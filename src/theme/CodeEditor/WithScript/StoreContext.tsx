import React from 'react';
import { Status, StorageSlot, Store, StoredScript } from '.';
import { ReactContextError, createStorageSlot } from '@docusaurus/theme-common';

interface Props {
    id?: string;
    children: React.ReactNode;
}

export const Context = React.createContext<Store | undefined>(undefined);

const getStorageScript = (storage: StorageSlot): StoredScript | undefined => {
    const storedCode = storage.get();
    if (storedCode) {
        try {
            const script = JSON.parse(storedCode);
            if (script) {
                return script;
            }
        } catch (e) {
            console.warn(`Failed to parse code for value "${storedCode}"`, e);
            storage.del();
        }
    }
    return;
}

const syncStorageScript = (script: StoredScript, storage: StorageSlot): boolean => {
    try {
        storage.set(JSON.stringify(script));
        return true;
    } catch (e) {
        console.warn(`Failed to save the code ${script}`, e);
        return false;
    }
}

const StoreContext = (props: Props) => {
    const [isLoaded, setLoaded] = React.useState<boolean>(false);
    const [status, setStatus] = React.useState<Status>(Status.IDLE);
    const [data, setData] = React.useState<StoredScript>(null);
    const [storage, setStorage] = React.useState<StorageSlot | null>(null);


    const loadData = (store) => {
        const script = getStorageScript(store);
        if (!isLoaded) {
            setLoaded(true);
        }
        if (script) {
            setData(script);
            return Status.SUCCESS;
        }
        return Status.ERROR;
    }

    React.useEffect(() => {
        if (!props.id) {
            return;
        }
        const newCodeId = `code.${props.id.replace(/-/g, '_')}`;
        const store = createStorageSlot(newCodeId);
        setStorage(store);
        loadData(store);        
    }, [props.id]);

    if (!props.id || !storage) {
        return (
            <Context.Provider value={undefined}>
                {props.children}
            </Context.Provider>
        );
    }
    return (
        <Context.Provider
            value={{
                status: status,
                isLoaded: isLoaded,
                data: data,
                load: async () => {
                    return loadData(storage);
                },
                set: async (script: StoredScript) => {
                    if (syncStorageScript(script, storage)) {
                        return Status.SUCCESS;
                    }
                    return Status.ERROR;
                },
                del: async () => {
                    storage.del();
                    return Status.SUCCESS;
                }
            }}
        >
            {props.children}
        </Context.Provider>
    );
};


export function useStore(): Store {
    const context = React.useContext(Context);
    if (context === null) {
      throw new ReactContextError(
        'StoreContextProvider',
        'The Component must be a child of the StoreContextProvider component',
      );
    }
    return context;
}


export default StoreContext;