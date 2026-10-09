/**
 * The theme shares its brand values with beammp.com, accounts.beammp.com and the forum theme.
 * These tests keep the pieces that make the docs read as the same site from drifting.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const themeDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', '.vitepress', 'theme')
const read = (name) => fs.readFileSync(path.join(themeDir, name), 'utf8')

test('the brand orange and corner radius match the other BeamMP sites', () => {
  const tokens = read('tokens.css')
  assert.match(tokens, /--beammp-orange:\s*#f36d24;/i)
  assert.match(tokens, /--radius:\s*0\.625rem;/)
})

test('the colours are the shared oklch set, and no stylesheet still reads them as hsl', () => {
  assert.match(read('tokens.css'), /--background:\s*oklch\(0\.13 0\.028 261\.692\)/)
  for (const file of ['custom.css', 'layout.css']) assert.doesNotMatch(read(file), /hsl\(var\(/, file)
})

test('the theme loads the tokens first and uses system fonts, not a bundled web font', () => {
  const index = read('index.ts')
  assert.ok(index.indexOf('tokens.css') < index.indexOf('custom.css') && index.indexOf('custom.css') < index.indexOf('layout.css'))
  assert.match(index, /vitepress\/theme-without-fonts/)
  assert.match(read('tokens.css'), /--vp-font-family-base:\s*ui-sans-serif, system-ui/)
})

test('the top menu is dropped below 1280px and the controls move into the "..." menu, so the switchers are never pushed off screen', () => {
  const css = read('layout.css')
  assert.match(css, /@media \(min-width: 768px\) and \(max-width: 1279px\) \{\s*\.VPNavBarMenu \{\s*display: none !important;/)
  assert.match(css, /@media \(min-width: 1280px\) and \(max-width: 1699px\) \{\s*\.VPNavBarExtra \{\s*display: block !important;/)
})

test('the repository is named in one place, site.ts, and nowhere else in the site', () => {
  const docs = path.join(themeDir, '..', '..')
  const found = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (!['dist', 'cache', 'node_modules', 'public'].includes(entry.name)) walk(full)
      } else if (/\.(md|mts|ts|vue|json)$/.test(entry.name) && entry.name !== 'site.ts') {
        const text = fs.readFileSync(full, 'utf8')
        if (/github\.com\/beammp\/docs/i.test(text) || /BeamMP\/Docs(-next)?(?![\w-])/.test(text)) found.push(path.relative(docs, full))
      }
    }
  }
  walk(docs)
  assert.deepEqual(found, [], 'write https://github.com/__repo__ or @repo@ instead, so site.ts is the only place to change')
  assert.match(fs.readFileSync(path.join(themeDir, '..', 'site.ts'), 'utf8'), /export const REPO = '[\w-]+\/[\w-]+'/)
})
