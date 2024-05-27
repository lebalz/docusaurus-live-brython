import * as React from 'react';
import { useScript, useStore } from '../WithScript/ScriptStore';
import Button, { Color } from '../Button';
import { translate } from '@docusaurus/Translate';

interface Props {
    title: string;
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