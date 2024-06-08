import * as React from 'react';
import { useStore, useScript } from '@theme/CodeEditor/hooks';
import Button, { Color } from '@theme/CodeEditor/Button';
import { translate } from '@docusaurus/Translate';

const Reset = () => {
    const store = useStore();
    const pristine = useScript(store, 'pristineCode');
    
    const onReset = () => {
        const shouldReset = window.confirm(translate({
            message: 'Discard your edits? Your changes will be lost!'
        }));
        if (shouldReset) {
            store.setCode(pristine);
        }
    };
    return (
        <Button
            onClick={onReset}
            title={translate({
                message: 'Discard Changes',
                description: 'Reset the code to its original state',
                id: 'theme.CodeEditor.Header.reset',
            })}
            icon="Reset"
        />
    )
}

export default Reset;