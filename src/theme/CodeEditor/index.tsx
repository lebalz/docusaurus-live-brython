import * as React from 'react';
import styles from './styles.module.css';
import PyEditor from './PyEditor';
import BrythonCommunicator from './BrythonCommunicator';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import CodeHistory from './CodeHistory';
import { useScript, useStore } from './WithScript/ScriptStore';

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
    const inBrowser = useIsBrowser();
    const { store } = useScript();
    const lang = useStore(store, (state) => state.lang);

    if (!inBrowser) {
        return <div>SSR</div>;
    }
    return (
        <div className={clsx(styles.wrapper, 'notranslate')}>
            <div
                className={clsx(
                    styles.playgroundContainer,
                    props.slim ? styles.containerSlim : styles.containerBig,
                    'live_py'
                )}
            >
                {lang === 'python' && <BrythonCommunicator />}
                <PyEditor {...props} />
                {!props.noHistory && (
                    <CodeHistory />
                )}
            </div>
        </div>
    );
};

export default PyAceEditor;
