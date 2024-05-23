import React from 'react';
import { checkCanvasOutput, checkGraphicsOutput, checkTurtleOutput, getPreCode } from './helpers';
import { ReactContextError, createStorageSlot } from '@docusaurus/theme-common';
import { v4 as uuidv4 } from 'uuid';
import StoreContext from './StoreContext';
import ScriptContext from './ScriptContext';

export interface Version {
    code: string;
    createdAt: Date;
}

export interface StoredScript {
    code: string;
    createdAt: Date;
    updatedAt: Date;
    versions: Version[];
}

export interface Script extends StoredScript {
    /**
     * this is normally a uuid
     */
    id: string;
    /**
     * this is the codeId used to
     * - identify dom elements for this block
     * - setup the brython communicator with this id
     * - when using the default storage, this is the key used to 
     *   store the code to local storage
     */
    codeId: string;
    pristineCode: string;
    setCode: (code: string) => void;
    isExecuting?: boolean;
    setExecuting: (executing: boolean) => void;
    execScript: (codeId: string) => void,
    preCode: string;
    lang: 'py' | string;
    logs: LogMessage[];
    addLogMessage: (log: LogMessage) => void;
    clearLogMessages: () => void;
    hasGraphicsOutput: boolean;
    hasTurtleOutput: boolean;
    hasCanvasOutput: boolean;
    hasEdits: boolean;
}

interface Props {
    id: string | undefined;
    lang: 'py' | string;
    raw: string;
    children: React.ReactNode;
    readonly: boolean;
    versioned: boolean;
}

export interface LogMessage {
    type: 'done' | 'stdout' | 'stderr' | 'start';
    output: string;
    timeStamp: number;
}

export type StorageSlot = {
    get: () => string | null;
    set: (value: string) => void;
    del: () => void;
    listen: (onChange: (event: StorageEvent) => void) => () => void;
};

export enum Status {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS'
}

export interface Store {
    isLoaded: boolean;
    load: () => Promise<Status>;
    set: (script: StoredScript) => Promise<Status>;
    del: () => Promise<Status>;
    data: StoredScript | null;
    status: Status;
}


const WithScript = (props: Props) => {
    return (
        <StoreContext id={props.id}>
            <ScriptContext
                id={props.id}
                lang={props.lang}
                raw={props.raw}
                readonly={props.readonly}
                versioned={props.versioned} 
            >
                {props.children}
            </ScriptContext>
        </StoreContext>
    );
}


export default WithScript;