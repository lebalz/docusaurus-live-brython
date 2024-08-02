import * as React from 'react';
import styles from './styles.module.css';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import Icon from '@theme/CodeEditor/Icon';
import { translate } from '@docusaurus/Translate';

interface Props {
    type: 'pre' | 'post';
    code: string;
}

const HiddenCode = (props: Props) => {
    const [show, setShow] = React.useState(false);
    const { code } = props;
    if (code.length === 0) {
        return null;
    }
    return (
        <div className={clsx(styles.container)}>
            {show && (
                <div>
                    <CodeBlock
                        language="python"
                        showLineNumbers={false}
                        className={clsx(styles.hiddenCode, styles.pre, show && styles.open)}
                    >
                        {code}
                    </CodeBlock>
                </div>
            )}
            <button
                className={clsx(styles.toggleButton, show && styles.open, styles[props.type])}
                onClick={() => setShow(!show)}
                title={translate({
                    id: 'theme.CodeEditor.Editor.HiddenCode.toggleButtonTitle',
                    message: 'Toggle hidden code'
                })}
            >
                <Icon
                    icon={show ? 'TrayMinus' : 'TrayPlus'}
                    rotate={(show ? 180 : 0) + (props.type === 'post' ? 180 : 0)}
                />
            </button>
        </div>
    );
};

export default HiddenCode;
