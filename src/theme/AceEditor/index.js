/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPython } from "@fortawesome/free-brands-svg-icons"
import { faDownload, faTimes, faPlay, faUndo, faFileSignature, faFileCode } from '@fortawesome/free-solid-svg-icons'
import Draggable from 'react-draggable';
import hashCode from '../utils/hash_code';
import debounce from 'lodash.debounce';
var AceEditor = undefined
import { setItem, getItem } from '../utils/storage';

const BRYTHON_NOTIFICATION_EVENT = 'bry_notify'
const CLOSE_TURTLE_MODAL_EVENT = 'close_turtle_modal'
const DOM_ELEMENT_IDS = {
  component: (codeId) => `${codeId}`,
  turtleResult: (codeId) => `${codeId}_turtle_result`,
  loaderIcon: (codeId) => `${codeId}_loader`,
  aceEditor: (codeId) => `${codeId}_editor`,
  turtleSvgContainer: (codeId) => `${codeId}_svg`,
  scriptSource: (codeId) => `${codeId}_src`
}


const loadLibs = (callback) => {
  if (AceEditor) {
    return callback();
  }

  import('react-ace').then((aceModule) => {
    return Promise.all([
      import('ace-builds/src-noconflict/mode-python'),
      // import 'ace-builds/src-noconflict/theme-textmate';
      import('ace-builds/src-noconflict/theme-dracula'),

      // import('ace-builds/src-noconflict/snippets/python'),
      import("ace-builds/src-noconflict/ext-language_tools"),
    ]).then(obj => {
      AceEditor = aceModule.default;
      callback();
    });
  })
};


const TURTLE_IMPORTS_TESTER = /(^from turtle import)|(^import turtle)/m

const run_template = require("./brython_runner.raw.py")


