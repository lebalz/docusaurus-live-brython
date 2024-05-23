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
import { useScript } from './WithScript/ScriptContext';
import { useStore } from './WithScript/StoreContext';

interface PlayProps {
}
const PlayButton = (props: PlayProps) => {
    const { codeId } = useStore();
    const {isExecuting, execScript, id} = useScript();
    return (
        <button
            onClick={() => execScript((window as any).__BRYTHON__)}
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
    lang: string;
}

const Header = ({ slim, title, resettable, lang, noCompare, download }: Props) => {
    const [showSavedNotification, setShowSavedNotification] = React.useState(false);
    const script = useScript();

    const onReset = () => {
        if (!resettable) {
            return;
        }
        // if (readonly) {
        //     pyScript.setData({ code: pyScript.pristine.code });
        //     return;
        // }
        const shouldReset = window.confirm('Änderungen verwerfen? (Ihre Version geht verloren!)');
        if (shouldReset) {
            script.setCode(script.pristineCode);
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
                    {!script && (
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
                    {script.hasEdits && resettable && (
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
                        <button
                            className={clsx(
                                styles.headerButton
                            )}
                            onClick={() => {
                                const downloadLink = document.createElement("a");
                                const file = new Blob([script.code],    
                                            {type: 'text/plain;charset=utf-8'});
                                downloadLink.href = URL.createObjectURL(file);
                                const fExt = lang === 'python' ? '.py' : `.${lang}`;
                                const fTitle = title === lang ? script.id : title
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
                    )}
                    {/* {script.hasEdits && !noCompare && (
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
