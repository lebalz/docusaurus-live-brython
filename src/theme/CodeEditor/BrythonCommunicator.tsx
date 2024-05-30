import * as React from "react";
import { BRYTHON_NOTIFICATION_EVENT, DOM_ELEMENT_IDS } from "./constants";
import { LogMessage, useScript, useStore } from './WithScript/Store';

const BrythonCommunicator = () => {
    const { store } = useScript();
    const codeId = useStore(store, (state) => state.codeId);
    

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
                    case "start":
                        store.clearLogMessages();
                        store.setExecuting(true);
                        break;
                    case "done":
                        store.setExecuting(false);
                        break;
                    default:
                        store.addLogMessage(data);
                        break;
                }
            }
        };
        current.addEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify as EventListener);
        return () => {
            current.removeEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify as EventListener)
        }

    }, [ref, store]);

    return (
        <div
            id={DOM_ELEMENT_IDS.communicator(codeId)}
            ref={ref}
        ></div>
    );
};

export default BrythonCommunicator;
