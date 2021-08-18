const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Live Brython',
  tagline: 'Execute your Markdown Python Codeblocks in your Browser',
  url: 'https://lebalz.github.io/docusaurus-live-brython',
  baseUrl: '/docusaurus-live-brython/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'lebalz', // Usually your GitHub org/user name.
  projectName: 'docusaurus-live-brython', // Usually your repo name.
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
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themes: ['docusaurus-live-brython'],
};
