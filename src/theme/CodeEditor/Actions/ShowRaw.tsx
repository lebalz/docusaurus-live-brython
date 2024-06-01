import * as React from 'react';
import { useScript, useStore } from 'docusaurus-live-brython/client';
import Button, { Color } from '@theme/CodeEditor/Button';
import { translate } from '@docusaurus/Translate';

const ShowRaw = () => {
    const { store } = useScript();
    const showRaw = useStore(store, (state) => state.showRaw);

    return (
        <Button
            icon={showRaw ? 'EditCode' : 'Code'}
            onClick={() => store.setState((state) => ({...state, showRaw: !showRaw}))}
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