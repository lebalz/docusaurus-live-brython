import React from 'react';
import CodeBlock, {type Props as CodeBlockType} from '@theme-init/CodeBlock';
// import CodeBlock from '@theme-original/CodeBlock';
// import CodeBlockType from '@theme/CodeBlock';
// @ts-ignore
import type { WrapperProps } from '@docusaurus/types';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { sanitizedTitle, sanitizeId } from '../CodeEditor/utils/sanitizers';
import CodeEditor from '../CodeEditor';

// @ts-ignore
// import Playground from '@theme/Playground';
// @ts-ignore
import ReactLiveScope from '@theme/ReactLiveScope';
import WithScript from '../CodeEditor/WithScript';


type Props = WrapperProps<typeof CodeBlockType>;

interface MetaProps {
        reference?: boolean;
        live_jsx?: boolean;
        live_py?: boolean;
        id?: string;
        slim?: boolean;
        readonly?: boolean;
        persist?: boolean;
        noDownload?: boolean;
        versioned?: boolean;
        noHistory?: boolean;
        noCompare?: boolean;
        maxLines?: string;
        title?: string
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
        if (!metaProps.id && !metaProps.slim) {
            return <CodeBlock {...props} />;
        }
        const title = props.title || metaProps.title;

        const rawcode: string = (props.children as string || '').replace(/\s*\n$/, '');
        let code = rawcode;
        return (
            <WithScript
                raw={rawcode}
                lang={lang}
                readonly={!!metaProps.readonly}
                versioned={!!metaProps.versioned}
                title={title || 'code'}
                id={metaProps.id}
            >
                <CodeEditor
                    {...props}
                    {...metaProps}
                    maxLines={metaProps.maxLines && Number.parseInt(metaProps.maxLines, 10)}
                    readonly={!!metaProps.readonly}
                    resettable={!metaProps.persist}
                    download={!metaProps.versioned && !metaProps.noDownload}
                    slim={!!metaProps.slim}
                    showLineNumbers={!(!!metaProps.slim && !/\n/.test(code))}
                    versioned={!!metaProps.versioned}
                    noHistory={!!metaProps.noHistory}
                    noCompare={!!metaProps.noCompare}
                    title={sanitizedTitle(title) || lang}
                />
            </WithScript>
        );
    }
    return (
        <CodeBlock {...props} />
    );
}
