import { defineConfig, type DefaultTheme } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { redirectPage, redirectPlan } from '../../scripts/lib/redirects.mjs'
import { describePage, pageHead } from '../../scripts/lib/seo.mjs'
import { HOSTNAME, REPO, REPO_NAME_PLACEHOLDER, REPO_PLACEHOLDER } from './site'
import container from 'markdown-it-container'
import type Token from 'markdown-it/lib/token.mjs'
import enTranslations from '../en/nav-translations.json'
import deTranslations from '../de/nav-translations.json'
import frTranslations from '../fr/nav-translations.json'
import esTranslations from '../es/nav-translations.json'
import itTranslations from '../it/nav-translations.json'
import ruTranslations from '../ru/nav-translations.json'
import zhTranslations from '../zh/nav-translations.json'

type LocaleKey = 'root' | 'de' | 'fr' | 'es' | 'it' | 'ru' | 'zh'

type NavItem = {
  text: string
  link?: string
  items?: NavItem[]
}

type TranslationMap = Record<string, string>

const localeBasePath: Record<LocaleKey, string> = {
  root: '',
  de: '/de/',
  fr: '/fr/',
  es: '/es/',
  it: '/it/',
  ru: '/ru/',
  zh: '/zh/'
}

const translations: Record<LocaleKey, TranslationMap> = {
  root: enTranslations as TranslationMap,
  de: deTranslations as TranslationMap,
  fr: frTranslations as TranslationMap,
  es: esTranslations as TranslationMap,
  it: itTranslations as TranslationMap,
  ru: ruTranslations as TranslationMap,
  zh: zhTranslations as TranslationMap
}

const localizeLink = (locale: LocaleKey, link?: string) => {
  if (!link || link.startsWith('http')) {
    return link
  }

  if (locale === 'root') {
    return `/en/${link === '/' ? '' : link.replace(/^\//, '')}`
  }

  return `${localeBasePath[locale]}${link === '/' ? '' : link.replace(/^\//, '')}`
}

const docsDir = fileURLToPath(new URL('../', import.meta.url))

