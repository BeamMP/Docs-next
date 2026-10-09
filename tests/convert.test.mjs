/**
 * The MkDocs -> VitePress converter. Each case is a shape found in the real
 * pages. Output must also be something the checks accept, and converting it a
 * second time must change nothing.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { cleanTitle, convertFrontMatter, convertInfoTooltips, convertPage, convertThemeImages, normalizeOpener, unwrapDoubleFences } from '../scripts/lib/convert.mjs'
import { findProblems } from '../scripts/lib/checks.mjs'

const lines = (...l) => l.join('\n') + '\n'

/** Converts, and asserts the result is clean and stable. */
function convert(source) {
  const result = convertPage(source)
  assert.deepEqual(
    findProblems(result.text).filter((p) => ['unclosed-container', 'stray-container-close', 'mkdocs-admonition', 'mkdocs-collapsible', 'mkdocs-tabs', 'indented-container'].includes(p.rule)),
    [],
    'the converted page still has problems:\n' + result.text,
  )
  assert.equal(convertPage(result.text).changed, false, 'converting the output again changed it:\n' + result.text)
  return result
}

test('a MkDocs box becomes a closed VitePress box with its text dedented', () => {
  const { text, converted } = convert(lines('Intro', '', '!!! warning "Careful now"', '    Do not do this.', '', '    Really.', '', 'After.'))
  assert.equal(text, lines('Intro', '', '::: warning Careful now', 'Do not do this.', '', 'Really.', ':::', '', 'After.'))
  assert.equal(converted.admonitions, 1)
})

test('the quotes round a title go, and so do icons in it', () => {
  assert.equal(cleanTitle('"Hello"'), 'Hello')
  assert.equal(cleanTitle('“Hello”'), 'Hello')
  assert.equal(cleanTitle('":material-scale-balance: DISCLAIMER:"'), 'DISCLAIMER:')
  assert.equal(cleanTitle(''), '')
  assert.equal(cleanTitle('""'), '')
})

test('a box with no title, or an empty one, gets no title', () => {
  assert.equal(convert(lines('!!! note', '    Text.')).text, lines('::: note', 'Text.', ':::'))
  assert.equal(convert(lines('!!!note ""', '    Text.')).text, lines('::: note', 'Text.', ':::'))
})

test('MkDocs box types map to ones the site has', () => {
  const cases = { abstract: 'info', hint: 'tip', important: 'tip', check: 'success', help: 'question', caution: 'warning', fail: 'failure', error: 'danger', cite: 'quote', bug: 'bug', example: 'example', note: 'note' }
  for (const [from, to] of Object.entries(cases)) {
    assert.equal(convert(lines(`!!! ${from}`, '    x')).text, lines(`::: ${to}`, 'x', ':::'), from)
  }
})

test('an unknown box type becomes a note and is flagged for review', () => {
  const { text, review } = convertPage(lines('!!! mystery', '    x'))
  assert.equal(text, lines('::: note', 'x', ':::'))
  assert.equal(review.length, 1)
  assert.match(review[0], /unknown box type "mystery"/)
})

test('a collapsible becomes a details box, and `setting` is just a title', () => {
  assert.equal(convert(lines('??? setting "Debug"', '    Turns on debug.')).text, lines('::: details Debug', 'Turns on debug.', ':::'))
  assert.equal(convert(lines('??? question "Why?"', '    Because.')).text, lines('::: details Why?', 'Because.', ':::'))
})

test('a collapsible that opened by default is flagged, since VitePress ones start closed', () => {
  const { text, review } = convertPage(lines('???+ tip "Open"', '    x'))
  assert.equal(text, lines('::: details Open', 'x', ':::'))
  assert.match(review[0], /opened by default/)
})

test('a VitePress-style box that was never closed is closed after its indented text', () => {
  const { text, converted } = convert(lines('::: info', '    BeamMP Staff are not bound.', '', '## Heading', ''))
  assert.equal(text, lines('::: info', 'BeamMP Staff are not bound.', ':::', '', '## Heading', ''))
  assert.equal(converted.unclosedBoxes, 1)
})

test('a box that is already closed is left alone', () => {
  const page = lines('::: warning', 'Careful.', ':::', '', 'Text')
  const result = convertPage(page)
  assert.equal(result.changed, false)
  assert.equal(result.text, page)
})

