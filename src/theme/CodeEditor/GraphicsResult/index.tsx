import * as React from 'react';
import styles from './styles.module.scss';
import { DOM_ELEMENT_IDS } from '../constants';
import Draggable from 'react-draggable';
import { checkForButtonClick } from '../../../utils/check_for_button_click';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores/hooks';
import Script from '../../../models/Script';
interface Props {
    webKey: string;
    controls?: JSX.Element;
    main?: JSX.Element;
}
const GraphicsResult = observer((props: Props) => {
    const store = useStore('documentStore');
    const pyScript = store.find<Script>(props.webKey);
    const documentStore = useStore("documentStore");
    return (
        <Draggable
            onStop={checkForButtonClick}
            positionOffset={{ x: 0, y: '-50%' }}
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
                            documentStore.setOpendTurtleModal(undefined);
                            pyScript.stopScript(document);
                        }}>
                        <span aria-hidden="true"><FontAwesomeIcon icon={faTimes} /></span>
                    </button>
                </div>
                <div
                    id={DOM_ELEMENT_IDS.graphicsResult(pyScript.codeId)}
                    className="brython-graphics-result"
                >
                    {props.main}
                </div>
            </div>
        </Draggable>
    )
})

export default GraphicsResult;