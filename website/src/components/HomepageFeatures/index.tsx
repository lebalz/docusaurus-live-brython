import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

type FeatureItem = {
    title: string;
    Img?: string;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Show it with Code',
        description: (
            <>
                Live Brython makes it easy to show and execute Python code on your Website. Just write a
                Python code block and it can be executed.
            </>
        )
    },
    {
        title: 'Interact with Code',
        Img: require('./images/live-python.png').default,
        description: (
            <>The Code Editor allows you to interact with the code. You can edit and run the changed code.</>
        )
    },
    {
        title: 'Learn with Code',
        description: (
            <>Use it for your learning website written with Docusaurus. Even Turtles are supported.</>
        )
    }
];

function Feature({ title, Img, description }: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                {Img ? (
                    <a href={useBaseUrl('/demo')}>
                        <img src={Img} />
                    </a>
                ) : (
                    <div style={{ height: '150px' }}></div>
                )}
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): JSX.Element {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