test('a box inside a box makes the outer fence longer, so the outer one is not closed early', () => {
  const { text } = convert(lines('::: info', '', '    Outer.', '', '    ::: danger "DISCLAIMER:"', '', '        Inner.', '', '    More outer.', '', 'After'))
  assert.equal(text, lines(':::: info', 'Outer.', '', '::: danger DISCLAIMER:', 'Inner.', ':::', '', 'More outer.', '::::', '', 'After'))
})

test('three levels of boxes use three different fence lengths', () => {
  const { text } = convert(lines('!!! note "A"', '    !!! tip "B"', '        !!! warning "C"', '            deep'))
  assert.equal(text, lines('::::: note A', '::::  tip B'.replace('::::  ', ':::: '), '::: warning C', 'deep', ':::', '::::', ':::::'))
})

test('a box inside a list item keeps its indentation', () => {
  const { text } = convert(lines('1. Step one', '', '    !!! note', '        Remember this.', '', '2. Step two'))
  assert.equal(text, lines('1. Step one', '', '    ::: note', '    Remember this.', '    :::', '', '2. Step two'))
})

test('a code block inside a box stays whole, and is dedented with the box', () => {
  const { text } = convert(lines('!!! tip', '    Run this:', '', '    ```bash', '    npm install', '', '    npm test', '    ```', '', 'After'))
  assert.equal(text, lines('::: tip', 'Run this:', '', '```bash', 'npm install', '', 'npm test', '```', ':::', '', 'After'))
})

test('code that shows MkDocs syntax is not converted', () => {
  const page = lines('```md', '!!! note', '    example', '=== "Tab"', '```', '', 'Text')
  assert.equal(convertPage(page).changed, false)
})

test('a fenced block that is not indented as deep as its box does not end the box early', () => {
  const { text } = convert(lines('!!! note', '    Intro', '', '    ```lua', 'print(1)', '    ```', '', 'After'))
  assert.match(text, /^::: note\nIntro\n\n```lua\nprint\(1\)\n```\n:::\n\nAfter\n$/)
})

test('text left unindented under a `:::` opener is taken as its body, and flagged', () => {
  const { text, review } = convertPage(lines('::: warning "Careful"', '', 'This is the body.', '', 'Not part of it.'))
  assert.equal(text, lines('::: warning Careful', 'This is the body.', ':::', '', 'Not part of it.'))
  assert.match(review[0], /no indented text/)
})

test('text a translation tool wrapped in a bare code fence is unwrapped into the box', () => {
  const { text, converted } = convert(lines(':::warning "¡Esta página está bajo construcción!"', '', '```', 'Se está trabajando en este sitio.', '', 'Esto puede ser hecho.', '```', '', '# Título'))
  assert.equal(text, lines('::: warning ¡Esta página está bajo construcción!', 'Se está trabajando en este sitio.', '', 'Esto puede ser hecho.', ':::', '', '# Título'))
  assert.equal(converted.unwrappedFences, 1)
})

test('a MkDocs box whose text is in a bare fence is unwrapped too', () => {
  const { text } = convert(lines('!!!failure ""', '', '```', '**Forum** — [x](https://x.example)', '```', '', 'After'))
  assert.equal(text, lines('::: failure', '**Forum** — [x](https://x.example)', ':::', '', 'After'))
})

test('a fence with a language is code, so a box above it is not given it as text', () => {
  const { text, review } = convertPage(lines('::: tip', '', '```lua', 'print(1)', '```', ''))
  assert.match(text, /^::: tip\n:::\n/)
  assert.match(text, /```lua\nprint\(1\)\n```/)
  assert.match(review[0], /no text/)
})

test('a `:::` opener with nothing under it is closed straight away and flagged', () => {
  const { text, review } = convertPage(lines('::: info', '', '# Heading'))
  assert.equal(text, lines('::: info', ':::', '', '# Heading'))
  assert.match(review[0], /no text/)
})

test('a title written as a Vue expression is kept as it is', () => {
  assert.equal(convertPage(lines(":::warning {{''}}", '    Text.')).text, lines(":::: warning {{''}}".replace('::::', ':::'), 'Text.', ':::'))
})

test('tabs next to each other become one group', () => {
  const { text, converted } = convert(lines('=== "Linux"', '', '    Do A.', '', '=== "Windows"', '', '    Do B.', '', 'After'))
  assert.equal(text, lines('::: tabs', '', '== Linux', '', 'Do A.', '', '== Windows', '', 'Do B.', '', ':::', '', 'After'))
  assert.equal(converted.tabs, 2)
})

test('tabs with unquoted or non-English labels are converted too', () => {
  const { text } = convert(lines('=== 基本格式', '    one', '', '=== Input', '    two'))
  assert.match(text, /== 基本格式/)
  assert.match(text, /== Input/)
})

