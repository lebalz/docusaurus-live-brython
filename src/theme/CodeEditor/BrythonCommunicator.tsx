import * as React from "react";
import { BRYTHON_NOTIFICATION_EVENT, DOM_ELEMENT_IDS } from "./constants";
import { LogMessage } from "./WithScript";
import { useScript } from './WithScript/ScriptContext';
import { useRefWithCallback } from "./utils/use_ref_with_clbk";
interface Props {
}

const BrythonCommunicator = (props: Props) => {
  const { codeId } = useScript();
  const { setExecuting, addLogMessage, clearLogMessages } = useScript();

  const onBryNotify = React.useCallback((event: {detail?: LogMessage}) => {
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
      }
    }
  }, [setExecuting, addLogMessage, clearLogMessages]);

  const setupEventListeners = useRefWithCallback(
    (node) => {
      // mount
      node.addEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify as EventListener);
    },
    (node) => {
      // unmount
      node.removeEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify as EventListener);
    }
  );
  return (
    <div
      id={DOM_ELEMENT_IDS.communicator(codeId)}
      ref={setupEventListeners}
    ></div>
  );
};

export default BrythonCommunicator;
