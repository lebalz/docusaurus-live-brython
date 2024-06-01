declare module '@theme/CodeEditor' {
  export interface Props {
    slim: boolean;
    readonly: boolean;
    children: React.ReactNode;
    noCompare: boolean;
    title: string;
    versioned: boolean;
    resettable: boolean;
    download: boolean;
    showLineNumbers: boolean;
    lang: string;
    precode: string;
    maxLines?: number;
    noHistory: boolean;
  }
  export default function CodeEditor(props: Props): JSX.Element;
}

declare module 'docusaurus-live-brython/client' {
  import type { Store, Selector } from '@theme/CodeEditor/WithScript/Types';

  export function useScript(): { store: Store };

  export function useStore<T, T>(store: Store<T>, selector: Selector<T, R>): R;
}
