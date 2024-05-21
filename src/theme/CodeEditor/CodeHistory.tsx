import { observer } from 'mobx-react-lite';
import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { useStore } from '../../stores/hooks';
import Script from '../../models/Script';
import DiffViewer from 'react-diff-viewer';
import { Prism } from 'prism-react-renderer';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { reaction } from 'mobx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

interface Props {
    webKey: string;
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

const CodeHistory = observer((props: Props) => {
    const store = useStore('documentStore');
    const userStore = useStore('userStore');
    const pyScript = store.find<Script>(props.webKey);
    const [version, setVersion] = React.useState(1);
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
        return reaction(
            () => store.find<Script>(props.webKey)?.id,
            (id) => {
                if (id && id > 0) {
                    setVersion(1);
                    if (open) {
                        store.find<Script>(props.webKey)?.loadVersions();
                    }
                }
            }
        );
    }, []);

    if (!pyScript.versioned) {
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
                        pyScript.loadVersions();
                    }
                    setOpen(!open);
                }}
                className={clsx('alert alert--info', styles.historyDetails)}
            >
                <summary>
                    <span className="badge badge--secondary">
                        {pyScript.versionsLoaded ? `${pyScript.versions.length} Versions` : 'Load Versions'}
                    </span>
                    <FontAwesomeIcon
                        className={clsx(styles.faButton)}
                        color={'var(--ifm-color-primary)'}
                        spin={pyScript.versionsLoaded === 'loading'}
                        icon={faSync}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            pyScript.loadVersions();
                        }}
                    />
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
                            onChange={(c: number) => {
                                setVersion(c);
                            }}
                            min={1}
                            max={pyScript.versions.length - 1}
                            dots={pyScript.versions.length < 50}
                        />
                        <span className="badge badge--primary">
                            V{version}
                        </span>
                    </div>
                    <div className={clsx(styles.diffViewer)}>
                        {pyScript.versions.length > 1 && (
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
                    </div>
                </div>
            </details>
        </div>
    );
});

export default CodeHistory;
