import * as React from 'react';
import { DOM_ELEMENT_IDS } from '../constants';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores/hooks';
import Script from '../../../models/Script';
import GraphicsResult from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.scss';
interface Props {
    webKey: string;
}

const downloadCanvas = (canvasId: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
        return;
    }
    var dt = canvas.toDataURL('image/png');
    /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
    dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
  
    /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
    dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
  
    var downloadLink = document.createElement("a");
    downloadLink.href = dt;
    downloadLink.download = `${canvasId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

const CanvasResult = observer((props: Props) => {
    const store = useStore('documentStore');
    const pyScript = store.find<Script>(props.webKey);
    return (
        <GraphicsResult
            webKey={props.webKey}
            controls={
                <button
                    aria-label="Download SVG"
                    type="button"
                    className={styles.slimStrippedButton}
                    style={{ zIndex: 1000 }}
                    onClick={() => {
                        downloadCanvas(DOM_ELEMENT_IDS.canvasContainer(pyScript.codeId))
                    }}>
                    <span aria-hidden="true"><FontAwesomeIcon icon={faDownload} /></span>
                </button>
            }
            main={
                <canvas 
                    id={DOM_ELEMENT_IDS.canvasContainer(pyScript.codeId)} 
                    width="500"
                    height="500"
                    style={{
                        display: 'block', 
                        width: '500px', 
                        height: '500px'
                    }}></canvas>
            }
        />
    )
})

export default CanvasResult;