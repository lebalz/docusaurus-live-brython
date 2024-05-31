import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { Prism } from 'prism-react-renderer';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useScript, useStore } from 'docusaurus-live-brython/theme/CodeEditor/WithScript/Store';
import Translate, { translate } from '@docusaurus/Translate';
import Button from 'docusaurus-live-brython/theme/CodeEditor/Button';
import DiffViewer from 'react-diff-viewer';
import Details from '@theme/Details';

const highlightSyntax = (str: string) => {
    if (!str) {
        return;
    }
    return (
        <span
            dangerouslySetInnerHTML={{
                __html: Prism.highlight(str, Prism.languages.python, 'python'),
            }}
        />
    );
};

const CodeHistory = () => {
    const [version, setVersion] = React.useState(1);
    const { store } = useScript();
    const versions = useStore(store, (state) => state.versions);
    const versionsLoaded = useStore(store, (state) => state.versionsLoaded);

    if (versions?.length < 2) {
        return null;
    }
    return (
        <div className={clsx(styles.codeHistory)}>
            <Details
                className={clsx(styles.historyDetails)}
                summary={
                    <summary>
                        <div className={clsx(styles.summary)}>
                            <span className="badge badge--secondary">
                                {
                                    versionsLoaded
                                        ? translate({message: '{n} Versions', id: 'CodeHistory.nVersions.text'}, {n: versions.length})
                                        : translate({message: 'Load Versions', id: 'CodeHistory.LoadVersions.text'})
                                }
                            </span>
                            <span className={clsx(styles.spacer)}></span>
                            <Button
                                icon='Sync'
                                title={translate({message: 'Sync Versions', id: 'CodeHistory.LoadVersions.text'})}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    store.loadVersions();
                                }}
                            />
                        </div>
                    </summary>
                }
            >
                <div
                    className={clsx(styles.content)}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <div className={clsx(styles.versionControl)}>
                        <Slider
                            value={version}
                            onChange={(c: number | number[]) => {
                                if (Array.isArray(c)) {
                                    return;
                                }
                                setVersion(c);
                            }}
                            min={1}
                            max={versions.length - 1}
                            dots={versions.length < 50}
                        />
                        <span className="badge badge--primary">
                            V{version}
                        </span>
                    </div>
                    <div className={clsx(styles.diffViewer)}>
                        {versions.length > 1 && (
                            <DiffViewer
                                splitView
                                oldValue={versions[version - 1].code}
                                newValue={versions[version].code}
                                leftTitle={
                                    <div className={clsx(styles.diffHeader)}>
                                        {`V${version}`}
                                        {versions[version].pasted && (
                                            <span className={clsx('badge', 'badge--danger')}>
                                                <Translate id="CodeHistory.PastedBadge.Text">Pasted</Translate>
                                            </span>
                                        )}
                                    </div>
                                }
                                rightTitle={
                                    <div className={clsx(styles.diffHeader)}>
                                        {`V${version}`}
                                        {versions[version].pasted && (
                                            <span className={clsx('badge', 'badge--danger')}>
                                                <Translate id="CodeHistory.PastedBadge.Text">Pasted</Translate>
                                            </span>
                                        )}
                                    </div>
                                }
                                renderContent={highlightSyntax}
                            />
                        )}
                    </div>
                </div>
            </Details>
        </div>
    );
};

export default CodeHistory;
