/**
 * The addresses of the live MkDocs site (docs.beammp.com) must keep working when this
 * site replaces it, or every link anyone has shared or bookmarked breaks.
 * scripts/old-addresses.txt is that site's sitemap, as paths. MkDocs served English at the
 * root and the other languages under their code, so `/server/create-a-server/` is English.
 * Both forms need a page or redirect page at exactly that address.
 */

import fs from 'node:fs'
import path from 'node:path'

/** True if a built site has something at this address (a page, or a redirect page). */
export function resolvesInBuild(distDir, address) {
  const file = path.join(distDir, decodeURIComponent(address.split(/[?#]/)[0]))
  if (address.endsWith('/')) return fs.existsSync(path.join(file, 'index.html'))
  return fs.existsSync(file + '.html') || fs.existsSync(path.join(file, 'index.html')) || fs.existsSync(file)
}

/**
 * The old addresses that lead nowhere in the build. An address is checked as it is: the old English
 * `/server/create-a-server/` needs a page or redirect page at that very address, not just somewhere
 * under `/en/`, because that is what a visitor with the old link requests.
 */
export function findMissingOldAddresses(distDir, addresses) {
  return addresses.filter((address) => !resolvesInBuild(distDir, address))
}

export function readOldAddresses(file) {
  return fs.readFileSync(file, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean)
}
