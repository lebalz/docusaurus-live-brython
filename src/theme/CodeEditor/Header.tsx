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

const Header = (props: Props) => {
    const { store } = useScript();

    const hasEdits = useStore(store, (state) => state.hasEdits);
    const lang = useStore(store, (state) => state.lang);
    return (
        <div className={clsx(styles.brythonCodeBlockHeader, styles.brythonCodeBlockHeader, styles.controls)}>
            {!props.slim && (
                <React.Fragment>
                    <div className={styles.title}>{props.title}</div>
                    <ShowSyncStatus />
                    {hasEdits && props.resettable && (
                        <Reset />
                    )}
                    {props.download && (
                        <DownloadCode title={props.title} />
                    )}
                    {hasEdits && !props.noCompare && (
                       <ShowRaw />
                    )}
                </React.Fragment>
            )}
            {lang === 'python' && <RunCode title={props.title} slim={props.slim} />}
        </div>
    );
};

export default Header;
