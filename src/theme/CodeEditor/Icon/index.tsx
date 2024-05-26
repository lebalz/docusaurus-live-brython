import * as React from 'react';
import * as Icons from './icons';
import styles from './styles.module.css';
import clsx from 'clsx';

interface Props {
    icon: keyof typeof Icons;
    size?: number | string;
    color?: string;
    className?: string;
}

const Icon = (props: Props) => {
    const size = props.size || '1.2em';

    return (
        <svg viewBox="0 0 24 24" role="presentation" style={{width: size, height: size}} className={clsx(props.className, styles.icon)}>
            <path d={Icons[props.icon]} style={{fill: props.color || 'currentcolor'}}></path>
        </svg>
    )
}

export default Icon;