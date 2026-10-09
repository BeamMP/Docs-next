/**
 * Where this site lives. These are the only two values to change when it replaces the
 * live docs (docs.beammp.com, built from BeamMP/Docs with MkDocs): everything else reads them.
 *
 *  - REPO is used by the repository card in the header, the "edit this page" link, the
 *    "View on GitHub" button on each home page and the pull request steps in the contributing
 *    pages. In page text, write `https://github.com/__repo__` for a link and `@repo@` for the
 *    name; the build fills them in.
 *  - HOSTNAME is the address the sitemap lists. DOCS_HOSTNAME overrides it for a one-off build.
 */
export const REPO = 'BeamMP/Docs-next'
export const HOSTNAME = process.env.DOCS_HOSTNAME || 'https://docs.beammp.dev'

/** What a page writes where the repository goes: in a link address, and as text. */
export const REPO_PLACEHOLDER = '__repo__'
export const REPO_NAME_PLACEHOLDER = '@repo@'
