import React, { useCallback } from "react";
import { useSyncExternalStore } from "react";
import { v4 as uuidv4 } from 'uuid';
import { checkCanvasOutput, checkGraphicsOutput, checkTurtleOutput, getPreCode, sanitizePyScript } from "./helpers";
import { ReactContextError, createStorageSlot } from "@docusaurus/theme-common";
import { usePluginData } from "@docusaurus/useGlobalData";
import { DOM_ELEMENT_IDS } from "../constants";
import throttle from 'lodash/throttle';

export interface Version {
    code: string;
    createdAt: Date;
    version: number;
}

export interface StoredScript {
    code: string;
    createdAt: Date;
    updatedAt: Date;
    versions: Version[];
}

export interface Script extends StoredScript {
    /**
     * this is normally a uuid
     */
    id: string;
    /**
     * this is the codeId used to
     * - identify dom elements for this block
     * - setup the brython communicator with this id
     * - when using the default storage, this is the key used to 
     *   store the code to local storage
     */
    codeId: string;
    pristineCode: string;
    showRaw: boolean;
    isExecuting?: boolean;
    preCode: string;
    lang: 'py' | string;
    logs: LogMessage[];
    isGraphicsmodalOpen: boolean;
    hasGraphicsOutput: boolean;
    hasTurtleOutput: boolean;
    hasCanvasOutput: boolean;
    hasEdits: boolean;
    /**
     * Storage props
    */
   isLoaded: boolean;
   status: Status;
   versionsLoaded: boolean;
}

export interface LogMessage {
    type: 'done' | 'stdout' | 'stderr' | 'start';
    output: string;
    timeStamp: number;
}

export type StorageSlot = {
    get: () => string | null;
    set: (value: string) => void;
    del: () => void;
    listen: (onChange: (event: StorageEvent) => void) => () => void;
};

export enum Status {
    IDLE = 'IDLE',
    SYNCING = 'SYNCING',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS'
}

interface InitState {
    id: string | undefined;
    lang: 'py' | string;
    title: string;
    raw: string;
    readonly: boolean;
    versioned: boolean;
}

interface Store<T = Script> {
    getState: () => T;
    setState: (fn: (state: Script) => Script) => void;
    subscribe: (listener: () => void) => () => void;
    saveNow: () => Promise<Status>;
    setCode: (code: string) => void;
    setExecuting: (executing: boolean) => void;
    execScript: () => void,
    stopScript: () => void;
    closeGraphicsModal: () => void;
    load: () => Promise<Status>;
    set: (script: StoredScript) => Promise<Status>;
    del: () => Promise<Status>;
    addLogMessage: (log: LogMessage) => void;
    clearLogMessages: () => void;
    loadVersions: () => Promise<void>;
}


const getStorageScript = (storage: StorageSlot): StoredScript | undefined => {
    const storedCode = storage.get();
    if (storedCode) {
        try {
            const script = JSON.parse(storedCode);
            if (script) {
                return script;
            }
        } catch (e) {
            console.warn(`Failed to parse code for value "${storedCode}"`, e);
            storage.del();
        }
    }
    return;
}

const syncStorageScript = (script: StoredScript, storage: StorageSlot): boolean => {
    try {
        storage.set(JSON.stringify(script));
        return true;
    } catch (e) {
        console.warn(`Failed to save the code ${script}`, e);
        return false;
    }
}

