import * as React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Editor from "./EditorAce";
import {
  DOM_ELEMENT_IDS,
} from "./constants";
import TurtleResult from "./GraphicsResult/Turtle";
import Header from "./Header";
import GraphicsResult from "./GraphicsResult";
import CanvasResult from "./GraphicsResult/Canvas";
import { useScript, useStore } from './WithScript/ScriptStore';
import Result from "./Result";

interface Props {
  slim: boolean;
  title: string;
  resettable: boolean;
  showLineNumbers: boolean;
  download: boolean;
  lang: string;
  noCompare: boolean;
  precode: string;
  maxLines?: number;
}

const PyEditor = (props: Props) => {
  const { store } = useScript();
  const { lang, codeId } = useStore(store, (state) => ({lang: state.lang, codeId: state.codeId}));
  return (
    <React.Fragment>
      <Header
        slim={props.slim}
        title={props.title}
        resettable={props.resettable}
        download={props.download}
        noCompare={props.noCompare}
      />
      <Editor 
        showLineNumbers={props.showLineNumbers} 
        maxLines={props.maxLines}
      />
      {lang === 'python' &&
        <div className={clsx(styles.result)}>
          {/* {store.opendGraphicsModalWebKey === pyScript.webKey && (
            <React.Fragment>
              {pyScript.hasTurtleOutput && (
                <TurtleResult webKey={props.webKey}/>
              )}
              {pyScript.hasCanvasOutput && (
                <CanvasResult webKey={props.webKey}/>
              )}
              {!pyScript.hasCanvasOutput && !pyScript.hasTurtleOutput && (
                <GraphicsResult webKey={props.webKey}/>
              )}
            </React.Fragment>
          )} */}
          <Result />
          <div id={DOM_ELEMENT_IDS.outputDiv(codeId)}></div>
        </div>
      }
    </React.Fragment>
  );
};

export default PyEditor;
