import * as React from 'react';
import styles from './styles.module.css';
import CodeBlock from '@theme/CodeBlock';
import { useStore, useScript } from '@theme/CodeEditor/hooks';

const Result = () => {
    const store = useStore();
    const logs = useScript(store, 'logs');
    if (logs.length === 0) {
        return null;
    }
    const errors: string[] = [];
    let lineNr = 1;
    const code = logs.slice().map((msg) => {
        const msgLen = (msg.output || '').split('\n').length - 1;
        if (msg.type === 'stderr') {
            errors.push(`${lineNr}-${lineNr + msgLen}`);
        }
        lineNr += msgLen;
        return msg.output;
    });
    return (
        <div className={styles.result}>
            <CodeBlock metastring={`{${errors.join(',')}}`}>{code.join('')}</CodeBlock>
        </div>
    );
};

export default Result;
