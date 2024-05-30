import React, { useCallback } from "react";
import { useSyncExternalStore } from "react";
import { v4 as uuidv4 } from 'uuid';
import { checkCanvasOutput, checkGraphicsOutput, checkTurtleOutput, getPreCode, sanitizePyScript } from "./helpers";
import { ReactContextError, createStorageSlot } from "@docusaurus/theme-common";
import { usePluginData } from "@docusaurus/useGlobalData";
import { DOM_ELEMENT_IDS } from "../constants";
import throttle from 'lodash/throttle';
import { getStorageScript, syncStorageScript } from "./Storage";
import { type InitState, type LogMessage, type Script, Status, type Store, type StoredScript, type Version } from "./Types";
export const createStore = (props: InitState, libDir: string, syncMaxOnceEvery: number): Store => {
    const canSave = !!props.id;
    const id = props.id || uuidv4();
    const codeId = `code.${props.title || props.lang}.${id}`.replace(/(-|\.)/g, '_');
    const createdAt = new Date();
    const storageKey = `code.${props.title || 'code_block'}.${id}`;
    const storage = createStorageSlot(storageKey);
    storage.listen((e) => {
        if (e.key === storageKey) {
            try {
                if (e.newValue) {
                    const script = JSON.parse(e.newValue) as StoredScript;
                    if (new Date(script.updatedAt) > state.updatedAt) {
                        loadData(storage);
                    }
                }
            } catch (err) {
                console.warn(err);
            }
        }
    });
    
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
            addVersion({code: code, createdAt: updatedAt, version: state.versions.length + 1});
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

    const setCode = (raw: string, action?: 'insert' | 'remove' | string) => {
        if (state.isPasted && action === 'remove') {
            return;
        }
        const data = prepareCode(raw);
        setState(
            (state) => ({
                ...state,
                ...data
            })
        );
        if (props.id) {
            const toStore: StoredScript = {code: data.code, createdAt: state.createdAt, updatedAt: data.updatedAt, versions: state.versions};
            if (state.isPasted) {
                addVersion.flush();
                if (toStore.versions.length > 0) {
                    toStore.versions[toStore.versions.length - 1].pasted = true;
                }
                set(toStore);
                set.flush();
                state.isPasted = false;
            } else {
                set(toStore);
            }
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
        syncMaxOnceEvery,
        {leading: false, trailing: true}
    );

    const _addVersion = (version: Version) => {
        if (!props.versioned) {
            return;
        }
        const versions = [...state.versions];
        versions.push(version);
        setState((s) => ({...s, versions: versions}));
    }
    const addVersion = throttle(
        _addVersion,
        syncMaxOnceEvery,
        {leading: false, trailing: true}
    );

    const saveNow = async () => {
        addVersion.flush();
        return set.flush();
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
        isPasted: false,
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
        state.isLoaded = false;
        load();
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
        setCode, 
        execScript, 
        setExecuting, 
        stopScript,
        load, 
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
    const {libDir, syncMaxOnceEvery} = usePluginData('docusaurus-live-brython') as {libDir: string, syncMaxOnceEvery: number};
    const [store, setStore] = React.useState<Store | null>(null);
    React.useEffect(() => {
        const store = createStore(props, libDir, syncMaxOnceEvery);
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