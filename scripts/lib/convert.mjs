/**
 * Converts a page from MkDocs Material syntax to VitePress syntax.
 *
 * MkDocs writes a box as `!!! warning "Title"` followed by a body indented four
 * spaces, a collapsible as `??? tip "Title"`, and tabs as `=== "Linux"`. VitePress
 * writes `::: warning Title` ... `:::` and `::: tabs` / `== Linux`, with no
 * indentation. Earlier work on this site changed many openers to the new form
 * but left the bodies indented and never closed the box, which is what the
 * checks report as `unclosed-container`.
 *
 * Both are the same shape to the reader: an opener, then the lines that belong
 * to it (blank or indented deeper than the opener). So the page is read into a
 * tree of blocks and written back out with the right fences. A box inside a box
 * needs MORE colons on the outer one, or VitePress ends the outer one early.
 *
 * Nothing here touches the file system. `convertPage` takes text and returns
 * text plus a note of what it did and anything that needs a person to look.
 */

import { splitLines } from './checks.mjs'

/** MkDocs box types and the VitePress type each becomes. */
export const TYPE_MAP = {
  note: 'note',
  abstract: 'info', summary: 'info', tldr: 'info', info: 'info', todo: 'info',
  tip: 'tip', hint: 'tip', important: 'tip',
  success: 'success', check: 'success', done: 'success',
  question: 'question', help: 'question', faq: 'question',
  warning: 'warning', caution: 'warning', attention: 'warning',
  failure: 'failure', fail: 'failure', missing: 'failure',
  danger: 'danger', error: 'danger',
  bug: 'bug',
  example: 'example',
  quote: 'quote', cite: 'quote',
}

/** Types VitePress (or the site's config) knows, so an existing `::: type` needs no change. */
export const KNOWN_TYPES = new Set(['info', 'note', 'tip', 'warning', 'danger', 'details', 'quote', 'question', 'success', 'failure', 'bug', 'example', 'tabs'])

const indentOf = (line) => {
  let width = 0
  for (const ch of line) {
    if (ch === ' ') width += 1
    else if (ch === '\t') width += 4
    else break
  }
  return width
}
const isBlank = (line) => line.trim() === ''
const stripIndent = (line, amount) => {
  let removed = 0
  let i = 0
  while (i < line.length && removed < amount) {
    if (line[i] === ' ') removed += 1
    else if (line[i] === '\t') removed += 4
    else break
    i++
  }
  return line.slice(i)
}

const MKDOCS_OPENER = /^(\s*)(!!!|\?\?\?\+?)\s*([\w-]+)\s*(.*)$/
const COLON_OPENER = /^(\s*)(:{3,})\s*([\w-]+)(.*)$/
const TAB_OPENER = /^(\s*)={3}\s+(.+?)\s*$/
const FENCE = /^\s*(`{3,}|~{3,})/

/** `"Title"`, `“Title”` or `Title` -> `Title`; icons such as `:material-x:` are dropped. */
export function cleanTitle(raw) {
  let title = String(raw || '').trim()
  title = title.replace(/^["“”'‘’]+/, '').replace(/["“”'‘’]+$/, '').trim()
  title = title.replace(/:(?:material|fontawesome|octicons|simple)-[a-z0-9-]+:/g, '').replace(/\s{2,}/g, ' ').trim()
  return title
}

/**
 * Which `:::` openers in these lines are never closed. Same rule as the check:
 * a stack over lines up to three spaces indented, outside code.
 */
function unclosedOpeners(lines) {
  const marked = splitLines(lines.join('\n'))
  const stack = []
  for (const { text, line, code } of marked) {
    if (code) continue
    if (/^ {0,3}:{3,}\s*[\w-]+/.test(text)) stack.push(line - 1)
    else if (/^ {0,3}:{3,}\s*$/.test(text) && stack.length) stack.pop()
  }
  return new Set(stack)
}

/**
 * The lines that belong to a block opened at `openerIndent` on line `start`:
 * everything after it that is blank or indented deeper, through to the first
 * line that is not. A fenced code block inside is kept whole.
 */
function bodyExtent(lines, start, openerIndent) {
  let end = start + 1
  let fence = null
  while (end < lines.length) {
    const line = lines[end]
    if (fence) {
      end++
      const close = line.match(FENCE)
      if (close && close[1][0] === fence.char && close[1].length >= fence.length && line.trim().replace(/[`~]/g, '') === '') fence = null
      continue
    }
    if (isBlank(line)) {
      end++
      continue
    }
    if (indentOf(line) <= openerIndent) break
    const open = line.match(FENCE)
    if (open) fence = { char: open[1][0], length: open[1].length }
    end++
  }
  let last = end
  while (last > start + 1 && isBlank(lines[last - 1])) last--
  return { bodyStart: start + 1, bodyEnd: last, next: last }
}

