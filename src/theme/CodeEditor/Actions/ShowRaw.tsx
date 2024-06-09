import * as React from 'react';
import { useStore, useScript } from '@theme/CodeEditor/hooks';
import Button, { Color } from '@theme/CodeEditor/Button';
import { translate } from '@docusaurus/Translate';

const ShowRaw = () => {
    const store = useStore();
    const showRaw = useScript(store, 'showRaw');

    return (
        <Button
            icon={showRaw ? 'EditCode' : 'Code'}
            onClick={() => store.setShowRaw(!showRaw)}
            color={showRaw ? Color.Primary : Color.Secondary}
            title={
                showRaw 
                ? translate({ message: 'Show edited Code', id: 'theme.CodeEditor.Actions.ShowCode.showEdited'})
                : translate({ message: 'Show initial code', id: 'theme.CodeEditor.Actions.ShowCode.showRaw'})
            }
        />
    )
}

export default ShowRaw;