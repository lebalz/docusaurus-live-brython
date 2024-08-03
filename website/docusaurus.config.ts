import type { Config } from '@docusaurus/types';
import * as Preset from '@docusaurus/preset-classic';
const { themes } = require('prism-react-renderer');

const lightCodeTheme = themes.vsLight;
const darkCodeTheme = themes.vsDark;

const BASE_URL = process.env.NODE_ENV === 'production' ? '/docusaurus-live-brython/' : '/';

const config: Config = {
    title: 'Live Brython',
    tagline: 'Execute and interact with your Markdown Python Codeblocks in Docusaurus 3',
    url: 'https://lebalz.github.io',
    baseUrl: BASE_URL,
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'lebalz', // Usually your GitHub org/user name.
    projectName: 'docusaurus-live-brython', // Usually your repo name.
    trailingSlash: false,
    future: {
        experimental_router: 'browser'
    },
    themeConfig: {
        navbar: {
            title: 'Live Brython',
            logo: {
                alt: 'Live Brython',
                src: 'img/logo.svg'
            },
            items: [
                {
                    to: 'docs',
                    position: 'left',
                    label: 'Docs'
                },
                {
                    to: 'demo',
                    position: 'left',
                    label: 'Demo'
                },
                {
                    to: 'snippets',
                    position: 'left',
                    label: 'Shareable Snippet'
                },
                {
                    to: 'playground',
                    position: 'left',
                    label: 'Playground'
                },
                {
                    href: 'https://www.npmjs.com/package/docusaurus-live-brython',
                    label: 'npm',
                    position: 'right'
                },
                {
                    href: 'https://github.com/lebalz/docusaurus-live-brython',
                    label: 'GitHub',
                    position: 'right'
                }
            ]
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Ressources',
                    items: [
                        {
                            label: 'npm',
                            href: 'https://www.npmjs.com/package/docusaurus-live-brython'
                        }
                    ]
                }
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Le Balz. Built with Docusaurus.`
        },
        prism: {
            theme: lightCodeTheme,
            darkTheme: darkCodeTheme
        },
        metadata: [
            {
                name: 'keywords',
                content: 'docusaurus, brython, live, python, markdown, codeblock'
            },
            {
                name: 'description',
                content: 'Execute and interact with your Markdown Python Codeblocks in Docusaurus 3'
            },
            { name: 'og:title', content: 'Docusaurus Live Brython' },
            {
                name: 'og:description',
                content: 'Execute and interact with your Markdown Python Codeblocks in Docusaurus 3'
            },
            {
                name: 'og:image',
                content: 'https://lebalz.github.io/docusaurus-live-brython/img/og_preview.png'
            },
            {
                name: 'og:url',
                content: 'https://lebalz.github.io/docusaurus-live-brython'
            },
            { name: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@lebalz' },
            { name: 'twitter:creator', content: '@lebalz' },
            { name: 'twitter:title', content: 'Docusaurus Live Brython' },
            {
                name: 'twitter:description',
                content: 'Execute and interact with your Markdown Python Codeblocks in Docusaurus 3'
            },
            {
                name: 'twitter:image',
                content: 'https://lebalz.github.io/docusaurus-live-brython/img/twitter_preview.png'
            }
        ]
    } satisfies Preset.ThemeConfig,
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                theme: {
                    customCss: require.resolve('./src/css/custom.css')
                }
            } satisfies Preset.Options
        ]
    ],
    scripts: [
        {
            src: 'https://umami.gbsl.website/tell-me.js',
            ['data-website-id']: '8783952a-0904-4284-9115-61f387c4499d',
            ['data-domains']: 'lebalz.github.io',
            async: true,
            defer: true
        }
    ],
    themes: ['docusaurus-live-brython']
};

export default config;
