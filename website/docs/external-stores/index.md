---
sidebar_position: 10
---
# State Management

In case you want to store edited code blocks to a database instead of the browser's local storage, you can sync changes to `docusaurus-live-brython` by providing your own state management. This can be done by swizzling `CodeEditor/hooks/useScript` and `CodeEditor/WithScript/ScriptContext`. To sync between `docusaurus-live-brython` and your state management you can use reacts `useSyncExternalStore` hook.

## Mobx

👉 Demo Repository: [lebalz/docusaurus-mobx-live-code](https://github.com/lebalz/docusaurus-mobx-live-code)

Lets assume you have a `DocumentStore` that stores `Document`s (which contain code blocks) and you want to sync changes to the `DocumentStore` with `docusaurus-live-brython`. This gives you the ability to store the code blocks in a database.

<details>
<summary>`src/stores/DocumentStore`</summary>

```ts title="src/stores/documentStore.ts"
import { action, computed, makeObservable, observable, override } from 'mobx';
import { RootStore } from './rootStore';
import { computedFn } from 'mobx-utils';
import Document from '../models/Document';
import { type RouterType } from '@docusaurus/types';

export class DocumentStore {
    readonly root: RootStore;
    static accessor libDir: string = '/bry-libs/';
    static syncMaxOnceEvery: number = 1000;
    static router: RouterType = 'browser';


    documents = observable.array<Document>([]);
    
    constructor(root: RootStore) {
        this.root = root;
    }

    @action
    addDocument(document: Document) {
        this.documents.push(document);
    }

    find = computedFn(
        function (this: DocumentStore, id?: string): Document | undefined {
            if (!id) {
                return;
            }
            return this.documents.find((d) => d.id === id) as Document | undefined;
        },
        { keepAlive: true }
    );

}
```

</details>

<details>
<summary>`src/models/Document.ts`</summary>

```ts title="src/models/Document.ts"
import { action, computed, observable, reaction } from 'mobx';
import { DocumentStore } from '../stores/documentStore';
import { v4 as uuidv4 } from 'uuid';
import { sanitizePyScript, splitPreCode } from 'docusaurus-live-brython/theme/CodeEditor/WithScript/helpers';
import throttle from 'lodash/throttle';
import { 
    CANVAS_OUTPUT_TESTER, 
    DOM_ELEMENT_IDS, 
    GRAPHICS_OUTPUT_TESTER, 
    GRID_IMPORTS_TESTER, 
    TURTLE_IMPORTS_TESTER 
} from 'docusaurus-live-brython/theme/CodeEditor/constants';
import { 
    type InitState, 
    type LogMessage, 
    type Version,
    Status
} from 'docusaurus-live-brython/theme/CodeEditor/WithScript/Types';
import { runCode } from 'docusaurus-live-brython/theme/CodeEditor/WithScript/bryRunner';


export default class Document {
    readonly store: DocumentStore;
    readonly isVersioned: boolean;
    readonly _pristineCode: string;
    readonly id: string;
    readonly codeId: string;
    readonly source: 'local' | 'remote';
    readonly _lang: 'py' | string;
    readonly preCode: string;
    readonly postCode: string;
    @observable accessor createdAt: Date;
    @observable accessor updatedAt: Date;
    @observable accessor code: string;
    @observable accessor isExecuting: boolean;
    @observable accessor showRaw: boolean;
    @observable accessor isLoaded: boolean;
    @observable accessor status: Status = Status.IDLE;
    @observable accessor graphicsModalExecutionNr: number; /* 0 = closed, >0 = open */
    @observable accessor isPasted: boolean = false;
    versions = observable.array<Version>([], {deep: false});
    logs = observable.array<LogMessage>([], {deep: false});


    constructor(props: InitState, store: DocumentStore) {
        this.store = store;
        this.id = props.id || uuidv4();
        this.source = props.id ? 'remote' : 'local';
        this._lang = props.lang;
        this.isExecuting = false;
        this.showRaw = false;
        this.isLoaded = true;
        this.isVersioned = props.versioned && this.source === 'remote';
        this._pristineCode = props.code;
        this.code = props.code;
        if (this.isVersioned) {
            this.versions.push({code: props.code, createdAt: new Date(), version: 1});
        }
        this.preCode = props.preCode;
        this.postCode = props.postCode;
        this.codeId = `code.${props.title || props.lang}.${this.id}`.replace(/(-|\.)/g, '_');
        this.updatedAt = new Date();
        this.createdAt = new Date();
    }

    @action
    clearLogMessages() {
        this.logs.clear();
    }

    @action
    setExecuting(isExecuting: boolean) {
        this.isExecuting = isExecuting;
    }

    @action
    addLogMessage(message: LogMessage) {
        this.logs.push({output: message.output, timeStamp: Date.now(), type: message.type});
    }

    @action
    setCode(code: string, action?: 'insert' | 'remove' | string) {
        if (this.isPasted && action === 'remove') {
            return;
        }
        this.code = code;
        const updatedAt = new Date();
        this.updatedAt = updatedAt;
        if (this.isVersioned) {
            this.addVersion({
                code: code,
                createdAt: updatedAt,
                version: this.versions.length + 1,
                pasted: this.isPasted
            });
        }
        if (this.isPasted) {
            this.isPasted = false;
        }

        /**
         * call the api to save the code...
         */
    }

    @action
    loadVersions() {
        // nop
    }

    
    @action
    _addVersion(version: Version) {
        if (!this.isVersioned) {
            return;
        }
        this.versions.push(version);
    }

    addVersion = throttle(
        this._addVersion,
        DocumentStore.syncMaxOnceEvery,
        {leading: false, trailing: true}
    );

    @computed
    get _codeToExecute() {
        return `${this.preCode}\n${this.code}\n${this.postCode}`;
    }

    @action
    execScript() {
        if (this.hasGraphicsOutput) {
            this.graphicsModalExecutionNr = this.graphicsModalExecutionNr + 1;
        }
        this.isExecuting = true;
        runCode(this.code, this.preCode, this.postCode, this.codeId, DocumentStore.libDir, DocumentStore.router);
    }

    @action
    saveNow() {
        /**
         * call the api to save the code...
         */
    }

    /**
     * stop the script from running
     * wheter the script is running or not is derived from the
     * `data--start-time` attribute on the communicator element.
     * This is used in combination with the game loop
     */
    @action
    stopScript() {
        const code = document?.getElementById(DOM_ELEMENT_IDS.communicator(this.codeId));
        if (code) {
            code.removeAttribute('data--start-time');
        }
    }

    @computed
    get hasGraphicsOutput() {
        return this.hasTurtleOutput || this.hasCanvasOutput || GRAPHICS_OUTPUT_TESTER.test(this._codeToExecute);
    }

    @computed
    get hasTurtleOutput() {
        return TURTLE_IMPORTS_TESTER.test(this._codeToExecute);
    }


    @computed
    get hasCanvasOutput() {
        return CANVAS_OUTPUT_TESTER.test(this._codeToExecute) || GRID_IMPORTS_TESTER.test(this._codeToExecute);
    }

    @computed
    get hasEdits() {
        return this.code !== this.pristineCode;
    }

    @computed
    get versionsLoaded() {
        return true;
    }


    @action
    closeGraphicsModal() {
        this.graphicsModalExecutionNr = 0;
    }

    subscribe(listener: () => void, selector: keyof Document) {
        if (Array.isArray(this[selector])) {
            return reaction(
                () => (this[selector] as Array<any>).slice().length,
                (curr, prev) => {
                    listener();
                }
            );
        }
        return reaction(
            () => this[selector],
            listener
        );
    }

    @computed
    get pristineCode() {
        return this._pristineCode;
    }

    @action
    setIsPasted(isPasted: boolean) {
        this.isPasted = isPasted;
    };
    @action
    setShowRaw(showRaw: boolean) {
        this.showRaw = showRaw;
    };
    @action
    setStatus(status: Status) {
        this.status = status;
    };

    get lang() {
        if (this._lang === 'py') {
            return 'python';
        }
        return this._lang;
    }
}
```

</details>

With the `useSyncExternalStore` hook you can setup the synchronization between `docusaurus-live-brython` and the `Document` Model tracked by mobx.

```ts title="src/theme/CodeEditor/hooks/useScript.ts"
import Document from "@site/src/models/Document";
import { useCallback, useSyncExternalStore } from "react";
export const useScript = <T extends keyof Document>(model: Document, selector: T): Document[T] => {
    const isArray = Array.isArray(model[selector]);
    if (isArray) {
        // Arrays (logs and versions) are treated differently, see the details below
    }
    return useSyncExternalStore(
        useCallback((callback) => {
            return model.subscribe(callback, selector);
        }, [model, selector]),
        useCallback(
            () => {
                return model[selector];
            },
            [model, selector]
        )
    );
}
```

The `model` provides a `subscribe` method, which sets up a reaction on changes on the specified `selector`.

```ts title="src/models/Document.ts"
    subscribe(listener: () => void, selector: keyof Document) {
        if (Array.isArray(this[selector])) {
            return reaction(
                () => (this[selector] as Array<any>).slice().length,
                listener
            );
        }
        return reaction(
            () => this[selector],
            listener
        );
    }
```



<details>
<summary>Full `useScript.ts` Source</summary>

```ts title="src/theme/CodeEditor/hooks/useScript.ts"
import Document from "@site/src/models/Document";
import { useCallback, useSyncExternalStore } from "react";
/**
 * A utility function to create a stable snapshot wrapper
 * it is meant to only track the length of the array and treats
 * two arrays with the same length as equal
 */
const useStableSnapshot = (getSnapshot: () => Array<any>) => {
    let prevLength: number = -1;
    let prevResult: Array<any>;
    return () => {
        const result = getSnapshot();
        if (result.length !== prevLength) {
            prevLength = result.length;
            prevResult = result.slice();
        }
        return prevResult;
    };
};


export const useScript = <T extends keyof Document>(model: Document, selector: T): Document[T] => {
    const isArray = Array.isArray(model[selector]);
    if (isArray) {
        /**
         * arrays are treated differently as they are expected to be
         * immutable, so we can use a stable snapshot to track changes
         * in the array
         */
        return useSyncExternalStore(
            useCallback((callback) => {
                return model.subscribe(callback, selector);
            }, [model, selector]),
            useCallback(
                useStableSnapshot(() => {
                    return model[selector] as Array<any>;
                }) as () => Document[T],
                [model, selector]
            )
        );
    }
    return useSyncExternalStore(
        useCallback((callback) => {
            return model.subscribe(callback, selector);
        }, [model, selector]),
        useCallback(
            () => {
                return model[selector];
            },
            [model, selector]
        )
    );
}
```
</details>

Since the state in `docusaurus-live-brython` is passed down through the `ScriptContext`, you need to swizzle the `ScriptContext` to provide the mobx `Document` to the `CodeEditor` and all of it's components.

Here you can see, that the `Document` is created when the `ScriptContext` is mounted and added to the `DocumentStore`.

```ts title="src/theme/CodeEditor/WithScript/ScriptContext.tsx"
import React from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import { observer } from "mobx-react-lite";
import { InitState } from "docusaurus-live-brython/theme/CodeEditor/WithScript/Types";
import Document from "@site/src/models/Document";
import { useStore } from "@site/src/hooks/useStore";
import BrowserOnly from '@docusaurus/BrowserOnly';
import CodeBlock from '@theme/CodeBlock';
export const Context = React.createContext<Document | undefined>(undefined);
import { v4 as uuidv4 } from 'uuid';

const ScriptContext = observer((props: InitState & { children: React.ReactNode; }) => {
    const [id, setId] = React.useState<string>(props.id || uuidv4());
    const documentStore = useStore('documentStore');
    React.useEffect(() => {
        const doc = documentStore.find(id);
        if (doc) {
            return;
        }
        const document = new Document({...props, id: id}, documentStore);
        documentStore.addDocument(document);
    }, [props.id, documentStore]);
    
    return (
        <BrowserOnly fallback={<CodeBlock language={props.lang}>{props.code}</CodeBlock>}>
            {() => {
                if (!documentStore.find(id)) {
                    return (<CodeBlock language={props.lang}>{props.code}</CodeBlock>);
                }
                return (
                    <Context.Provider value={documentStore.find(id)}>
                        {props.children}
                    </Context.Provider>
                );
            }}
        </BrowserOnly>
    );
});

export default ScriptContext;
```