---
sidebar_position: 10
---
# 狀態管理

如果您希望將編輯過的代碼塊存儲到資料庫而不是瀏覽器的本地存儲中，您可以通過提供自己的狀態管理來同步到 `docusaurus-live-brython`。這可以通過交換 `CodeEditor/hooks/useScript` 和 `CodeEditor/WithScript/ScriptContext` 來完成。要在 `docusaurus-live-brython` 和您的狀態管理之間進行同步，您可以使用 React 的 `useSyncExternalStore` 鉤子。

## Mobx

👉 演示倉庫: [lebalz/docusaurus-mobx-live-code](https://github.com/lebalz/docusaurus-mobx-live-code)

假設您有一個 `DocumentStore` 來存儲 `Document`（其中包含代碼塊），並且您希望將 `DocumentStore` 的更改同步到 `docusaurus-live-brython`。這使您可以將代碼塊存儲在資料庫中。

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

使用 `useSyncExternalStore` 鉤子，您可以設置 `docusaurus-live-brython` 和由 mobx 跟蹤的 `Document` 模型之間的同步。

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

`model` 提供了一個 `subscribe` 函式，用於設置對指定 `selector` 變化的反應。

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
<summary>完整 `useScript.ts` 來源</summary>

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

由於 `docusaurus-live-brython` 中的狀態通過 `ScriptContext` 傳遞，您需要交換 `ScriptContext` 以將 mobx 的 `Document` 提供給 `CodeEditor` 及其所有組件。

這裡您可以看到，當 `ScriptContext` 被掛載時創建了 `Document` 並將其添加到 `DocumentStore`。

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