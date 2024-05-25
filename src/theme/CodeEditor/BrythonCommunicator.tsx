import * as React from "react";
import { BRYTHON_NOTIFICATION_EVENT, DOM_ELEMENT_IDS } from "./constants";
import { LogMessage, useScript, useStore } from './WithScript/ScriptStore';
import { useRefWithCallback } from "./utils/use_ref_with_clbk";
interface Props {
}
const BrythonCommunicator = (props: Props) => {
    const { store } = useScript();
    const {addLogMessage, clearLogMessages, codeId, setExecuting} = useStore(store, (state) => ({codeId: state.codeId, setExecuting: state.setExecuting, addLogMessage: state.addLogMessage, clearLogMessages: state.clearLogMessages}));

    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const { current } = ref;
        if (!current) {
            return;
        }
        console.log('!!!!! rebind !!!!!')
        const onBryNotify = (event: { detail?: LogMessage }) => {
            if (event.detail) {
                const data = event.detail as LogMessage;
                    console.log('xxxx:', data)
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

    // const onBryNotify = React.useCallback((event: {detail?: LogMessage}) => {
    //   if (event.detail) {
    //     const data = event.detail as LogMessage;
    //     switch (data.type) {
    //       case "start":
    //         console.log('start', 'clear')
    //         clearLogMessages();
    //         setExecuting(true);
    //         break;
    //       case "done":
    //         setExecuting(false);
    //         break;
    //       default:
    //         addLogMessage(data);
    //         break;
    //     }
    //   }
    // }, [setExecuting, addLogMessage, clearLogMessages, logs]);

    // const setupEventListeners = useRefWithCallback(
    //   (node) => {
    //     // mount
    //     node.addEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify as EventListener);
    //   },
    //   (node) => {
    //     // unmount
    //     node.removeEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify as EventListener);
    //   }
    // );
    return (
        <div
            id={DOM_ELEMENT_IDS.communicator(codeId)}
            ref={ref}
        ></div>
    );
};

export default BrythonCommunicator;
