/**
 * Images and other files. VitePress only publishes what is under docs/public
 * (as it is) and what a page imports with a relative path. Anything else that a
 * page or the config points to builds without complaint and then 404s live, so
 * these check that every reference resolves, with the same upper and lower case
 * as on the Linux server that publishes it.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsExactCase, findMissingAssets, ownSiteAssetUrls } from '../scripts/lib/assets.mjs'
import { splitLines } from '../scripts/lib/checks.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(root, 'docs')

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'docs-assets-'))
}

test('ownSiteAssetUrls finds images, styles and scripts on the same site', () => {
  const html = '<img src="/assets/core/logo.png"><link href="/assets/style.abc.css" rel="stylesheet"><script src="/assets/app.js"></script>'
  assert.deepEqual(ownSiteAssetUrls(html).sort(), ['/assets/app.js', '/assets/core/logo.png', '/assets/style.abc.css'])
})

test('ownSiteAssetUrls ignores other sites, data URLs, page links and relative paths', () => {
  const html = '<img src="https://cdn.example/x.png"><img src="data:image/png;base64,AAAA"><a href="/en/server/page.html">p</a><img src="x.png">'
  assert.deepEqual(ownSiteAssetUrls(html), [])
})

test('ownSiteAssetUrls drops the query string and fragment, and decodes the name', () => {
  assert.deepEqual(ownSiteAssetUrls('<img src="/assets/a%20b.png?v=2#x">'), ['/assets/a b.png'])
})

test('existsExactCase wants the same case on every part of the path', () => {
  const dir = tempDir()
  fs.mkdirSync(path.join(dir, 'assets', 'core'), { recursive: true })
  fs.writeFileSync(path.join(dir, 'assets', 'core', 'Logo.png'), 'x')
  assert.equal(existsExactCase(dir, '/assets/core/Logo.png'), true)
  assert.equal(existsExactCase(dir, '/assets/core/logo.png'), false)
  assert.equal(existsExactCase(dir, '/Assets/core/Logo.png'), false)
  assert.equal(existsExactCase(dir, '/assets/core/missing.png'), false)
})

test('findMissingAssets reports an asset a built page asks for that is not in the build', () => {
  const dist = tempDir()
  fs.mkdirSync(path.join(dist, 'assets'), { recursive: true })
  fs.mkdirSync(path.join(dist, 'en'), { recursive: true })
  fs.writeFileSync(path.join(dist, 'assets', 'here.png'), 'x')
  fs.writeFileSync(path.join(dist, 'en', 'page.html'), '<img src="/assets/here.png"><img src="/assets/core/gone.png">')
  assert.deepEqual(findMissingAssets(dist), [{ page: 'en/page.html', url: '/assets/core/gone.png' }])
})

test('findMissingAssets finds nothing when every asset is there', () => {
  const dist = tempDir()
  fs.mkdirSync(path.join(dist, 'assets'), { recursive: true })
  fs.writeFileSync(path.join(dist, 'assets', 'a.png'), 'x')
  fs.writeFileSync(path.join(dist, 'index.html'), '<img src="/assets/a.png">')
  assert.deepEqual(findMissingAssets(dist), [])
})

// ---- the real pages ------------------------------------------------------

function pages(dir = docsDir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!['.vitepress', 'node_modules', 'public'].includes(entry.name)) pages(full, out)
    } else if (entry.name.endsWith('.md')) out.push(full)
  }
  return out
}

/** Images a page references, outside code: `![](url)` and `<img src>`. */
function imageUrls(source) {
  const prose = splitLines(source).filter((l) => !l.code).map((l) => l.text).join('\n')
  const urls = []
  for (const m of prose.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)>?[^)]*\)/g)) urls.push(m[1])
  for (const m of prose.matchAll(/<img[^>]+src=["']([^"']+)["']/g)) urls.push(m[1])
  return urls.map((u) => u.split('#')[0].split('?')[0]).filter((u) => u && !/^(?:[a-z]+:)?\/\//i.test(u) && !u.startsWith('data:'))
}

test('every image a page points to with a relative path exists, in exactly that case', () => {
  const missing = []
  for (const file of pages()) {
    for (const url of imageUrls(fs.readFileSync(file, 'utf8'))) {
      if (url.startsWith('/')) continue
      const target = path.relative(root, path.resolve(path.dirname(file), url)).split(path.sep).join('/')
      if (!existsExactCase(root, target)) missing.push(`${path.relative(docsDir, file)}: ${url}`)
    }
  }
  assert.deepEqual(missing, [])
})

test('every image a page, the theme or the config points to with a root path is in docs/public', () => {
  const missing = []
  const check = (where, url) => {
    if (!existsExactCase(path.join(docsDir, 'public'), url)) missing.push(`${where}: ${url}`)
  }
  for (const file of pages()) {
    const source = fs.readFileSync(file, 'utf8')
    for (const url of imageUrls(source)) if (url.startsWith('/')) check(path.relative(docsDir, file), url)
    const front = source.startsWith('---') ? source.split('\n---')[0] : ''
    for (const m of front.matchAll(/^\s*src:\s*["']?(\/[^\s"']+\.(?:png|jpe?g|svg|webp|ico|gif))["']?\s*$/gm)) check(path.relative(docsDir, file) + ' (front matter)', m[1])
  }
  const config = fs.readFileSync(path.join(docsDir, '.vitepress', 'config.mts'), 'utf8')
  for (const m of config.matchAll(/['"](\/[^'"\s]+\.(?:png|jpe?g|svg|webp|ico|gif))['"]/g)) check('.vitepress/config.mts', m[1])
  assert.deepEqual([...new Set(missing)], [])
})

test('the logos the header and home pages use are published', () => {
  for (const name of ['beammp_dark.png', 'beammp_light.png']) {
    assert.equal(fs.existsSync(path.join(docsDir, 'public', 'assets', 'core', name)), true, name)
  }
})
