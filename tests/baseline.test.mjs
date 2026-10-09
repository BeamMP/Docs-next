/**
 * The ratchet: the baseline of known problems may only shrink. A page getting
 * worse fails the check, a page getting better is noted, and dead links are
 * read back out of a VitePress build's output.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { buildSnapshot, compareToBaseline, normalizePagePath, parseDeadLinks, parseRenderErrors, sortSnapshot, totalsByRule } from '../scripts/lib/baseline.mjs'

test('parseDeadLinks reads each dead link and the page it is on', () => {
  const output = [
    '(!) Found dead link ./game-faq in file /home/runner/work/Docs-next/Docs-next/docs/de/FAQ/player-faq.md',
    '(!) Found dead link ./../../game/getting-started in file /Users/me/Docs-next/Docs/de/FAQ/game-faq.md',
    'some other line',
  ].join('\n')
  assert.deepEqual(parseDeadLinks(output), [
    { link: './game-faq', file: 'docs/de/FAQ/player-faq.md' },
    { link: './../../game/getting-started', file: 'docs/de/FAQ/game-faq.md' },
  ])
})

test('parseDeadLinks ignores terminal colour codes', () => {
  assert.deepEqual(parseDeadLinks('\x1b[33m(!) Found dead link ./x in file /a/docs/en/p.md\x1b[0m'), [{ link: './x', file: 'docs/en/p.md' }])
})

test('parseDeadLinks finds nothing in a clean build', () => {
  assert.deepEqual(parseDeadLinks('build complete in 8.2s.'), [])
})

test('page paths are the same whether the folder is Docs or docs, and whatever the machine', () => {
  assert.equal(normalizePagePath('/Users/x/repo/Docs/en/a.md'), 'docs/en/a.md')
  assert.equal(normalizePagePath('/home/runner/repo/docs/en/a.md'), 'docs/en/a.md')
  assert.equal(normalizePagePath('C:\\repo\\docs\\en\\a.md'), 'docs/en/a.md')
  assert.equal(normalizePagePath('docs/en/a.md'), 'docs/en/a.md')
})

test('a page path relative to the docs folder gets the docs/ prefix', () => {
  assert.equal(normalizePagePath('en/server/a.md'), 'docs/en/server/a.md')
  assert.equal(normalizePagePath('./en/a.md'), 'docs/en/a.md')
})

const PAGES = ['docs/zh/game-documentation/snippets/imgui-snippets.md', 'docs/en/server/create-a-server.md']

test('a rendering error is matched back to its page by the temporary file name', () => {
  const output = [
    'Error: [vitepress-plugin-tabs] TabsSingleState should be injected',
    '    at useTabsSingleState (file:///app/node_modules/vitepress-plugin-tabs/dist/client/ssr/index.js:97:26)',
    '    at _sfc_ssrRender (file:///app/docs/.vitepress/.temp/zh_game-documentation_snippets_imgui-snippets.md.js:236:9)',
    'Error: [vitepress-plugin-tabs] TabsSingleState should be injected',
    '    at _sfc_ssrRender (file:///app/docs/.vitepress/.temp/en_server_create-a-server.md.js:10:9)',
    '',
  ].join('\n')
  assert.deepEqual(parseRenderErrors(output, PAGES), [
    { file: 'docs/zh/game-documentation/snippets/imgui-snippets.md', message: '[vitepress-plugin-tabs] TabsSingleState should be injected' },
    { file: 'docs/en/server/create-a-server.md', message: '[vitepress-plugin-tabs] TabsSingleState should be injected' },
  ])
})

test('a rendering error that cannot be matched to a page is still counted', () => {
  assert.deepEqual(parseRenderErrors('Error: boom\n    at somewhere (file:///x.js:1:1)\n', PAGES), [{ file: '(unknown page)', message: 'boom' }])
})

test('"build error" and warnings are not rendering errors', () => {
  assert.deepEqual(parseRenderErrors('build error:\nCannot read properties\n(!) Some chunks are larger\n', PAGES), [])
})

test('buildSnapshot counts rendering errors per page', () => {
  assert.deepEqual(buildSnapshot({}, [], [{ file: 'docs/a.md' }, { file: 'docs/a.md' }]), { 'docs/a.md': { 'render-error': 2 } })
})

test('buildSnapshot keeps only pages with problems, and counts dead links per page', () => {
  const snapshot = buildSnapshot({ 'docs/a.md': { 'mkdocs-icon': 2 }, 'docs/b.md': {} }, [
    { file: 'docs/a.md', link: './x' },
    { file: 'docs/a.md', link: './y' },
    { file: 'docs/c.md', link: './z' },
  ])
  assert.deepEqual(snapshot, {
    'docs/a.md': { 'dead-link': 2, 'mkdocs-icon': 2 },
    'docs/c.md': { 'dead-link': 1 },
  })
})

test('a snapshot is written in a stable order, so saving it twice makes no diff', () => {
  const sorted = sortSnapshot({ 'docs/b.md': { z: 1, a: 2 }, 'docs/a.md': { m: 3 } })
  assert.deepEqual(Object.keys(sorted), ['docs/a.md', 'docs/b.md'])
  assert.deepEqual(Object.keys(sorted['docs/b.md']), ['a', 'z'])
})

test('more of a problem than the baseline allows is worse', () => {
  const { worse, better } = compareToBaseline({ 'docs/a.md': { r: 3 } }, { 'docs/a.md': { r: 2 } })
  assert.deepEqual(worse, [{ file: 'docs/a.md', rule: 'r', was: 2, now: 3 }])
  assert.deepEqual(better, [])
})

test('a new problem on a page, or a problem on a new page, is worse', () => {
  assert.equal(compareToBaseline({ 'docs/a.md': { r: 1, s: 1 } }, { 'docs/a.md': { r: 1 } }).worse.length, 1)
  assert.equal(compareToBaseline({ 'docs/new.md': { r: 1 } }, {}).worse.length, 1)
})

test('fewer problems than the baseline is better, and never fails', () => {
  const { worse, better } = compareToBaseline({ 'docs/a.md': { r: 1 } }, { 'docs/a.md': { r: 4 }, 'docs/gone.md': { r: 2 } })
  assert.deepEqual(worse, [])
  assert.deepEqual(better, [
    { file: 'docs/a.md', rule: 'r', was: 4, now: 1 },
    { file: 'docs/gone.md', rule: 'r', was: 2, now: 0 },
  ])
})

test('the same problems as the baseline is neither', () => {
  assert.deepEqual(compareToBaseline({ 'docs/a.md': { r: 2 } }, { 'docs/a.md': { r: 2 } }), { worse: [], better: [] })
})

test('totalsByRule adds up occurrences and the pages they are on', () => {
  assert.deepEqual(totalsByRule({ 'docs/a.md': { r: 2, s: 1 }, 'docs/b.md': { r: 3 } }), {
    r: { count: 5, pages: 2 },
    s: { count: 1, pages: 1 },
  })
})
