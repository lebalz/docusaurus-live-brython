import { v4 as uuidv4 } from 'uuid';
import { createStorageSlot } from '@docusaurus/theme-common';
import { getStorageScript, syncStorageScript } from '@theme/CodeEditor/WithScript/Storage';
import {
    checkCanvasOutput,
    checkGraphicsOutput,
    checkTurtleOutput
} from '@theme/CodeEditor/WithScript/helpers';
import {
    type InitState,
    type LogMessage,
    type Script,
    Status,
    type Document,
    type StoredScript,
    type Version
} from '@theme/CodeEditor/WithScript/Types';
import { DOM_ELEMENT_IDS } from '@theme/CodeEditor/constants';
import throttle from 'lodash/throttle';
import { RouterType } from '@docusaurus/types';
import { runCode } from '@theme/CodeEditor/WithScript/bryRunner';

export const createStore = (
    props: InitState,
    libDir: string,
    syncMaxOnceEvery: number,
    router: RouterType
): Document => {
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
        setState((s) => ({ ...s, status: canSave ? Status.SYNCING : s.status }));
        const script = getStorageScript(store);
        const loadedCode = script?.code ? prepareCode(script.code, { codeOnly: true }) : {};
        addVersion.cancel();
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
            setState((s) => ({
                ...s,
                ...script,
                ...loadedCode,
                status: canSave ? Status.SUCCESS : s.status,
                versionsLoaded: true
            }));
            return Status.SUCCESS;
        }
        setState((s) => ({ ...s, status: canSave ? Status.ERROR : s.status }));
        return Status.ERROR;
    };

    const prepareCode = (
        code: string,
        config: { codeOnly?: boolean; stateNotInitialized?: boolean } = {}
    ) => {
        const hasEdits = code !== (config.stateNotInitialized ? code : state.pristineCode);
        const updatedAt = new Date();
        const allCode = `${props.preCode}\n${code}\n${props.postCode}`;
        const hasCanvasOutput = checkCanvasOutput(allCode);
        const hasTurtleOutput = checkTurtleOutput(allCode);
        const hasGraphicsOutput = checkGraphicsOutput(allCode);
        if (props.versioned && !config.stateNotInitialized) {
            addVersion({
                code: code,
                createdAt: updatedAt,
                version: state.versions.length + 1
            });
        }
        return {
            code: code,
            hasCanvasOutput: hasCanvasOutput,
            hasTurtleOutput: hasTurtleOutput,
            hasGraphicsOutput: hasGraphicsOutput,
            hasEdits: hasEdits,
            updatedAt: updatedAt
        };
    };

    const setCode = (raw: string, action?: 'insert' | 'remove' | string) => {
        if (state.isPasted && action === 'remove') {
            return;
        }
        const data = prepareCode(raw);
        setState((state) => ({
            ...state,
            ...data
        }));
        if (props.id) {
            const toStore: StoredScript = {
                code: data.code,
                createdAt: state.createdAt,
                updatedAt: data.updatedAt,
                versions: state.versions
            };
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
        setState((s) => ({
            ...s,
            isExecuting: true,
            graphicsModalExecutionNr: state.hasGraphicsOutput ? state.graphicsModalExecutionNr + 1 : 0
        }));
        runCode(state.code, state.preCode, state.postCode, codeId, libDir, router);
    };

    const load = async () => {
        return loadData(storage);
    };

    const _set = async (script: StoredScript) => {
        setState((s) => ({ ...s, status: canSave ? Status.SYNCING : s.status }));
        if (syncStorageScript(script, storage)) {
            setState((s) => ({ ...s, status: canSave ? Status.SUCCESS : s.status }));
            return Status.SUCCESS;
        }
        setState((s) => ({ ...s, status: canSave ? Status.ERROR : s.status }));
        return Status.ERROR;
    };

    const setIsPasted = (isPasted: boolean) => {
        setState((s) => ({ ...s, isPasted: isPasted }));
    };

    const set = throttle(_set, syncMaxOnceEvery, {
        leading: false,
        trailing: true
    });

    const _addVersion = (version: Version) => {
        if (!props.versioned || !props.id) {
            return;
        }
        const versions = [...state.versions];
        versions.push(version);
        setState((s) => ({ ...s, versions: versions }));
    };
    const addVersion = throttle(_addVersion, syncMaxOnceEvery, {
        leading: false,
        trailing: true
    });

    const saveNow = async () => {
        addVersion.flush();
        return set.flush();
    };

    const del = async () => {
        storage.del();
        return Status.SUCCESS;
    };
    const codeData = prepareCode(props.code, { stateNotInitialized: true });
    const setExecuting = (isExecuting: boolean) => {
        setState((s) => ({ ...s, isExecuting: isExecuting }));
    };
    const addLogMessage = (log: LogMessage) => {
        setState((s) => ({ ...s, logs: [...s.logs, log] }));
    };
    const clearLogMessages = () => {
        setState((s) => ({ ...s, logs: [] }));
    };
    const closeGraphicsModal = () => {
        setState((s) => ({ ...s, graphicsModalExecutionNr: 0 }));
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
        graphicsModalExecutionNr: 0,
        hasEdits: false,
        createdAt: createdAt,
        isLoaded: false,
        status: Status.IDLE,
        versions: [],
        versionsLoaded: false,
        isPasted: false,
        preCode: props.preCode,
        postCode: props.postCode,
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
        setState((s) => ({ ...s, versionsLoaded: true }));
        return Promise.resolve();
    };

    const setShowRaw = (showRaw: boolean) => {
        setState((s) => ({ ...s, showRaw: showRaw }));
    };

    const setStatus = (status: Status) => {
        setState((s) => ({ ...s, status: status }));
    };

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
        setIsPasted,
        setShowRaw,
        setStatus,
        loadVersions
    } satisfies Document;
};