test('tabs separated by other text are two groups', () => {
  const { text } = convert(lines('=== "A"', '    a', '', 'Some text.', '', '=== "B"', '    b'))
  assert.equal((text.match(/^::: tabs$/gm) || []).length, 2)
})

test('a box inside a tab makes the tab group fence longer', () => {
  const { text } = convert(lines('=== "A"', '', '    !!! note', '        inner', '', '=== "B"', '    b'))
  assert.match(text, /^:::: tabs\n/)
  assert.match(text, /\n::: note\ninner\n:::\n/)
  assert.match(text, /\n::::\n$/)
})

test('a heading underline is not a tab', () => {
  const page = lines('Title', '=====', '', 'Text')
  assert.equal(convertPage(page).changed, false)
})

test('MkDocs hide: front matter becomes the VitePress options', () => {
  const notes = { converted: { frontMatter: 0 } }
  assert.deepEqual(convertFrontMatter(['---', 'hide:', '  - navigation', 'title: T', '---', '# T'], notes), ['---', 'title: T', 'sidebar: false', '---', '# T'])
  assert.deepEqual(convertFrontMatter(['---', 'hide:', '  - navigation', '  - toc', '---', '# T'], notes), ['---', 'sidebar: false', 'aside: false', '---', '# T'])
  assert.equal(notes.converted.frontMatter, 2)
})

test('front matter with nothing else in it is removed', () => {
  const page = lines('---', 'hide:', '  - toc', '---', '', '# T')
  const { text } = convertPage(page)
  assert.match(text, /^---\naside: false\n---\n/)
})

test('other front matter is left alone', () => {
  const page = lines('---', 'layout: home', '---', '# T')
  assert.equal(convertPage(page).changed, false)
})

test('light and dark images get a class instead of the MkDocs suffix', () => {
  assert.equal(convertThemeImages('![a](x.png#only-dark){width="450"}'), '![a](x.png){.only-dark width="450"}')
  assert.equal(convertThemeImages('![a](x.png#only-light)'), '![a](x.png){.only-light}')
  assert.equal(convertThemeImages('![a](x.png)'), '![a](x.png)')
})

test('light and dark images in a code block are left alone', () => {
  const page = lines('```md', '![a](x.png#only-dark)', '```')
  assert.equal(convertPage(page).changed, false)
})

test('an info icon with a tooltip becomes a span', () => {
  assert.equal(
    convertInfoTooltips('1. No Spam :material-information-outline:{ title="This includes <b> & more." }'),
    '1. No Spam <span class="info-tooltip" title="This includes &lt;b> &amp; more.">ⓘ</span>',
  )
})

test('windows line endings are kept', () => {
  const { text } = convertPage('!!! note\r\n    Text.\r\n')
  assert.equal(text, '::: note\r\nText.\r\n:::\r\n')
})

test('a page with nothing to convert is returned untouched', () => {
  const page = lines('# Title', '', 'Plain text with a [link](a.md).')
  const result = convertPage(page)
  assert.equal(result.changed, false)
  assert.equal(result.text, page)
})

test('a tab whose text was left unindented takes what follows it, up to the next tab', () => {
  const { text, review } = convert(lines('=== 基本格式', '', '```lua', 'im.Text("")', '```', '', '=== 输入', '', '```lua', 'im.Input()', '```', '', '## Next'))
  assert.equal(text, lines('::: tabs', '', '== 基本格式', '', '```lua', 'im.Text("")', '```', '', '== 输入', '', '```lua', 'im.Input()', '```', '', ':::', '', '## Next'))
  assert.equal(review.length, 2)
})

