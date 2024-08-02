import * as React from 'react';
import styles from './styles.module.css';
import { DOM_ELEMENT_IDS } from '@theme/CodeEditor/constants';
import Draggable from 'react-draggable';
import { checkForButtonClick } from '@theme/CodeEditor/Editor/utils/checkForButtonClick';
import { useStore, useScript } from '@theme/CodeEditor/hooks';
import Button from '@theme/CodeEditor/Button';
import clsx from 'clsx';
export interface Props {
    controls?: JSX.Element;
    main?: JSX.Element;
}
const Graphics = (props: Props) => {
    const store = useStore();
    const codeId = useScript(store, 'codeId');
    const nodeRef = React.useRef(null);
    return (
        <Draggable onStop={checkForButtonClick} positionOffset={{ x: '15%', y: '25%' }} nodeRef={nodeRef}>
            <div className={styles.brythonGraphicsResult} ref={nodeRef}>
                <div className={styles.brythonGraphicsResultHead}>
                    <span>Output</span>
                    <span className={styles.spacer}></span>
                    {props.controls}
                    <Button
                        icon="Close"
                        className={clsx(styles.closeButton)}
                        onClick={() => {
                            store.stopScript();
                            store.closeGraphicsModal();
                        }}
                        iconSize="12px"
                    />
                </div>
                <div id={DOM_ELEMENT_IDS.graphicsResult(codeId)} className="brython-graphics-result">
                    {props.main}
                </div>
            </div>
        </Draggable>
    );
};

export default Graphics;
