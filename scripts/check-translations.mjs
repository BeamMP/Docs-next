#!/usr/bin/env node
/**
 * Shows which translations are out of date because the English page changed.
 *
 *   npm run check:translations                      list stale and unrecorded translations (exit 0)
 *   npm run check:translations -- --strict          exit 1 if there are any
 *   npm run check:translations -- --record          record every translation as up to date
 *   npm run check:translations -- --record en/players/faq.md de/players/faq.md
 *                                                   record these (en/... = every language, de/... = German)
 *
 * Record only after the translation was updated from the current English page. See lib/translations.mjs.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LOCALES, SOURCE_LOCALE, findDrift, hashPage, listPages, recordSources, sortManifest } from './lib/translations.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(root, 'docs')
const manifestPath = path.join(root, 'scripts', 'translation-sources.json')

const args = process.argv.slice(2)
const strict = args.includes('--strict')
const record = args.includes('--record')
const targetArgs = args.filter((arg) => !arg.startsWith('--'))

const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {}
const englishPages = listPages(docsDir, SOURCE_LOCALE)
const english = Object.fromEntries(englishPages.map((page) => [page, hashPage(docsDir, `${SOURCE_LOCALE}/${page}`)]))
const translations = Object.fromEntries(LOCALES.map((locale) => [locale, listPages(docsDir, locale)]))

if (record) {
  const targets = targetArgs.length
    ? targetArgs
    : englishPages.map((page) => `${SOURCE_LOCALE}/${page}`)
  const result = recordSources({ manifest, english, translations, targets })
  fs.writeFileSync(manifestPath, JSON.stringify(sortManifest(result.manifest), null, 2) + '\n')
  console.log(`Recorded ${result.recorded.length} translation(s) as up to date.`)
  process.exit(0)
}

const drift = findDrift({ manifest, english, translations })
const labels = {
  stale: 'Out of date (the English page changed after the translation was made)',
  unrecorded: 'Not recorded yet (run with --record once the translation is known to match the English)',
  missing: 'Missing (English page with no translation)',
  orphaned: 'No English page',
  removed: 'In the manifest but the page is gone',
}
let problems = 0
for (const [kind, list] of Object.entries(drift)) {
  if (!list.length) continue
  problems += list.length
  console.log(`\n${labels[kind]}: ${list.length}`)
  for (const item of list) console.log(`  ${item}`)
}
if (!problems) console.log(`All ${Object.values(translations).flat().length} translations match the current English.`)
else if (strict) process.exit(1)
