import React from 'react';
import CodeBlock, {type Props as CodeBlockType} from '@theme-init/CodeBlock';
// import CodeBlock from '@theme-original/CodeBlock';
// import CodeBlockType from '@theme/CodeBlock';
import type { WrapperProps } from '@docusaurus/types';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { sanitizedTitle, sanitizeId } from '../utils/sanitizers';
import hashCode from '../utils/hash_code';
import PyAceEditor from '../CodeEditor';
import { v4 as uuidv4 } from 'uuid';

// @ts-ignore
import Playground from '@theme/Playground';
// @ts-ignore
import ReactLiveScope from '@theme/ReactLiveScope';


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
        /** casts to booleans and numbers. When no value was provided, true is used */
        const val = value === 'true' ? true
                    : value === 'false' ? false
                    : !Number.isNaN(Number(value)) ? Number(value)
                    : value || true;
        acc[key] = val;
        return acc;
    }, {} as {[key: string]: number | string | boolean});
}

function pageId() {
    try {
        const pageId = sanitizeId(window.location.pathname.replace(/^\/|\/$/g, ''));
        return pageId || 'py';
    } catch (e) {
        return `py`;
    }
}

const CONSOLE_ENUMERATION_MAPPING: {[key: string]: {[k: string]: number}} = {};

const getCodeId = (title: string, children: string) => {
    const page = pageId();
    if (!CONSOLE_ENUMERATION_MAPPING[page]) {
        CONSOLE_ENUMERATION_MAPPING[page] = {};
    }

    const codeHash = hashCode(children);
    if (!CONSOLE_ENUMERATION_MAPPING[page][codeHash]) {
        CONSOLE_ENUMERATION_MAPPING[page][codeHash] =
            Object.keys(CONSOLE_ENUMERATION_MAPPING[page]).length + 1;
    }
    const codeId = title ? sanitizeId(title) : `${CONSOLE_ENUMERATION_MAPPING[page][codeHash]}`;
    return codeId;
};

export default function CodeBlockWrapper(props: Props): JSX.Element {
    const metaProps = extractMetaProps(props);
    const langMatch = ((props.className || '') as string).match(/language-(?<lang>\w*)/);
    let lang = langMatch?.groups?.lang?.toLocaleLowerCase() ?? '';
    if (lang === 'py') {
        lang = 'python';
    }
    if (metaProps.live_jsx) {
        return <Playground scope={ReactLiveScope} {...props} />;
    }
    if (metaProps.live_py && ExecutionEnvironment.canUseDOM) {
        if (!metaProps.id && !metaProps.slim) {
            return <CodeBlock {...props} />;
        }
        const title = props.title || metaProps.title;

        const rawcode: string = (props.children as string || '').replace(/\s*\n$/, '');
        const match = rawcode.match(/\n###\s*PRE.*?\n/);
        let precode = '';
        let code = rawcode;
        if (match) {
            precode = rawcode.slice(0, match.index || 0);
            code = rawcode.slice((match.index || 0) + match[0].length);
        }
        const codeId = getCodeId(title, code);
        const [webKey] = React.useState(metaProps.id || uuidv4());

        return (
            <PyAceEditor
                {...props}
                {...metaProps}
                maxLines={metaProps.maxLines && Number.parseInt(metaProps.maxLines, 10)}
                webKey={webKey}
                code={code}
                codeId={codeId}
                readonly={!!metaProps.readonly}
                lang={lang}
                resettable={!metaProps.persist}
                download={!metaProps.versioned && !metaProps.noDownload}
                slim={!!metaProps.slim}
                precode={precode}
                showLineNumbers={!(!!metaProps.slim && !/\n/.test(code))}
                versioned={!!metaProps.versioned}
                noHistory={!!metaProps.noHistory}
                noCompare={!!metaProps.noCompare}
                title={sanitizedTitle(title) || lang}
            />
        );
    }
    return (
        <CodeBlock {...props} />
    );
}
