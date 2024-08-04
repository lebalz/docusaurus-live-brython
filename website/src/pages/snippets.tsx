import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
// @ts-ignore
import ContextEditor from '@theme/CodeEditor/ContextEditor';
import styles from './snippets.module.css';
import { useLocation, useHistory } from '@docusaurus/router';
import React from 'react';
import Title from '../components/SnippetComponents/Title';
import Description from '../components/SnippetComponents/Description';
import pako from 'pako';

interface CodeSnippet {
    title: string;
    description: string;
    code: string;
}
const DEFAULT_SNIPPET: CodeSnippet = Object.freeze({
    title: '',
    description: '',
    code: ''
});
const encodeToBase64 = (str: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const compressed = pako.gzip(data);
    return btoa(String.fromCharCode(...new Uint8Array(compressed)));
};

const decodeFromBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const decompressed = pako.ungzip(bytes);
    const decoder = new TextDecoder();
    return decoder.decode(decompressed);
};

const decodeSnippet = (raw: string): CodeSnippet => {
    try {
        const snippet = JSON.parse(decodeFromBase64(decodeURIComponent(raw)));
        return {...DEFAULT_SNIPPET, ...snippet};
    } catch (e) {
        console.warn('Failed to decode snippet', e);
        return {...DEFAULT_SNIPPET};
    }
};

const encodeSnippet = (snippet: CodeSnippet): string => {
    return encodeURIComponent(encodeToBase64(JSON.stringify(snippet)));
};

export default function Snippet(): JSX.Element {
    const location = useLocation();
    const history = useHistory();
    const [initialized, setInitialized] = React.useState(false);
    const [code, setCode] = React.useState('');
    const [init, setInit] = React.useState<CodeSnippet>({...DEFAULT_SNIPPET});
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');

    const [copyied, setCopyied] = React.useState(false);

    React.useEffect(() => {
        if (location.search) {
            const params = new URLSearchParams(location.search);
            if (params.has('snippet')) {
                const raw = params.get('snippet');
                const snippet = decodeSnippet(raw);
                setCode(snippet.code);
                setTitle(snippet.title);
                setDescription(snippet.description);
                setInit(snippet);
            }
        }
        setInitialized(true);
    }, []);

    React.useEffect(() => {
        if (!initialized) {
            return;
        }
        const data: Partial<CodeSnippet> = {};
        if (code.length > 0) {
            data.code = code;
        }
        if (title.length > 0) {
            data.title = title;
        }
        if (description.length > 0) {
            data.description = description;
        }
        if (Object.keys(data).length === 0) {
            return;
        }
        const enc = encodeSnippet(data as CodeSnippet);
        console.log(decodeSnippet(enc), enc);
        history.replace({
            search: enc ? `?snippet=${enc}` : ''
        });
    }, [initialized, code, title, description]);

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCopyied(false);
        }, 2000);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [copyied]);

    return (
        <Layout title={'Interactive Python Codeblocks'} description="Snippet Editor">
            <main className={clsx(styles.main, 'container container--fluid margin-vert--lg')}>
                <div className={clsx(styles.snippetContainer)}>
                    <div className={styles.title}>
                        <Heading as="h1" className="hero__title">
                            Python Snippet
                        </Heading>
                        <button
                            className={clsx(
                                styles.shareButton,
                                copyied && styles.copyied,
                                'button button--outline button--primary'
                            )}
                            title="Copy the link to share the snippet"
                            onClick={() => {
                                console.log(window.location.href);
                                navigator.clipboard
                                    .writeText(window.location.href)
                                    .then(() => {
                                        setCopyied(true);
                                    })
                                    .catch((err) => {
                                        window.alert(
                                            'Failed to copy the link. Your browser may not support this feature.'
                                        );
                                    });
                            }}
                        >
                            {/* icons set through css background-image */}
                        </button>
                    </div>
                    <p style={{ marginBottom: 0 }}>
                        Share your Python code snippets by editing the code below and then sharing the link.
                    </p>
                    {initialized && (
                        <>
                            <div>
                                <Title onChange={setTitle} title={init.title} />
                                <Description onChange={setDescription} description={init.description} />
                            </div>
                            <ContextEditor
                                className={clsx('language-py')}
                                title={title || 'snippet.py'}
                                onChange={(code: string) => setCode(code)}
                            >
                                {init.code || "print('Hello Python Snippet')"}
                            </ContextEditor>
                        </>
                    )}
                </div>
            </main>
        </Layout>
    );
}
