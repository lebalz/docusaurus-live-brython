import * as React from 'react';
import clsx from 'clsx';
// import {default as editorStyles} from "./styles.module.css";
import styles from './styles.module.css';
import { useScript, useStore } from './WithScript/ScriptStore';
import Button, { Color } from './Button';
import { translate } from '@docusaurus/Translate';
import ShowRaw from './Actions/ShowRaw';
import RunCode from './Actions/RunCode';
import Icon from './Icon';
import Reset from './Actions/Reset';
import DownloadCode from './Actions/DownloadCode';

interface Props {
    slim: boolean;
    title: string;
    resettable: boolean;
    download: boolean;
    noCompare: boolean;
}

const Header = ({ slim, title, resettable, noCompare, download }: Props) => {
    const [showSavedNotification, setShowSavedNotification] = React.useState(false);
    const { store } = useScript();

    const hasEdits = useStore(store, (state) => state.hasEdits);
    const lang = useStore(store, (state) => state.lang);
    const isLoaded = useStore(store, (state) => state.isLoaded);

    return (
        <div className={clsx(styles.brythonCodeBlockHeader, styles.brythonCodeBlockHeader, styles.controls)}>
            {!slim && (
                <React.Fragment>
                    <div className={styles.title}>{title}</div>
                    {!isLoaded && (
                        <Icon icon='Sync' spin size={'1.2em'} color={Color.Primary}/>
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
                        <Reset />
                    )}
                    {download && (
                        <DownloadCode title={title} />
                    )}
                    {hasEdits && !noCompare && (
                       <ShowRaw />
                    )}
                </React.Fragment>
            )}
            {lang === 'python' && <RunCode title={title} />}
        </div>
    );
};

export default Header;
