#!/usr/bin/env node
/**
 * Converts pages from MkDocs Material syntax to VitePress syntax.
 *
 *   node scripts/convert-mkdocs.mjs                 show what would change (nothing is written)
 *   node scripts/convert-mkdocs.mjs --write         change the files
 *   node scripts/convert-mkdocs.mjs --only fr/      only pages whose path contains "fr/"
 *   node scripts/convert-mkdocs.mjs --review        list every note that needs a person to look
 *
 * See lib/convert.mjs for what is converted. Run `npm run check` afterwards: the
 * counts it reports should go down, and `npm run check:update-baseline` locks
 * that in.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { convertPage } from './lib/convert.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(root, 'docs')

const argv = process.argv.slice(2)
const write = argv.includes('--write')
const showReview = argv.includes('--review')
const onlyIndex = argv.indexOf('--only')
const only = onlyIndex >= 0 ? argv[onlyIndex + 1] : null

function listPages() {
  const pages = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (!['.vitepress', 'node_modules', 'public'].includes(entry.name)) walk(full)
      } else if (entry.name.endsWith('.md')) pages.push(full)
    }
  }
  walk(docsDir)
  return pages.sort()
}

const totals = {}
const reviews = []
let changedPages = 0
let scanned = 0

for (const file of listPages()) {
  const name = 'docs/' + path.relative(docsDir, file).split(path.sep).join('/')
  if (only && !name.includes(only)) continue
  scanned++
  const source = fs.readFileSync(file, 'utf8')
  const result = convertPage(source)
  for (const note of result.review) reviews.push(`${name}: ${note}`)
  if (!result.changed) continue
  changedPages++
  for (const [kind, count] of Object.entries(result.converted)) if (count) totals[kind] = (totals[kind] || 0) + count
  if (write) fs.writeFileSync(file, result.text)
}

console.log(`${write ? 'Converted' : 'Would convert'} ${changedPages} of ${scanned} pages.`)
for (const [kind, count] of Object.entries(totals)) console.log(`  ${kind.padEnd(14)} ${count}`)
if (reviews.length) {
  console.log(`\n${reviews.length} thing(s) to look at${showReview ? ':' : ' (run with --review to list them)'}`)
  if (showReview) for (const line of reviews) console.log('  ' + line)
}
if (!write && changedPages) console.log('\nNothing was written. Run again with --write to change the files.')
