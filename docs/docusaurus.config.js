// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Admin App Actions',
  tagline: 'for Shopware 6 apps',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Shopware AG', // Usually your GitHub org/user name.
  projectName: 'admin-app-actions', // Usually your repo name.

  plugins: [
    [
      'docusaurus-plugin-typedoc',

      // Plugin / TypeDoc options
      {
        entryPoints: ['../lib/index.ts'],
        tsconfig: '../tsconfig.json',
        watch: process.env.TYPEDOC_WATCH,
        excludeInternal: true,
        hideBreadcrumbs: true,
        hideInPageTOC: true,
        sidebar: {
          fullNames: true,
          readmeLabel: 'Getting started'
        }
      },
    ]
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Admin App Actions',
        logo: {
          alt: 'Shopware 6 Logo',
          src: 'img/sw6-logo.svg',
        },
        items: [
          {
            to: 'docs/api',
            activeBasePath: 'docs/api',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/shopware/admin-app-actions',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} Shopware AG`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