test('the last unindented tab stops at the next heading', () => {
  const { text } = convert(lines('=== "A"', 'text a', '', '=== "B"', 'text b', '', '## Heading', 'after'))
  assert.match(text, /== B\n\ntext b\n\n:::\n\n## Heading\nafter\n$/)
})

test('a code block wrapped in an extra bare fence is unwrapped', () => {
  const notes = { converted: { unwrappedFences: 0 } }
  const out = unwrapDoubleFences(['Text', '```', '```lua', 'print(1)', '```', '```', 'More'], notes)
  assert.deepEqual(out, ['Text', '```lua', 'print(1)', '```', 'More'])
  assert.equal(notes.converted.unwrappedFences, 1)
})

test('fences that are not wrapped that way are left alone', () => {
  const notes = { converted: { unwrappedFences: 0 } }
  const lone = ['```', 'plain', '```', '', '```lua', 'print(1)', '```']
  assert.deepEqual(unwrapDoubleFences(lone, notes), lone)
  assert.equal(notes.converted.unwrappedFences, 0)
})

test('a closed box with a quoted title loses the quotes, and keeps its colons', () => {
  assert.equal(normalizeOpener('::: danger ":material-scale-balance: HAFTUNGSAUSSCHLUSS:"'), '::: danger HAFTUNGSAUSSCHLUSS:')
  assert.equal(normalizeOpener('::::  warning “Warnung”'), ':::: warning Warnung')
})

test('a closed box of a type VitePress lacks is renamed', () => {
  assert.equal(normalizeOpener('::: setting "Show advanced options"'), '::: details Show advanced options')
  assert.equal(normalizeOpener('::: hint'), '::: tip')
})

test('a box already in good shape is left exactly as it is', () => {
  for (const line of ['::: warning', '::: tip Title', "::: warning {{''}}", ':::: info', '    ::: indented code', 'plain text']) {
    assert.equal(normalizeOpener(line), line, line)
  }
})

test('a page with a closed, quoted box is tidied by convertPage', () => {
  const { text, converted } = convertPage(lines('::: warning "Careful"', 'Text.', ':::'))
  assert.equal(text, lines('::: warning Careful', 'Text.', ':::'))
  assert.equal(converted.openerTitles, 1)
})

test('a figure with a markdown attribute gets blank lines inside, so the image is an image', () => {
  const { text, converted } = convert(lines('<figure class="image image_resized" style="width:62%;" markdown>', '![](a.png)', '</figure>', '', 'After.'))
  assert.equal(text, lines('<figure class="image image_resized" style="width:62%;">', '', '![](a.png)', '', '</figure>', '', 'After.'))
  assert.equal(converted.markdownBlocks, 1)
})

test('a figure that is written with markdown="" or the attribute alone is handled the same', () => {
  assert.equal(convert(lines('<figure markdown="">', '![x](a.png)', '</figure>')).text, lines('<figure>', '', '![x](a.png)', '', '</figure>'))
  assert.equal(convert(lines('<figure markdown>', '', '![x](a.png)', '', '</figure>')).text, lines('<figure>', '', '![x](a.png)', '', '</figure>'))
})

test('a figure shown inside a code block is not touched', () => {
  const source = lines('```html', '<figure markdown>', '![](a.png)', '</figure>', '```')
  assert.equal(convertPage(source).changed, false)
})

test('grid cards become a numbered list, from the markdown form and from the HTML GitLocalize left', () => {
  const md = lines('<div class="grid cards" markdown>', '', '-   :material-dns:{ .lg .middle } __Assign an IP__', '', '    ---', '    Needed so it does not change.', '', '    [:octicons-arrow-right-24: More](https://x.test)', '', '-   :material-router-wireless:{ .lg .middle } __Log in__', '', '    ---', '', '    Use the gateway.', '', '</div>', '', 'After.')
  const out = convertPage(md)
  assert.equal(out.text, lines('1. **Assign an IP**', '', '   Needed so it does not change.', '', '   [More](https://x.test)', '', '2. **Log in**', '', '   Use the gateway.', '', 'After.'))
  assert.equal(out.converted.gridCards, 1)
  const html = lines('<div class="grid cards" markdown>', '</div>', '<ul data-md-type="list" data-md-list-type="unordered">', '<li data-md-type="list_item">', '<p data-md-type="paragraph">:material-dns:{ .lg .middle } <strong data-md-type="double_emphasis">Assign</strong></p>', '<hr data-md-type="hrule">', '<p data-md-type="paragraph">Run <code data-md-type="codespan">ipconfig</code> <a href="https://x.test" data-md-type="link">:octicons-arrow-right-24: here</a></p>', '</li>', '</ul>', '<div data-md-type="block_html"></div>', '', 'After.')
  assert.equal(convertPage(html).text, lines('1. **Assign**', '', '   Run `ipconfig` [here](https://x.test)', '', 'After.'))
  assert.equal(convertPage(convertPage(html).text).changed, false)
})

test('a figure written on one line (as GitLocalize left it) is split so the image is an image', () => {
  const { text } = convert(lines('<figure class="image" style="width:44%;" markdown="">![](a.png)</figure>', 'After.'))
  assert.equal(text, lines('<figure class="image" style="width:44%;">', '', '![](a.png)', '', '</figure>', 'After.'))
})
