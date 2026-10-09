#!/usr/bin/env node
/**
 * Checks the documentation for problems left over from the move to VitePress.
 *
 *   npm run check                    run every check, fail if anything got worse
 *   npm run check -- --no-links      skip the dead-link build (quicker)
 *   npm run check -- --verbose       list each new problem with its line
 *   npm run check:update-baseline    save today's problems as the new baseline
 *
 * What it checks, per page:
 *   - MkDocs syntax that VitePress does not understand, and `:::` boxes that are
 *     left open (see lib/checks.mjs for the full list)
 *   - that the page compiles to valid Vue code (a page that does not breaks the
 *     whole build)
 * and across the site:
 *   - dead links, and errors VitePress prints while rendering pages (they do not
 *     fail the build, so they would otherwise go unnoticed), from one build
 *
 * Known problems are kept in scripts/docs-check-baseline.json. The check fails
 * only when a page gets worse than its baseline; see lib/baseline.mjs.
 */

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { RULES, countByRule, findProblems } from './lib/checks.mjs'
import { findMissingAssets } from './lib/assets.mjs'
import { findMissingOldAddresses, readOldAddresses } from './lib/oldaddresses.mjs'
import { buildSnapshot, compareToBaseline, parseDeadLinks, parseRenderErrors, sortSnapshot, totalsByRule } from './lib/baseline.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(root, 'docs')
const baselinePath = path.join(root, 'scripts', 'docs-check-baseline.json')

const args = new Set(process.argv.slice(2))
const updateBaseline = args.has('--update-baseline')
const skipLinks = args.has('--no-links')
const verbose = args.has('--verbose')

const EXTRA_RULES = {
  'does-not-compile': 'The page does not compile to valid Vue code, which breaks the whole build.',
  'dead-link': 'A link to a page that does not exist.',
  'render-error': 'VitePress printed an error while rendering the page, so part of it will not show.',
  'missing-asset': 'The built page asks for an image, stylesheet or script that is not in the build, so it 404s on the live site.',
}

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

const pageName = (file) => 'docs/' + path.relative(docsDir, file).split(path.sep).join('/')

/** Renders each page the way VitePress does and parses the Vue code it becomes. */
async function compileFailures(pages) {
  const requireFromRepo = createRequire(path.join(root, 'package.json'))
  const { resolveConfig, createMarkdownRenderer } = await import('vitepress')
  const { compileTemplate } = requireFromRepo('@vue/compiler-sfc')
  const config = await resolveConfig(docsDir)
  const md = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base, config.logger)

  const failures = {}
  for (const file of pages) {
    try {
      const html = md.render(fs.readFileSync(file, 'utf8'), { path: file, relativePath: path.relative(docsDir, file), cleanUrls: false })
      const out = compileTemplate({ source: `<template>${html}</template>`, filename: file, id: 'check', compilerOptions: { prefixIdentifiers: true } })
      if (out.errors.length) throw new Error(String(out.errors[0].message || out.errors[0]))
      // Parsing only (nothing runs): is the generated render function valid JavaScript?
      const code = out.code.split('\n').filter((line) => !/^\s*import\s/.test(line)).join('\n').replace(/export\s+function/g, 'function')
      new Function(code)
    } catch (error) {
      failures[pageName(file)] = String(error.message || error).split('\n')[0].slice(0, 160)
    }
  }
  return failures
}

/**
 * One VitePress build that lists every dead link (without failing on them) and
 * goes on to render every page, so both kinds of problem come from one run.
 */
function buildReport() {
  const result = spawnSync('npx', ['vitepress', 'build', 'docs'], {
    cwd: root,
    env: { ...process.env, DOCS_REPORT_LINKS: '1' },
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  })
  const output = `${result.stdout || ''}\n${result.stderr || ''}`
  return { output, failed: result.status !== 0 }
}

// On a case-insensitive disk (macOS, Windows) a folder called "Docs" still opens
// as "docs", but VitePress then reports links as dead that CI does not, so the
// results would not match. Say so instead of giving misleading numbers.
if (!fs.readdirSync(root).includes('docs')) {
  console.error('The docs folder is called "' + fs.readdirSync(root).find((name) => name.toLowerCase() === 'docs') + '" on disk, but git and the config call it "docs".')
  console.error('Rename it to "docs" (on macOS: mv Docs docs__tmp && mv docs__tmp docs) so the results match CI.')
  process.exit(1)
}

const pages = listPages()
console.log(`Checking ${pages.length} pages...`)

const pageCounts = {}
const details = {}
for (const file of pages) {
  const problems = findProblems(fs.readFileSync(file, 'utf8'))
  if (problems.length) {
    pageCounts[pageName(file)] = countByRule(problems)
    details[pageName(file)] = problems
  }
}

