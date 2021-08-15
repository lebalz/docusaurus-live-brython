import * as React from 'react';
import styles from './styles.module.css';
import { DOM_ELEMENT_IDS } from './constants';
import Draggable from 'react-draggable';
import { checkForButtonClick } from '../utils/check_for_button_click';
import { saveSvg } from '../utils/save_svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function TurtleResult({ clearResult, codeId, pyScript, contextId }) {
    return (
        <Draggable
            onStop={checkForButtonClick}
            positionOffset={{x: 0, y: '-50%'}}
        >
            <div className={styles.brythonTurtleResult}>
                <div className={styles.brythonTurtleResultHead}>
                    <span>Output</span>
                    <span className={styles.spacer} ></span>
                    <button
                        aria-label="Download SVG"
                        type="button"
                        className={styles.slimStrippedButton}
                        style={{ zIndex: 1000 }}
                        onClick={() => {
                            const turtleResult = document.getElementById(DOM_ELEMENT_IDS.turtleSvgContainer(codeId));
                            if (turtleResult) {
                                saveSvg(turtleResult, `${codeId}.svg`, codeId, contextId)
                            }
                        }}>
                        <span aria-hidden="true"><FontAwesomeIcon icon={faDownload} /></span>
                    </button>
                    <button
                        aria-label="Close"
                        type="button"
                        style={{ zIndex: 1000 }}
                        className={styles.slimStrippedButton}
                        onClick={() => clearResult(true)}>
                        <span aria-hidden="true"><FontAwesomeIcon icon={faTimes} /></span>
                    </button>
                </div>
                <div
                    id={DOM_ELEMENT_IDS.turtleResult(codeId)}
                    className="brython-turtle-result"
                >
                </div>
            </div>
        </Draggable>
    )
}