import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import CodeEditor, { type MetaProps } from '@theme/CodeEditor';
import ScriptContext from '@theme/CodeEditor/WithScript/Store';
import CodeBlock from '@theme/CodeBlock';

interface Props extends MetaProps {
    className?: string;
    title?: string;
    children: string | React.ReactNode;
}

/**
 * Use this component when you want a working CodeEditor.
 * The CodeEditor must be wrapped in a ScriptContext - this component does that.
 * wraps it in a ScriptContext and initializes the CodeEditor with the given
 * params.
 */
const ContextEditor = (props: Props) => {
    const langMatch = ((props.className || '') as string).match(/language-(?<lang>\w*)/);
    let lang = langMatch?.groups?.lang?.toLocaleLowerCase() ?? '';
    if (lang === 'py') {
        lang = 'python';
    }
    if (ExecutionEnvironment.canUseDOM) {
        const title = props.title || lang;

        const rawcode: string = (props.children as string || '').replace(/\s*\n$/, '');
        let code = rawcode;
        return (
            <ScriptContext
                id={props.id}
                lang={lang}
                title={title}
                raw={rawcode}
                readonly={!!props.readonly}
                versioned={!!props.versioned}
            >
                <CodeEditor
                    {...props}
                    lang={lang}
                    precode=''
                    maxLines={props.maxLines && Number.parseInt(props.maxLines, 10)}
                    readonly={!!props.readonly}
                    resettable={!props.noReset}
                    download={!props.versioned && !props.noDownload}
                    slim={!!props.slim}
                    showLineNumbers={!(!!props.slim && !/\n/.test(code))}
                    versioned={!!props.versioned}
                    noHistory={!!props.noHistory}
                    noCompare={!!props.noCompare}
                    title={title}
                />
            </ScriptContext>
        );
    }
    return (
        <CodeBlock {...props} />
    );
}

export default ContextEditor;