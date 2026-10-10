# BeamMP Docs

The BeamMP documentation site, built with [VitePress](https://vitepress.dev). We are glad you are here: this hopefully means you want to help improve the docs. Please read the below, as it will help you get started.

> [!NOTE]
> **This repository is the VitePress rebuild of the docs**, previewed at <https://docs.beammp.dev>. The live site at <https://docs.beammp.com> is still built from [BeamMP/Docs](https://github.com/BeamMP/Docs) with MkDocs until this one replaces it. Content changes made there are merged in here regularly.

## Contributing

There are two ways to help.

### 1. Edit the Markdown files

This is the fastest way for spelling, grammar and small additions.

1. Open the page you want to change under `docs/` and click edit.
2. Fork the project into your own GitHub account and make your changes.
3. Raise a pull request against this repository.

A member of the BeamMP Mod Team will review it. Once it is merged it is deployed automatically.

### 2. Edit with a live preview

1. Fork and clone the project.
2. Install [Node.js](https://nodejs.org) 22 or newer, then run `npm install`.
3. Run `npm run dev` and open the address it prints. The page updates as you edit.
4. Make your changes, then run `npm test` and `npm run check` (see below).
5. Commit to your fork and raise a pull request.

## Writing pages

Pages are Markdown, with VitePress extensions. The old MkDocs syntax does **not** work here.

| You want | Write this |
|---|---|
| A note, tip, warning or danger box | `::: warning` on one line, the text, then `:::` on its own line |
| A box with a title | `::: tip My title` |
| A collapsible section | `::: details Title` ... `:::` |
| A less common box | `::: info`, `::: note` or `::: question` |

Always close a box with `:::`. A box that is left open swallows the rest of the page.

How a page should read (voice, page layout, when to use each box, images, links, the words we use) is in the [style guide](STYLE_GUIDE.md). Please read it before writing a new page.

## Checks

```bash
npm test                      # tests for the check tooling itself
npm run check                 # checks the pages, and fails if anything got worse
npm run check:translations    # lists translations that are out of date (warns, never fails)
```

`npm run check` looks for MkDocs syntax that VitePress does not understand, boxes that are left open, pages that do not compile, dead links, missing images, and old addresses of the previous site that no longer work. It has no known problems today: `scripts/docs-check-baseline.json` is empty and should stay that way. A pull request that adds a problem fails the check.

The tests, the check and a build run on every pull request.

## Deployment

Every push to `main` is built and published to GitHub Pages by `.github/workflows/deploy.yml`. Pull requests run the tests, the checks and a build, and do not publish.

## Project layout

    docs/
        .vitepress/   # Site configuration, navigation, theme, and site.ts (the repository and address).
        en/ de/ ...   # The pages, one folder per language, each at its final path.
        assets/       # Images and other files.
    scripts/          # The check tooling, its baseline, old-addresses.txt and translation-sources.json (see below).
    tests/            # Tests for the check tooling.
    STYLE_GUIDE.md    # How a page is written.

The English folder is the master: the other languages follow it. A page that moved keeps its old
address through `movedPages` in `docs/.vitepress/config.mts`, which writes a small redirect page
for it. `scripts/old-addresses.txt` is the sitemap of the old MkDocs site, and `npm run check`
fails if any of those addresses stops working.

## Translations

The docs are in English, German, Spanish, French, Italian, Russian and Chinese. English is the master: every other language folder has the same pages at the same paths, and a page is changed in English first.

### When you change an English page

1. Make the change in `docs/en/`.
2. Run `npm run check:translations`. It lists the translations that are now out of date, because the English page they were made from changed. A shared part (`_parts/`) counts for every page that includes it.
3. Update each translation, or say in your pull request which ones you could not do. The list is a warning, not a failure, so an English change is never blocked by it, but the languages fall behind until someone updates them.
4. After you update a translation from the current English, record it:

   ```bash
   npm run check:translations -- --record de/players/faq.md   # one language
   npm run check:translations -- --record en/players/faq.md   # every language that has the page
   ```

   This writes `scripts/translation-sources.json`. Record only when the translation matches the English, because the list trusts it.

### How to translate

- Translate the text, not the code. Commands, file names, settings keys, Lua and TOML stay as they are, and so do links to other pages (only the language part of the path changes, for example `/en/` to `/de/`).
- Keep the structure: the same headings, boxes, images and links as the English page.
- **BeamMP's own labels** (the mod's settings and buttons): the game shows them in the player's language where the mod has a translation. For French and Chinese the mod has one, so use the exact label from the mod's `locales/translations/<language>/beammp/` files. For German, Spanish, Italian and Russian the game shows the English label, so keep the English label in the translated page.
- Labels that belong to BeamNG.drive itself are written as the game shows them in that language.
- Do not change the legacy scripting page (`developers/beammp-scripting/server/legacy-v2.md`) in any language. It is not maintained.
- A native speaker reading a page is welcome at any time: open a pull request with the corrections.

