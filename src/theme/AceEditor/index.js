import * as React from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './styles.module.css';
import hashCode from '../utils/hash_code';
import debounce from 'lodash.debounce';
import { setItem, getItem } from '../utils/storage';
import Editor from './editor';
import { DOM_ELEMENT_IDS, BRYTHON_NOTIFICATION_EVENT, CLOSE_TURTLE_MODAL_EVENT, TURTLE_IMPORTS_TESTER } from './constants'
import { useRefWithCallback } from '../utils/use_ref_with_clbk';
import TurtleResult from './turtle_result';
import PyScriptSrc from './py_script_src';
import Result from './result';
import Header from './header';


export default function PyAceEditor({ children, codeId, contextId, title, resettable, slim, ...props }) {
  const isClient = useIsBrowser();
  const [rerender, setRerender] = React.useState(0);
  const rerenderRef = React.useRef(0);
  rerenderRef.current = rerender;
  const [execCounter, setExecCounter] = React.useState(0);
  const execCounterRef = React.useRef(0);
  execCounterRef.current = execCounter;
  const [executing, setExecuting] = React.useState(false);
  const [logMessages, setLogMessages] = React.useState([]);
  const [turtleModalOpen, setTurtleModalOpen] = React.useState(false);

  const [hasEdits, setHasEdits] = React.useState(getItem(codeId, contextId, {}).edited ? true : false);
  const [pyScript, setPyScript] = React.useState(hasEdits ? getItem(codeId, contextId, {}).edited : '');
  const [showRaw, setShowRaw] = React.useState(!hasEdits);
  const [showSavedNotification, setShowSavedNotification] = React.useState(false);

  const pristineHash = hashCode(isClient ? children.replace(/\n$/, '') : '');

  const _save = (script, showNotification = false) => {
    setItem(codeId, { edited: script }, contextId)
    if (showNotification) {
      setShowSavedNotification(true)
    }
  }

  const save = React.useMemo(
    () => debounce(_save, 1000)
    , [codeId, contextId, children, showRaw, slim]
  );

  const _checkForChanges = (script) => {
    if (showRaw || slim) {
      return;
    }
    const hasChanges = hashCode(script) !== pristineHash;
    setHasEdits(hasChanges)
    if (hasChanges) {
      save(script, true)
    } else {
      save(undefined)
    }
  };

  const checkForChanges = React.useMemo(
    () => debounce(_checkForChanges, 300)
    , [codeId, contextId, children, showRaw, slim]);

  // setup cleanup of debounce handler
  React.useEffect(() => {
    checkForChanges(pyScript);
    return () => {
      checkForChanges.cancel();
      save.cancel();
    }
  }, [pyScript]);  // setup cleanup of debounce handler

  React.useEffect(() => {
    const timer = window.setTimeout(() => setShowSavedNotification(false), 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showSavedNotification])

  React.useEffect(() => {
    if (showRaw) {
      setPyScript(children.replace(/\n$/, ''));
    } else {
      const item = getItem(codeId, contextId, {});
      if (item.edited) {
        setPyScript(item.edited)
      }
    }
  }, [showRaw]);

  React.useEffect(() => {
    setExecCounter(0);
  }, [codeId])

  React.useEffect(() => {
    if (execCounter > 0) {
      setLogMessages([])
      window.brython(1, { ids: [DOM_ELEMENT_IDS.scriptSource(codeId)] })
    }
  }, [execCounter, codeId])

  const onBryNotify = React.useCallback((event) => {
    if (event.detail) {
      const data = event.detail;
      switch (data.type) {
        case 'done':
          setExecuting(false);
          break;
        case 'stdout':
        case 'stderr':
          if (data.output.length > 0) {
            setLogMessages(oldArray => {
              return [
                ...oldArray,
                {
                  type: data.type,
                  msg: data.output,
                  time: event.timeStamp
                }
              ].sort((a, b) => a.time > b.time ? 1 : (a.time < b.time ? -1 : 0));
            })
          }
          break;
      }
    }
  }, []);

  const onTurtleModalClose = React.useCallback((event) => {
    if (event.detail.force || event.detail.codeId !== codeId) {
      setTurtleModalOpen(false);
    } else {
      const resNode = document.getElementById(DOM_ELEMENT_IDS.turtleResult(codeId))
      while (resNode && resNode.lastElementChild) {
        resNode.removeChild(resNode.lastElementChild);
      }
    }
  }, [])

  const setupEventListeners = useRefWithCallback(
    (node) => { // mount
      if (node.id !== DOM_ELEMENT_IDS.component(codeId)) {
        setRerender(rerenderRef.current + 1);
      }
      node.addEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify)
      document.addEventListener(CLOSE_TURTLE_MODAL_EVENT, onTurtleModalClose)
    },
    (node) => { // unmount
      node.removeEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify)
      document.removeEventListener(CLOSE_TURTLE_MODAL_EVENT, onTurtleModalClose)
    }
  );

  const clearResult = (force = false) => {
    /* only one turtle modal shall be opened at a time */
    document.dispatchEvent(
      new CustomEvent(
        CLOSE_TURTLE_MODAL_EVENT,
        { detail: { codeId: codeId, force: force } }
      )
    );
  }

  const execScript = () => {
    if (!slim && !showRaw) {
      _save(pyScript, hasEdits)
    }
    setItem(codeId, { executed: pyScript }, contextId)
    clearResult()
    // make sure brython always processes only one script per page
    document.querySelectorAll('.brython-script[type="text/python"]').forEach((src) => {
      src.setAttribute('type', 'text/py_disabled');
    })
    const active = document.getElementById(DOM_ELEMENT_IDS.scriptSource(codeId))
    active.setAttribute('type', 'text/python');
    setExecuting(true);
    if (TURTLE_IMPORTS_TESTER.test(pyScript)) {
      setTurtleModalOpen(true)
    }
    setExecCounter(execCounterRef.current + 1)
  }

  const onChange = (value) => {
    if (showRaw && !slim) {
      setShowRaw(false);
      if (getItem(codeId, contextId, {}).edited) {
        return;
      }
    }
    setPyScript(value);
  }

  const onReset = () => {
    if (!resettable) {
      return;
    }
    const item = getItem(codeId, contextId, {})
    if (item.original) {
      setShowRaw(true)
      setItem(codeId, { edited: undefined }, contextId)
      setHasEdits(false)
    }
  }
  
  const onToggleRaw = () => setShowRaw(!showRaw)

  return (
    <div
      id={DOM_ELEMENT_IDS.component(codeId)}
      className={clsx(
        styles.playgroundContainer,
        slim ? styles.containerSlim : styles.containerBig,
        'live_py'
      )}
      key={rerender}
      ref={setupEventListeners}
    >
      <Header
        slim={slim}
        title={title}
        executing={executing}
        onReset={onReset}
        onToggleRaw={onToggleRaw}
        hasEdits={hasEdits}
        showRaw={showRaw}
        resettable={resettable}
        execScript={execScript}
        showSavedNotification={showSavedNotification}
      />
      <Editor
        onChange={onChange}
        execScript={execScript}
        pyScript={pyScript}
        setPyScript={setPyScript}
        codeId={codeId}
        contextId={contextId}
        name={DOM_ELEMENT_IDS.aceEditor(codeId)}
        save={_save}
      />
      <div className={clsx(styles.result)}>
        <Result
          logMessages={logMessages}
          codeId={codeId}
          pyScript={pyScript}
        />
        {turtleModalOpen &&
          <TurtleResult codeId={codeId} clearResult={clearResult} contextId={contextId} />
        }
        <PyScriptSrc codeId={codeId} pyScript={pyScript} />
      </div>
    </div>
  )
}
