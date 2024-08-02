import * as React from 'react';
import { BRYTHON_NOTIFICATION_EVENT, DOM_ELEMENT_IDS } from '@theme/CodeEditor/constants';
import { useStore, useScript } from '@theme/CodeEditor/hooks';
import { type LogMessage } from '@theme/CodeEditor/WithScript/Types';

const BrythonCommunicator = () => {
    const store = useStore();
    const codeId = useScript(store, 'codeId');

    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const { current } = ref;
        if (!current) {
            return;
        }
        const onBryNotify = (event: { detail?: LogMessage }) => {
            if (event.detail) {
                const data = event.detail as LogMessage;
                switch (data.type) {
                    case 'start':
                        store.clearLogMessages();
                        store.setExecuting(true);
                        break;
                    case 'done':
                        store.setExecuting(false);
                        break;
                    default:
                        store.addLogMessage({
                            type: data.type,
                            output: data.output,
                            timeStamp: data.timeStamp
                        });
                        break;
                }
            }
        };
        current.addEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify as EventListener);
        return () => {
            current.removeEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify as EventListener);
        };
    }, [ref, store]);

    return <div id={DOM_ELEMENT_IDS.communicator(codeId)} ref={ref}></div>;
};

export default BrythonCommunicator;
