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
import AceEditor from 'react-ace';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPython } from "@fortawesome/free-brands-svg-icons"
import { faDownload, faTimes, faPlay } from '@fortawesome/free-solid-svg-icons'

import Draggable from 'react-draggable';


import 'ace-builds/src-noconflict/mode-python';

// import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-dracula';

import 'ace-builds/src-noconflict/snippets/python';
import "ace-builds/src-noconflict/ext-language_tools";

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
  return script.replaceAll('"""', "'''")
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

export default function PyAceEditor({ children, codeId, title, ...props }) {
  const { isClient } = useDocusaurusContext();
  const [pyScript, setPyScript] = React.useState(isClient ? children.replace(/\n$/, '') : '');
  const [execCounter, setExecCounter] = React.useState(0);
  const [executing, setExecuting] = React.useState(false);
  const [logMessages, setLogMessages] = React.useState([]);
  const [turtleModalOpen, setTurtleModalOpen] = React.useState(false);

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
      const resNode = document.getElementById(`${codeId}_turtle_result`)
      while (resNode && resNode.lastElementChild) {
        resNode.removeChild(resNode.lastElementChild);
      }
    }
  }, [])

  const setupEventListeners = useRefWithCallback(
    (node) => { // mount
      node.addEventListener('bry_notify', onBryNotify)
      document.addEventListener('close_turtle_modal', onTurtleModalClose)
    },
    (node) => { // unmount
      node.removeEventListener('bry_notify', onBryNotify)
      document.removeEventListener('close_turtle_modal', onTurtleModalClose)
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
      if (node.refEditor) {
        node.refEditor.querySelectorAll('.ace_scrollbar').forEach((scroller) => {
          if (!scroller.classList.contains('thin-scrollbar')) {
            scroller.classList.add('thin-scrollbar');
          }
        })
      }
      // resizeEditor(node.editor)
    }
  }, []);

  const clearResult = (force = false) => {
    /* only one turtle modal shall be opened at a time */
    document.dispatchEvent(new CustomEvent('close_turtle_modal', { detail: { codeId: codeId, force: force } }));
  }

  const execScript = () => {
    clearResult()
    document.querySelectorAll('.brython-script[type="text/python"]').forEach((scr) => {
      scr.setAttribute('type', 'text/py_disabled')
    })
    const active = document.getElementById(`${codeId}_src`)
    active.setAttribute('type', 'text/python');
    setExecuting(true);
    if (TURTLE_IMPORTS_TESTER.test(pyScript)) {
      setTurtleModalOpen(true)
    }
    setExecCounter(execCounter + 1)
  }

  const onChange = (value) => {
    setPyScript(value)
  }

  return (
    <div className={styles.playgroundContainer} id={codeId} ref={setupEventListeners}>
      <div className={clsx(styles.brythonCodeBlockHeader)}>
        <div>
          {title}
        </div>
        <div className={styles.spacer} ></div>
        <button
          onClick={execScript}
          className={styles.playButton}
        >
          {executing ? <FontAwesomeIcon icon={faPython} spin id={`${codeId}_loader`} /> : <FontAwesomeIcon icon={faPlay} />}
        </button>
      </div>
      <div className={clsx(styles.brythonCodeBlock)}>
        <AceEditor
          className={styles.brythonEditor}
          style={{
            width: '100%',
          }}
          maxLines={Infinity}
          ref={editorRef}
          mode="python"
          theme="dracula"
          keyBindings="VSCode"
          onChange={onChange}
          value={pyScript}
          defaultValue={pyScript}
          name={codeId}
          editorProps={{ $blockScrolling: true }}
          showPrintMargin={false}
          highlightActiveLine={true}
          enableBasicAutocompletion
          enableLiveAutocompletion
          showGutter
        />
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
            <Draggable>
              <div className={styles.brythonTurtleResult}>
                <div className={styles.brythonTurtleResultHead}>
                  <span>Output</span>
                  <span className={styles.spacer} ></span>
                  <button
                    aria-label="Download SVG"
                    type="button"
                    className={styles.slimStrippedButton}
                    onClick={() => {
                      if (turtleModalOpen) {
                        const turtleResult = document.getElementById(`${codeId}_svg`);
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
                    className={styles.slimStrippedButton}
                    onClick={() => clearResult(true)}>
                    <span aria-hidden="true"><FontAwesomeIcon icon={faTimes} /></span>
                  </button>
                </div>
                <div
                  id={`${codeId}_turtle_result`}
                  className="brython-turtle-result"
                >
                </div>
              </div>
            </Draggable>
          )
        }
        <script id={`${codeId}_src`} type="text/py_disabled" className="brython-script">
          {`${run_template}\nrun("""${sanitizePyScript(pyScript)}""", '${codeId}')`}
        </script>

      </div>
    </div>
  );
}
