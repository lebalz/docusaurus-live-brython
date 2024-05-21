import * as React from 'react';
import styles from './styles.module.scss';
import { DOM_ELEMENT_IDS } from '../constants';
import { saveSvg } from '../../../utils/save_svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faRunning } from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores/hooks';
import Script from '../../../models/Script';
import GraphicsResult from '.';
interface Props {
    webKey: string;
}
const TurtleResult = observer((props: Props) => {
    const store = useStore('documentStore');
    const pyScript = store.find<Script>(props.webKey);
    return (
        <GraphicsResult
            webKey={props.webKey}
            controls={
                <React.Fragment>
                <button
                    aria-label="Download Animated SVG"
                    type="button"
                    className={styles.slimStrippedButton}
                    style={{ zIndex: 1000 }}
                    onClick={() => {
                        const turtleResult = (document.getElementById(DOM_ELEMENT_IDS.turtleSvgContainer(pyScript.codeId)) as any) as SVGSVGElement;
                        if (turtleResult) {
                            saveSvg(turtleResult, `${pyScript.codeId}`, pyScript.executedScriptSource, true)
                        }
                    }}>
                    <span aria-hidden="true"><FontAwesomeIcon icon={faRunning} /></span>
                </button>
                <button
                    aria-label="Download SVG"
                    type="button"
                    className={styles.slimStrippedButton}
                    style={{ zIndex: 1000 }}
                    onClick={() => {
                        const turtleResult = (document.getElementById(DOM_ELEMENT_IDS.turtleSvgContainer(pyScript.codeId)) as any) as SVGSVGElement;
                        if (turtleResult) {
                            saveSvg(turtleResult, `${pyScript.codeId}`, pyScript.executedScriptSource)
                        }
                    }}>
                    <span aria-hidden="true"><FontAwesomeIcon icon={faDownload} /></span>
                </button>
                </React.Fragment>
            }
        />
    )
})

export default TurtleResult;