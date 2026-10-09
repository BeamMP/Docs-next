/**
 * Redirects from the old MkDocs addresses: what gets one, and what never does.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { redirectPage, redirectPlan, servedUrl } from '../scripts/lib/redirects.mjs'

const PAGES = [
  'en/index.md',
  'en/FAQ/game-faq.md',
  'en/server/create-a-server.md',
  'en/game/getting-started.md',
  'en/players/index.md',
  'en/guides/index.md',
  'en/server-owners/error-codes.md',
]
const REWRITES = {
  'en/server/create-a-server.md': 'en/server-owners/host-a-server.md',
  'en/game/getting-started.md': 'en/get-started/index.md',
  'en/guides/index.md': 'en/developers/index.md',
}
const plan = redirectPlan(PAGES, REWRITES)

test('a page is served at .html, an index page at its folder', () => {
  assert.equal(servedUrl('en/players/faq'), '/en/players/faq.html')
  assert.equal(servedUrl('en/get-started/index'), '/en/get-started/')
  assert.equal(servedUrl('en/index'), '/en/')
})

test('MkDocs ended every address in a slash, so that sends the visitor on', () => {
  assert.equal(plan.get('en/FAQ/game-faq/index.html'), '/en/FAQ/game-faq.html')
  assert.equal(plan.get('en/server-owners/error-codes/index.html'), '/en/server-owners/error-codes.html')
})

test('a page the config moved is reachable at its old address, with or without the slash', () => {
  assert.equal(plan.get('en/server/create-a-server/index.html'), '/en/server-owners/host-a-server.html')
  assert.equal(plan.get('en/server/create-a-server.html'), '/en/server-owners/host-a-server.html')
  assert.equal(plan.get('en/game/getting-started/index.html'), '/en/get-started/')
  assert.equal(plan.get('en/guides/index.html'), '/en/developers/')
})

test('index pages already live at their folder, so they need no slash redirect', () => {
  assert.equal(plan.has('en/players/index/index.html'), false)
  assert.equal(plan.has('en/players/index.html'), false)
})

test('a page that really exists is never replaced by a redirect', () => {
  const clash = redirectPlan(['en/a.md', 'en/b.md'], { 'en/b.md': 'en/a.md' })
  assert.equal(clash.has('en/a.html'), false)
})

test('the redirect page keeps the anchor and escapes the address', () => {
  const html = redirectPage('/en/x.html')
  assert.match(html, /location\.replace\("\/en\/x\.html" \+ location\.hash\)/)
  assert.match(html, /<link rel="canonical" href="\/en\/x\.html">/)
  assert.doesNotMatch(redirectPage('/a"><script>'), /"><script>/)
})
