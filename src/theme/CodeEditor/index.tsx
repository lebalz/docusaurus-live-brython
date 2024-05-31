import * as React from 'react';
import styles from './styles.module.css';
import Editor from 'docusaurus-live-brython/theme/CodeEditor/Editor';
import BrythonCommunicator from 'docusaurus-live-brython/theme/CodeEditor/BrythonCommunicator';
import clsx from 'clsx';
import { useScript, useStore } from 'docusaurus-live-brython/theme/CodeEditor/WithScript/Store';
import BrowserOnly from '@docusaurus/BrowserOnly';
import CodeHistory from 'docusaurus-live-brython/theme/CodeEditor/CodeHistory';

interface Props {
    slim: boolean;
    readonly: boolean;
    children: React.ReactNode;
    noCompare: boolean;
    title: string;
    versioned: boolean;
    resettable: boolean;
    download: boolean;
    showLineNumbers: boolean;
    lang: string;
    precode: string;
    maxLines?: number;
    noHistory: boolean;
}

const PyAceEditor = (props: Props) => {
    const { store } = useScript();
    const lang = useStore(store, (state) => state.lang);
    return (
        <BrowserOnly
            fallback={<div>Loading...</div>}
        >
            {() => {
                    return (
                        <div className={clsx(styles.wrapper, 'notranslate')}>
                            <div
                                className={clsx(
                                    styles.playgroundContainer,
                                    props.slim ? styles.containerSlim : styles.containerBig,
                                    'live_py'
                                )}
                            >
                                <Editor {...props} />
                                {!props.noHistory && (
                                    <CodeHistory />
                                )}
                            </div>
                            {lang === 'python' && <BrythonCommunicator />}
                        </div>
                    )
            }}
        </BrowserOnly>
    );
};

export default PyAceEditor;

