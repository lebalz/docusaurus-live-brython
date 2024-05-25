import * as React from "react";
import { BRYTHON_NOTIFICATION_EVENT, DOM_ELEMENT_IDS } from "./constants";
import { LogMessage, useScript, useStore } from './WithScript/ScriptStore';
import { useRefWithCallback } from "./utils/use_ref_with_clbk";
interface Props {
}
const BrythonCommunicator = (props: Props) => {
    const { store } = useScript();
    const addLogMessage = useStore(store, (state) => state.addLogMessage);
    const clearLogMessages = useStore(store, (state) => state.clearLogMessages);
    const setExecuting = useStore(store, (state) => state.setExecuting);
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
                        clearLogMessages();
                        setExecuting(true);
                        break;
                    case "done":
                        setExecuting(false);
                        break;
                    default:
                        addLogMessage(data);
                        break;
                }
            }
        };
        current.addEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify as EventListener);
        return () => {
            current.removeEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify as EventListener)
        }

    }, [ref, addLogMessage, setExecuting, clearLogMessages]);

    return (
        <div
            id={DOM_ELEMENT_IDS.communicator(codeId)}
            ref={ref}
        ></div>
    );
};

export default BrythonCommunicator;
