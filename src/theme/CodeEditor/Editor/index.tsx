import * as React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import {
  DOM_ELEMENT_IDS,
} from "../constants";
import { useScript, useStore } from '../WithScript/ScriptStore';
import Result from "./Result";
import TurtleResult from "./Result/Graphics/Turtle";
import CanvasResult from "./Result/Graphics/Canvas";
import GraphicsResult from "./Result/Graphics";
import Header from "./Header";
import EditorAce from "./EditorAce";

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
        <>
          <Result />
          <div id={DOM_ELEMENT_IDS.outputDiv(codeId)}></div>
          {isGraphicsmodalOpen && (
            <>
              {hasTurtleOutput && (
                <TurtleResult />
              )}
              {hasCanvasOutput && (
                <CanvasResult />
              )}
              {!hasCanvasOutput && !hasTurtleOutput && (
                <GraphicsResult />
              )}
            </>
          )}
        </>
      }
    </React.Fragment>
  );
};

export default Editor;
