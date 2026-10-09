/**
 * What a shared link shows: the description comes from the first paragraph of prose, and each
 * page gets its own address, title and picture.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { describePage, pageHead, pageUrl } from '../scripts/lib/seo.mjs'

test('the description is the first paragraph of prose, without markdown', () => {
  const page = ['---', 'title: X', '---', '# Title', '', '::: warning Careful', 'A box.', ':::', '', 'Basics of setting up the **server** application. See [the guide](/en/x) and `code` for more details.', '', 'Second paragraph.'].join('\n')
  assert.equal(describePage(page), 'Basics of setting up the server application. See the guide and code for more details.')
})

test('the text inside a box is skipped, nested boxes included, and entities are decoded', () => {
  const page = ['::: warning This site is under construction!', 'Feel you could help? Please do by clicking on the page with a pencil.', '', '::: info Inner', 'Also an aside that is long enough to be a paragraph of its own.', ':::', '', ':::', '', 'Use the format &quot;X-Y&quot; where X is the player and Y is the vehicle, for example.'].join('\n')
  assert.equal(describePage(page), 'Use the format "X-Y" where X is the player and Y is the vehicle, for example.')
})

test('headings, boxes, tables, lists, code and html are skipped, and a page with no prose has no description', () => {
  assert.equal(describePage(['# T', '', '- a list of things that is long enough to be a paragraph on its own line', '', '| a | b |', '|---|---|', '', '```lua', 'print("a paragraph inside code that is certainly long enough")', '```', '', '<figure>', '![x](a.png)', '</figure>'].join('\n')), '')
})

test('a short line is not enough, and a long paragraph is cut at a word with an ellipsis', () => {
  assert.equal(describePage('Too short.'), '')
  const long = 'word '.repeat(80).trim()
  const out = describePage(long)
  assert.ok(out.length <= 200 && out.endsWith('…'), out)
  assert.ok(!/ …$/.test(out))
})

test('addresses follow how VitePress serves a page', () => {
  assert.equal(pageUrl('en/server-owners/host-a-server.md'), '/en/server-owners/host-a-server.html')
  assert.equal(pageUrl('en/get-started/index.md'), '/en/get-started/')
  assert.equal(pageUrl('en/index.md'), '/en/')
})

test('a page gets a canonical address, a title, a description, a picture and the locale', () => {
  const head = pageHead({ title: 'Port Forwarding', description: 'How to forward ports.', relativePath: 'de/server-owners/port-forwarding.md', hostname: 'https://docs.example.dev/', siteName: 'BeamMP Docs', siteDescription: 'Site.', image: '/assets/core/social-card.png', imageAlt: 'BeamMP', themeColor: '#f36d24' })
  const find = (key, name) => head.find(([, attrs]) => attrs[key] === name)?.[1]
  assert.equal(find('rel', 'canonical').href, 'https://docs.example.dev/de/server-owners/port-forwarding.html')
  assert.equal(find('property', 'og:title').content, 'Port Forwarding')
  assert.equal(find('property', 'og:description').content, 'How to forward ports.')
  assert.equal(find('property', 'og:image').content, 'https://docs.example.dev/assets/core/social-card.png')
  assert.equal(find('property', 'og:locale').content, 'de_DE')
  assert.equal(find('name', 'twitter:card').content, 'summary_large_image')
  assert.equal(find('name', 'theme-color').content, '#f36d24')
})

test('with no description of its own a page falls back to the site description', () => {
  const head = pageHead({ title: 'T', description: '', relativePath: 'en/x.md', hostname: 'https://h', siteName: 'S', siteDescription: 'Site wide.', image: '/i.png', imageAlt: 'a', themeColor: '#fff' })
  assert.equal(head.find(([, a]) => a.property === 'og:description')[1].content, 'Site wide.')
})
