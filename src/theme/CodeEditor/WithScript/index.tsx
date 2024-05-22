import React from 'react';
import { checkCanvasOutput, checkGraphicsOutput, checkTurtleOutput, getPreCode } from './helpers';
import { ReactContextError, createStorageSlot } from '@docusaurus/theme-common';
import { v4 as uuidv4 } from 'uuid';

interface Version {
    code: string;
    createdAt: Date;
}

interface StoredScript {
    code: string;
    createdAt: Date;
    updatedAt: Date;
    versions: Version[];
}

const getCodeId = (lang: string, id: string) => {
    const codeId = `code.${lang}.${id.replace(/-/g, '_')}`;
    return codeId;
}

export interface Script extends StoredScript {
    id: string;
    codeId: string;
    pristineCode: string;
    setCode: (code: string) => void;
    isExecuting?: boolean;
    setExecuting: (executing: boolean) => void;
    execScript: (codeId: string) => void,
    preCode: string;
    lang: 'py' | string;
    logs: LogMessage[];
    addLogMessage: (log: LogMessage) => void;
    clearLogMessages: () => void;
    hasGraphicsOutput: boolean;
    hasTurtleOutput: boolean;
    hasCanvasOutput: boolean;
    hasEdits: boolean;
}

export const CodeContext = React.createContext<Script>({
    id: uuidv4(),
    codeId: getCodeId('txt', uuidv4()),
    code: '',
    pristineCode: '',
    setCode: (code: string) => { },
    isExecuting: false,
    setExecuting: (executing: boolean) => { },
    execScript: (codeId: string) => { },
    preCode: '',
    versions: [],
    logs: [],
    addLogMessage: (log: LogMessage) => { },
    clearLogMessages: () => { },
    lang: '',
    hasGraphicsOutput: false,
    hasTurtleOutput: false,
    hasCanvasOutput: false,
    hasEdits: false,
    updatedAt: new Date(),
    createdAt: new Date()
});

interface Props {
    id: string | undefined;
    lang: 'py' | string;
    raw: string;
    children: React.ReactNode;
    readonly: boolean;
    versioned: boolean;
}

export interface LogMessage {
    type: 'done' | 'stdout' | 'stderr' | 'start';
    output: string;
    timeStamp: number;
}

type StorageSlot = {
    get: () => string | null;
    set: (value: string) => void;
    del: () => void;
    listen: (onChange: (event: StorageEvent) => void) => () => void;
};

const getStorageScript = (codeId: string, storage: StorageSlot): StoredScript | undefined => {
    const storedCode = storage.get();
    if (storedCode) {
        try {
            const script = JSON.parse(storedCode);
            if (script) {
                return script;
            }
        } catch (e) {
            console.warn(`Failed to parse code for ${codeId}`);
            storage.del();
        }
    }
    return;
}

const syncStorageScript = (codeId: string, script: StoredScript, storage: StorageSlot): boolean => {
    try {
        storage.set(JSON.stringify(script));
        return true;
    } catch (e) {
        console.warn(`Failed to save code for ${codeId}`);
        return false;
    }
}

