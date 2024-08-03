import React from 'react';
import styles from './styles.module.css';
import { useLocation, useHistory } from '@docusaurus/router';
import clsx from 'clsx';

interface Props {
    onChange?: (title: string) => void;
}

const Title = (props: Props) => {
    const location = useLocation();
    const history = useHistory();
    const [title, setTitle] = React.useState('');

    React.useEffect(() => {
        if (location.search) {
            const params = new URLSearchParams(location.search);
            if (params.has('title')) {
                setTitle(params.get('title') || '');
            }
        }
    }, []);

    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (title) {
            params.set('title', title);
        } else if (params.has('title')) {
            params.delete('title');
        }
        history.replace({
            search: params.toString()
        });
        if (props.onChange) {
            props.onChange(title);
        }
    }, [title]);

    return (
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Snippet Title"
            className={clsx(styles.titleInput)}
        />
    );
};

export default Title;
