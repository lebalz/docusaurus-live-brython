import * as React from 'react';
import * as Icons from '../Icon/icons';
import styles from './styles.module.css';
import clsx from 'clsx';
import Icon from '../Icon';

export enum Color {
    Primary = 'button--primary',
    Secondary = 'button--secondary',
    Success = 'button--success',
    Info = 'button--info',
    Warning = 'button--warning',
    Danger = 'button--danger',
    Link = 'button--link',
}
export enum Size {
    Small = 'button--sm',
    Large = 'button--lg',
}

interface Props {
    icon: keyof typeof Icons;
    title?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    size?: Size;
    spin?: boolean;
    color?: Color;
    className?: string;
}


const Button = (props: Props) => {

    return (
        <button 
            className={clsx('button', props.color || Color.Secondary, props.size || Size.Small, styles.button, props.className)}
            onClick={props.onClick}
            title={props.title}
        >
            <Icon 
                icon={props.icon}
                className={styles.icon}
                spin={props.spin}
            />
        </button>
    )
}

export default Button;