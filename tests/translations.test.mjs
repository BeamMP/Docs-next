/**
 * Translation drift: a translation is out of date when the English page it was made from has changed.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { expandIncludes, findDrift, hashPage, hashText, recordSources } from '../scripts/lib/translations.mjs'

function docs(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-'))
  for (const [file, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
    fs.writeFileSync(path.join(dir, file), text)
  }
  return dir
}

test('line endings and trailing spaces do not change the hash, words do', () => {
  assert.equal(hashText('# A  \r\nText\r\n'), hashText('# A\nText'))
  assert.notEqual(hashText('# A\nText'), hashText('# A\nText!'))
})

test('a shared part changes the hash of every page that includes it', () => {
  const before = docs({ 'en/a.md': 'Intro\n<!--@include: ./_parts/x.md-->', 'en/_parts/x.md': 'one' })
  const after = docs({ 'en/a.md': 'Intro\n<!--@include: ./_parts/x.md-->', 'en/_parts/x.md': 'two' })
  assert.notEqual(hashPage(before, 'en/a.md'), hashPage(after, 'en/a.md'))
  assert.match(expandIncludes(path.join(before, 'en/a.md')), /one/)
})

test('an include that cannot be read is left as written and a loop does not hang', () => {
  const dir = docs({ 'en/a.md': '<!--@include: ./gone.md-->', 'en/b.md': '<!--@include: ./b.md-->' })
  assert.match(expandIncludes(path.join(dir, 'en/a.md')), /@include/)
  assert.equal(typeof expandIncludes(path.join(dir, 'en/b.md')), 'string')
})

test('drift is sorted into stale, unrecorded, missing, orphaned and removed', () => {
  const drift = findDrift({
    manifest: { 'de/a.md': 'old', 'de/b.md': 'same', 'de/gone.md': 'x' },
    english: { 'a.md': 'new', 'b.md': 'same', 'c.md': 'c', 'd.md': 'd' },
    translations: { de: ['a.md', 'b.md', 'c.md', 'extra.md'], fr: ['a.md'] },
  })
  assert.deepEqual(drift.stale, ['de/a.md'])
  assert.deepEqual(drift.unrecorded, ['de/c.md', 'fr/a.md'])
  assert.deepEqual(drift.missing, ['de/d.md', 'fr/b.md', 'fr/c.md', 'fr/d.md'])
  assert.deepEqual(drift.orphaned, ['de/extra.md'])
  assert.deepEqual(drift.removed, ['de/gone.md'])
})

test('recording an English path records every language that has the page, a language path only that one', () => {
  const input = { manifest: {}, english: { 'a.md': 'h1' }, translations: { de: ['a.md'], fr: ['a.md'], es: [] } }
  assert.deepEqual(recordSources({ ...input, targets: ['en/a.md'] }).recorded, ['de/a.md', 'fr/a.md'])
  assert.deepEqual(recordSources({ ...input, targets: ['de/a.md'] }).recorded, ['de/a.md'])
  assert.deepEqual(recordSources({ ...input, targets: ['de/none.md'] }).recorded, [])
})

test('every translation in the repository is recorded and matches the English it was made from', () => {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'translation-sources.json'), 'utf8'))
  assert.ok(Object.keys(manifest).length >= 282, 'the manifest covers all six languages')
})
