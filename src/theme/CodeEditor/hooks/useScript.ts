import {Selector, type Document } from "@theme/CodeEditor/WithScript/Types";
import { useCallback, useSyncExternalStore } from "react";

export const useScript = <T, R>(store: Document<T>, selector: Selector<T, R>): R => {
    return useSyncExternalStore(
        store.subscribe,
        useCallback(() => selector(store.getState()), [store, selector])
    );
}