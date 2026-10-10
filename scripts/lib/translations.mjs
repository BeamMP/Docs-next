/**
 * English is the master; the other languages follow it. A translation goes out of date the moment the
 * English page changes, and nothing in git says so. This records, for every translated page, a hash of
 * the English page it was translated from (scripts/translation-sources.json), so a changed English page
 * shows which translations to redo.
 *
 * The hash covers the page and the shared parts it includes (`<!--@include: ./_parts/x.md-->`), because
 * a change to a shared part changes every page that shows it.
 */

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export const SOURCE_LOCALE = 'en'
export const LOCALES = ['de', 'es', 'fr', 'it', 'ru', 'zh']

const INCLUDE = /<!--@include:\s*([^\s>]+?)\s*-->/g

/** Same text on every platform, and no difference for trailing spaces. */
function normalise(text) {
  return text.replace(/\r\n/g, '\n').split('\n').map((line) => line.trimEnd()).join('\n').trim()
}

/** The page with its includes put in, so one hash covers everything the reader sees. */
export function expandIncludes(file, read = (f) => fs.readFileSync(f, 'utf8'), seen = new Set()) {
  if (seen.has(file)) return ''
  seen.add(file)
  return read(file).replace(INCLUDE, (match, target) => {
    const included = path.resolve(path.dirname(file), target)
    try {
      return expandIncludes(included, read, new Set(seen))
    } catch {
      return match
    }
  })
}

export function hashText(text) {
  return crypto.createHash('sha256').update(normalise(text)).digest('hex').slice(0, 12)
}

export function hashPage(docsDir, relativePath, read) {
  return hashText(expandIncludes(path.join(docsDir, relativePath), read))
}

/** Every page under docs/<locale>, as a path relative to that folder. */
export function listPages(docsDir, locale) {
  const base = path.join(docsDir, locale)
  const pages = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith('.md')) pages.push(path.relative(base, full).split(path.sep).join('/'))
    }
  }
  if (fs.existsSync(base)) walk(base)
  return pages.sort()
}

/**
 * Compare the manifest with the pages on disk.
 *   stale       the English page changed after this translation was made
 *   unrecorded  a translation with no entry in the manifest
 *   missing     an English page the language does not have
 *   orphaned    a translation with no English page
 *   removed     a manifest entry for a translation that no longer exists
 */
export function findDrift({ manifest, english, translations }) {
  const result = { stale: [], unrecorded: [], missing: [], orphaned: [], removed: [] }
  for (const locale of Object.keys(translations)) {
    const have = new Set(translations[locale])
    for (const page of Object.keys(english)) {
      if (!have.has(page)) result.missing.push(`${locale}/${page}`)
    }
    for (const page of have) {
      const key = `${locale}/${page}`
      if (!(page in english)) result.orphaned.push(key)
      else if (!(key in manifest)) result.unrecorded.push(key)
      else if (manifest[key] !== english[page]) result.stale.push(key)
    }
  }
  const existing = new Set(Object.entries(translations).flatMap(([locale, pages]) => pages.map((p) => `${locale}/${p}`)))
  for (const key of Object.keys(manifest)) if (!existing.has(key)) result.removed.push(key)
  for (const list of Object.values(result)) list.sort()
  return result
}

export function sortManifest(manifest) {
  return Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
}

/**
 * Record that translations were made from the current English. `targets` are paths under docs/:
 * `en/players/faq.md` records every language that has the page, `de/players/faq.md` only German.
 */
export function recordSources({ manifest, english, translations, targets }) {
  const next = { ...manifest }
  const recorded = []
  for (const target of targets) {
    const [first, ...rest] = target.split('/')
    const page = rest.join('/')
    const locales = first === SOURCE_LOCALE ? Object.keys(translations) : [first]
    for (const locale of locales) {
      if (!(page in english) || !translations[locale]?.includes(page)) continue
      next[`${locale}/${page}`] = english[page]
      recorded.push(`${locale}/${page}`)
    }
  }
  return { manifest: sortManifest(next), recorded }
}
