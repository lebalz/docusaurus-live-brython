import React from 'react';
import CodeBlock, { type Props as CodeBlockType } from '@theme-init/CodeBlock';
import type { WrapperProps } from '@docusaurus/types';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { type MetaProps } from '@theme/CodeEditor';

import ContextEditor, { splitCode } from '@theme/CodeEditor/ContextEditor';
import BrowserOnly from '@docusaurus/BrowserOnly';

type Props = WrapperProps<typeof CodeBlockType>;

const sanitizedTitle = (id: string) => {
    if (!id) {
        return;
    }
    return id
        .replace(/--/g, '<<HYPHEN>>')
        .replace(/__/g, '<<UNDERSCORE>>')
        .replace(/[-_]/g, ' ')
        .replace(/<<UNDERSCORE>>/g, '_')
        .replace(/<<HYPHEN>>/g, '-');
};

const extractMetaProps = (props: { metastring?: string }): MetaProps => {
    const metaString = (props?.metastring || '').replace(/\s*=\s*/g, '='); // remove spaces around =
    const metaRaw = metaString.split(/\s+/).map((s) => s.trim().split('='));
    return metaRaw.reduce(
        (acc, [key, value]) => {
            if (!key) {
                return acc;
            }
            /** casts to booleans and numbers. When no value was provided, true is used */
            const val =
                value === 'true'
                    ? true
                    : value === 'false'
                        ? false
                        : !Number.isNaN(Number(value))
                            ? Number(value)
                            : value || true;
            acc[key] = val;
            return acc;
        },
        {} as { [key: string]: number | string | boolean }
    );
};

export default function CodeBlockWrapper(props: Props): React.ReactNode {
    const metaProps = extractMetaProps(props);
    const langMatch = ((props.className || '') as string).match(/language-(?<lang>\w*)/);
    let lang = langMatch?.groups?.lang?.toLocaleLowerCase() ?? '';
    if (lang === 'py') {
        lang = 'python';
    }
    // if (metaProps.live_jsx) {
    //     return <Playground scope={ReactLiveScope} {...props} />;
    // }
    if (metaProps.live_py) {
        const title = props.title || metaProps.title;
        const { code } = splitCode((props.children as string) || '');
        return (
            <BrowserOnly fallback={<CodeBlock language={lang}>{code}</CodeBlock>}>
                {() => {
                    return (
                        <ContextEditor {...props} {...metaProps} title={sanitizedTitle(title) || lang}>
                            {props.children}
                        </ContextEditor>
                    );
                }}
            </BrowserOnly>
        );
    }
    return <CodeBlock {...props} />;
}
