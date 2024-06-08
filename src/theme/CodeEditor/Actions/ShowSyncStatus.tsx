import * as React from 'react';
import { useStore, useScript } from '@theme/CodeEditor/hooks';
import Icon, { Color } from '@theme/CodeEditor/Icon';
import { Status } from '@theme/CodeEditor/WithScript/Types';

const ShowSyncStatus = () => {
    const store = useStore();
    const isLoaded = useScript(store, 'isLoaded');
    const status = useScript(store, 'status');

    React.useEffect(() => {
        if (status !== Status.IDLE) {
            const disposer = setTimeout(() => {
                store.setState((state) => ({ ...state, status: Status.IDLE }));
            }, 1200);
            return () => clearTimeout(disposer);
        }
    }, [status, store]);

    return (
        <>
            {!isLoaded && (
                <Icon icon='Sync' spin size={'1.2em'} color={Color.Primary}/>
            )}
            <div style={{flexGrow: 1, flexShrink: 1, flexBasis: 0}}></div>
            <span style={{ minWidth: '1em' }}>
                {status === Status.SYNCING && (
                    <Icon icon='Sync' spin size={'1.2em'} color={Color.Primary}/>
                )}
                {status === Status.SUCCESS && (
                    <Icon icon='Check' size={'1.2em'} color={Color.Success}/>
                )}
                {status === Status.ERROR && (
                    <Icon icon='Close' size={'1.2em'} color={Color.Danger}/>
                )}
            </span>
        </>
    )
}

export default ShowSyncStatus;