/**
 * What a shared link shows. Discord, Slack, X and search engines read the Open Graph and
 * Twitter tags in a page's <head>: a title, a description, a picture and a site name.
 * Without them a link shows only the site-wide description. Here each page gets its own
 * title and a description taken from its first paragraph, in its own language.
 */

const LOCALES = { en: 'en_US', de: 'de_DE', es: 'es_ES', fr: 'fr_FR', it: 'it_IT', ru: 'ru_RU', zh: 'zh_CN' }
const MAX = 200

/** The first paragraph of prose in a page, as plain text of at most 200 characters, or ''. */
export function describePage(markdown) {
  let text = String(markdown).replace(/\r\n?/g, '\n')
  text = text.replace(/^---\n[\s\S]*?\n---\n/, '')
  text = text.replace(/^\s*(```|~~~)[\s\S]*?^\s*\1.*$/gm, '')
  // A box (`::: warning` ... `:::`) is an aside, often the "this page is being worked on" notice; skip its text.
  let depth = 0
  text = text
    .split('\n')
    .filter((line) => {
      if (/^\s*:{3,}\s*[a-z]\S*/i.test(line)) return depth++ && false
      if (/^\s*:{3,}\s*$/.test(line)) return (depth = Math.max(0, depth - 1)) && false
      return depth === 0
    })
    .join('\n')
  for (const block of text.split(/\n\s*\n/)) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
    const first = lines[0] || ''
    if (!first) continue
    // headings, boxes, tables, lists, quotes, rules, HTML, images, tabs
    if (/^(#|:{3,}|\||[-*+]\s|\d+\.\s|>|-{3,}|<|!\[|={2,}|\{\{)/.test(first)) continue
    const plain = lines
      .filter((l) => !/^:{3,}/.test(l))
      .join(' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/[*_`~]+/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim()
    if (plain.length >= 40) return clip(plain)
  }
  return ''
}

function clip(text) {
  if (text.length <= MAX) return text
  const cut = text.slice(0, MAX - 1)
  const space = cut.lastIndexOf(' ')
  return (space > 120 ? cut.slice(0, space) : cut).replace(/[\s,.;:!?-]+$/, '') + '…'
}

/** `en/server-owners/host-a-server.md` -> `/en/server-owners/host-a-server.html`; index pages -> their folder. */
export function pageUrl(relativePath) {
  const path = String(relativePath).replace(/\.md$/, '')
  return '/' + (/(^|\/)index$/.test(path) ? path.replace(/index$/, '') : path + '.html')
}

/**
 * The head tags for one page: `[['meta', { property, content }], ...]`.
 * `page` is `{ title, description, relativePath }` (the description may be empty).
 */
export function pageHead({ title, description, relativePath, hostname, siteName, siteDescription, image, imageAlt, themeColor }) {
  const url = hostname.replace(/\/$/, '') + pageUrl(relativePath)
  const picture = hostname.replace(/\/$/, '') + image
  const locale = LOCALES[String(relativePath).split('/')[0]]
  const summary = description || siteDescription
  const meta = (key, name, content) => ['meta', { [key]: name, content }]
  return [
    ['link', { rel: 'canonical', href: url }],
    meta('name', 'theme-color', themeColor),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', siteName),
    meta('property', 'og:title', title),
    meta('property', 'og:description', summary),
    meta('property', 'og:url', url),
    meta('property', 'og:image', picture),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', imageAlt),
    ...(locale ? [meta('property', 'og:locale', locale)] : []),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', summary),
    meta('name', 'twitter:image', picture),
  ]
}
