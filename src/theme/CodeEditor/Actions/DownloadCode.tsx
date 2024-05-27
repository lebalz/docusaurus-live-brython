import * as React from 'react';
import { useScript, useStore } from '../WithScript/ScriptStore';
import Button, { Color } from '../Button';
import { translate } from '@docusaurus/Translate';


const DownloadCode = (props: {title: string}) => {
    const { store } = useScript();
    const code = useStore(store, (state) => state.code);
    const lang = useStore(store, (state) => state.lang);
    const id = useStore(store, (state) => state.id);
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