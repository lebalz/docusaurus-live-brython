import * as React from 'react';
import clsx from 'clsx';
// import {default as editorStyles} from "./styles.module.css";
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython } from '@fortawesome/free-brands-svg-icons';
import {
    faPlay,
    faUndo,
    faFileSignature,
    faFileCode,
    faCheckCircle,
    faSync,
    faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { useScript, useStore } from './WithScript/ScriptStore';

interface PlayProps {
}
const PlayButton = (props: PlayProps) => {
    const { store } = useScript();
    // const { isExecuting, execScript, id, codeId } = useStore(store, (state) => ({isExecuting: state.isExecuting, id: state.id, codeId: state.codeId, execScript: state.execScript}));
    const isExecuting = useStore(store, (state) => state.isExecuting);
    const id = useStore(store, (state) => state.id);
    const codeId = useStore(store, (state) => state.codeId);
    const execScript = useStore(store, (state) => state.execScript);
    return (
        <button
            onClick={() => {
                execScript()
            }}
            className={clsx(styles.playButton, styles.headerButton)}
            title={`Code Ausführen ${id} ${codeId}`}
        >
            {/* <FontAwesomeIcon icon={isExecuting ? faPython : faPlay} spin={isExecuting} /> */}
            Exec
        </button>
    );
};

interface Props {
    slim: boolean;
    title: string;
    resettable: boolean;
    download: boolean;
    noCompare: boolean;
}

const DownloadButton = (props: {title: string}) => {
    const { store } = useScript();
    const code = useStore(store, (state) => state.code);
    const lang = useStore(store, (state) => state.lang);
    const id = useStore(store, (state) => state.id);
    return (
        <button
            className={clsx(
                styles.headerButton
            )}
            onClick={() => {
                const downloadLink = document.createElement("a");
                const file = new Blob([code],    
                            {type: 'text/plain;charset=utf-8'});
                downloadLink.href = URL.createObjectURL(file);
                const fExt = lang === 'python' ? '.py' : `.${lang}`;
                const fTitle = props.title === lang ? id : props.title
                const fName = fTitle.endsWith(fExt) ? fTitle : `${fTitle}${fExt}`;
                downloadLink.download = fName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }}
            title="Download"
        >
            {/* <FontAwesomeIcon icon={faDownload} /> */}
            Download
        </button>
    )
}

const Header = ({ slim, title, resettable, noCompare, download }: Props) => {
    const [showSavedNotification, setShowSavedNotification] = React.useState(false);
    const { store } = useScript();
    // const { setCode, pristineCode, hasEdits, code, lang, id, isLoaded } = useStore(store, (state) => ({setCode: state.setCode, pristineCode: state.pristineCode, hasEdits: state.hasEdits, code: state.code, lang: state.lang, id: state.id, isLoaded: state.isLoaded }));
    // 
    const hasEdits = useStore(store, (state) => state.hasEdits);
    const setCode = useStore(store, (state) => state.setCode);
    const lang = useStore(store, (state) => state.lang);
    const isLoaded = useStore(store, (state) => state.isLoaded);
    const pristineCode = useStore(store, (state) => state.pristineCode);
    
    const onReset = () => {
        if (!resettable) {
            return;
        }
        const shouldReset = window.confirm('Änderungen verwerfen? (Ihre Version geht verloren!)');
        if (shouldReset) {
            setCode(pristineCode);
        }
    };

    // React.useEffect(() => {
    //     let timeoutId: NodeJS.Timeout;
    //     const disposer = reaction(
    //         () => pyScript.saveService.state,
    //         (current, last) => {
    //             if (last === 'save' && current === 'done') {
    //                 setShowSavedNotification(true);
    //                 timeoutId = setTimeout(() => {
    //                     setShowSavedNotification(false);
    //                     timeoutId = undefined;
    //                 }, 1500);
    //             }
    //         }
    //     );
    //     return () => {
    //         if (timeoutId) {
    //             clearTimeout(timeoutId);
    //         }
    //         disposer();
    //     };
    // }, [pyScript]);

    return (
        <div className={clsx(styles.brythonCodeBlockHeader, styles.brythonCodeBlockHeader, styles.controls)}>
            {!slim && (
                <React.Fragment>
                    <div className={styles.title}>{title}</div>
                    {!isLoaded && (
                        <span
                            className="badge badge--warning"
                            title="Warte auf die Antwort des Servers. Seite neu laden."
                        >
                            Laden
                        </span>
                    )}
                    {<div className={styles.spacer}></div>}
                    {/* <span style={{ minWidth: '1em' }}>
                        {pyScript.saveService.state === 'save' && (
                            <FontAwesomeIcon icon={faSync} style={{ color: '#3578e5' }} spin />
                        )}
                        {showSavedNotification && (
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                style={{ color: 'var(--ifm-color-success)' }}
                            />
                        )}
                    </span> */}
                    {hasEdits && resettable && (
                        <button
                            onClick={onReset}
                            className={styles.headerButton}
                            title="Änderungen Verwerfen"
                        >
                            {/* <FontAwesomeIcon icon={faUndo} /> */}
                            Reset
                        </button>
                    )}
                    {download && (
                        <DownloadButton title={title} />
                    )}
                    {/* {hasEdits && !noCompare && (
                        <button
                            className={clsx(
                                styles.showRawButton,
                                styles.headerButton,
                                // pyScript.showRaw ? styles.showRawButtonDisabled : undefined
                            )}
                            onClick={action(() => (pyScript.showRaw = !pyScript.showRaw))}
                            title={pyScript.showRaw ? 'Mein Code Anzeigen' : 'Original Anzeigen'}
                        >
                            {pyScript.showRaw ? (
                                <FontAwesomeIcon icon={faFileCode} />
                            ) : (
                                <FontAwesomeIcon icon={faFileSignature} />
                            )}
                        </button>
                    )} */}
                </React.Fragment>
            )}
            {lang === 'python' && <PlayButton />}
        </div>
    );
};

export default Header;
export { PlayButton };
