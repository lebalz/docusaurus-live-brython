import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { Prism } from 'prism-react-renderer';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { useScript, useStore } from './WithScript/ScriptStore';

interface Props {
}

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

const CodeHistory = (props: Props) => {
    const [version, setVersion] = React.useState(1);
    const [open, setOpen] = React.useState(false);
    const { store } = useScript();
    const { versions } = useStore(store, (state) => ({versions: state.versions}));

    if (versions.length < 1) {
        return null;
    }
    return (
        <div className={clsx(styles.codeHistory)}>
            <details
                open={open}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!open) {
                        // pyScript.loadVersions();
                    }
                    setOpen(!open);
                }}
                className={clsx('alert alert--info', styles.historyDetails)}
            >
                <summary>
                    <span className="badge badge--secondary">
                        {/* {pyScript.versionsLoaded ? `${versions.length} Versions` : 'Load Versions'} */}
                        {`${versions.length} Versions`}
                    </span>
                    {/* <FontAwesomeIcon
                        className={clsx(styles.faButton)}
                        color={'var(--ifm-color-primary)'}
                        // spin={pyScript.versionsLoaded === 'loading'}
                        // icon={faSync}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            pyScript.loadVersions();
                        }}
                    /> */}
                </summary>
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
                    {/* <div className={clsx(styles.diffViewer)}>
                        {versions.length > 1 && (
                            <DiffViewer
                                leftTitle={pyScript.versions[version - 1].version}
                                rightTitle={
                                    <div>
                                        {pyScript.versions[version].version}
                                        {pyScript.versions[version].pasted && userStore.current?.admin && (
                                            <span style={{ float: 'right' }} className="badge badge--danger">
                                                Pasted
                                            </span>
                                        )}
                                    </div>
                                }
                                splitView
                                oldValue={pyScript.versions[version - 1].data.code}
                                newValue={pyScript.versions[version].data.code}
                                renderContent={highlightSyntax}
                            />
                        )}
                    </div> */}
                </div>
            </details>
        </div>
    );
};

export default CodeHistory;
