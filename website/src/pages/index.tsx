import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate from '@docusaurus/Translate';
// @ts-ignore
import ContextEditor from '@theme/CodeEditor/ContextEditor';

import styles from './styles.module.css';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    const { withBaseUrl } = useBaseUrlUtils();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    {siteConfig.title}
                </Heading>
                <p className="hero__subtitle">
                    <Translate id="homepage.subtitle">Execute and interact with your Markdown Python Codeblocks in Docusaurus 3</Translate>
                </p>
                <div className={styles.buttons}>
                    <Link className="button button--lg button--success" to={withBaseUrl('docs')}>
                        <Translate id="homepage.getStarted">Get Started</Translate>
                    </Link>
                    <Link className="button button--secondary button--lg" to={withBaseUrl('/demo')}>
                        <Translate id="homepage.liveDemo">Live Demo</Translate>
                    </Link>
                    <Link className="button button--secondary button--lg" to={withBaseUrl('/snippets')}>
                        <Translate id="homepage.shareCode">Share Code</Translate>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout title={'Interactive Python Codeblocks'} description={siteConfig.tagline}>
            <HomepageHeader />
            <main>
                <section className={clsx(styles.section)}>
                    <div className={clsx('card', styles.card)}>
                        <div className="card__image">
                            <img
                                src={require('./images/brython-demo.gif').default}
                                style={{ clipPath: 'inset(0px 0px 2px 0px)' }}
                            />
                        </div>
                        <div className="card__footer">
                            <a className="button button--primary button--block" href={useBaseUrl('/demo')}>
                                <Translate id="homepage.tryIt">Try It!</Translate>
                            </a>
                        </div>
                    </div>
                    <ContextEditor className={clsx('language-py', styles.code)}>
                        {`print('Hello Live Brython! ❤️')`}
                    </ContextEditor>
                </section>
            </main>
        </Layout>
    );
}
