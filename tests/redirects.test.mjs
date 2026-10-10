/**
 * Redirects from the old MkDocs addresses: what gets one, and what never does.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { englishRootPlan, redirectPage, redirectPlan, servedUrl } from '../scripts/lib/redirects.mjs'

const PAGES = [
  'en/index.md',
  'en/FAQ/game-faq.md',
  'en/get-started/index.md',
  'en/server-owners/host-a-server.md',
  'en/players/index.md',
  'en/developers/index.md',
  'en/server-owners/error-codes.md',
]
const MOVED = {
  'en/server/create-a-server.md': 'en/server-owners/host-a-server.md',
  'en/game/getting-started.md': 'en/get-started/index.md',
  'en/guides/index.md': 'en/developers/index.md',
  'en/API documentation/Server-Side.md': 'en/missing/page.md',
}
const plan = redirectPlan(PAGES, MOVED)

test('a page is served at .html, an index page at its folder', () => {
  assert.equal(servedUrl('en/players/faq'), '/en/players/faq.html')
  assert.equal(servedUrl('en/get-started/index'), '/en/get-started/')
  assert.equal(servedUrl('en/index'), '/en/')
})

test('MkDocs ended every address in a slash, so that sends the visitor on', () => {
  assert.equal(plan.get('en/FAQ/game-faq/index.html'), '/en/FAQ/game-faq.html')
  assert.equal(plan.get('en/server-owners/error-codes/index.html'), '/en/server-owners/error-codes.html')
})

test('a page that moved is reachable at its old address, with or without the slash', () => {
  assert.equal(plan.get('en/server/create-a-server/index.html'), '/en/server-owners/host-a-server.html')
  assert.equal(plan.get('en/server/create-a-server.html'), '/en/server-owners/host-a-server.html')
  assert.equal(plan.get('en/game/getting-started/index.html'), '/en/get-started/')
  assert.equal(plan.get('en/guides/index.html'), '/en/developers/')
})

test('an old address is never sent to a page that does not exist', () => {
  assert.equal(plan.has('en/API documentation/Server-Side.html'), false)
  assert.equal(plan.has('en/API documentation/Server-Side/index.html'), false)
})

test('an old address of a page not translated yet goes to the English page', () => {
  const p = redirectPlan(['en/server-owners/setup-vps.md'], { 'de/server/setup-vps.md': 'de/server-owners/setup-vps.md' })
  assert.equal(p.get('de/server/setup-vps/index.html'), '/en/server-owners/setup-vps.html')
})

test('index pages already live at their folder, so they need no slash redirect', () => {
  assert.equal(plan.has('en/players/index/index.html'), false)
  assert.equal(plan.has('en/players/index.html'), false)
})

test('a page that really exists is never replaced by a redirect', () => {
  const clash = redirectPlan(['en/a.md', 'en/b.md'], { 'en/a.md': 'en/b.md' })
  assert.equal(clash.has('en/a.html'), false)
})

test('the redirect page keeps the anchor and escapes the address', () => {
  const html = redirectPage('/en/x.html')
  assert.match(html, /location\.replace\(\(a\[h\] \|\| "\/en\/x\.html"\) \+ h\)/)
  assert.match(html, /var h = location\.hash/)
  assert.match(html, /<link rel="canonical" href="\/en\/x\.html">/)
  assert.doesNotMatch(redirectPage('/a"><script>'), /"><script>/)
})

test('a section that moved to another page than the rest of its old page is sent there by its anchor', () => {
  const html = redirectPage('/en/server-owners/configuration.html')
  assert.match(html, /"#updating-the-server":"\/en\/server-owners\/maintenance\.html"/)
  assert.match(redirectPage('/de/server-owners/configuration.html'), /a = \{\}/, 'only English has the anchor the server prints')
  assert.match(redirectPage('/en/x.html', { '#a': '/en/y.html' }), /"#a":"\/en\/y\.html"/)
})

test('an old English address, which had no language folder, gets a redirect page at that same address', () => {
  const plan = englishRootPlan(['/server/create-a-server/', '/community/rules/', '/community/', '/de/server/create-a-server/', '/gone/page/', '/'], ['en/server-owners/host-a-server.md', 'en/community/rules.md', 'en/community/index.md'], { 'en/server/create-a-server.md': 'en/server-owners/host-a-server.md' })
  assert.equal(plan.get('server/create-a-server/index.html'), '/en/server-owners/host-a-server.html')
  assert.equal(plan.get('community/rules/index.html'), '/en/community/rules.html')
  assert.equal(plan.get('community/index.html'), '/en/community/')
  assert.equal(plan.size, 3, 'a translated address, a page that does not exist and the root are left alone')
})

test('an old English folder address is answered by the index page that moved', () => {
  const plan = englishRootPlan(['/guides/'], ['en/developers/index.md'], { 'en/guides/index.md': 'en/developers/index.md' })
  assert.equal(plan.get('guides/index.html'), '/en/developers/')
})
