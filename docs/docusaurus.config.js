// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Admin Extension SDK',
  tagline: 'for Shopware 6 apps and plugins',
  url: 'https://shopware.github.io',
  baseUrl: '/admin-extension-sdk/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Shopware AG', // Usually your GitHub org/user name.
  projectName: 'admin-extension-sdk', // Usually your repo name.

  plugins: [
    [
      'docusaurus-plugin-typedoc',

      // Plugin / TypeDoc options
      {
        entryPoints: ['../src'],
        entryPointStrategy: 'expand',
        tsconfig: '../tsconfig.json',
        watch: process.env.TYPEDOC_WATCH,
        publicPath: 'api/',
        readme: 'none',
        sort: ['instance-first']
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
        title: 'Admin Extension SDK',
        logo: {
          alt: 'Shopware 6 Logo',
          src: 'img/sw6-logo.svg',
        },
        items: [
          {
            to: 'docs/guide',
            activeBasePath: 'docs/guide',
            position: 'left',
            label: 'Guide',
          },
          {
            to: 'docs/api',
            activeBasePath: 'docs/api',
            position: 'left',
            label: 'API',
          },
          {
            href: 'https://github.com/shopware/admin-extension-sdk',
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
      algolia: {
        // If Algolia did not provide you any appId, use 'BH4D9OD16A'
        appId: 'YOUR_APP_ID',
  
        // Public API key: it is safe to commit it
        apiKey: 'YOUR_SEARCH_API_KEY',
  
        indexName: 'YOUR_INDEX_NAME',
  
        // Optional: see doc section below
        contextualSearch: true,
  
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: 'external\\.com|domain\\.com',
  
        // Optional: see doc section below
        appId: 'YOUR_APP_ID',
  
        // Optional: Algolia search parameters
        searchParameters: {},
  
        //... other Algolia params
      },
    }),
};

module.exports = config;
