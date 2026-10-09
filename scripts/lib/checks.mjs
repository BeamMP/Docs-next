/**
 * Static checks for the documentation pages.
 *
 * The docs are being moved from MkDocs Material to VitePress, and the two use
 * different Markdown extensions. A page written for MkDocs still builds under
 * VitePress, but its boxes, tabs and icons show up as plain text, or a box is
 * left open and swallows the rest of the page. These checks find those.
 *
 * Everything here works on the text of one page and has no dependencies, so it
 * is quick and easy to test. Checking that a page compiles, and finding dead
 * links, needs VitePress itself and lives in check-docs.mjs.
 */

export const RULES = {
  'mkdocs-admonition': 'A MkDocs box (`!!! note`). VitePress uses `::: note` ... `:::`.',
  'mkdocs-collapsible': 'A MkDocs collapsible (`??? note`). VitePress uses `::: details`.',
  'mkdocs-tabs': 'A MkDocs tab (`=== "Tab"`). VitePress uses `::: tabs` with `== Tab`.',
  'mkdocs-icon': 'A MkDocs icon (`:material-...:`). VitePress shows it as plain text.',
  'mkdocs-theme-image': 'A light/dark image suffix (`#only-dark`). VitePress ignores it, so both images show.',
  'mkdocs-grid-cards': 'A MkDocs grid of cards (`<div class="grid cards" markdown>`).',
  'mkdocs-markdown-attr': 'An HTML block with a `markdown` attribute (`<figure markdown>`). VitePress shows what is inside as text.',
  'mkdocs-front-matter': 'MkDocs-only front matter (`hide:`).',
  'mkdocs-snippet': 'A MkDocs include (`--8<--`).',
  'unclosed-container': 'A `:::` box that is never closed, so it swallows the rest of the page.',
  'stray-container-close': 'A closing `:::` with no box open.',
  'indented-container': 'A `:::` box indented four or more spaces, which Markdown treats as code.',
}

/**
 * The page as lines, each marked as inside a fenced code block or not. The
 * checks below only look at prose: syntax shown inside a code block as an
 * example is not a problem.
 */
export function splitLines(source) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const out = []
  let fence = null
  lines.forEach((text, index) => {
    const open = text.match(/^ {0,3}(`{3,}|~{3,})/)
    if (fence) {
      out.push({ text, line: index + 1, code: true })
      if (open && open[1][0] === fence.char && open[1].length >= fence.length && /^ {0,3}(`{3,}|~{3,})\s*$/.test(text)) {
        fence = null
      }
    } else if (open) {
      fence = { char: open[1][0], length: open[1].length }
      out.push({ text, line: index + 1, code: true })
    } else {
      out.push({ text, line: index + 1, code: false })
    }
  })
  return out
}

/** A line of prose without inline code, so `!!!` written as an example does not count. */
const prose = (text) => text.replace(/`[^`]*`/g, '')

const LINE_RULES = [
  ['mkdocs-admonition', /^\s*!!!\s*[\w-]+/],
  ['mkdocs-collapsible', /^\s*\?\?\?\+?\s*[\w-]+/],
  // `=== "Tab"` in MkDocs. The VitePress tabs plugin also reads a line starting `===` as one
  // of its own tab items, so even an unquoted `=== Tab` breaks the page when it is rendered.
  ['mkdocs-tabs', /^\s*={3,}\s+\S/],
  ['mkdocs-icon', /:(?:material|fontawesome|octicons|simple)-[a-z0-9-]+:/],
  ['mkdocs-theme-image', /#only-(?:dark|light)\b/],
  ['mkdocs-grid-cards', /<div[^>]*(?:class="[^"]*\bgrid\b[^"]*\bcards\b|\smarkdown(?:=["']?1["']?)?[\s>])/],
  ['mkdocs-markdown-attr', /<(?!div\b)[a-z][\w-]*\b[^>]*\smarkdown(?:=["']?1?["']?)?[\s/>]/],
  ['mkdocs-snippet', /--8<--/],
]

/** The front matter block at the top of the page, if there is one. */
function frontMatterLines(lines) {
  if (!lines.length || lines[0].text.trim() !== '---') return []
  const out = []
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].text.trim() === '---') return out
    out.push(lines[i])
  }
  return []
}

/**
 * Every problem on one page: `{ rule, line }` for each occurrence, in page
 * order. `line` is 1-based.
 */
export function findProblems(source) {
  const lines = splitLines(source)
  const problems = []

  for (const entry of frontMatterLines(lines)) {
    if (/^hide:\s*$/.test(entry.text)) problems.push({ rule: 'mkdocs-front-matter', line: entry.line })
  }

  const stack = []
  // Whether the page is inside a list item right now: a box indented under a
  // list item is fine, but the same indent after plain text is a code block.
  let inList = false
  for (const { text, line, code } of lines) {
    if (code) continue
    const visible = prose(text)

    for (const [rule, pattern] of LINE_RULES) {
      if (pattern.test(visible)) problems.push({ rule, line })
    }

    const indented = /^(?:\t| {4,})\S/.test(text)
    if (text.trim() !== '' && !indented) inList = /^ {0,3}(?:[-*+]|\d+[.)])\s/.test(text)

    if (indented && /^(?:\t| {4,}):{3,}\s*[\w-]+/.test(text)) {
      if (!inList) problems.push({ rule: 'indented-container', line })
    } else if (indented && /^(?:\t| {4,}):{3,}\s*$/.test(text)) {
      // the end of a box that was already reported, or of one inside a list
    } else if (/^ {0,3}:{3,}\s*[\w-]+/.test(text)) {
      stack.push(line)
    } else if (/^ {0,3}:{3,}\s*$/.test(text)) {
      if (stack.length) stack.pop()
      else problems.push({ rule: 'stray-container-close', line })
    }
  }
  for (const line of stack) problems.push({ rule: 'unclosed-container', line })

  return problems.sort((a, b) => a.line - b.line)
}

/** `{ rule: count }` for one page. */
export function countByRule(problems) {
  const counts = {}
  for (const { rule } of problems) counts[rule] = (counts[rule] || 0) + 1
  return counts
}
