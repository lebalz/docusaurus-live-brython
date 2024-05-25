import React from 'react';
import { checkCanvasOutput, checkGraphicsOutput, checkTurtleOutput, getPreCode, sanitizePyScript } from './helpers';
import { ReactContextError } from '@docusaurus/theme-common';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from './StoreContext';
import { LogMessage, Script, Version } from '.';
import CodeBlock from '@theme/CodeBlock';
import { usePluginData } from '@docusaurus/useGlobalData';


interface Props {
    id: string | undefined;
    lang: 'py' | string;
    title: string;
    raw: string;
    children: React.ReactNode;
    readonly: boolean;
    versioned: boolean;
}
export const CodeContext = React.createContext<Script | undefined>(undefined);

const ScriptContext = (props: Props) => {
    const {libDir} = usePluginData('docusaurus-live-brython') as {libDir: string};
    const [codeId, setCodeId] = React.useState<string | undefined>(undefined);
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

    React.useEffect(() => {
        if (!props.id && !store?.isLoaded) {
            return;
        }
        const id = props.id || uuidv4();
        const newCodeId = `code.${props.title}.${id}`;
        setCodeId(newCodeId);  
    }, [props.id, store?.isLoaded]);

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

    if (!codeId) {
        return (
            <CodeBlock
                language={props.lang}
                title='Loading...'
            >
                {props.raw}
            </CodeBlock>
        );
    }

    return (
        <CodeContext.Provider
            value={{
                id: props.id || uuidv4(),
                codeId: codeId,
                lang: props.lang,
                code,
                pristineCode: props.raw,
                setCode,
                isExecuting,
                setExecuting,
                execScript: () => {
                    const toExec = `${code}`;
                    const lineShift = preCode.split(/\n/).length;
                    const src = `from brython_runner import run
run("""${sanitizePyScript(toExec || '')}""", '${codeId}', ${lineShift})
`;
                    console.log('exec', src);
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
/*                    (window as any).__BRYTHON__.runPythonSource(
                        code,
                        {
                            id: codeId,
                            name: codeId,
                            pythonpath: ["/libs/"]
                        }
                    )*/
                },
                preCode,
                versions,
                logs,
                addLogMessage: (log: LogMessage) => {
                    console.log('-->', log, ...logs)
                    setLogs([...logs, log]);
                },
                clearLogMessages: () => {
                    console.log('clear log')
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