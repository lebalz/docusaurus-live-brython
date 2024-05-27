import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { Status, useScript, useStore } from './WithScript/ScriptStore';
import ShowRaw from './Actions/ShowRaw';
import RunCode from './Actions/RunCode';
import Icon, { Color } from './Icon';
import Reset from './Actions/Reset';
import DownloadCode from './Actions/DownloadCode';
import ShowSyncStatus from './Actions/ShowSyncStatus';

interface Props {
    slim: boolean;
    title: string;
    resettable: boolean;
    download: boolean;
    noCompare: boolean;
}

const Header = ({ slim, title, resettable, noCompare, download }: Props) => {
    const { store } = useScript();

    const hasEdits = useStore(store, (state) => state.hasEdits);
    const lang = useStore(store, (state) => state.lang);
    const isLoaded = useStore(store, (state) => state.isLoaded);
    const status = useStore(store, (state) => state.status);


    return (
        <div className={clsx(styles.brythonCodeBlockHeader, styles.brythonCodeBlockHeader, styles.controls)}>
            {!slim && (
                <React.Fragment>
                    <div className={styles.title}>{title}</div>
                    <ShowSyncStatus />
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
