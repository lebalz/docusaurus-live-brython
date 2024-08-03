import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';
// @ts-ignore
import ContextEditor from '@theme/CodeEditor/ContextEditor';
import styles from './styles.module.css';
import { useLocation, useHistory } from '@docusaurus/router';
import React from 'react';
import Title from '../components/SnippetComponents/Title';
import Description from '../components/SnippetComponents/Description';

export default function Snippet(): JSX.Element {
    const location = useLocation();
    const history = useHistory();
    const [initialized, setInitialized] = React.useState(false);
    const [code, setCode] = React.useState<string>('');
    const [edited, setEdited] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [copyied, setCopyied] = React.useState(false);

    React.useEffect(() => {
        if (location.search) {
            const params = new URLSearchParams(location.search);
            if (params.has('code')) {
                const snippet = params.get('code') || '';
                console.log(snippet);
                setCode(snippet);
                setEdited(snippet);
            }
        }
        setInitialized(true);
    }, []);

    React.useEffect(() => {
        if (!initialized) {
            return;
        }
        const params = new URLSearchParams(location.search);
        if (edited) {
            params.set('code', edited);
        } else if (params.has('code')) {
            params.delete('code');
        }
        history.replace({
            search: params.toString()
        });
    }, [initialized, edited]);

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
                    <div>
                        <Title onChange={(title) => setTitle(title)} />
                        <Description />
                    </div>
                    {initialized && (
                        <ContextEditor
                            className={clsx('language-py')}
                            title={title || 'snippet.py'}
                            onChange={(code: string) => setEdited(code)}
                        >
                            {code || "print('Hello Python Snippet')"}
                        </ContextEditor>
                    )}
                </div>
            </main>
        </Layout>
    );
}
