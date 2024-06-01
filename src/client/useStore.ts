import {Selector, type Store } from "@theme/CodeEditor/WithScript/Types";
import { useCallback, useSyncExternalStore } from "react";

export const useStore = <T, R>(store: Store<T>, selector: Selector<T, R>): R => {
    return useSyncExternalStore(
        store.subscribe,
        useCallback(() => selector(store.getState()), [store, selector])
    );
}