import * as React from 'react';
import { DOM_ELEMENT_IDS } from '@theme/CodeEditor/constants';
import { useStore, useScript } from '@theme/CodeEditor/hooks';
import Result from '@theme/CodeEditor/Editor/Result';
import Turtle from '@theme/CodeEditor/Editor/Result/Graphics/Turtle';
import Canvas from '@theme/CodeEditor/Editor/Result/Graphics/Canvas';
import Graphics from '@theme/CodeEditor/Editor/Result/Graphics';
import Header from '@theme/CodeEditor/Editor/Header';
import EditorAce from '@theme/CodeEditor/Editor/EditorAce';
import clsx from 'clsx';
import styles from './styles.module.css';
import HiddenCode from '@theme/CodeEditor/Editor/HiddenCode';

export interface Props {
    slim: boolean;
    title: string;
    resettable: boolean;
    showLineNumbers: boolean;
    download: boolean;
    lang: string;
    noCompare: boolean;
    preCode: string;
    postCode: string;
    maxLines?: number;
    versioned?: boolean;
}

const Editor = (props: Props) => {
    const store = useStore();
    const lang = useScript(store, 'lang');
    const codeId = useScript(store, 'codeId');
    const hasCanvasOutput = useScript(store, 'hasCanvasOutput');
    const hasTurtleOutput = useScript(store, 'hasTurtleOutput');
    const isGraphicsmodalOpen = useScript(store, 'isGraphicsmodalOpen');

    return (
        <React.Fragment>
            <Header
                slim={props.slim}
                title={props.title}
                resettable={props.resettable}
                download={props.download}
                noCompare={props.noCompare}
            />
            <div className={clsx(styles.editorContainer)}>
                <HiddenCode type="pre" code={props.preCode} />
                <EditorAce
                    showLineNumbers={props.showLineNumbers}
                    maxLines={props.maxLines}
                    versioned={props.versioned}
                />
                <HiddenCode type="post" code={props.postCode} />
            </div>
            {lang === 'python' && (
                <>
                    <Result />
                    <div id={DOM_ELEMENT_IDS.outputDiv(codeId)}></div>
                    {isGraphicsmodalOpen && (
                        <>
                            {hasTurtleOutput && <Turtle />}
                            {hasCanvasOutput && <Canvas />}
                            {!hasCanvasOutput && !hasTurtleOutput && <Graphics />}
                        </>
                    )}
                </>
            )}
        </React.Fragment>
    );
};

export default Editor;
