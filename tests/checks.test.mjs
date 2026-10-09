/**
 * The page checks: each kind of leftover MkDocs syntax and each way a `:::` box
 * can go wrong is found, and examples inside code are not mistaken for it.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { RULES, countByRule, findProblems, splitLines } from '../scripts/lib/checks.mjs'

const rules = (source) => findProblems(source).map((p) => p.rule)

test('a page in VitePress syntax has no problems', () => {
  const page = ['---', 'title: Hi', '---', '# Title', '', '::: warning', 'Careful.', ':::', '', '::: tip Title', 'Nice.', ':::', ''].join('\n')
  assert.deepEqual(findProblems(page), [])
})

test('every MkDocs construct is found, with its line', () => {
  const page = ['!!! note "Title"', '    body', '', '??? tip "More"', '    body', '', '=== "Linux"', '    text', ':material-information:', '![x](a.png#only-dark)', '<div class="grid cards" markdown>', '--8<-- "file.md"'].join('\n')
  assert.deepEqual(findProblems(page), [
    { rule: 'mkdocs-admonition', line: 1 },
    { rule: 'mkdocs-collapsible', line: 4 },
    { rule: 'mkdocs-tabs', line: 7 },
    { rule: 'mkdocs-icon', line: 9 },
    { rule: 'mkdocs-theme-image', line: 10 },
    { rule: 'mkdocs-grid-cards', line: 11 },
    { rule: 'mkdocs-snippet', line: 12 },
  ])
})

test('a MkDocs tab is found with or without quotes around its label', () => {
  assert.deepEqual(rules('=== "Linux"\n    text'), ['mkdocs-tabs'])
  assert.deepEqual(rules('=== Linux\n    text'), ['mkdocs-tabs'])
  assert.deepEqual(rules('=== 基本格式'), ['mkdocs-tabs'])
  assert.deepEqual(rules('==== Four\n'), ['mkdocs-tabs'])
})

test('a heading underline and the VitePress tab syntax are not MkDocs tabs', () => {
  assert.deepEqual(rules('Title\n=====\n'), [])
  assert.deepEqual(rules('::: tabs\n== Linux\ntext\n== Windows\ntext\n:::\n'), [])
})

test('the other MkDocs icon sets are found too', () => {
  for (const icon of [':fontawesome-brands-discord:', ':octicons-mark-github-16:', ':simple-github:']) {
    assert.deepEqual(rules(`Text ${icon} more`), ['mkdocs-icon'], icon)
  }
})

test('MkDocs-only front matter is found, other front matter is not', () => {
  assert.deepEqual(rules('---\nhide:\n  - navigation\n---\n# T'), ['mkdocs-front-matter'])
  assert.deepEqual(rules('---\nlayout: home\n---\n# T'), [])
  // a `hide:` line further down the page is not front matter
  assert.deepEqual(rules('# T\n\nhide:\n'), [])
})

test('syntax shown as an example in a code block, or in inline code, is not a problem', () => {
  assert.deepEqual(rules('```md\n!!! note\n::: warning\n:material-x:\n```\n'), [])
  assert.deepEqual(rules('~~~\n??? tip\n~~~\n'), [])
  assert.deepEqual(rules('Write `!!! note` for a box and `:material-x:` for an icon.'), [])
})

test('a longer code fence is only closed by an equal or longer one', () => {
  const page = ['````md', '```', '!!! note', '```', '````', '', '!!! real'].join('\n')
  assert.deepEqual(findProblems(page), [{ rule: 'mkdocs-admonition', line: 7 }])
})

test('a box that is never closed is reported at the line it opened on', () => {
  assert.deepEqual(findProblems('text\n\n::: warning\nbody\n\nmore text'), [{ rule: 'unclosed-container', line: 3 }])
})

test('every unclosed box is reported, including nested ones', () => {
  const page = '::: details\n::: warning\nbody\n:::\n'
  assert.deepEqual(findProblems(page), [{ rule: 'unclosed-container', line: 1 }])
  assert.deepEqual(rules('::: a\n::: b\n'), ['unclosed-container', 'unclosed-container'])
})

test('a closing line with nothing open is reported', () => {
  assert.deepEqual(findProblems('text\n:::\n'), [{ rule: 'stray-container-close', line: 2 }])
})

test('boxes with titles, extra colons and attributes count as boxes', () => {
  assert.deepEqual(rules('::: warning "Title"\nx\n:::\n'), [])
  assert.deepEqual(rules(":::warning {{''}}\nx\n:::\n"), [])
  assert.deepEqual(rules(':::: outer\n::: inner\nx\n:::\n::::\n'), [])
})

test('a box indented four spaces after plain text is code, and is reported once', () => {
  const page = 'Some text.\n\n    ::: warning\n    body\n    :::\n'
  assert.deepEqual(findProblems(page), [{ rule: 'indented-container', line: 3 }])
})

test('a box indented under a list item is fine', () => {
  assert.deepEqual(rules('1. Step one\n\n    ::: tip\n    ok\n    :::\n'), [])
  assert.deepEqual(rules('- item\n\n    ::: tip\n    ok\n    :::\n'), [])
})

test('windows line endings do not change the result', () => {
  assert.deepEqual(findProblems('!!! note\r\n::: a\r\nbody\r\n'), [
    { rule: 'mkdocs-admonition', line: 1 },
    { rule: 'unclosed-container', line: 2 },
  ])
})

test('problems come back in page order', () => {
  const lines = findProblems('::: a\n!!! note\n').map((p) => p.line)
  assert.deepEqual(lines, [...lines].sort((a, b) => a - b))
})

test('countByRule totals each rule', () => {
  assert.deepEqual(countByRule([{ rule: 'a', line: 1 }, { rule: 'b', line: 2 }, { rule: 'a', line: 3 }]), { a: 2, b: 1 })
  assert.deepEqual(countByRule([]), {})
})

test('splitLines marks fenced lines as code', () => {
  const marked = splitLines('a\n```\nb\n```\nc').map((l) => l.code)
  assert.deepEqual(marked, [false, true, true, true, false])
})

test('every rule has an explanation', () => {
  for (const rule of ['mkdocs-admonition', 'mkdocs-collapsible', 'mkdocs-tabs', 'mkdocs-icon', 'mkdocs-theme-image', 'mkdocs-grid-cards', 'mkdocs-front-matter', 'mkdocs-snippet', 'unclosed-container', 'stray-container-close', 'indented-container']) {
    assert.ok(RULES[rule] && RULES[rule].length > 10, rule)
  }
})
