import * as React from 'react';
import { useStore, useScript } from '@theme/CodeEditor/hooks';
import Button, { Color } from '@theme/CodeEditor/Button';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';
import clsx from 'clsx';

export interface Props {
    title: string;
    slim: boolean;
}

const RunCode = (props: Props) => {
    const store = useStore();
    const isExecuting = useScript(store, 'isExecuting');
    return (
        <Button
            icon={isExecuting ? 'Python' : 'Play'}
            spin={isExecuting}
            color={Color.Success}
            className={clsx(styles.runCode, props.slim && styles.slim)}
            iconSize={props.slim ? '1.2em' : '1.6em'}
            onClick={() => {
                store.execScript();
            }}
            title={translate(
                {
                    message: 'Run code snippet {title}',
                    id: 'theme.CodeEditor.Actions.RunCode.title'
                },
                { title: props.title }
            )}
        />
    );
};

export default RunCode;
