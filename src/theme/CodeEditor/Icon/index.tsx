import * as React from 'react';
import * as Icons from '@theme/CodeEditor/Icon/icons';
import styles from './styles.module.css';
import clsx from 'clsx';

export enum Color {
    Primary = 'var(--ifm-color-primary)',
    Secondary = 'var(--ifm-color-secondary)',
    Success = 'var(--ifm-color-success)',
    Info = 'var(--ifm-color-info)',
    Warning = 'var(--ifm-color-warning)',
    Danger = 'var(--ifm-color-danger)',
    Link = 'var(--ifm-color-link)'
}

export interface Props {
    icon: keyof typeof Icons;
    size?: number | string;
    spin?: boolean;
    rotate?: number;
    color?: string;
    className?: string;
}

const Icon = (props: Props) => {
    const size = props.size || '1.6em';

    if (props.spin) {
        return (
            <svg
                viewBox="0 0 24 24"
                role="presentation"
                style={{ width: size, height: size }}
                className={clsx(props.className, styles.icon, styles.spin)}
            >
                <style>{`@keyframes spin-inverse { to { transform: rotate(-360deg) } }`}</style>
                <g
                    style={{
                        animation: '2s linear 0s infinite normal none running spin-inverse',
                        transformOrigin: 'center center'
                    }}
                >
                    <path d={Icons[props.icon]} style={{ fill: props.color || 'currentcolor' }}></path>
                </g>
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            role="presentation"
            style={{
                width: size,
                height: size,
                transform: `translateY(15%) rotate(${props.rotate || 0}deg)`
            }}
            className={clsx(props.className, styles.icon)}
        >
            <path d={Icons[props.icon]} style={{ fill: props.color || 'currentcolor' }}></path>
        </svg>
    );
};

export default Icon;
