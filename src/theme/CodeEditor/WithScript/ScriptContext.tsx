import React from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import { type InitState, type Document } from "@theme/CodeEditor/WithScript/Types";
import { createStore } from "@theme/CodeEditor/WithScript/createStore";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
export const Context = React.createContext<Document | undefined>(undefined);

const ScriptContext = (props: InitState & { children: React.ReactNode; }) => {
    const {libDir, syncMaxOnceEvery} = usePluginData('docusaurus-live-brython') as { libDir: string; syncMaxOnceEvery: number; };
    const [store, setStore] = React.useState<Document | null>(null);
    const { siteConfig } = useDocusaurusContext();
    React.useEffect(() => {
        const router = siteConfig.future.experimental_router;
        const store = createStore(props, libDir, syncMaxOnceEvery, router);
        setStore(store);
        store.load();
    }, [props.id, libDir, siteConfig]);

    if (!store) {
        return <div>Load</div>;
    }

    return (
        <Context.Provider value={store}>
            {props.children}
        </Context.Provider>
    );
}

export default ScriptContext;