const WithScript = (props: Props) => {
    const [code, _setCode] = React.useState('');
    const [codeId, setCodeId] = React.useState<string | undefined>(undefined);
    const [isExecuting, setExecuting] = React.useState(false);
    const [preCode, setPreCode] = React.useState('');
    const [versions, setVersions] = React.useState<Version[]>([]);
    const [isLoaded, setLoaded] = React.useState(false);
    const [logs, setLogs] = React.useState<LogMessage[]>([]);
    const [hasGraphicsOutput, setHasGraphicsOutput] = React.useState(false);
    const [hasTurtleOutput, setHasTurtleOutput] = React.useState(false);
    const [hasCanvasOutput, setHasCanvasOutput] = React.useState(false);
    const [hasEdits, setHasEdits] = React.useState(false);
    const [updatedAt, setUpdatedAt] = React.useState(new Date());
    const [createdAt, setCreatedAt] = React.useState(new Date());

    const [storage, setStorage] = React.useState<StorageSlot | null>(null);

    React.useEffect(() => {
        console.log(props);
    },[]);

    React.useEffect(() => {
        if (!props.id) {
            return;
        }
        const newCodeId = `code.${props.lang}.${props.id.replace(/-/g, '_')}`
        console.log('setting codeId', props.id, props.lang, newCodeId);
        setCodeId(newCodeId);
        setStorage(createStorageSlot(newCodeId))
    }, [props.id, codeId, props.lang, setStorage]);

    const setCode = React.useMemo(() => {
        return (raw: string) => {
            console.log('setting code', raw);
            const { pre, code } = getPreCode(raw);
            _setCode(code);
            setPreCode(pre);
            if (raw !== props.raw) {
                setHasEdits(true);
            }
            const updAt = new Date();
            setUpdatedAt(updAt);
            setHasCanvasOutput(checkCanvasOutput(raw));
            setHasTurtleOutput(checkTurtleOutput(raw));
            setHasGraphicsOutput(checkGraphicsOutput(raw));
            const newVersions = [...versions];
            if (props.versioned) {
                newVersions.unshift({code, createdAt: updAt});
                setVersions([{code: code, createdAt: updAt}, ...versions]);
            }
            if (storage && codeId) {
                syncStorageScript(
                    codeId,
                    {
                        code,
                        createdAt,
                        updatedAt: updAt,
                        versions: newVersions
                    },
                    storage
                )
            }
        }
    }, [
        props.raw, 
        props.id, 
        codeId,
        props.lang,
        createdAt,
        storage, 
        versions,
        _setCode, 
        setUpdatedAt, 
        setHasEdits, 
        setHasCanvasOutput, 
        setHasEdits, 
        setHasTurtleOutput, 
        setHasGraphicsOutput, 
        setPreCode
    ]);

    React.useEffect(() => {
        if (isLoaded || !storage) {
            return;
        }
        setLoaded(true);
        if (!props.id || props.readonly || !codeId) {
            setCode(props.raw);
            return;
        }
        if (!storage) {
            return;
        }
        const stored = getStorageScript(codeId, storage);
        console.log('stored', stored)
        if (stored) {
            setCode(stored.code);
            setCreatedAt(stored.createdAt);
            setUpdatedAt(stored.updatedAt);
            setVersions(stored.versions);
        }
        // storage.listen((newCode) => {
        //     if (newCode.newValue) {
        //         setCode(newCode.newValue);
        //     } else {
        //         setCode(props.raw);
        //     }
        // });
        
    }, [
        props.lang,
        props.readonly,
        codeId,
        props.id,
        props.raw, 
        isLoaded, 
        setLoaded, 
        setCode, 
        storage, 
        setCreatedAt, 
        setUpdatedAt, 
        setVersions
    ])

    return (
        <CodeContext.Provider
            value={{
                id: props.id || uuidv4(),
                codeId: codeId || getCodeId(props.lang, uuidv4()),
                lang: props.lang,
                code,
                pristineCode: props.raw,
                setCode,
                isExecuting,
                setExecuting,
                execScript: (codeId: string) => {},
                preCode,
                versions,
                logs,
                addLogMessage: (log: LogMessage) => {
                    setLogs([...logs, log]);
                },
                clearLogMessages: () => {
                    setLogs([]);
                },
                hasGraphicsOutput,
                hasTurtleOutput,
                hasCanvasOutput,
                hasEdits,
                updatedAt,
                createdAt
            }}
        >
            {props.children}
        </CodeContext.Provider>
    );
}


export function useScript(): Script {
    const context = React.useContext(CodeContext);
    if (context == null) {
      throw new ReactContextError(
        'CodeContextProvider',
        'The Component must be a child of the CodeContextProvider component',
      );
    }
    return context;
}

export default WithScript;