import React from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';

interface Props {
    onChange: (title: string) => void;
    title?: string;
}

const Title = (props: Props) => {
    const [title, setTitle] = React.useState(props.title || '');

    return (
        <input
            type="text"
            value={title}
            onChange={(e) => {
                setTitle(e.target.value);
                props.onChange(e.target.value);
            }}
            placeholder="Snippet Title"
            className={clsx(styles.titleInput)}
        />
    );
};

export default Title;
