import * as React from 'react';
import styles from './styles.module.css';
import Editor from '@theme/CodeEditor/Editor';
import BrythonCommunicator from '@theme/CodeEditor/BrythonCommunicator';
import clsx from 'clsx';
import { useStore, useScript } from '@theme/CodeEditor/hooks';
import BrowserOnly from '@docusaurus/BrowserOnly';
import CodeHistory from '@theme/CodeEditor/CodeHistory';

export interface MetaProps {
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
    title?: string;
}
export interface Props {
    slim: boolean;
    readonly: boolean;
    noCompare: boolean;
    title: string;
    versioned: boolean;
    resettable: boolean;
    download: boolean;
    showLineNumbers: boolean;
    lang: string;
    preCode: string;
    postCode: string;
    code: string;
    maxLines?: number;
    noHistory: boolean;
    className?: string;
    onChange?: (code: string) => void;
}

const CodeEditor = (props: Props) => {
    const store = useStore();
    const lang = useScript(store, 'lang');
    return (
        <BrowserOnly fallback={<div>Loading...</div>}>
            {() => {
                return (
                    <div className={clsx(styles.wrapper, 'notranslate', props.className)}>
                        <div
                            className={clsx(
                                styles.playgroundContainer,
                                props.slim ? styles.containerSlim : styles.containerBig,
                                'live_py'
                            )}
                        >
                            <Editor {...props} />
                            {!props.noHistory && <CodeHistory />}
                        </div>
                        {lang === 'python' && <BrythonCommunicator />}
                    </div>
                );
            }}
        </BrowserOnly>
    );
};

export default CodeEditor;
