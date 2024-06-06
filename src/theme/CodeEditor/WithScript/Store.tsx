import React from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import { type InitState, type Store } from "@theme/CodeEditor/WithScript/Types";
import { createStore } from "@theme/CodeEditor/WithScript/createStore";
export const Context = React.createContext<{store: Store} | undefined>(undefined);

const ScriptContext = (props: InitState & { children: React.ReactNode; }) => {
    const {libDir, syncMaxOnceEvery} = usePluginData('docusaurus-live-brython') as { libDir: string; syncMaxOnceEvery: number; };
    const [store, setStore] = React.useState<Store | null>(null);
    React.useEffect(() => {
        const store = createStore(props, libDir, syncMaxOnceEvery);
        setStore(store);
        store.load();
    }, [props.id, libDir]);

    if (!store) {
        return <div>Load</div>;
    }

    return (
        <Context.Provider value={{store: store}}>
            {props.children}
        </Context.Provider>
    );
}

export default ScriptContext;