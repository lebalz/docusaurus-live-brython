import React, { useCallback } from "react";
import { useSyncExternalStore } from "react";
import { v4 as uuidv4 } from 'uuid';
import { checkCanvasOutput, checkGraphicsOutput, checkTurtleOutput, getPreCode, sanitizePyScript } from "./helpers";
import { ReactContextError, createStorageSlot } from "@docusaurus/theme-common";
import { usePluginData } from "@docusaurus/useGlobalData";

export interface Version {
    code: string;
    createdAt: Date;
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
    setCode: (code: string) => void;
    isExecuting?: boolean;
    setExecuting: (executing: boolean) => void;
    execScript: () => void,
    preCode: string;
    lang: 'py' | string;
    logs: LogMessage[];
    addLogMessage: (log: LogMessage) => void;
    clearLogMessages: () => void;
    hasGraphicsOutput: boolean;
    hasTurtleOutput: boolean;
    hasCanvasOutput: boolean;
    hasEdits: boolean;
    /**
     * Storage props
     */
    isLoaded: boolean;
    load: () => Promise<Status>;
    set: (script: StoredScript) => Promise<Status>;
    del: () => Promise<Status>;
    status: Status;
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
    LOADING = 'LOADING',
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
    const id = props.id || uuidv4();
    const codeId = `code.${props.title}.${id}`;
    const createdAt = new Date();
    const storageKey = `code.${props.title || 'code_block'}.${props.id.replace(/-/g, '_')}`;
    const storage = createStorageSlot(storageKey);
    
    const loadData = (store) => {
        const script = getStorageScript(store);
        if (!state.isLoaded) {
            setState((s) => ({...s, isLoaded: true, ...(script || {})}));
            return Status.SUCCESS;
        }
        if (script) {
            setState((s) => ({...s, ...script}));
            return Status.SUCCESS;
        }
        return Status.ERROR;
    }

    const setCode = (raw: string) => {
        const { pre, code } = getPreCode(raw);
        const hasEdits = raw !== props.raw;
        const updatedAt = new Date();
        const hasCanvasOutput = checkCanvasOutput(raw);
        const hasTurtleOutput = checkTurtleOutput(raw);
        const hasGraphicsOutput = checkGraphicsOutput(raw);
        const versions = [...state.versions];
        if (props.versioned) {
            versions.unshift({code, createdAt: updatedAt});
        }
        setState(
            (state) => ({
                ...state,
                code,
                preCode: pre,
                hasCanvasOutput,
                hasTurtleOutput,
                hasGraphicsOutput,
                hasEdits,
                updatedAt,
                versions
            })
        );
        set({code, createdAt: state.createdAt, updatedAt, versions});
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
        (window as any).__BRYTHON__.runPythonSource(
            src,
            {
                id: 'main', 
                pythonpath: [libDir]
            }
        );
    };
    const load = async () => {
        return loadData(storage);
    };
    const set = async (script: StoredScript) => {
        if (syncStorageScript(script, storage)) {
            return Status.SUCCESS;
        }
        return Status.ERROR;
    };
    const del = async () => {
        storage.del();
        return Status.SUCCESS;
    }
    const { pre, code } = getPreCode(props.raw);
    let state: Script = {
        id: props.id || uuidv4(),
        codeId: codeId,
        lang: props.lang,
        code: code,
        pristineCode: props.raw,
        setCode: setCode,
        isExecuting: false,
        setExecuting: (isExecuting: boolean) => setState((s) => ({...s, isExecuting: isExecuting})),
        execScript: execScript, 
        preCode: pre,
        versions: [],
        logs: [],
        addLogMessage: (log: LogMessage) => {
            setState((s) => ({...s, logs: [...s.logs, log]}));
        },
        clearLogMessages: () => {
            setState((s) => ({...s, logs: []}));
        },
        hasGraphicsOutput: checkGraphicsOutput(props.raw),
        hasTurtleOutput: checkTurtleOutput(props.raw),
        hasCanvasOutput: checkCanvasOutput(props.raw),
        hasEdits: false,
        updatedAt: new Date(),
        createdAt: createdAt,
        isLoaded: false,
        load: load,
        set: set,
        del: del,
        status: Status.IDLE
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
    return { getState, setState, subscribe } satisfies Store;
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
        store.getState().load();
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