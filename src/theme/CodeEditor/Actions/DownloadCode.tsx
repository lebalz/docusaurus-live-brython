import * as React from 'react';
import { useStore, useScript } from '@theme/CodeEditor/hooks';
import Button, { Color } from '@theme/CodeEditor/Button';
import { translate } from '@docusaurus/Translate';


const DownloadCode = (props: {title: string}) => {
    const { store } = useStore();
    const code = useScript(store, (state) => state.code);
    const lang = useScript(store, (state) => state.lang);
    const id = useScript(store, (state) => state.id);
    return (
        <Button
            icon='Download'
            onClick={() => {
                const downloadLink = document.createElement("a");
                const file = new Blob([code],    
                            {type: 'text/plain;charset=utf-8'});
                downloadLink.href = URL.createObjectURL(file);
                const fExt = lang === 'python' ? '.py' : `.${lang}`;
                const fTitle = props.title === lang ? id : props.title
                const fName = fTitle.endsWith(fExt) ? fTitle : `${fTitle}${fExt}`;
                downloadLink.download = fName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }}
            title={translate({
                message: 'Download code snippet {title}',
                id: 'theme.CodeEditor.Actions.DownloadCode.title'
            }, {
                title: props.title || id
            })}
        />
    )
}

export default DownloadCode;