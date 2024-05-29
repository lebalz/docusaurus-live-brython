import * as React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import EditorAce from "./EditorAce";
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

const Editor = (props: Props) => {
  const { store } = useScript();
  const lang = useStore(store, (state) => state.lang);
  const codeId = useStore(store, (state) => state.codeId);
  const hasCanvasOutput = useStore(store, (state) => state.hasCanvasOutput);
  const hasTurtleOutput = useStore(store, (state) => state.hasTurtleOutput);
  const isGraphicsmodalOpen = useStore(store, (state) => state.isGraphicsmodalOpen);
  
  return (
    <React.Fragment>
      <Header
        slim={props.slim}
        title={props.title}
        resettable={props.resettable}
        download={props.download}
        noCompare={props.noCompare}
      />
      <EditorAce 
        showLineNumbers={props.showLineNumbers} 
        maxLines={props.maxLines}
      />
      {lang === 'python' &&
        <div className={clsx(styles.result)}>
          {isGraphicsmodalOpen && (
            <React.Fragment>
              {hasTurtleOutput && (
                <TurtleResult />
              )}
              {hasCanvasOutput && (
                <CanvasResult />
              )}
              {!hasCanvasOutput && !hasTurtleOutput && (
                <GraphicsResult />
              )}
            </React.Fragment>
          )}
          <Result />
          <div id={DOM_ELEMENT_IDS.outputDiv(codeId)}></div>
        </div>
      }
    </React.Fragment>
  );
};

export default Editor;
