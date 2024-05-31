import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { useScript, useStore } from 'docusaurus-live-brython/theme/CodeEditor/WithScript/Store';
import ShowSyncStatus from 'docusaurus-live-brython/theme/CodeEditor/Actions/ShowSyncStatus';
import Reset from 'docusaurus-live-brython/theme/CodeEditor/Actions/Reset';
import DownloadCode from 'docusaurus-live-brython/theme/CodeEditor/Actions/DownloadCode';
import ShowRaw from 'docusaurus-live-brython/theme/CodeEditor/Actions/ShowRaw';
import RunCode from 'docusaurus-live-brython/theme/CodeEditor/Actions/RunCode';

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
        <div className={clsx(styles.controls, props.slim && styles.slim)}>
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
