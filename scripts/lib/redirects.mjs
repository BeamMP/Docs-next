/**
 * Redirects from the addresses the old MkDocs site used to the ones this site serves.
 *
 * GitHub Pages cannot redirect, so each old address gets a small page that sends the
 * visitor on. Two kinds of old address exist:
 *  - MkDocs ended every address in a slash (`/en/FAQ/game-faq/`); VitePress writes
 *    `/en/FAQ/game-faq.html`, and Pages does not map one to the other.
 *  - pages that moved (`moved`, from the config's `movedPages`) used to live at another path,
 *    and some were removed in favour of another page.
 *
 * Nothing is written over a page that really exists, and nothing redirects to a page
 * that does not exist (an untranslated page goes to its English version).
 */

const noExt = (file) => file.replace(/\.md$/, '')
const isIndex = (file) => /(^|\/)index$/.test(file)

/** The address (not the file) a page is served at: `/en/get-started/` or `/en/players/faq.html`. */
export function servedUrl(destNoExt) {
  return isIndex(destNoExt) ? '/' + destNoExt.replace(/index$/, '') : '/' + destNoExt + '.html'
}

/**
 * `Map { 'en/server/create-a-server/index.html' => '/en/server-owners/host-a-server.html', ... }`
 * from the page list (`en/x/y.md`) and the moved pages (`{ 'en/old.md': 'en/new.md' }`).
 */
export function redirectPlan(pages, moved = {}) {
  const real = new Set(pages.map((page) => noExt(page) + '.html'))
  const plan = new Map()
  const add = (file, to) => {
    if (real.has(file) || plan.has(file)) return
    plan.set(file, to)
  }
  for (const page of pages) {
    const dest = noExt(page)
    if (!isIndex(dest)) add(dest + '/index.html', servedUrl(dest))
  }
  for (const [from, to] of Object.entries(moved)) {
    let target = noExt(to)
    // The MkDocs site showed the English page at every language's address for a page that was not
    // translated yet; keep that, instead of a dead link.
    if (!real.has(target + '.html')) target = target.replace(/^[a-z]{2}\//, 'en/')
    if (!real.has(target + '.html')) continue
    const source = noExt(from)
    add(source + '.html', servedUrl(target))
    if (!isIndex(source)) add(source + '/index.html', servedUrl(target))
  }
  return plan
}

const escapeAttr = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** The page that sends a visitor on, keeping the `#anchor` they came with. */
export function redirectPage(to) {
  const safe = escapeAttr(to)
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${safe}">
<meta http-equiv="refresh" content="0; url=${safe}">
<script>location.replace(${JSON.stringify(to).replace(/</g, '\\u003c')} + location.hash)</script>
</head>
<body><p>This page has moved to <a href="${safe}">${safe}</a>.</p></body>
</html>
`
}
