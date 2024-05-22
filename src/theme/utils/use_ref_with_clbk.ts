import * as React from 'react';


/**
 * @url https://medium.com/welldone-software/usecallback-might-be-what-you-meant-by-useref-useeffect-773bc0278ae
 * 
 * @param {(node: any) => void} onMount 
 * @param {(node: any) => void} onUnmount
 * @returns (node: any) => void
 */
const useRefWithCallback = <T extends HTMLDivElement = HTMLDivElement>(onMount: (node: T) => void, onUnmount: (node: T) => void): (node: T) => void => {
    const nodeRef = React.useRef<T | null>(null);

    const setRef = React.useCallback((node: T) => {
        if (nodeRef.current) {
            onUnmount(nodeRef.current);
        }

        nodeRef.current = node;

        if (nodeRef.current) {
            onMount(nodeRef.current);
        }
    }, [onMount, onUnmount]);

    return setRef;
}

export { useRefWithCallback }