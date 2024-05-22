import * as React from 'react';
import type { default as AceType, Props } from './EditorAce_';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useScript } from './WithScript';

const PlaceholderEditor = (props: Props) => {
    const { code } = useScript();
    return (
        <pre>
            <code>{code}</code>
        </pre>
    );
};

const Editor = (props: Props) => {
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
};
export default Editor;
