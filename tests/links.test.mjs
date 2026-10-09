/**
 * Repairing dead links. Each case is a shape found in the real pages: a link
 * that names a page by its old MkDocs path, a sibling that only sat beside it in
 * the old layout, or a path with no language. A repaired link is an absolute
 * path to the page's final address; links that work are never touched.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { buildIndex, readConfigLinks, readRewritePairs, repairLink, repairLinks, resolves } from '../scripts/lib/links.mjs'

const PAIRS = [
  ['game/getting-started', 'get-started/index'],
  ['server/create-a-server', 'server-owners/host-a-server'],
  ['FAQ/player-faq', 'players/faq'],
  ['FAQ/Update-launcher', 'troubleshooting/launcher-update'],
]
const FILES = [
  'en/index.md',
  'en/game/getting-started.md', 'en/get-started/index.md',
  'en/server/create-a-server.md', 'en/server-owners/host-a-server.md', 'en/server-owners/error-codes.md',
  'en/FAQ/player-faq.md', 'en/players/faq.md', 'en/FAQ/game-faq.md',
  'en/FAQ/Update-launcher.md', 'en/troubleshooting/launcher-update.md',
  'de/FAQ/game-faq.md', 'de/support/game-faq.md', 'de/players/index.md', 'de/get-started/index.md',
]
const index = buildIndex(FILES, PAIRS, undefined, ['FAQ/game-faq'])

test('the config table of moved pages is read', () => {
  const config = "const legacyRewritePairs: Record<string, string> = {\n  'game/getting-started': 'get-started/index',\n  'FAQ/player-faq': 'players/faq'\n}\n"
  assert.deepEqual(readRewritePairs(config), [['game/getting-started', 'get-started/index'], ['FAQ/player-faq', 'players/faq']])
  assert.deepEqual(readRewritePairs('nothing here'), [])
})

test('the pages the sidebar links to are read, without the language or a trailing slash', () => {
  assert.deepEqual(readConfigLinks("{ link: '/FAQ/game-faq' }, { link: '/get-started/' }, { link: '/players/index' }"), ['FAQ/game-faq', 'get-started', 'players'])
})

test('links that work are left alone', () => {
  assert.equal(resolves('en/FAQ/player-faq.md', 'game-faq.md', index), true)
  assert.equal(resolves('en/FAQ/player-faq.md', './game-faq', index), true)
  assert.equal(resolves('en/FAQ/player-faq.md', '/en/FAQ/game-faq', index), true)
  assert.equal(repairLink('en/FAQ/player-faq.md', 'game-faq.md', index), null)
})

test('other sites, anchors and mail links are never touched', () => {
  for (const href of ['https://example.com/x', 'mailto:a@b.c', '#section', '//cdn.example/x', '<https://discord.com/channels/1/2>']) {
    assert.equal(repairLink('en/FAQ/player-faq.md', href, index), null, href)
  }
})

test('a link to a page by its old path points at where it moved, keeping the anchor', () => {
  assert.equal(repairLink('en/FAQ/game-faq.md', '../../game/getting-started.md#2b-linux-installation', index), '/en/get-started/#2b-linux-installation')
  assert.equal(repairLink('en/FAQ/game-faq.md', '../server/create-a-server/', index), '/en/server-owners/host-a-server')
})

test('a sibling link that only worked in the old folder is read in the old folder', () => {
  // en/server-owners/error-codes.md was server/error-codes.md; ./create-a-server sat beside it
  assert.equal(repairLink('en/server-owners/error-codes.md', './create-a-server', index), '/en/server-owners/host-a-server')
})

test('a sibling that exists only in the old folder is found there, even when its name is not unique', () => {
  const custom = buildIndex(['en/old/a.md', 'en/new/a.md', 'en/old/target.md', 'en/elsewhere/target.md'], [['old/a', 'new/a']], undefined, [])
  assert.equal(repairLink('en/new/a.md', './target', custom), '/en/old/target')
})

test('a path with no language gets the language of the page', () => {
  assert.equal(repairLink('en/index.md', '/game/getting-started#x', index), '/en/get-started/#x')
  assert.equal(repairLink('de/index.md'.replace('index', 'players/index'), '/game/getting-started', index), '/de/get-started/')
})

test('a moved page named by an old, different name is found', () => {
  assert.equal(repairLink('en/community/rules.md', '../../support/player-faq', index), '/en/players/faq')
})

test('a link ending in a slash is found by the name before the slash', () => {
  const custom = buildIndex(['en/FAQ/where.md', 'en/server-owners/cgnat.md'], [['FAQ/How-to-check-for-CGNAT', 'server-owners/cgnat']], undefined, [])
  assert.equal(repairLink('en/FAQ/where.md', '../How-to-check-for-CGNAT/', custom), '/en/server-owners/cgnat')
})

test('a name shared by two pages goes to the one the sidebar links to', () => {
  assert.equal(repairLink('de/players/index.md', 'game-faq.md', index), '/de/FAQ/game-faq')
})

test('a name shared by two pages with no clue is not guessed', () => {
  const ambiguous = buildIndex(FILES, PAIRS, undefined, [])
  assert.equal(repairLink('de/players/index.md', 'game-faq.md', ambiguous), null)
})

test('a link to a page that does not exist anywhere is left for a person', () => {
  assert.equal(repairLink('en/FAQ/player-faq.md', '../../FAQ/How-to-deactivate-mods.md', index), null)
})

test('the language is respected: a link never jumps to another language', () => {
  const only = buildIndex(['en/FAQ/game-faq.md', 'fr/index.md'], [], undefined, [])
  assert.equal(repairLink('fr/index.md', 'game-faq.md', only), null)
})

test('repairLinks fixes dead links in a page, counts them and lists the ones it could not fix', () => {
  const source = ['See [the guide](../../game/getting-started.md), [the FAQ](game-faq.md) and [missing](../../FAQ/How-to-deactivate-mods.md).', '', '[site](https://example.com)'].join('\n')
  const result = repairLinks(source, 'en/FAQ/player-faq.md', index)
  assert.equal(result.fixed, 1)
  assert.equal(result.text.split('\n')[0], 'See [the guide](/en/get-started/), [the FAQ](game-faq.md) and [missing](../../FAQ/How-to-deactivate-mods.md).')
  assert.deepEqual(result.unresolved, [{ line: 1, href: '../../FAQ/How-to-deactivate-mods.md' }])
})

test('links inside code, and images, are not changed', () => {
  const source = ['```md', '[x](../../game/getting-started.md)', '```', '', '![img](../../game/getting-started.md)'].join('\n')
  const result = repairLinks(source, 'en/FAQ/player-faq.md', index)
  assert.equal(result.fixed, 0)
  assert.equal(result.text, source)
})

test('a title after the link is kept', () => {
  const result = repairLinks('[a](../../game/getting-started.md "Start here")', 'en/FAQ/player-faq.md', index)
  assert.equal(result.text, '[a](/en/get-started/ "Start here")')
})

test('running it twice changes nothing the second time', () => {
  const once = repairLinks('[a](../../game/getting-started.md) [b](/game/getting-started)', 'en/FAQ/player-faq.md', index)
  const twice = repairLinks(once.text, 'en/FAQ/player-faq.md', index)
  assert.equal(twice.fixed, 0)
  assert.equal(twice.text, once.text)
})

test('windows line endings are kept', () => {
  const result = repairLinks('[a](../../game/getting-started.md)\r\nnext\r\n', 'en/FAQ/player-faq.md', index)
  assert.equal(result.text, '[a](/en/get-started/)\r\nnext\r\n')
})
