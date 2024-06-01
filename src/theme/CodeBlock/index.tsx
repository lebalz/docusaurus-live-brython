import React from 'react';
import CodeBlock, {type Props as CodeBlockType} from '@theme-init/CodeBlock';
// @ts-ignore
import type { WrapperProps } from '@docusaurus/types';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import CodeEditor from '@theme/CodeEditor';

import ScriptContext from '@theme/CodeEditor/WithScript/Store';


type Props = WrapperProps<typeof CodeBlockType>;

interface MetaProps {
        reference?: boolean;
        live_jsx?: boolean;
        live_py?: boolean;
        id?: string;
        slim?: boolean;
        readonly?: boolean;
        noReset?: boolean;
        noDownload?: boolean;
        versioned?: boolean;
        noHistory?: boolean;
        noCompare?: boolean;
        maxLines?: string;
        title?: string
}


const sanitizedTitle = (id: string) => {
    if (!id) {
        return;
    }
    return id.replace(/--/g, '<<HYPHEN>>').replace(/__/g, '<<UNDERSCORE>>').replace(/[-_]/g, ' ').replace(/<<UNDERSCORE>>/g, '_').replace(/<<HYPHEN>>/g, '-')
}

const extractMetaProps = (props: {metastring?: string}): MetaProps => {
    const metaString = (props?.metastring || '').replace(/\s*=\s*/g, '='); // remove spaces around =
    const metaRaw = metaString.split(/\s+/).map((s) => s.trim().split('='));
    return metaRaw.reduce((acc, [key, value]) => {
        if (!key) {
            return acc;
        }
        /** casts to booleans and numbers. When no value was provided, true is used */
        const val = value === 'true' ? true
                    : value === 'false' ? false
                    : !Number.isNaN(Number(value)) ? Number(value)
                    : value || true;
        acc[key] = val;
        return acc;
    }, {} as {[key: string]: number | string | boolean});
}

export default function CodeBlockWrapper(props: Props): JSX.Element {
    const metaProps = extractMetaProps(props);
    const langMatch = ((props.className || '') as string).match(/language-(?<lang>\w*)/);
    let lang = langMatch?.groups?.lang?.toLocaleLowerCase() ?? '';
    if (lang === 'py') {
        lang = 'python';
    }
    // if (metaProps.live_jsx) {
    //     return <Playground scope={ReactLiveScope} {...props} />;
    // }
    if (metaProps.live_py && ExecutionEnvironment.canUseDOM) {
        const title = props.title || metaProps.title;

        const rawcode: string = (props.children as string || '').replace(/\s*\n$/, '');
        let code = rawcode;
        return (
            <ScriptContext
                id={metaProps.id}
                lang={lang}
                title={title}
                raw={rawcode}
                readonly={!!metaProps.readonly}
                versioned={!!metaProps.versioned}
            >
                <CodeEditor
                    {...props}
                    {...metaProps}
                    maxLines={metaProps.maxLines && Number.parseInt(metaProps.maxLines, 10)}
                    readonly={!!metaProps.readonly}
                    resettable={!metaProps.noReset}
                    download={!metaProps.versioned && !metaProps.noDownload}
                    slim={!!metaProps.slim}
                    showLineNumbers={!(!!metaProps.slim && !/\n/.test(code))}
                    versioned={!!metaProps.versioned}
                    noHistory={!!metaProps.noHistory}
                    noCompare={!!metaProps.noCompare}
                    title={sanitizedTitle(title) || lang}
                />
            </ScriptContext>
        );
    }
    return (
        <CodeBlock {...props} />
    );
}