/**
 * Removes the indentation every body line shares. Lines inside a code fence are
 * not counted (code may be less indented than the box it sits in), and a fence
 * counts at any indentation, because inside a body it is indented with the rest.
 */
function dedentBody(bodyLines) {
  let min = Infinity
  let fence = null
  for (const line of bodyLines) {
    if (isBlank(line)) continue
    const open = line.match(FENCE)
    if (fence) {
      if (open && open[1][0] === fence.char && open[1].length >= fence.length && line.trim().replace(/[`~]/g, '') === '') {
        min = Math.min(min, indentOf(line))
        fence = null
      }
      continue
    }
    if (open) fence = { char: open[1][0], length: open[1].length }
    min = Math.min(min, indentOf(line))
  }
  if (!Number.isFinite(min)) min = 0
  return bodyLines.map((line) => (isBlank(line) ? '' : stripIndent(line, min)))
}

/**
 * Reads lines into blocks.
 *  { kind: 'text', lines }
 *  { kind: 'box', indent, type, title, details, children }
 *  { kind: 'tabs', indent, items: [{ label, children }] }
 */
function parseRegion(lines, notes) {
  const nodes = []
  const unclosed = unclosedOpeners(lines)
  const text = () => {
    if (!nodes.length || nodes[nodes.length - 1].kind !== 'text') nodes.push({ kind: 'text', lines: [] })
    return nodes[nodes.length - 1].lines
  }

  let i = 0
  let fence = null
  while (i < lines.length) {
    const line = lines[i]

    if (fence) {
      text().push(line)
      const close = line.match(FENCE)
      if (close && close[1][0] === fence.char && close[1].length >= fence.length && line.trim().replace(/[`~]/g, '') === '') fence = null
      i++
      continue
    }
    const open = line.match(FENCE)
    if (open) {
      fence = { char: open[1][0], length: open[1].length }
      text().push(line)
      i++
      continue
    }

    const mk = line.match(MKDOCS_OPENER)
    const colon = !mk && unclosed.has(i) ? line.match(COLON_OPENER) : null

    if (mk || colon) {
      const indent = indentOf(mk ? mk[1] : colon[1])
      // A `:::` opener indented four or more is code, not a box (the check reports those).
      if (colon && indent >= 4) {
        text().push(line)
        i++
        continue
      }
      const rawType = (mk ? mk[3] : colon[3]).toLowerCase()
      const rest = mk ? mk[4] : colon[4]
      const collapsible = mk ? mk[2].startsWith('???') : rawType === 'details'
      const openByDefault = mk ? mk[2] === '???+' : false

      let extent = bodyExtent(lines, i, indent)
      let body = lines.slice(extent.bodyStart, extent.bodyEnd)

      if (!body.some((l) => !isBlank(l))) {
        // The translation tools sometimes wrapped a box's text in a bare code fence
        // (``` with no language). The text is prose, not code, so unwrap it.
        let j = i + 1
        while (j < lines.length && isBlank(lines[j])) j++
        const fenceOpen = j < lines.length ? lines[j].match(/^(\s*)(`{3,}|~{3,})\s*$/) : null
        let closeAt = -1
        if (fenceOpen && indentOf(fenceOpen[1]) <= indent + 3) {
          for (let k = j + 1; k < lines.length; k++) {
            const close = lines[k].match(/^\s*(`{3,}|~{3,})\s*$/)
            if (close && close[1][0] === fenceOpen[2][0] && close[1].length >= fenceOpen[2].length) {
              closeAt = k
              break
            }
          }
        }
        if (closeAt > 0) {
          body = lines.slice(j + 1, closeAt)
          extent = { next: closeAt + 1 }
          notes.converted.unwrappedFences++
        } else if (colon) {
          // A `:::` box whose text was left unindented: take the next paragraph, and say so.
          let k = j
          while (k < lines.length && !isBlank(lines[k]) && !COLON_OPENER.test(lines[k]) && !MKDOCS_OPENER.test(lines[k]) && !/^#{1,6}\s/.test(lines[k]) && !FENCE.test(lines[k])) k++
          if (k > j) {
            body = lines.slice(j, k)
            extent = { next: k }
            notes.review.push(`line ${i + 1}: "${line.trim().slice(0, 50)}" had no indented text, so the next paragraph was used as its body`)
          } else {
            extent = { next: i + 1 }
            notes.review.push(`line ${i + 1}: "${line.trim().slice(0, 50)}" has no text, so it was closed straight away`)
          }
        }
      }

      let type = rawType
      if (collapsible) type = 'details'
      else if (mk) {
        if (!(rawType in TYPE_MAP)) notes.review.push(`line ${i + 1}: unknown box type "${rawType}", used "note"`)
        type = TYPE_MAP[rawType] || 'note'
      } else if (!KNOWN_TYPES.has(rawType)) {
        if (rawType === 'setting') type = 'details'
        else if (rawType in TYPE_MAP) type = TYPE_MAP[rawType]
        else notes.review.push(`line ${i + 1}: unknown box type "${rawType}"`)
      }
      if (openByDefault) notes.review.push(`line ${i + 1}: "???+" opened by default in MkDocs; VitePress details start closed`)

      const keepTitleAsIs = rest.includes('{{')
      const title = keepTitleAsIs ? rest.trim() : cleanTitle(rest)

      nodes.push({
        kind: 'box',
        indent,
        type,
        title,
        converted: mk ? 'mkdocs' : 'unclosed',
        children: parseRegion(dedentBody(body), notes),
      })
      notes.converted[mk ? (collapsible ? 'collapsibles' : 'admonitions') : 'unclosedBoxes']++
      i = extent.next
      continue
    }

    const tab = line.match(TAB_OPENER)
    if (tab && !line.match(/^\s*={3,}\s*$/)) {
      const indent = indentOf(tab[1])
      const items = []
      let cursor = i
      while (cursor < lines.length) {
        const m = lines[cursor].match(TAB_OPENER)
        if (!m || indentOf(m[1]) !== indent) break
        let extent = bodyExtent(lines, cursor, indent)
        let body = lines.slice(extent.bodyStart, extent.bodyEnd)
        // The translation tools sometimes left a tab's text unindented. Then the tab's
        // text is everything up to the next tab, heading or box.
        if (!body.some((l) => !isBlank(l))) {
          const unindented = unindentedTabBody(lines, cursor + 1, indent)
          if (unindented) {
            body = unindented.body
            extent = { next: unindented.next }
            notes.review.push(`line ${cursor + 1}: tab "${cleanTitle(m[2]).slice(0, 40)}" had no indented text, so what follows it was used`)
          }
        }
        items.push({ label: cleanTitle(m[2]), children: parseRegion(dedentBody(body), notes) })
        cursor = extent.next
        // the next tab may follow after blank lines
        let peek = cursor
        while (peek < lines.length && isBlank(lines[peek])) peek++
        const following = peek < lines.length ? lines[peek].match(TAB_OPENER) : null
        if (following && indentOf(following[1]) === indent) cursor = peek
        else break
      }
      nodes.push({ kind: 'tabs', indent, items })
      notes.converted.tabs += items.length
      i = cursor
      continue
    }

    text().push(line)
    i++
  }
  return nodes
}


