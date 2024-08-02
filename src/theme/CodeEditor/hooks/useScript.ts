import { Selector, type Script, type Document } from '@theme/CodeEditor/WithScript/Types';
import { useCallback, useSyncExternalStore } from 'react';

export const useScript = <T extends keyof Script>(store: Document, selector: T): Script[T] => {
    return useSyncExternalStore(
        store.subscribe,
        useCallback(() => store.getState()[selector], [store, selector])
    );
};
