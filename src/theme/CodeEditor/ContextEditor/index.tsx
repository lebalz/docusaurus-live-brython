import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import CodeEditor, { type MetaProps } from '@theme/CodeEditor';
import ScriptContext from '@theme/CodeEditor/WithScript/ScriptContext';
import CodeBlock from '@theme/CodeBlock';

interface Props extends MetaProps {
    className?: string;
    title?: string;
    children: string | React.ReactNode;
    onChange?: (code: string) => void;
}

const SPLIT_CODE_REGEX = /^(?:(?<pre>.*?)\n###\s*PRE\s*)?(?<code>.*?)(?:\n###\s*POST\s*(?<post>.*))?$/s;
const splitCode = (rawCode: string) => {
    const { pre, code, post } = rawCode.replace(/\s*\n$/, '').match(SPLIT_CODE_REGEX).groups || {};
    return {
        pre: pre || '',
        code: code || '',
        post: post || ''
    };
};

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
        const { pre, code, post } = splitCode((props.children as string) || '');
        return (
            <ScriptContext
                id={props.id}
                lang={lang}
                title={title}
                code={code}
                preCode={pre}
                postCode={post}
                readonly={!!props.readonly}
                versioned={!!props.versioned}
            >
                <CodeEditor
                    code={code}
                    lang={lang}
                    preCode={pre}
                    postCode={post}
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
                    className={props.className}
                    onChange={props.onChange}
                />
            </ScriptContext>
        );
    }
    return <CodeBlock {...props} />;
};

export default ContextEditor;
