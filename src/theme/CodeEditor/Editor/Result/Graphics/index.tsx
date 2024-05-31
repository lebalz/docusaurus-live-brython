import * as React from 'react';
import styles from './styles.module.css';
import { DOM_ELEMENT_IDS } from 'docusaurus-live-brython/theme/CodeEditor/constants';
import Draggable from 'react-draggable';
import { checkForButtonClick } from 'docusaurus-live-brython/theme/CodeEditor/Editor/utils/checkForButtonClick';
import { useScript, useStore } from 'docusaurus-live-brython/theme/CodeEditor/WithScript/Store';
import Button from 'docusaurus-live-brython/theme/CodeEditor/Button';
import clsx from 'clsx';
interface Props {
    controls?: JSX.Element;
    main?: JSX.Element;
}
const Graphics = (props: Props) => {
    const { store } = useScript();
    const codeId = useStore(store, (state) => state.codeId);
    return (
        <Draggable
            onStop={checkForButtonClick}
            positionOffset={{ x: 0, y: '-50%' }}
        >
            <div className={styles.brythonGraphicsResult}>
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
                        iconSize='12px'
                    />
                </div>
                <div
                    id={DOM_ELEMENT_IDS.graphicsResult(codeId)}
                    className="brython-graphics-result"
                >
                    {props.main}
                </div>
            </div>
        </Draggable>
    );
};

export default Graphics;