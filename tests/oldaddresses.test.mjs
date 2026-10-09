/**
 * The old MkDocs addresses: English is at the root, other languages under their code,
 * and an address works if the build has a page or a redirect page there.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { findMissingOldAddresses } from '../scripts/lib/oldaddresses.mjs'

function build(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-'))
  for (const file of files) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
    fs.writeFileSync(path.join(dir, file), '<html></html>')
  }
  return dir
}

test('an address is found only where a visitor requests it, English at the root and the others under their code', () => {
  const dist = build(['server/create-a-server/index.html', 'de/FAQ/game-faq/index.html', 'index.html', 'en/only-here/index.html'])
  assert.deepEqual(findMissingOldAddresses(dist, ['/server/create-a-server/', '/de/FAQ/game-faq/', '/']), [])
  assert.deepEqual(findMissingOldAddresses(dist, ['/only-here/']), ['/only-here/'], 'a page under /en/ does not answer the old root address')
})

test('an address with a space or an encoded space is matched, and a missing one is reported', () => {
  const dist = build(['API documentation/Client-Side/index.html'])
  assert.deepEqual(findMissingOldAddresses(dist, ['/API%20documentation/Client-Side/', '/gone/page/']), ['/gone/page/'])
})

test('the saved list of old addresses is not empty and every line is a path', () => {
  const lines = fs.readFileSync(new URL('../scripts/old-addresses.txt', import.meta.url), 'utf8').split('\n').filter(Boolean)
  assert.ok(lines.length > 300)
  for (const line of lines) assert.match(line, /^\//, line)
})
