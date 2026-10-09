/**
 * Finds assets a built page asks for that are not in the build.
 *
 * VitePress only publishes what is under docs/public (copied as it is) and what
 * a page imports with a relative path (renamed with a hash). A path such as
 * `/assets/core/logo.png` written in the config or a page's front matter is
 * neither, so the page builds fine and the image 404s on the live site.
 * Reading the built HTML finds that.
 */

import fs from 'node:fs'
import path from 'node:path'

const ASSET_EXTENSIONS = 'png|jpe?g|gif|svg|webp|avif|ico|css|js|mjs|woff2?|ttf|json|mp4|webm'

/** Every `src="/..."` and `href="/..."` for a file, in one page's HTML. */
export function ownSiteAssetUrls(html) {
  const urls = new Set()
  const pattern = new RegExp(`(?:src|href|srcset)="(/[^"#?]*\\.(?:${ASSET_EXTENSIONS}))(?:[?#][^"]*)?"`, 'gi')
  for (const match of String(html).matchAll(pattern)) urls.add(decodeURIComponent(match[1]))
  return [...urls]
}

/** True if `file` exists under `root`, with the same upper and lower case on every part (as on Linux). */
export function existsExactCase(root, file) {
  let dir = root
  for (const part of file.split('/').filter(Boolean)) {
    let entries
    try {
      entries = fs.readdirSync(dir)
    } catch {
      return false
    }
    if (!entries.includes(part)) return false
    dir = path.join(dir, part)
  }
  return true
}

/** `{ page, url }` for each asset a built page requests that is missing from the build. */
export function findMissingAssets(distDir) {
  const missing = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith('.html')) {
        const page = path.relative(distDir, full).split(path.sep).join('/')
        for (const url of ownSiteAssetUrls(fs.readFileSync(full, 'utf8'))) {
          if (!existsExactCase(distDir, url)) missing.push({ page, url })
        }
      }
    }
  }
  walk(distDir)
  return missing
}
