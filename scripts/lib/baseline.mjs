/**
 * The ratchet. Today many pages still have problems left over from the move to
 * VitePress. Rather than block every change until they are all fixed, the
 * known problems are saved in a baseline file. A check then fails only when a
 * page gets WORSE than its baseline (a new problem, or more of one), and tells
 * you when pages have got better so the baseline can be updated. Over time the
 * baseline shrinks to nothing.
 */

/** Dead links found in a VitePress build's output, as `{ file, link }`. */
export function parseDeadLinks(output) {
  const clean = String(output).replace(/\x1b\[[0-9;]*m/g, '')
  const found = []
  for (const match of clean.matchAll(/Found dead link (\S+) in file (\S+)/g)) {
    found.push({ link: match[1], file: normalizePagePath(match[2]) })
  }
  return found
}

/**
 * `/any/where/Docs/en/x.md`, `docs/en/x.md` or `en/x.md` -> `docs/en/x.md`
 * (the folder's case differs between platforms, and VitePress sometimes gives
 * the path relative to the docs folder).
 */
export function normalizePagePath(file) {
  const path = String(file).replace(/\\/g, '/')
  if (/(?:^|\/)docs\//i.test(path)) return path.replace(/^.*?(?:^|\/)docs\//i, 'docs/')
  return 'docs/' + path.replace(/^\.?\//, '')
}

/**
 * Errors VitePress prints while rendering pages (they do not fail the build, so
 * they would otherwise go unnoticed), as `{ file, message }`. VitePress names
 * the page only by the temporary file it compiled, `en_server_x.md.js`, so it
 * is matched back to the real page by that name.
 */
export function parseRenderErrors(output, pageNames) {
  const clean = String(output).replace(/\x1b\[[0-9;]*m/g, '')
  const byTempName = new Map(pageNames.map((name) => [name.replace(/^docs\//, '').replace(/\//g, '_'), name]))
  const errors = []
  const lines = clean.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (!/^Error: /.test(lines[i])) continue
    let file = '(unknown page)'
    for (let j = i + 1; j < lines.length && /^\s+at /.test(lines[j]); j++) {
      const temp = lines[j].match(/\.vitepress\/\.temp\/(.+?\.md)\.js/)
      if (temp) {
        file = byTempName.get(temp[1]) || '(unknown page)'
        break
      }
    }
    errors.push({ file, message: lines[i].slice('Error: '.length).slice(0, 160) })
  }
  return errors
}

/**
 * `{ "docs/en/x.md": { rule: count } }` from per-page problem counts and the
 * dead links per page. Dead links count under the rule `dead-link`.
 */
export function buildSnapshot(pageCounts, deadLinks = [], renderErrors = []) {
  const snapshot = {}
  for (const [file, counts] of Object.entries(pageCounts)) {
    if (Object.keys(counts).length) snapshot[file] = { ...counts }
  }
  for (const { file } of deadLinks) {
    snapshot[file] = snapshot[file] || {}
    snapshot[file]['dead-link'] = (snapshot[file]['dead-link'] || 0) + 1
  }
  for (const { file } of renderErrors) {
    snapshot[file] = snapshot[file] || {}
    snapshot[file]['render-error'] = (snapshot[file]['render-error'] || 0) + 1
  }
  return sortSnapshot(snapshot)
}

export function sortSnapshot(snapshot) {
  const out = {}
  for (const file of Object.keys(snapshot).sort()) {
    out[file] = {}
    for (const rule of Object.keys(snapshot[file]).sort()) out[file][rule] = snapshot[file][rule]
  }
  return out
}

/**
 * What changed against the baseline.
 *  - `worse`: a page has a problem the baseline does not allow (new, or more of it).
 *  - `better`: a page has fewer problems than the baseline records.
 */
export function compareToBaseline(current, baseline) {
  const worse = []
  const better = []
  const files = new Set([...Object.keys(current), ...Object.keys(baseline)])
  for (const file of [...files].sort()) {
    const now = current[file] || {}
    const was = baseline[file] || {}
    for (const rule of new Set([...Object.keys(now), ...Object.keys(was)])) {
      const a = now[rule] || 0
      const b = was[rule] || 0
      if (a > b) worse.push({ file, rule, was: b, now: a })
      else if (a < b) better.push({ file, rule, was: b, now: a })
    }
  }
  return { worse, better }
}

/** Totals per rule across the whole snapshot: `{ rule: { count, pages } }`. */
export function totalsByRule(snapshot) {
  const totals = {}
  for (const counts of Object.values(snapshot)) {
    for (const [rule, count] of Object.entries(counts)) {
      totals[rule] = totals[rule] || { count: 0, pages: 0 }
      totals[rule].count += count
      totals[rule].pages += 1
    }
  }
  return totals
}