export const createStore = (props: InitState, libDir: string): Store => {
    const canSave = !!props.id;
    const id = props.id || uuidv4();
    const codeId = `code.${props.title || props.lang}.${id}`.replace(/(-|\.)/g, '_');
    const createdAt = new Date();
    const storageKey = `code.${props.title || 'code_block'}.${id}`;
    const storage = createStorageSlot(storageKey);
    
    const loadData = (store) => {
        setState((s) => ({...s, status: canSave ? Status.SYNCING : s.status}));
        const script = getStorageScript(store);
        const loadedCode = script?.code ? prepareCode(script.code, { codeOnly: true }) : {};
        if (!state.isLoaded) {
            setState((s) => ({
                ...s, 
                isLoaded: true, 
                ...(script || {}), 
                ...loadedCode,
                versions: script?.versions || [],
                versionsLoaded: true,
                status: canSave ? Status.SUCCESS : s.status
            }));        
            return Status.SUCCESS;
        }
        if (script) {
            setState((s) => ({...s, ...script, ...loadedCode, status: canSave ? Status.SUCCESS : s.status, versionsLoaded: true}));
            return Status.SUCCESS;
        }
        setState((s) => ({...s, status: canSave ? Status.ERROR : s.status}));
        return Status.ERROR;
    }

    const _addVersion = (version: Version) => {
        if (!props.versioned) {
            return;
        }
        const versions = [...state.versions];
        versions.unshift(version);
        setState((s) => ({...s, versions: versions}));
    }
    const addVersion = throttle(
        _addVersion,
        1000,
        {leading: false, trailing: true}
    );

    const prepareCode = (raw: string, config: { codeOnly?: boolean, stateNotInitialized?: boolean } = {}) => {
        const { pre, code } = config.codeOnly 
                                ? { pre: getPreCode(state.pristineCode).pre, code: raw }
                                : getPreCode(raw);
        const hasEdits = code !== (config.stateNotInitialized ? getPreCode(props.raw).code : state.pristineCode);
        const updatedAt = new Date();
        const hasCanvasOutput = checkCanvasOutput(raw);
        const hasTurtleOutput = checkTurtleOutput(raw);
        const hasGraphicsOutput = checkGraphicsOutput(raw);
        if (props.versioned && !config.stateNotInitialized) {
            addVersion({code, createdAt: updatedAt, version: state.versions.length + 1});
        }
        return {
            code: code,
            preCode: pre,
            hasCanvasOutput: hasCanvasOutput,
            hasTurtleOutput: hasTurtleOutput,
            hasGraphicsOutput: hasGraphicsOutput,
            hasEdits: hasEdits,
            updatedAt: updatedAt
        };
    }

    const setCode = (raw: string) => {
        const data = prepareCode(raw);
        setState(
            (state) => ({
                ...state,
                ...data
            })
        );
        if (props.id) {
            set({code: data.code, createdAt: state.createdAt, updatedAt: data.updatedAt, versions: state.versions});
        }
    };

    const execScript = () => {
        const toExec = `${state.code}`;
        const lineShift = state.preCode.split(/\n/).length;
        const src = `from brython_runner import run
run("""${sanitizePyScript(toExec || '')}""", '${codeId}', ${lineShift})
`;
        if (!(window as any).__BRYTHON__) {
            alert('Brython not loaded');
            return;
        }
        setState((s) => ({...s, isExecuting: true, isGraphicsmodalOpen: state.hasGraphicsOutput}));
        const active = document.getElementById(DOM_ELEMENT_IDS.communicator(state.codeId));
        active.setAttribute('data--start-time', `${Date.now()}`);
        /**
         * ensure that the script is executed after the current event loop.
         * Otherwise, the brython script will not be able to access the graphics output.
         */
        setTimeout(() => {
            (window as any).__BRYTHON__.runPythonSource(
                src,
                {
                    pythonpath: [libDir]
                }
            );
        }, 0);
    };
    const load = async () => {
        return loadData(storage);
    };
    const _set = async (script: StoredScript) => {
        setState((s) => ({...s, status: canSave ? Status.SYNCING : s.status}));
        if (syncStorageScript(script, storage)) {
            setState((s) => ({...s, status: canSave ? Status.SUCCESS : s.status}));
            return Status.SUCCESS;
        }
        setState((s) => ({...s, status: canSave ? Status.ERROR : s.status}));
        return Status.ERROR;
    };

    const set = throttle(
        _set,
        1000,
        {leading: false, trailing: true}
    );

    const saveNow = async () => {
        set.cancel();
        return _set({code: state.code, createdAt: state.createdAt, updatedAt: state.updatedAt, versions: state.versions});
    }

    const del = async () => {
        storage.del();
        return Status.SUCCESS;
    }
    const codeData = prepareCode(props.raw, { stateNotInitialized: true });
    const setExecuting = (isExecuting: boolean) => {
        setState((s) => ({...s, isExecuting: isExecuting}))
    };
    const addLogMessage = (log: LogMessage) => {
        setState((s) => ({...s, logs: [...s.logs, log]}));
    };
    const clearLogMessages = () => {
        setState((s) => ({...s, logs: []}));
    };
    const closeGraphicsModal = () => {
        setState((s) => ({...s, isGraphicsmodalOpen: false}));
    };
    const stopScript = () => {
        const code = document.getElementById(DOM_ELEMENT_IDS.communicator(state.codeId));
        if (code) {
            code.removeAttribute('data--start-time');
        }
    };
    let state: Script = {
        id: id,
        codeId: codeId,
        lang: props.lang,
        showRaw: false,
        pristineCode: codeData.code,
        isExecuting: false,
        logs: [],
        isGraphicsmodalOpen: false,
        hasEdits: false,
        createdAt: createdAt,
        isLoaded: false,
        status: Status.IDLE,
        versions: [],
        versionsLoaded: false,
        ...codeData
    };
    

    const getState = () => state;
    const listeners = new Set<() => void>();
    const setState = (fn: (state: Script) => Script) => {
        state = fn(state);
        listeners.forEach((l) => l());
    };
    const subscribe = (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };
    const loadVersions = async () => {
        // noop
        setState((s) => ({...s, versionsLoaded: true}));
        return Promise.resolve();
    }

    return { 
        getState, 
        setState, 
        subscribe, 
        saveNow, 
        addLogMessage, 
        clearLogMessages, 
        closeGraphicsModal, 
        del, 
        set, 
        load, 
        setCode, 
        execScript, 
        setExecuting, 
        stopScript,
        loadVersions
    } satisfies Store;
};
    

type Selector<T, R> = (state: T) => R;
export const useStore = <T, R>(store: Store<T>, selector: Selector<T, R>): R => {
    return useSyncExternalStore(
        store.subscribe,
        useCallback(() => selector(store.getState()), [store, selector])
    );
}

export const Context = React.createContext<{store: Store} | undefined>(undefined);


const ScriptContext = (props: InitState & { children: React.ReactNode; }) => {
    const {libDir} = usePluginData('docusaurus-live-brython') as {libDir: string};
    const [store, setStore] = React.useState<Store | null>(null);
    React.useEffect(() => {
        const store = createStore(props, libDir);
        setStore(store);
        store.load();
    }, [props.id, libDir]);

    if (!store) {
        return <div>Load</div>;
    }

    return (
        <Context.Provider value={{store: store}}>
            {props.children}
        </Context.Provider>
    );
}

export function useScript(): {store: Store} {
    const context = React.useContext(Context);
    if (context === null) {
      throw new ReactContextError(
        'ScriptContextProvider',
        'The Component must be a child of the CodeContextProvider component',
      );
    }
    return context;
}


export default ScriptContext;