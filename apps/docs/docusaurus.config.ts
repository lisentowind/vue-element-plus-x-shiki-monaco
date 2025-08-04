import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Vue Shiki Monaco Editor",
  tagline: "基于 Monaco Editor + Shiki 的现代化 Vue 3 代码编辑器组件",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://lisentowind.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/vue-shiki-monaco/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "lisentowind", // Usually your GitHub org/user name.
  projectName: "vue-shiki-monaco", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans", "en"],
    localeConfigs: {
      "zh-Hans": {
        label: "简体中文",
        direction: "ltr",
        htmlLang: "zh-CN",
      },
      en: {
        label: "English",
        direction: "ltr",
        htmlLang: "en-US",
      },
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/lisentowind/vue-shiki-monaco/edit/main/apps/docs/",
          routeBasePath: "docs",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Vue Shiki Monaco Editor ",
      logo: {
        alt: "Vue Shiki Monaco Editor  Logo",
        src: "img/logo-best-mini.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "文档",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          href: "https://github.com/lisentowind/vue-shiki-monaco",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "文档",
          items: [
            {
              label: "快速开始",
              to: "/docs/getting-started",
            },
            {
              label: "API 参考",
              to: "/docs/api",
            },
            {
              label: "使用示例",
              to: "/docs/examples",
            },
          ],
        },
        {
          title: "社区",
          items: [
            {
              label: "GitHub Issues",
              href: "https://github.com/lisentowind/vue-shiki-monaco/issues",
            },
            {
              label: "GitHub Discussions",
              href: "https://github.com/lisentowind/vue-shiki-monaco/discussions",
            },
          ],
        },
        {
          title: "更多",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/lisentowind/vue-shiki-monaco",
            },
            {
              label: "NPM",
              href: "https://www.npmjs.com/package/vue-shiki-monaco",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Vue Shiki Monaco Editor  组件. by lisentowind`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
