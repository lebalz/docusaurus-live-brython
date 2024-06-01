import * as React from 'react';
import styles from './styles.module.css';
import CodeBlock from '@theme/CodeBlock';
import { useScript, useStore } from '@theme/CodeEditor/hooks';

const Result = () => {
    const { store } = useScript();
    const logs = useStore(store, (state) => state.logs);
    if (logs.length === 0) {
        return null;
    }
    const errors: string[] = []
    let lineNr = 1;
    const code = logs.map((msg) => {
        const msgLen = (msg.output || '').split('\n').length - 1;
        if (msg.type === 'stderr') {
            errors.push(`${lineNr}-${lineNr + msgLen}`);
        }
        lineNr += msgLen;
        return msg.output;
    });
    return (
        <div className={styles.result}>
            <CodeBlock metastring={`{${errors.join(',')}}`}>
                {code.join('')}
            </CodeBlock>
        </div>
    );
};

export default Result;
