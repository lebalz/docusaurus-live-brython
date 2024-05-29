import type { Config } from '@docusaurus/types';
import * as Preset from '@docusaurus/preset-classic';
const { themes } = require('prism-react-renderer');


const lightCodeTheme = themes.vsLight;
const darkCodeTheme = themes.vsDark;

const BASE_URL = process.env.NODE_ENV === 'production' ? '/docusaurus-live-brython/' : '/';

const config: Config = {
  title: 'Live Brython',
  tagline: 'Execute your Markdown Python Codeblocks in your Browser',
  url: 'https://lebalz.github.io',
  baseUrl: BASE_URL,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'lebalz', // Usually your GitHub org/user name.
  projectName: 'docusaurus-live-brython', // Usually your repo name.
  trailingSlash: false,
  themeConfig: {
    navbar: {
      title: 'Live Brython',
      logo: {
        alt: 'Live Brython',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'playground',
          position: 'left',
          label: 'Playground'
        },
        {
          href: 'https://github.com/lebalz/docusaurus-live-brython',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Ressources',
          items: [
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/docusaurus-live-brython',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Le Balz. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  } satisfies Preset.ThemeConfig,
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: [
      'docusaurus-live-brython'
  ],
};

export default config;