function saveSvg(svgEl, name) {
  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  var svgData = svgEl.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  var svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

/**
 * The python script is transformed to a string by embedding it with """ characters.
 * So we must prevent the script itself to contain this sequence of characters.
 * @param {String} script 
 */
function sanitizePyScript(script) {
  return script.replace(/"{3}/g, "'''")
}

/**
 * @url https://medium.com/welldone-software/usecallback-might-be-what-you-meant-by-useref-useeffect-773bc0278ae
 * 
 * @param {(node: any) => void} onMount 
 * @param {(node: any) => void} onUnmount
 * @returns (node: any) => void
 */
function useRefWithCallback(onMount, onUnmount) {
  const nodeRef = React.useRef(null);

  const setRef = React.useCallback(node => {
    if (nodeRef.current) {
      onUnmount(nodeRef.current);
    }

    nodeRef.current = node;

    if (nodeRef.current) {
      onMount(nodeRef.current);
    }
  }, [onMount, onUnmount]);

  return setRef;
}

export default function PyAceEditor({ children, codeId, title, resettable, slim, ...props }) {
  const { isClient } = useDocusaurusContext();
  const [execCounter, setExecCounter] = React.useState(0);
  const [executing, setExecuting] = React.useState(false);
  const [logMessages, setLogMessages] = React.useState([]);
  const [turtleModalOpen, setTurtleModalOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const [hasEdits, setHasEdits] = React.useState(getItem(codeId, {}).edited ? true : false);
  const [pyScript, setPyScript] = React.useState(hasEdits ? getItem(codeId, {}).edited : '');
  const [showRaw, setShowRaw] = React.useState(!hasEdits);

  const pristineHash = hashCode(isClient ? children.replace(/\n$/, '') : '');


  React.useEffect(() => {
    loadLibs(() => {
      setLoaded(true);
      setItem(codeId, { original: pyScript });
      const item = getItem(codeId)
      if (item.edited) {
        setPyScript(item.edited);
      }
    });
  }, [loaded]);

  const _checkForChanges = (script) => {
    if (showRaw || slim) {
      return;
    }
    const hasChanges = hashCode(script) !== pristineHash;
    setHasEdits(hasChanges)
    if (hasChanges) {
      setItem(codeId, { edited: script })
    } else {
      setItem(codeId, { edited: undefined })
    }
  };
  const checkForChanges = React.useMemo(
    () => debounce(_checkForChanges, 300)
    , [codeId, children, showRaw, slim]);

  // setup cleanup of debounce handler
  React.useEffect(() => {
    checkForChanges(pyScript);
    return () => {
      checkForChanges.cancel();
    }
  }, [pyScript]);  // setup cleanup of debounce handler

  React.useEffect(() => {
    if (showRaw) {
      setPyScript(children.replace(/\n$/, ''));
    } else {
      const item = getItem(codeId, {});
      if (item.edited) {
        setPyScript(item.edited)
      }
    }
  }, [showRaw]);


  React.useEffect(() => {
    if (execCounter > 0) {
      setLogMessages([])
      window.brython(1, { ids: [`${codeId}_src`] })
    }
  }, [execCounter])

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
      node.addEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify)
      document.addEventListener(CLOSE_TURTLE_MODAL_EVENT, onTurtleModalClose)
    },
    (node) => { // unmount
      node.removeEventListener(BRYTHON_NOTIFICATION_EVENT, onBryNotify)
      document.removeEventListener(CLOSE_TURTLE_MODAL_EVENT, onTurtleModalClose)
    }
  );

  const editorRef = React.useCallback(node => {
    if (node !== null) {
      if (node.editor) {
        node.editor.commands.addCommand({
          // commands is array of key bindings.
          name: 'execute',
          bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
          exec: execScript
        });
      }
    }
  }, []);

  const clearResult = (force = false) => {
    /* only one turtle modal shall be opened at a time */
    document.dispatchEvent(new CustomEvent(CLOSE_TURTLE_MODAL_EVENT, { detail: { codeId: codeId, force: force } }));
  }

  const execScript = () => {
    if (!slim) {
      setItem(codeId, { edited: pyScript })
    }
    clearResult()
    // make sure brython always processes only one script per page
    document.querySelectorAll('.brython-script[type="text/python"]').forEach((scr) => {
      scr.setAttribute('type', 'text/py_disabled')
    })
    const active = document.getElementById(DOM_ELEMENT_IDS.scriptSource(codeId))
    active.setAttribute('type', 'text/python');
    setExecuting(true);
    if (TURTLE_IMPORTS_TESTER.test(pyScript)) {
      setTurtleModalOpen(true)
    }
    setExecCounter(execCounter + 1)
  }

  const onChange = (value) => {
    if (showRaw && !slim) {
      setShowRaw(false);
      if (getItem(codeId, {}).edited) {
        return;
      }
    }
    setPyScript(value);
  }

  const checkForButtonClick = (event) => {
    if (!event.type || event.type.toLowerCase() !== 'touchend') {
      return;
    }
    var elem = event.target;
    if (!elem) {
      return;
    }
    while (elem.tagName.toLowerCase() !== 'button') {
      elem = elem.parentNode;
      if (!elem || !elem.tagName) {
        break;
      }
      if (elem.tagName.toLowerCase() === 'div') {
        if (elem.classList.contains('react-draggable')) {
          elem = null
          break;
        }
      }
    }
    if (elem) {
      // add the click to the end of the event queue
      setTimeout(() => elem.click(), 1);
    }
  }

  return (
    <div className={clsx(styles.playgroundContainer, slim ? styles.containerSlim : styles.containerBig, 'live_py')} id={DOM_ELEMENT_IDS.component(codeId)} ref={setupEventListeners}>
      <div className={clsx(styles.brythonCodeBlockHeader, styles.controls)}>
        {!slim && (
          <React.Fragment>
            <div>
              {title}
            </div>
            <div className={styles.spacer} ></div>
          </React.Fragment>
        )}
        {(!slim && hasEdits && !showRaw && resettable) && (
          <button
            onClick={() => {
              if (!resettable) {
                return;
              }
              const item = getItem(codeId, {})
              if (item.original) {
                setShowRaw(true)
                setItem(codeId, { edited: undefined })
                setHasEdits(false)
              }
            }}
            className={styles.headerButton}
          >
            <FontAwesomeIcon icon={faUndo} />
          </button>
        )}
        {(!slim && hasEdits) && (
          <button
            className={clsx(styles.showRawButton, styles.headerButton, showRaw ? styles.showRawButtonDisabled : undefined)}
            onClick={() => setShowRaw(!showRaw)}
          >
            {
              showRaw ? (
                <FontAwesomeIcon icon={faFileCode} />
              ) : (
                <FontAwesomeIcon icon={faFileSignature} />
              )
            }
          </button>
        )}
        <button
          onClick={execScript}
          className={clsx(styles.playButton, styles.headerButton)}
        >
          {executing ? <FontAwesomeIcon icon={faPython} spin id={DOM_ELEMENT_IDS.loaderIcon(codeId)} /> : <FontAwesomeIcon icon={faPlay} />}
        </button>

      </div>
      <div className={clsx(styles.brythonCodeBlock, styles.editor)}>
        {
          loaded ? (
            <AceEditor
              className={styles.brythonEditor}
              style={{
                width: '100%',
              }}
              maxLines={20}
              ref={editorRef}
              mode="python"
              theme="dracula"
              keyBindings="VSCode"
              onChange={onChange}
              value={pyScript}
              defaultValue={pyScript}
              name={DOM_ELEMENT_IDS.aceEditor(codeId)}
              editorProps={{ $blockScrolling: true }}
              setOptions={{displayIndentGuides: true, vScrollBarAlwaysVisible: false, highlightGutterLine: false}}
              showPrintMargin={false}
              highlightActiveLine={false}
              enableBasicAutocompletion
              enableLiveAutocompletion={false}
              enableSnippets={false}
              showGutter
            />
          ) :
            (<pre>
              <code>
                {children}
              </code>
            </pre>)
        }
      </div>
      <div className={clsx(styles.result)}>
        <div className={styles.brythonOut}>
          {
            logMessages.length > 0 && (
              <pre>
                {logMessages.map((msg, idx) => {
                  return (
                    <code
                      key={idx}
                      style={{
                        color: msg.type === 'stderr' ? 'var(--ifm-color-danger-darker)' : undefined
                      }}
                    >
                      {msg.msg}
                    </code>)
                })}
              </pre>
            )
          }
        </div>
        {
          turtleModalOpen && (
            <Draggable
              // onMouseDown={checkForButtonClick}
              onStop={checkForButtonClick}
            >
              <div className={styles.brythonTurtleResult}>
                <div className={styles.brythonTurtleResultHead}>
                  <span>Output</span>
                  <span className={styles.spacer} ></span>
                  <button
                    aria-label="Download SVG"
                    type="button"
                    className={styles.slimStrippedButton}
                    style={{ zIndex: 1000 }}
                    onClick={() => {
                      if (turtleModalOpen) {
                        const turtleResult = document.getElementById(DOM_ELEMENT_IDS.turtleSvgContainer(codeId));
                        if (turtleResult) {
                          saveSvg(turtleResult, `${codeId}.svg`)
                        }
                      }
                    }}>
                    <span aria-hidden="true"><FontAwesomeIcon icon={faDownload} /></span>
                  </button>
                  <button
                    aria-label="Close"
                    type="button"
                    style={{ zIndex: 1000 }}
                    className={styles.slimStrippedButton}
                    onClick={() => clearResult(true)}>
                    <span aria-hidden="true"><FontAwesomeIcon icon={faTimes} /></span>
                  </button>
                </div>
                <div
                  id={DOM_ELEMENT_IDS.turtleResult(codeId)}
                  className="brython-turtle-result"
                >
                </div>
              </div>
            </Draggable>
          )
        }
        <script id={DOM_ELEMENT_IDS.scriptSource(codeId)} type="text/py_disabled" className="brython-script">
          {`${run_template}\nrun("""${sanitizePyScript(pyScript)}""", '${codeId}')`}
        </script>
      </div>
    </div>
  )
}
