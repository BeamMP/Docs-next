#!/usr/bin/env node
/**
 * Repairs dead internal links (see lib/links.mjs).
 *
 *   node scripts/fix-links.mjs              show what would change (nothing is written)
 *   node scripts/fix-links.mjs --write      change the files
 *   node scripts/fix-links.mjs --unresolved list links no page could be found for
 *
 * Run `npm run check` afterwards: the dead-link count should drop, and
 * `npm run check:update-baseline` locks that in.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildIndex, readConfigLinks, readRewritePairs, repairLinks } from './lib/links.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(root, 'docs')
const argv = process.argv.slice(2)
const write = argv.includes('--write')
const showUnresolved = argv.includes('--unresolved')

const files = []
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!['.vitepress', 'node_modules', 'public'].includes(entry.name)) walk(full)
    } else if (entry.name.endsWith('.md')) files.push(full)
  }
}
walk(docsDir)
files.sort()

const rel = (file) => path.relative(docsDir, file).split(path.sep).join('/')
const config = fs.readFileSync(path.join(docsDir, '.vitepress', 'config.mts'), 'utf8')
const index = buildIndex(files.map(rel), readRewritePairs(config), undefined, readConfigLinks(config))

let pagesChanged = 0
let fixed = 0
const unresolved = []
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8')
  const result = repairLinks(source, rel(file), index)
  for (const item of result.unresolved) unresolved.push(`${rel(file)}:${item.line}  ${item.href}`)
  if (result.fixed) {
    pagesChanged++
    fixed += result.fixed
    if (write) fs.writeFileSync(file, result.text)
  }
}

console.log(`${write ? 'Repaired' : 'Would repair'} ${fixed} links on ${pagesChanged} pages.`)
console.log(`${unresolved.length} dead link(s) no page could be found for${showUnresolved ? ':' : ' (run with --unresolved to list them)'}`)
if (showUnresolved) for (const line of unresolved) console.log('  ' + line)
if (!write && fixed) console.log('\nNothing was written. Run again with --write to change the files.')
