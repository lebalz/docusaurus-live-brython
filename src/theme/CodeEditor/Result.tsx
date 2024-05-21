import { observer } from 'mobx-react-lite';
import * as React from 'react';
import Script from '../../models/Script';
import { useStore } from '../../stores/hooks';
import styles from './styles.module.scss';
import CodeBlock from '@theme/CodeBlock';

interface Props {
    webKey: string;
}

const Result = observer((props: Props) => {
    const store = useStore('documentStore');
    const pyScript = store.find<Script>(props.webKey);

    if (pyScript.logMessages.length === 0 || /^\s*$/.test(pyScript.logMessages.map((msg) => msg.output).join(''))) {
        return null;
    }
    const errors = []
    let lineNr = 1;
    const code = pyScript.logMessages.map((msg) => {
        const msgLen = (msg.output || '').split('\n').length - 1;
        if (msg.type === 'stderr') {
            errors.push(`${lineNr}-${lineNr + msgLen}`);
        }
        lineNr += msgLen;
        return msg.output;
    });
    return (
        <div className={styles.brythonOut}>
            <CodeBlock metastring={`{${errors.join(',')}}`}>
                {code.join('')}
            </CodeBlock>
        </div>
    );
});

export default Result;
