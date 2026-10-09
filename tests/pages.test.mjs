/**
 * Checks on the real pages and the saved baseline, so a bad merge or a
 * hand-edited baseline cannot slip in unnoticed.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(root, 'docs')

function pages(dir = docsDir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!['.vitepress', 'node_modules', 'public'].includes(entry.name)) pages(full, out)
    } else if (entry.name.endsWith('.md')) out.push(full)
  }
  return out
}

test('the docs folder is called docs on disk, as git and the config say', () => {
  // A folder called "Docs" opens as "docs" on a case-insensitive disk, but makes
  // VitePress report dead links that CI does not, so local results would differ.
  assert.ok(fs.readdirSync(root).includes('docs'), 'rename the folder so its case matches')
})

test('there are pages to check, in all seven languages', () => {
  const found = pages()
  assert.ok(found.length > 300, `only ${found.length} pages found`)
  for (const language of ['en', 'de', 'es', 'fr', 'it', 'ru', 'zh']) {
    assert.ok(found.some((file) => path.relative(docsDir, file).startsWith(language + path.sep)), language)
  }
})

test('no page has a merge conflict marker left in it', () => {
  const marked = pages().filter((file) => /^(<{7}|>{7}) |^={7}$/m.test(fs.readFileSync(file, 'utf8')))
  assert.deepEqual(marked.map((file) => path.relative(docsDir, file)), [])
})

test('the old domain is not left in the repository', () => {
  assert.equal(fs.existsSync(path.join(docsDir, 'CNAME')), false, 'docs/CNAME would claim docs.beammp.com')
})

test('the baseline is valid, in a stable order, and only names pages that exist', () => {
  const baseline = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'docs-check-baseline.json'), 'utf8'))
  const files = Object.keys(baseline)
  assert.deepEqual(files, [...files].sort(), 'not sorted: run npm run check:update-baseline')
  for (const file of files) {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} is in the baseline but does not exist`)
    for (const count of Object.values(baseline[file])) assert.ok(Number.isInteger(count) && count > 0, file)
  }
})

test('the footer links to every social account, Twitch and Bluesky included', () => {
  const source = fs.readFileSync(path.join(docsDir, '.vitepress', 'theme', 'components', 'AppFooter.vue'), 'utf8')
  const socials = [...source.matchAll(/label: '([^']+)', href: '([^']+)'/g)].map((m) => [m[1], m[2]])
  assert.deepEqual(socials, [
    ['GitHub', 'https://github.com/BeamMP'],
    ['Discord', 'https://discord.gg/beammp'],
    ['YouTube', 'https://www.youtube.com/@beammpofficial'],
    ['X', 'https://x.com/beammpofficial'],
    ['Reddit', 'https://www.reddit.com/r/BeamMP'],
    ['Bluesky', 'https://bsky.app/profile/beammp.com'],
    ['Twitch', 'https://www.twitch.tv/beammpofficial'],
    ['Instagram', 'https://www.instagram.com/beammpofficial'],
    ['TikTok', 'https://www.tiktok.com/@beammpofficial'],
    ['Facebook', 'https://www.facebook.com/BeamMPTeam'],
  ])
})