// A page that is not translated yet is left out of that language's menus, instead of linking to a
// page that is not there. The English page is the master, and a new one shows in every language as
// soon as it is translated.
const pageExists = (locale: LocaleKey, link: string) => {
  const rel = link.replace(/^\//, '')
  const file = rel === '' || rel.endsWith('/') ? `${rel}index` : rel
  return fs.existsSync(path.join(docsDir, locale === 'root' ? 'en' : locale, `${file}.md`))
}

const localizeItems = (locale: LocaleKey, items: NavItem[]): DefaultTheme.NavItem[] => {
  return items
    .filter((item) => {
      if (item.items) return true
      if (item.link && !item.link.startsWith('http')) return pageExists(locale, item.link)
      return true
    })
    .map((item) => {
    const localized: Record<string, unknown> = {
      text: translations[locale][item.text] ?? item.text
    }

    if (item.link) {
      localized.link = localizeLink(locale, item.link)
    }

    if (item.items) {
      localized.items = localizeItems(locale, item.items)
    }

    return localized as unknown as DefaultTheme.NavItem
  })
    .filter((item) => !('items' in item && Array.isArray(item.items) && item.items.length === 0 && !('link' in item)))
}

const baseNav: NavItem[] = [
  { text: 'Home', link: '/' },
  {
    text: 'Get Started',
    items: [
      { text: 'Install BeamMP', link: '/get-started/install-beammp' },
      { text: 'Join Your First Server', link: '/get-started/join-first-server' },
      { text: 'First-Time Multiplayer Settings', link: '/get-started/multiplayer-settings-quickstart' }
    ]
  },
  {
    text: 'Players',
    items: [
      { text: 'Gameplay Basics', link: '/players/gameplay-basics' },
      { text: 'Multiplayer Settings', link: '/players/multiplayer-settings' },
      { text: 'Player FAQ', link: '/players/faq' },
      { text: 'Game FAQ', link: '/players/game-faq' },
      { text: 'Mod Safety', link: '/players/mod-safety' }
    ]
  },
  {
    text: 'Server Owners',
    items: [
      { text: 'Host a Server', link: '/server-owners/host-a-server' },
      { text: 'Server Setup on VPS', link: '/server-owners/setup-vps' },
      { text: 'Port Forwarding', link: '/server-owners/port-forwarding' },
      { text: 'Check for CGNAT', link: '/server-owners/cgnat' },
      { text: 'Server Configuration', link: '/server-owners/configuration' },
      { text: 'Server Maintenance', link: '/server-owners/maintenance' },
      { text: 'Server FAQ', link: '/server-owners/faq' },
      { text: 'Server Manual', link: '/server-owners/manual' },
      { text: 'Server Error Codes', link: '/server-owners/error-codes' }
    ]
  },
  {
    text: 'Developers',
    items: [
      { text: 'Development Environment Setup', link: '/developers/dev-environment-setup' },
      { text: 'Mod & Resource Creation', link: '/developers/mod-and-resource-creation' },
      {
        text: 'BeamMP Scripting Reference',
        items: [
          { text: 'Mod (In-Game)', link: '/developers/beammp-scripting/mod-in-game' },
          {
            text: 'Server',
            link: '/developers/beammp-scripting/server/latest',
            items: [
              { text: 'Version 3.X (Latest)', link: '/developers/beammp-scripting/server/latest' },
              { text: 'Version 2.X (Deprecated)', link: '/developers/beammp-scripting/server/legacy-v2' }
            ]
          }
        ]
      }
    ]
  },
  {
    text: 'Game Documentation',
    items: [
      {
        text: 'Content Development',
        items: [
          { text: 'Introduction', link: '/game-documentation/content-development/index' },
          {
            text: 'Programming',
            items: [
              { text: 'UI Apps (HTML)', link: '/game-documentation/programming/ui-apps-html-cef' },
              { text: 'ImGui Window Tutorial', link: '/game-documentation/programming/imgui' }
            ]
          }
        ]
      },
      { text: 'Lua Code Snippets', link: '/game-documentation/snippets/lua-snippets' },
      { text: 'CSS Code Snippets', link: '/game-documentation/snippets/css-snippets' },
      { text: 'ImGui Code Snippets', link: '/game-documentation/snippets/imgui-snippets' }
    ]
  },
  {
    text: 'Troubleshooting',
    items: [
      { text: 'Launcher Update Issues', link: '/troubleshooting/launcher-update' },
      { text: 'Connection / Networking Issues', link: '/troubleshooting/connection-networking' },
      { text: 'Changing the Launcher Port', link: '/troubleshooting/launcher-port' },
      { text: 'Defender / Firewall Exclusions', link: '/troubleshooting/defender-exclusions' },
      { text: 'Error Codes', link: '/troubleshooting/error-codes' }
    ]
  },
  {
    text: 'Community',
    items: [
      { text: 'Community Info', link: '/community/index' },
      { text: 'Rules', link: '/community/rules' },
      { text: 'Contributing', link: '/community/contributing' }
    ]
  }
]

const navByLocale = (_locale: LocaleKey) => baseNav

// The top bar has room for about four sections next to search, the repository card and the
// language and theme switchers (eight did not fit in any language, and not at all in Spanish or
// Russian). The rest go in a "More" menu. The sidebar keeps the full list.
const topNavTexts = ['Get Started', 'Players', 'Server Owners', 'Developers']
const topNav = (nav: NavItem[]): NavItem[] => [
  ...nav.filter((item) => topNavTexts.includes(item.text)),
  { text: 'More', items: nav.filter((item) => !topNavTexts.includes(item.text) && item.text !== 'Home') }
]

const localeNav = (locale: LocaleKey) => localizeItems(locale, topNav(navByLocale(locale)))

const localeSidebar = (locale: LocaleKey) => localizeItems(locale, navByLocale(locale))

const docsLocales = ['en', 'de', 'fr', 'es', 'it', 'ru', 'zh'] as const

// Where each page of the MkDocs site is now. The files live at their final paths; this table keeps
// the old addresses working (a small redirect page is written for each, see buildEnd) and lets the
// link repair tool follow a link that still names an old path.
const movedPages: Record<string, string> = {
  'game/getting-started': 'get-started/index',
  'game/multiplayer-settings': 'players/multiplayer-settings',
  'server/create-a-server': 'server-owners/host-a-server',
  'server/port-forwarding': 'server-owners/port-forwarding',
  'server/server-maintenance': 'server-owners/configuration',
  'server/error-codes': 'server-owners/error-codes',
  'game/error-codes': 'troubleshooting/error-codes',
  'FAQ/player-faq': 'players/faq',
  'FAQ/Clearing-mods': 'players/mod-safety',
  'FAQ/server-faq': 'server-owners/faq',
  'FAQ/How-to-check-for-CGNAT': 'server-owners/cgnat',
  'FAQ/Update-launcher': 'troubleshooting/launcher-update',
  'FAQ/where-to-find-my-IP': 'troubleshooting/connection-networking',
  'FAQ/Defender-exclusions': 'troubleshooting/defender-exclusions',
  'guides/index': 'developers/index',
  'guides/beammp-dev/beammp-dev': 'developers/dev-environment-setup',
  'guides/mod-creation/server/getting-started': 'developers/mod-and-resource-creation',
  'scripting/mod-reference': 'developers/beammp-scripting/mod-in-game',
  'scripting/server/latest-server-reference': 'developers/beammp-scripting/server/latest',
  'scripting/server/v2-server-reference': 'developers/beammp-scripting/server/legacy-v2',
  'beamng/dev/index': 'game-documentation/content-development/index',
  'beamng/dev/content/maps': 'game-documentation/content-development/index',
  'beamng/dev/content/props': 'game-documentation/content-development/index',
  'beamng/dev/content/vehicles': 'game-documentation/content-development/index',
  'beamng/dev/modding/ui-apps': 'game-documentation/programming/ui-apps-html-cef',
  'beamng/dev/modding/lua-mods': 'game-documentation/index',
  'beamng/dev/modding/imgui-window-tutorial': 'game-documentation/programming/imgui',
  'beamng/lua-snippets': 'game-documentation/snippets/lua-snippets',
  'beamng/css-snippets': 'game-documentation/snippets/css-snippets',
  'beamng/imgui-snippets': 'game-documentation/snippets/imgui-snippets',
  'beamng/cef-snippets': 'game-documentation/index',
  'contributing': 'community/contributing',
  'FAQ/Change-launcher-port': 'troubleshooting/launcher-port',
  'FAQ/game-faq': 'players/game-faq',
  'server/manual': 'server-owners/manual',
  'server/setup-vps': 'server-owners/setup-vps',
  'API documentation/Client-Side': 'developers/beammp-scripting/mod-in-game',
  'API documentation/Server-Side': 'developers/beammp-scripting/server/latest',
  'beamng/dev/modding/imgui-windows': 'game-documentation/programming/imgui',
  'beamng/index': 'game-documentation/index',
  'FAQ/How-to-deactivate-mods': 'players/mod-safety',
  'FAQ/march-28-outage': 'community/index',
  'beamng/snippets': 'game-documentation/snippets/lua-snippets',
  'game/tailoring': 'game-documentation/index',
  'support/error-codes': 'troubleshooting/error-codes',
  'support/game-faq': 'players/game-faq',
  'support/player-faq': 'players/faq',
  'support/server-faq': 'server-owners/faq'
}

// The same table, for every language, as `en/old/path.md` -> `en/new/path.md`.
const movedByLocale = docsLocales.reduce<Record<string, string>>((acc, locale) => {
  for (const [from, to] of Object.entries(movedPages)) {
    acc[`${locale}/${from}.md`] = `${locale}/${to}.md`
  }
  return acc
}, {})

const makeLocale = (locale: LocaleKey, label: string, lang: string, link?: string) => ({
  label,
  lang,
  ...(link ? { link } : {}),
  themeConfig: {
    nav: localeNav(locale) as DefaultTheme.NavItem[],
    sidebar: localeSidebar(locale) as DefaultTheme.SidebarItem[]
  }
})

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'BeamMP Docs',
  description:
    'This website serves as the new BeamMP Documentation site for general self serve support, guides and documentation.',
  head: [
    ['script', { defer: "true", src: 'https://analytics.beammp.com/api/script.js', 'data-site-id': '632c87f003fc', async: "true" }]
  ],
  lastUpdated: true,
  // Parts included into other pages (<!--@include: ./_parts/x.md-->) are not pages of their own.
  srcExclude: ['**/_parts/**'],
  // Many links still point at the old MkDocs file layout, so dead links do not
  // fail the build for now. `npm run check` sets DOCS_REPORT_LINKS=1 so each one
  // is printed, with its page, and counted against the saved baseline.
  ignoreDeadLinks: process.env.DOCS_REPORT_LINKS
    ? [
        (link: string, source: string) => {
          console.log(`Found dead link ${link} in file ${source}`)
          return true
        },
      ]
    : true,
  locales: {
    root: makeLocale('root', 'English', 'en', '/en/'),
    de: makeLocale('de', 'Deutsch', 'de', '/de/'),
    fr: makeLocale('fr', 'Français', 'fr', '/fr/'),
    es: makeLocale('es', 'Español', 'es', '/es/'),
    it: makeLocale('it', 'Italiano', 'it', '/it/'),
    ru: makeLocale('ru', 'Pусский', 'ru', '/ru/'),
    zh: makeLocale('zh', '中文', 'zh', '/zh/')
  },
  // GitHub Pages cannot redirect, so the old MkDocs addresses (movedPages) get a small page that sends the visitor on.
  // The "View on GitHub" button on each home page names the repository by placeholder, and a page
  // with no description of its own takes one from its first paragraph (for search results and
  // for the card a shared link shows).
  transformPageData(pageData, { siteConfig }) {
    const hero = pageData.frontmatter?.hero
    if (Array.isArray(hero?.actions)) {
      for (const action of hero.actions) {
        if (typeof action.link === 'string') action.link = action.link.replace(REPO_PLACEHOLDER, REPO)
      }
    }
    if (!pageData.description) {
      let description: string = hero?.tagline || ''
      if (!description && pageData.filePath) {
        try {
          description = describePage(fs.readFileSync(path.join(siteConfig.srcDir, pageData.filePath), 'utf8'))
        } catch {
          /* a page with no readable source keeps the site description */
        }
      }
      pageData.description = description
    }
  },
  // What a shared link (Discord, Slack, X) shows: title, description, picture, site name.
  transformHead({ pageData, siteConfig }) {
    return pageHead({
      title: pageData.frontmatter?.hero?.name || pageData.title || siteConfig.site.title,
      description: pageData.description,
      relativePath: pageData.relativePath,
      hostname: HOSTNAME,
      siteName: siteConfig.site.title,
      siteDescription: siteConfig.site.description,
      image: '/assets/core/social-card.png',
      imageAlt: 'BeamMP Documentation',
      themeColor: '#f36d24'
    })
  },
  buildEnd(siteConfig) {
    for (const [file, to] of redirectPlan(siteConfig.pages, movedByLocale)) {
      const target = path.join(siteConfig.outDir, file)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.writeFileSync(target, redirectPage(to))
    }
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)

      // A page writes https://github.com/__repo__ for a link to the repository and @repo@ for its
      // name; both are filled in from site.ts.
      md.core.ruler.push('repo-placeholder', (state) => {
        for (const block of state.tokens) {
          for (const token of block.children ?? []) {
            if (token.type === 'link_open') {
              const href = token.attrGet('href')
              if (href && href.includes(REPO_PLACEHOLDER)) token.attrSet('href', href.replace(REPO_PLACEHOLDER, REPO))
            } else if (token.type === 'text' && token.content.includes(REPO_NAME_PLACEHOLDER)) {
              token.content = token.content.replaceAll(REPO_NAME_PLACEHOLDER, REPO)
            }
          }
        }
      })

      const makeContainer = (type: string, defaultTitle: string) => [
        container,
        type,
        {
          render(tokens: Token[], idx: number) {
            const token = tokens[idx]
            const info = token.info.trim().slice(type.length).trim()
            const title = info || defaultTitle
            if (token.nesting === 1) {
              return `<div class="custom-block ${type}"><p class="custom-block-title">${title}</p>\n`
            }
            return '</div>\n'
          }
        }
      ] as const

      md.use(...makeContainer('note', 'NOTE'))
      md.use(...makeContainer('quote', 'QUOTE'))
      // MkDocs box types VitePress does not have. The pages use them, and an
      // unregistered `::: type` would show as plain text.
      md.use(...makeContainer('question', 'QUESTION'))
      md.use(...makeContainer('success', 'SUCCESS'))
      md.use(...makeContainer('failure', 'FAILURE'))
      md.use(...makeContainer('bug', 'BUG'))
      md.use(...makeContainer('example', 'EXAMPLE'))
    },
  },
  sitemap: {
    // Where the site is served: docs.beammp.dev while this is the preview, and
    // docs.beammp.com once it replaces the live docs.
    hostname: HOSTNAME
  },
  themeConfig: {
    repo: REPO,
    editLink: {
      pattern: `https://github.com/${REPO}/edit/main/docs/:path`
    },
    logo: {
      light: '/assets/core/beammp_dark.png',
      dark: '/assets/core/beammp_light.png'
    },
    search: {
      provider: 'local'
    }
  }
})
