import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/hooks';
import Script from '../../models/Script';
import type { default as AceType, Props } from './EditorAce_';
import useIsBrowser from '@docusaurus/useIsBrowser';

const PlaceholderEditor = observer((props: Props) => {
    const store = useStore('documentStore');
    const pyScript = store.find<Script>(props.webKey);
    return (
        <pre>
            <code>{pyScript.data.code}</code>
        </pre>
    );
});

const Editor = observer((props: Props) => {
    const [ace, setAce] = React.useState<{ default: typeof AceType }>();
    React.useEffect(() => {
        import('./EditorAce_').then((aceEditor) => {
            setAce(aceEditor);
        });
    }, []);
    if (!useIsBrowser()) {
        return <PlaceholderEditor {...props} />;
    }
    if (ace) {
        return <ace.default {...props} />;
    }
    return <div></div>;
});
export default Editor;
