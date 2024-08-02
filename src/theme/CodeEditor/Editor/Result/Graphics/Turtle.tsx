import * as React from 'react';
import styles from './styles.module.css';
import { DOM_ELEMENT_IDS } from '@theme/CodeEditor/constants';
import Graphics from '@theme/CodeEditor/Editor/Result/Graphics';
import { saveSvg } from '@theme/CodeEditor/Editor/utils/saveSvg';
import { useStore, useScript } from '@theme/CodeEditor/hooks';
import Button from '@theme/CodeEditor/Button';
import clsx from 'clsx';

const Turtle = () => {
    const store = useStore();
    const codeId = useScript(store, 'codeId');
    const code = useScript(store, 'code');
    return (
        <Graphics
            controls={
                <React.Fragment>
                    <Button
                        icon="AnimationPlay"
                        onClick={() => {
                            const turtleResult = document.getElementById(
                                DOM_ELEMENT_IDS.turtleSvgContainer(codeId)
                            ) as any as SVGSVGElement;
                            if (turtleResult) {
                                saveSvg(turtleResult, `${codeId}`, code, true);
                            }
                        }}
                        className={clsx(styles.slimStrippedButton)}
                        iconSize="12px"
                        title="Download Animated SVG"
                    />
                    <Button
                        icon="Download"
                        iconSize="12px"
                        onClick={() => {
                            const turtleResult = document.getElementById(
                                DOM_ELEMENT_IDS.turtleSvgContainer(codeId)
                            ) as any as SVGSVGElement;
                            if (turtleResult) {
                                saveSvg(turtleResult, `${codeId}`, code);
                            }
                        }}
                        title="Download SVG"
                        className={styles.slimStrippedButton}
                    />
                </React.Fragment>
            }
        />
    );
};

export default Turtle;
