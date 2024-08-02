import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { useStore, useScript } from '@theme/CodeEditor/hooks';
import ShowSyncStatus from '@theme/CodeEditor/Actions/ShowSyncStatus';
import Reset from '@theme/CodeEditor/Actions/Reset';
import DownloadCode from '@theme/CodeEditor/Actions/DownloadCode';
import ShowRaw from '@theme/CodeEditor/Actions/ShowRaw';
import RunCode from '@theme/CodeEditor/Actions/RunCode';

export interface Props {
    slim: boolean;
    title: string;
    resettable: boolean;
    download: boolean;
    noCompare: boolean;
}

const Header = (props: Props) => {
    const store = useStore();

    const hasEdits = useScript(store, 'hasEdits');
    const lang = useScript(store, 'lang');
    return (
        <div className={clsx(styles.controls, props.slim && styles.slim)}>
            {!props.slim && (
                <React.Fragment>
                    <div className={styles.title}>{props.title}</div>
                    <ShowSyncStatus />
                    {hasEdits && props.resettable && <Reset />}
                    {props.download && <DownloadCode title={props.title} />}
                    {hasEdits && !props.noCompare && <ShowRaw />}
                </React.Fragment>
            )}
            {lang === 'python' && <RunCode title={props.title} slim={props.slim} />}
        </div>
    );
};

export default Header;
