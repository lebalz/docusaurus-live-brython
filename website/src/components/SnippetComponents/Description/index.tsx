import React from 'react';
import styles from './styles.module.css';
import { useLocation, useHistory } from '@docusaurus/router';
import useAutosizeTextArea from './useAutoSizeTextArea';

const Description = () => {
    const location = useLocation();
    const history = useHistory();
    const [textAreaRef, setTextAreaRef] = React.useState<HTMLTextAreaElement>(null);
    const [description, setDescription] = React.useState('');
    useAutosizeTextArea(textAreaRef, '', 2);

    React.useEffect(() => {
        if (location.search) {
            const params = new URLSearchParams(location.search);
            if (params.has('description')) {
                setDescription(params.get('description') || '');
            }
        }
    }, []);

    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (description) {
            params.set('description', description);
        } else if (params.has('description')) {
            params.delete('description');
        }
        history.replace({
            search: params.toString()
        });
    }, [description]);

    return (
        <textarea
            value={description}
            ref={setTextAreaRef}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Snippet Description"
            className={styles.input}
        />
    );
};

export default Description;
