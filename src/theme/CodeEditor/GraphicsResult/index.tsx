import * as React from 'react';
import styles from './styles.module.css';
import { DOM_ELEMENT_IDS } from '../constants';
import Draggable from 'react-draggable';
import { checkForButtonClick } from '../utils/check_for_button_click';
import { useScript, useStore } from '../WithScript/ScriptStore';
interface Props {
    controls?: JSX.Element;
    main?: JSX.Element;
}
const GraphicsResult = (props: Props) => {
    const { store } = useScript();
    const codeId = useStore(store, (state) => state.codeId);
    const closeGraphicsModal = useStore(store, (state) => state.closeGraphicsModal);
    const stopScript = useStore(store, (state) => state.stopScript);
    return (
        <Draggable
        >
            <div className={styles.brythonGraphicsResult}>
                <div className={styles.brythonGraphicsResultHead}>
                    <span>Output</span>
                    <span className={styles.spacer} ></span>
                    {props.controls}
                    <button
                        aria-label="Close"
                        type="button"
                        style={{ zIndex: 1000 }}
                        className={styles.slimStrippedButton}
                        onClick={() => {
                            stopScript();
                            closeGraphicsModal();
                        }}>
                        <span aria-hidden="true">X</span>
                    </button>
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

export default GraphicsResult;