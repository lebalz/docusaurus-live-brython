import * as React from 'react';
import { useScript, useStore } from '../WithScript/ScriptStore';
import Button, { Color } from '../Button';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';
import clsx from 'clsx';

interface Props {
    title: string;
    slim: boolean;
}

const RunCode = (props: Props) => {
    const { store } = useScript();
    const isExecuting = useStore(store, (state) => state.isExecuting);
    const execScript = useStore(store, (state) => state.execScript);
    return (
        <Button
            icon={isExecuting ? 'Python' : 'Play'}
            spin={isExecuting}
            color={Color.Success}
            className={clsx(styles.runCode, props.slim && styles.slim)}
            iconSize={props.slim ? '1.2em' : '1.6em'}
            onClick={() => {
                execScript()
            }}
            title={translate({
                message: 'Run code snippet {title}',
                id: 'theme.CodeEditor.Actions.RunCode.title'
            }, {title: props.title})}
        />
    );
};

export default RunCode;