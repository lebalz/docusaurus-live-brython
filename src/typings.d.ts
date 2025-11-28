/// <reference types="@docusaurus/module-type-aliases" />

// Aggiungiamo questa definizione manuale per dire a TS che Details esiste
declare module '@theme/Details' {
  import { ReactNode } from 'react';
  export interface Props {
    readonly summary: ReactNode;
    readonly children: ReactNode;
    [key: string]: any;
  }
  export default function Details(props: Props): JSX.Element;
}