/**
 * The text of a tab whose text was not indented: from the first non-blank line after
 * it up to the next tab at the same indent, a heading, or a box fence. A code fence
 * is kept whole. Returns null if there is nothing there.
 */
function unindentedTabBody(lines, from, tabIndent) {
  let j = from
  while (j < lines.length && isBlank(lines[j])) j++
  let k = j
  let fence = null
  while (k < lines.length) {
    const line = lines[k]
    if (fence) {
      const close = line.match(FENCE)
      if (close && close[1][0] === fence.char && close[1].length >= fence.length && line.trim().replace(/[`~]/g, '') === '') fence = null
      k++
      continue
    }
    const tab = line.match(TAB_OPENER)
    if (tab && indentOf(tab[1]) === tabIndent) break
    if (/^#{1,6}\s/.test(line) || /^ {0,3}:{3,}/.test(line) || MKDOCS_OPENER.test(line)) break
    const open = line.match(FENCE)
    if (open) fence = { char: open[1][0], length: open[1].length }
    k++
  }
  let end = k
  while (end > j && isBlank(lines[end - 1])) end--
  return end > j ? { body: lines.slice(j, end), next: end } : null
}

/**
 * Translation tools sometimes wrapped a fenced code block in another, bare fence:
 *   ```            <- extra
 *   ```lua
 *   code
 *   ```
 *   ```            <- extra
 * which Markdown reads as the wrong blocks. Removes the two extra lines when the
 * whole shape is there, and leaves anything else alone.
 */
export function unwrapDoubleFences(lines, notes) {
  const out = []
  for (let i = 0; i < lines.length; i++) {
    const outer = lines[i].match(/^(\s*)(`{3,}|~{3,})\s*$/)
    if (outer) {
      let j = i + 1
      while (j < lines.length && isBlank(lines[j])) j++
      const inner = j < lines.length ? lines[j].match(/^(\s*)(`{3,}|~{3,})\s*\S+/) : null
      if (inner) {
        let k = j + 1
        while (k < lines.length && !/^\s*(`{3,}|~{3,})\s*$/.test(lines[k])) k++
        let m = k + 1
        while (m < lines.length && isBlank(lines[m])) m++
        if (k < lines.length && m < lines.length && /^\s*(`{3,}|~{3,})\s*$/.test(lines[m])) {
          out.push(...lines.slice(j, k + 1))
          notes.converted.unwrappedFences++
          i = m
          continue
        }
      }
    }
    out.push(lines[i])
  }
  return out
}

/**
 * A `:::` box that was already closed still needs its type and title tidied: a
 * quoted title shows its quote marks in VitePress, and some MkDocs types have no
 * counterpart. Boxes already in good shape are left exactly as they are.
 */
export function normalizeOpener(line) {
  const m = line.match(COLON_OPENER)
  if (!m || indentOf(m[1]) >= 4) return line
  const [, lead, colons, type, rest] = m
  let newType = type
  if (type === 'setting') newType = 'details'
  else if (!KNOWN_TYPES.has(type) && type in TYPE_MAP) newType = TYPE_MAP[type]
  const title = rest.includes('{{') ? rest.trim() : cleanTitle(rest)
  const out = `${lead}${colons} ${newType}${title ? ' ' + title : ''}`
  return out === line.trimEnd() ? line : out
}

/** How many levels of box sit inside (0 for plain text). */
const height = (node) => {
  if (node.kind === 'text') return 0
  const kids = node.kind === 'box' ? node.children : node.items.flatMap((item) => item.children)
  return 1 + Math.max(0, ...kids.map(height))
}

const trimBlank = (lines) => {
  let start = 0
  let end = lines.length
  while (start < end && isBlank(lines[start])) start++
  while (end > start && isBlank(lines[end - 1])) end--
  return lines.slice(start, end)
}

function render(nodes, indentPrefix = '') {
  const out = []
  for (const node of nodes) {
    if (node.kind === 'text') {
      // Text read from inside a box was dedented; put the indentation back.
      out.push(...node.lines.map((line) => (isBlank(line) || indentPrefix === '' ? line : indentPrefix + line)))
      continue
    }
    const colons = ':'.repeat(2 + height(node))
    const outer = indentPrefix + ' '.repeat(node.indent)
    if (node.kind === 'box') {
      out.push(`${outer}${colons} ${node.type}${node.title ? ' ' + node.title : ''}`)
      out.push(...trimBlank(render(node.children, outer)))
      out.push(`${outer}${colons}`)
    } else {
      out.push(`${outer}${colons} tabs`, '')
      node.items.forEach((item, index) => {
        if (index) out.push('')
        out.push(`${outer}== ${item.label}`, '')
        out.push(...trimBlank(render(item.children, outer)))
      })
      out.push('', `${outer}${colons}`)
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// The smaller conversions
// ---------------------------------------------------------------------------

/**
 * `![x](a.png#only-dark){width="450"}` is MkDocs Material's way to show an image
 * only in dark mode. VitePress ignores the suffix and shows both images, so it
 * becomes a class (`{.only-dark width="450"}`) that the theme's CSS hides in the
 * other mode.
 */
export function convertThemeImages(line) {
  return line.replace(/(!\[[^\]]*\]\()([^)\s]+?)#only-(dark|light)(\))(\{([^}]*)\})?/g, (_all, open, url, mode, close, _braces, attrs) => {
    const existing = (attrs || '').trim()
    return `${open}${url}${close}{.only-${mode}${existing ? ' ' + existing : ''}}`
  })
}

/**
 * `:material-information-outline:{ title="..." }` after a rule is an info icon
 * with a tooltip. VitePress has no Material icons, and the `{...}` would attach
 * the title to the whole list item, so it becomes an inline span the theme styles.
 */
export function convertInfoTooltips(line) {
  return line.replace(/:material-information-outline:\{\s*title="([^"]*)"\s*\}/g, (_all, title) => `<span class="info-tooltip" title="${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}">ⓘ</span>`)
}

/** MkDocs `hide:` front matter -> the VitePress equivalents. */
export function convertFrontMatter(lines, notes) {
  if (!lines.length || lines[0].trim() !== '---') return lines
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---')
  if (end < 0) return lines
  const front = lines.slice(1, end)
  const kept = []
  const hidden = []
  for (let i = 0; i < front.length; i++) {
    if (/^hide:\s*$/.test(front[i])) {
      while (i + 1 < front.length && /^\s+-\s+\S/.test(front[i + 1])) hidden.push(front[++i].replace(/^\s+-\s+/, '').trim())
      continue
    }
    kept.push(front[i])
  }
  if (kept.length === front.length) return lines
  if (hidden.includes('navigation')) kept.push('sidebar: false')
  if (hidden.includes('toc')) kept.push('aside: false')
  notes.converted.frontMatter++
  const rest = lines.slice(end + 1)
  if (!kept.length) return rest[0] !== undefined && isBlank(rest[0]) ? rest.slice(1) : rest
  return ['---', ...kept, '---', ...rest]
}

/** Applies a per-line conversion outside fenced code. */
function mapProse(lines, fn, notes, key) {
  const marked = splitLines(lines.join('\n'))
  return lines.map((line, i) => {
    if (marked[i].code) return line
    const next = fn(line)
    if (next !== line) notes.converted[key]++
    return next
  })
}

/**
 * MkDocs reads Markdown inside an HTML block that has a `markdown` attribute
 * (`<figure markdown>`). VitePress follows CommonMark: the block is raw HTML until
 * a blank line, so the image inside shows as the text `![](...)`. Dropping the
 * attribute and putting a blank line inside each end makes the inside Markdown.
 */
export function convertMarkdownBlocks(lines, notes) {
  const marked = splitLines(lines.join('\n'))
  const out = []
  const open = []
  lines.forEach((line, i) => {
    if (marked[i].code) return out.push(line)
    // GitLocalize left the whole block on one line: <figure markdown="">![](a.png)</figure>
    const inline = line.match(/^(\s*)<(figure|section|details|aside|article)\b([^>]*?)\smarkdown(?:=["']?1?["']?)?([^>]*)>(.+)<\/\2>\s*$/)
    if (inline) {
      out.push(`${inline[1]}<${inline[2]}${inline[3]}${inline[4]}>`, '', inline[5].trim(), '', `${inline[1]}</${inline[2]}>`)
      notes.converted.markdownBlocks = (notes.converted.markdownBlocks || 0) + 1
      return
    }
    const opener = line.match(/^(\s*)<(figure|section|details|aside|article)\b([^>]*?)\smarkdown(?:=["']?1?["']?)?([^>]*)>\s*$/)
    if (opener) {
      out.push(`${opener[1]}<${opener[2]}${opener[3]}${opener[4]}>`)
      if (lines[i + 1] !== undefined && lines[i + 1].trim()) out.push('')
      open.push(opener[2])
      notes.converted.markdownBlocks = (notes.converted.markdownBlocks || 0) + 1
      return
    }
    const closer = line.match(/^\s*<\/(\w+)>\s*$/)
    if (closer && open.length && open[open.length - 1] === closer[1]) {
      open.pop()
      if (out.length && out[out.length - 1].trim()) out.push('')
    }
    out.push(line)
  })
  return out
}

// ---------------------------------------------------------------------------
// Grid cards
// ---------------------------------------------------------------------------

const decodeEntities = (text) => text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&')

/** The icon shortcodes MkDocs Material puts in front of a title or a link text. */
const stripIcons = (text) => text.replace(/:(?:material|fontawesome|octicons|simple)-[a-z0-9-]+:(?:\{[^}]*\})?\s*/g, '')

/** One card written as MkDocs markdown: a `- :icon:{ .lg .middle } **Title**` line and an indented body after `---`. */
function cardsFromMarkdown(body) {
  const items = []
  for (const line of body) {
    const start = line.match(/^[-*]\s+(.*)$/)
    if (start) {
      const title = stripIcons(start[1]).replace(/^(__|\*\*)(.*)\1\s*$/, '$2').trim()
      items.push({ title, lines: [] })
    } else if (items.length) {
      items[items.length - 1].lines.push(line.replace(/^( {2,4})/, ''))
    }
  }
  for (const item of items) {
    item.lines = item.lines.filter((line, i, all) => !(line.trim() === '---' && all.slice(0, i).every((l) => !l.trim() || l.trim() === '---')))
  }
  return items
}

/** The same cards after GitLocalize turned the markdown into HTML (`<ul data-md-type="list">`). */
function cardsFromHtml(body) {
  const html = body.join('\n')
  const items = []
  for (const li of html.matchAll(/<li data-md-type="list_item"[^>]*>([\s\S]*?)<\/li>/g)) {
    const parts = []
    let title = ''
    for (const block of li[1].matchAll(/<p data-md-type="paragraph">([\s\S]*?)<\/p>|<div data-md-type="block_html">\n?([\s\S]*?)\n?<\/div>/g)) {
      if (block[2] !== undefined) {
        parts.push('', ...block[2].split('\n'))
        continue
      }
      const text = decodeEntities(
        block[1]
          .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/g, '**$1**')
          .replace(/<code[^>]*>([\s\S]*?)<\/code>/g, '`$1`')
          .replace(/<a href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
      )
      if (!title && /\*\*/.test(text)) title = stripIcons(text).replace(/^\*\*(.*)\*\*\s*$/, '$1').trim()
      else parts.push('', stripIcons(text).trim())
    }
    items.push({ title, lines: parts })
  }
  return items
}

/**
 * A MkDocs "grid of cards" has no VitePress equivalent, and its icons are text
 * there. It becomes a numbered list: bold title, then the card's text and link.
 * Handles the markdown form and the HTML GitLocalize left in the translations.
 */
export function convertGridCards(lines, notes) {
  const start = lines.findIndex((line) => /^<div[^>]*class="[^"]*\bgrid\b[^"]*\bcards\b[^"]*"[^>]*>\s*$/.test(line))
  if (start < 0) return lines
  const html = lines[start + 1]?.trim() === '</div>' && /^<ul data-md-type/.test(lines[start + 2] || '')
  let end
  if (html) {
    end = lines.findIndex((line, i) => i > start + 2 && /^<div data-md-type="block_html"><\/div>\s*$/.test(line))
  } else {
    end = lines.findIndex((line, i) => i > start && /^<\/div>\s*$/.test(line))
  }
  if (end < 0) {
    notes.review.push({ line: start + 1, text: 'A grid of cards could not be converted: its end was not found.' })
    return lines
  }
  const items = html ? cardsFromHtml(lines.slice(start + 2, end)) : cardsFromMarkdown(lines.slice(start + 1, end))
  if (!items.length) return lines
  const out = []
  items.forEach((item, i) => {
    out.push(`${i + 1}. **${item.title}**`)
    const body = []
    for (const line of item.lines) {
      const text = stripIcons(line).replace(/^\[\s+/, '[')
      if (!text.trim() && (!body.length || !body[body.length - 1].trim())) continue
      body.push(text)
    }
    while (body.length && !body[body.length - 1].trim()) body.pop()
    if (body.length && body[0].trim()) body.unshift('')
    for (const line of body) out.push(line.trim() ? '   ' + line : '')
    out.push('')
  })
  while (out.length && !out[out.length - 1].trim()) out.pop()
  notes.converted.gridCards = (notes.converted.gridCards || 0) + 1
  return [...lines.slice(0, start), ...out, ...lines.slice(end + 1)]
}

/**
 * Converts one page. Returns `{ text, changed, converted, review }`:
 *  - `converted` counts what was changed, by kind,
 *  - `review` lists anything a person should look at.
 */
export function convertPage(source) {
  const eol = source.includes('\r\n') ? '\r\n' : '\n'
  const notes = { converted: { admonitions: 0, collapsibles: 0, unclosedBoxes: 0, tabs: 0, frontMatter: 0, themeImages: 0, infoTooltips: 0, unwrappedFences: 0, openerTitles: 0 }, review: [] }

  let lines = source.replace(/\r\n?/g, '\n').split('\n')
  lines = convertFrontMatter(lines, notes)
  lines = unwrapDoubleFences(lines, notes)
  lines = convertGridCards(lines, notes)
  lines = convertMarkdownBlocks(lines, notes)
  lines = render(parseRegion(lines, notes))
  lines = mapProse(lines, normalizeOpener, notes, 'openerTitles')
  lines = mapProse(lines, convertThemeImages, notes, 'themeImages')
  lines = mapProse(lines, convertInfoTooltips, notes, 'infoTooltips')

  const text = lines.join('\n').replace(/\n/g, eol)
  return { text, changed: text !== source, converted: notes.converted, review: notes.review }
}
