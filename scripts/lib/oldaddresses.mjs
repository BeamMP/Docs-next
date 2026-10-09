/**
 * The addresses of the live MkDocs site (docs.beammp.com) must keep working when this
 * site replaces it, or every link anyone has shared or bookmarked breaks.
 * scripts/old-addresses.txt is that site's sitemap, as paths. MkDocs served English at the
 * root and the other languages under their code, so `/server/create-a-server/` is English.
 */

import fs from 'node:fs'
import path from 'node:path'

const LANGUAGE_FOLDERS = ['en', 'de', 'es', 'fr', 'it', 'ru', 'zh']

/** True if a built site has something at this address (a page, or a redirect page). */
export function resolvesInBuild(distDir, address) {
  const file = path.join(distDir, decodeURIComponent(address.split(/[?#]/)[0]))
  if (address.endsWith('/')) return fs.existsSync(path.join(file, 'index.html'))
  return fs.existsSync(file + '.html') || fs.existsSync(path.join(file, 'index.html')) || fs.existsSync(file)
}

/** The old addresses that lead nowhere in the build. */
export function findMissingOldAddresses(distDir, addresses) {
  return addresses.filter((address) => {
    const first = address.split('/')[1]
    const site = LANGUAGE_FOLDERS.includes(first) ? address : '/en' + address
    return !resolvesInBuild(distDir, site) && !resolvesInBuild(distDir, address)
  })
}

export function readOldAddresses(file) {
  return fs.readFileSync(file, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean)
}
