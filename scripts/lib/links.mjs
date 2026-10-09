/**
 * Repairs internal links that point at a page that is not there.
 *
 * The pages were written for MkDocs and later copied into a new folder layout,
 * so many links name a page by its OLD path (`../../FAQ/Update-launcher.md`), or
 * by a sibling (`./create-a-server`) that only sat beside it in the old layout.
 * The config's table of where pages moved says where each one went. A repaired
 * link is written as an absolute path to the page's final address
 * (`/en/troubleshooting/launcher-update`), which does not depend on the folder
 * the linking page is in, so it stays right if pages are moved again.
 *
 * Only links that are dead now are touched. Nothing here reads the file system.
 */

import { splitLines } from './checks.mjs'

/** `[['game/getting-started', 'get-started/index'], ...]` from the config text. */
export function readRewritePairs(configText) {
  const start = configText.indexOf('const movedPages')
  if (start < 0) return []
  const rest = configText.slice(start)
  const block = rest.slice(0, rest.indexOf('\n}\n'))
  return [...block.matchAll(/'([^']+)':\s*'([^']+)'/g)].map((m) => [m[1], m[2]])
}

/** `docs/en/x/y.md` or `en/x/y.md` -> `en/x/y`; `en/x/index.md` -> `en/x/index`. */
export const pagePath = (file) => String(file).replace(/^docs\//, '').replace(/\.md$/, '')

/** Page paths the sidebar and nav link to, without the language: `link: '/FAQ/game-faq'` -> `FAQ/game-faq`. */
export function readConfigLinks(configText) {
  return [...configText.matchAll(/link:\s*'\/([^']+)'/g)].map((m) => m[1].replace(/\/$/, '').replace(/\/index$/, ''))
}

export function buildIndex(pageFiles, rewritePairs, locales = ['en', 'de', 'es', 'fr', 'it', 'ru', 'zh'], preferred = []) {
  const pages = new Set(pageFiles.map(pagePath))
  const legacyToNew = new Map(rewritePairs)
  const newToLegacy = new Map(rewritePairs.map(([a, b]) => [b, a]))
  const byName = new Map()
  for (const page of pages) {
    const name = page.split('/').pop()
    if (!byName.has(name)) byName.set(name, [])
    byName.get(name).push(page)
  }
  // The address each page is served at: a page named in the rewrites is served at its new path.
  const servedPath = (page) => {
    const locale = locales.find((l) => page.startsWith(l + '/'))
    if (!locale) return page
    const next = legacyToNew.get(page.slice(locale.length + 1))
    return next ? `${locale}/${next}` : page
  }
  const served = new Set([...pages].map(servedPath))
  return { pages, served, servedPath, legacyToNew, newToLegacy, byName, locales, preferred: new Set(preferred) }
}

const isExternal = (href) => /^<?(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)

function splitHref(href) {
  const m = href.match(/^([^?#]*)([?#].*)?$/)
  return { path: m[1], suffix: m[2] || '' }
}

/** The page a link path names, the way VitePress reads it: no extension, a trailing slash means index. */
function normalize(pathPart) {
  let p = pathPart.replace(/\.(html|md)$/, '')
  if (p.endsWith('/')) p += 'index'
  return p
}

function resolveRelative(fromDir, relative) {
  const parts = fromDir ? fromDir.split('/') : []
  for (const seg of relative.split('/')) {
    if (seg === '' || seg === '.') continue
    if (seg === '..') parts.pop()
    else parts.push(seg)
  }
  return parts.join('/')
}

/**
 * Does VitePress find a page for this link? Same reading as its own dead link check:
 * a relative link is read from where the linking page is served, which is not where
 * its file is when the config rewrites it.
 */
export function resolves(fileRel, href, index) {
  if (isExternal(href)) return true
  const { path } = splitHref(href)
  if (!path) return true
  const url = normalize(path)
  const servedFrom = index.servedPath(pagePath(fileRel))
  const target = url.startsWith('/') ? url.slice(1) : resolveRelative(servedFrom.split('/').slice(0, -1).join('/'), url)
  return index.served.has(target) || /\.(png|jpe?g|gif|svg|webp|ico|css|js|json|pdf|zip|exe)$/i.test(path)
}

const toHref = (pageRel, suffix) => '/' + pageRel.replace(/\/index$/, '/').replace(/^index$/, '') + suffix

/**
 * A repaired href for a dead link on page `fileRel` (`en/server/create-a-server.md`),
 * or null if no page can be worked out. Candidates are tried in order; the first
 * that names a real page wins:
 *  1. read as written, in the folder of the page
 *  2. read in the folder of the page's OLD location (it was copied from there)
 *  3. read from the language's root, for links written with the folder first
 *  4. the one page anywhere in this language with that name
 * and then a page that moved is replaced by where it went.
 */
export function repairLink(fileRel, href, index) {
  if (isExternal(href) || resolves(fileRel, href, index)) return null
  const { path, suffix } = splitHref(href)
  const locale = fileRel.split('/')[0]
  const here = pagePath(fileRel)
  const withoutLocale = here.slice(locale.length + 1)
  const dir = here.split('/').slice(0, -1).join('/')

  const legacyOfHere = index.newToLegacy.get(withoutLocale)
  const legacyDir = legacyOfHere ? `${locale}/${legacyOfHere}`.split('/').slice(0, -1).join('/') : null

  let url = normalize(path)
  const absolute = url.startsWith('/')
  if (absolute) url = url.slice(1)

  const candidates = []
  if (absolute) {
    candidates.push(url)
    if (!index.locales.includes(url.split('/')[0])) candidates.push(`${locale}/${url}`)
  } else {
    candidates.push(resolveRelative(dir, url))
    if (legacyDir !== null) candidates.push(resolveRelative(legacyDir, url))
    // `../../FAQ/x` from a page two folders down climbs out of the language folder: take the part after the climb.
    const stripped = url.replace(/^(?:\.\.?\/)+/, '')
    candidates.push(`${locale}/${stripped}`)
  }

  const moved = (page) => index.servedPath(page)

  for (const candidate of candidates) {
    if (index.pages.has(candidate)) return toHref(moved(candidate), suffix)
    if (index.pages.has(candidate + '/index')) return toHref(moved(candidate + '/index'), suffix)
    if (index.served.has(candidate)) return toHref(candidate, suffix)
    if (index.served.has(candidate + '/index')) return toHref(candidate + '/index', suffix)
  }

  // A moved page, named by its old path, whose old file no longer exists.
  for (const candidate of candidates) {
    const withoutLoc = candidate.startsWith(locale + '/') ? candidate.slice(locale.length + 1) : candidate
    const next = index.legacyToNew.get(withoutLoc) || index.legacyToNew.get(withoutLoc.replace(/\/index$/, ''))
    if (next && index.served.has(`${locale}/${next}`)) return toHref(`${locale}/${next}`, suffix)
  }

  // A moved page named by the name it had: `.../player-faq` is now `players/faq`. (A trailing
  // slash made `url` end in `/index`, which is not the page's name.)
  const name = path.replace(/[?#].*$/, '').split('/').filter(Boolean).pop()?.replace(/\.(html|md)$/, '')
  if (name) {
    const oldNames = [...index.legacyToNew].filter(([legacy]) => legacy.split('/').pop() === name)
    const live = oldNames.map(([, next]) => `${locale}/${next}`).filter((page) => index.served.has(page))
    if (live.length === 1) return toHref(live[0], suffix)
  }

  // The only page in this language with that name.
  if (name) {
    const matches = (index.byName.get(name) || []).filter((page) => page.startsWith(locale + '/'))
    if (matches.length === 1) return toHref(moved(matches[0]), suffix)
    // Several pages share the name: the one the sidebar links to is the real one.
    const linked = matches.filter((page) => index.preferred.has(page.slice(locale.length + 1)))
    if (linked.length === 1) return toHref(moved(linked[0]), suffix)
  }
  return null
}

/**
 * Repairs the dead links on one page. Returns `{ text, fixed, unresolved }`.
 * Links in code, images and other sites are left alone.
 */
export function repairLinks(source, fileRel, index) {
  const marked = splitLines(source)
  const unresolved = []
  let fixed = 0
  const out = marked.map(({ text, code, line }) => {
    if (code) return text
    return text.replace(/(?<!!)(\[[^\]]*\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g, (all, open, href, close) => {
      if (isExternal(href) || resolves(fileRel, href, index)) return all
      const repaired = repairLink(fileRel, href, index)
      if (repaired === null) {
        unresolved.push({ line, href })
        return all
      }
      fixed++
      return open + repaired + close
    })
  })
  const eol = source.includes('\r\n') ? '\r\n' : '\n'
  return { text: out.join('\n').replace(/\n/g, eol), fixed, unresolved }
}
