import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPython } from "@fortawesome/free-brands-svg-icons"
import { faPlay, faUndo, faFileSignature, faFileCode } from '@fortawesome/free-solid-svg-icons'

const PlayButton = ({ execScript, executing }) => {
    return (
        <button
            onClick={execScript}
            className={clsx(styles.playButton, styles.headerButton)}
        >
            <FontAwesomeIcon 
                icon={executing ? faPython : faPlay}
                spin={executing}
            />
        </button>
    )
}

export default function Header({
    slim,
    title,
    executing,
    onReset,
    hasEdits,
    showRaw,
    resettable,
    onToggleRaw,
    execScript }) {

    return (
        <div className={clsx(styles.brythonCodeBlockHeader, styles.controls)}>
            {!slim && (
                <React.Fragment>
                    <div>
                        {title}
                    </div>
                    <div className={styles.spacer} ></div>
                </React.Fragment>
            )}
            {(!slim && hasEdits && !showRaw && resettable) && (
                <button
                    onClick={onReset}
                    className={styles.headerButton}
                >
                    <FontAwesomeIcon icon={faUndo} />
                </button>
            )}
            {(!slim && hasEdits) && (
                <button
                    className={clsx(styles.showRawButton, styles.headerButton, showRaw ? styles.showRawButtonDisabled : undefined)}
                    onClick={onToggleRaw}
                >
                    {
                        showRaw ? (
                            <FontAwesomeIcon icon={faFileCode} />
                        ) : (
                            <FontAwesomeIcon icon={faFileSignature} />
                        )
                    }
                </button>
            )}
            <PlayButton execScript={execScript} executing={executing} />

        </div>
    )
}

export {PlayButton}