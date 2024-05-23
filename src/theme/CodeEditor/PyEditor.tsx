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
import { useScript } from './WithScript/ScriptContext';
import Result from "./Result";
import { useStore } from "./WithScript/StoreContext";

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
  const { codeId } = useStore();
  const script = useScript();
  return (
    <React.Fragment>
      <Header
        slim={props.slim}
        title={props.title}
        resettable={props.resettable}
        download={props.download}
        noCompare={props.noCompare}
        lang={props.lang}
      />
      <Editor 
        showLineNumbers={props.showLineNumbers} 
        maxLines={props.maxLines}
      />
      {props.lang === 'python' &&
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
