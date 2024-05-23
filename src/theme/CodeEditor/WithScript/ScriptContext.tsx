import React from 'react';
import { checkCanvasOutput, checkGraphicsOutput, checkTurtleOutput, getPreCode } from './helpers';
import { ReactContextError } from '@docusaurus/theme-common';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from './StoreContext';
import { LogMessage, Script, Version } from '.';


interface Props {
    id: string | undefined;
    lang: 'py' | string;
    raw: string;
    children: React.ReactNode;
    readonly: boolean;
    versioned: boolean;
}
export const CodeContext = React.createContext<Script | undefined>(undefined);

const ScriptContext = (props: Props) => {
    const [code, _setCode] = React.useState('');
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
    const store = useStore();


    const setCode = (raw: string) => {
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
        if (store) {
            store.set({
                code,
                createdAt,
                updatedAt: updAt,
                versions: newVersions
            });
        }
    };

    React.useEffect(() => {
        if (isLoaded || !store?.isLoaded) {
            return;
        }
        setLoaded(true);
        if (!props.id || props.readonly || !store.data) {
            setCode(props.raw);
            return;
        }
        const { data } = store;
        setCode(data.code);
        setCreatedAt(data.createdAt);
        setUpdatedAt(data.updatedAt);
        setVersions(data.versions);
    }, [
        props.lang,
        props.readonly,
        props.id,
        props.raw, 
        isLoaded,
        store,
        store?.isLoaded,
    ]);

    return (
        <CodeContext.Provider
            value={{
                id: props.id || uuidv4(),
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
    if (context === null) {
      throw new ReactContextError(
        'CodeContextProvider',
        'The Component must be a child of the CodeContextProvider component',
      );
    }
    return context;
}

export default ScriptContext;