const failures = await compileFailures(pages)
for (const [file, message] of Object.entries(failures)) {
  pageCounts[file] = { ...(pageCounts[file] || {}), 'does-not-compile': 1 }
  details[file] = [...(details[file] || []), { rule: 'does-not-compile', line: 0, message }]
}

let links = []
let renderErrors = []
let missingAssets = []
let missingOldAddresses = []
if (!skipLinks) {
  console.log('Building the site to find dead links and rendering errors...')
  const build = buildReport()
  // A build that fails must not be mistaken for a clean one.
  if (build.failed) {
    console.error('\nThe build failed:\n')
    console.error(build.output.replace(/\x1b\[[0-9;]*m/g, '').split('\n').slice(-25).join('\n'))
    process.exit(1)
  }
  links = parseDeadLinks(build.output)
  renderErrors = parseRenderErrors(build.output, pages.map(pageName))
  missingAssets = findMissingAssets(path.join(docsDir, '.vitepress', 'dist')).map(({ page, url }) => ({ file: 'docs/' + page.replace(/\.html$/, '.md'), url }))
  missingOldAddresses = findMissingOldAddresses(path.join(docsDir, '.vitepress', 'dist'), readOldAddresses(path.join(root, 'scripts', 'old-addresses.txt')))
}

if (missingOldAddresses.length) {
  console.error(`\n${missingOldAddresses.length} address(es) of the live MkDocs site lead nowhere in this build:\n`)
  for (const address of missingOldAddresses.slice(0, 40)) console.error('  ' + address)
  console.error('\nAdd the page to movedPages in docs/.vitepress/config.mts so its old address redirects.')
  process.exit(1)
}

const current = buildSnapshot(pageCounts, links, renderErrors, missingAssets)

if (updateBaseline) {
  // With --no-links the dead links and render errors are not known, so keep the ones already saved.
  let snapshot = current
  if (skipLinks && fs.existsSync(baselinePath)) {
    const old = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
    snapshot = JSON.parse(JSON.stringify(current))
    for (const [file, counts] of Object.entries(old)) {
      for (const rule of ['dead-link', 'render-error', 'missing-asset']) {
        if (counts[rule]) {
          snapshot[file] = snapshot[file] || {}
          snapshot[file][rule] = counts[rule]
        }
      }
    }
    snapshot = sortSnapshot(snapshot)
  }
  fs.writeFileSync(baselinePath, JSON.stringify(snapshot, null, 1) + '\n')
  console.log(`\nBaseline saved: ${Object.keys(snapshot).length} pages with known problems.`)
  process.exit(0)
}

const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')) : {}
let { worse, better } = compareToBaseline(current, baseline)
if (skipLinks) {
  // The build was skipped, so dead links and render errors cannot count as better or worse.
  worse = worse.filter((entry) => !['dead-link', 'render-error', 'missing-asset'].includes(entry.rule))
  better = better.filter((entry) => !['dead-link', 'render-error', 'missing-asset'].includes(entry.rule))
}

console.log('\nProblems found, by kind:')
const totals = totalsByRule(current)
for (const rule of Object.keys(totals).sort((a, b) => totals[b].count - totals[a].count)) {
  console.log(`  ${rule.padEnd(24)} ${String(totals[rule].count).padStart(5)} in ${String(totals[rule].pages).padStart(3)} pages`)
}
if (!Object.keys(totals).length) console.log('  none')

if (better.length) {
  console.log(`\n${better.length} problem(s) are fixed compared with the baseline. Run "npm run check:update-baseline" to lock that in.`)
}

if (worse.length) {
  console.log(`\nFAILED: ${worse.length} problem(s) are new or worse than the baseline:\n`)
  for (const entry of worse.slice(0, 60)) {
    const what = RULES[entry.rule] || EXTRA_RULES[entry.rule] || ''
    console.log(`  ${entry.file}  ${entry.rule}: ${entry.was} -> ${entry.now}`)
    if (what) console.log(`      ${what}`)
    if (verbose) {
      const lines = (details[entry.file] || []).filter((p) => p.rule === entry.rule).map((p) => p.line || p.message)
      if (lines.length) console.log(`      lines: ${lines.slice(0, 12).join(', ')}`)
    }
  }
  if (worse.length > 60) console.log(`  ... and ${worse.length - 60} more`)
  console.log('\nFix them, or if a problem is expected, run "npm run check:update-baseline" and commit the result.')
  process.exit(1)
}

console.log('\nOK: nothing is worse than the baseline.')
