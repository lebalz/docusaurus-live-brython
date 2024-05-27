import * as React from 'react';
import * as Icons from './icons';
import styles from './styles.module.css';
import clsx from 'clsx';

interface Props {
    icon: keyof typeof Icons;
    size?: number | string;
    spin?: boolean;
    color?: string;
    className?: string;
}

const Icon = (props: Props) => {
    const size = props.size || '1.6em';

    if (props.spin) {
        return (
            <svg viewBox="0 0 24 24" role="presentation" style={{width: size, height: size}} className={clsx(props.className, styles.icon, styles.spin)}>
                <style>{`@keyframes spin-inverse { to { transform: rotate(-360deg) } }`}</style>
                <g style={{animation: '2s linear 0s infinite normal none running spin-inverse', transformOrigin: 'center center'}}>
                    <path d={Icons[props.icon]} style={{fill: props.color || 'currentcolor'}}></path>
                </g>
            </svg>
        )
    }

    return (
        <svg viewBox="0 0 24 24" role="presentation" style={{width: size, height: size}} className={clsx(props.className, styles.icon)}>
            <path d={Icons[props.icon]} style={{fill: props.color || 'currentcolor'}}></path>
        </svg>
    )
}

export default Icon;