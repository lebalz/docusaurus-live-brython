import React from 'react';
import styles from './styles.module.css';
import useAutosizeTextArea from './useAutoSizeTextArea';

interface Props {
    onChange: (title: string) => void;
    description?: string;
}

const Description = (props: Props) => {
    const [textAreaRef, setTextAreaRef] = React.useState<HTMLTextAreaElement>(null);
    const [description, setDescription] = React.useState(props.description || '');
    useAutosizeTextArea(textAreaRef, props.description || '', 2);

    return (
        <textarea
            value={description}
            ref={setTextAreaRef}
            onChange={(e) => {
                setDescription(e.target.value);
                props.onChange(e.target.value);
            }}
            placeholder="Snippet Description"
            className={styles.input}
        />
    );
};

export default Description;
