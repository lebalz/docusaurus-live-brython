import { Context } from "@theme/CodeEditor/WithScript/ScriptContext";
import {type Document } from "@theme/CodeEditor/WithScript/Types";
import { ReactContextError } from "@docusaurus/theme-common";
import { useContext } from "react";

export function useStore(): Document {
    const context = useContext(Context);
    if (context === null) {
      throw new ReactContextError(
        'ScriptContextProvider',
        'The Component must be a child of the ScriptContextProvider component',
      );
    }
    return context;
}