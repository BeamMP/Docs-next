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
npm test            # tests for the check tooling itself
npm run check       # checks the pages, and fails if anything got worse
```

`npm run check` looks for MkDocs syntax that VitePress does not understand, boxes that are left open, pages that do not compile, and dead links. Many pages still have problems from the move to VitePress, so they are saved in `scripts/docs-check-baseline.json`. The check fails only when a page gets **worse** than its baseline. When you fix problems, run `npm run check:update-baseline` and commit the smaller file, so they stay fixed.

The same checks run on every pull request.

## Deployment

Every push to `main` is built and published to GitHub Pages by `.github/workflows/deploy.yml`. Pull requests run the tests, the checks and a build, and do not publish.

## Project layout

    docs/
        .vitepress/   # Site configuration, navigation, theme, and site.ts (the repository and address).
        en/ de/ ...   # The pages, one folder per language, each at its final path.
        assets/       # Images and other files.
    scripts/          # The check tooling, its baseline, and old-addresses.txt (see below).
    tests/            # Tests for the check tooling.
    STYLE_GUIDE.md    # How a page is written.

The English folder is the master: the other languages follow it. A page that moved keeps its old
address through `movedPages` in `docs/.vitepress/config.mts`, which writes a small redirect page
for it. `scripts/old-addresses.txt` is the sitemap of the old MkDocs site, and `npm run check`
fails if any of those addresses stops working.

## Translations

The BeamMP Docs are translated in multiple languages. The current progress of this sits at: [![gitlocalized ](https://gitlocalize.com/repo/9180/whole_project/badge.svg)](https://gitlocalize.com/repo/9180?utm_source=badge)

We use [GitLocalize](https://gitlocalize.com/) for managing this. You can contribute if you wish here: https://gitlocalize.com/repo/9180

The individual language progress is as follows:

| Language | Badge                                                                                                                     |
|----------|---------------------------------------------------------------------------------------------------------------------------|
| German   | [![gitlocalized ](https://gitlocalize.com/repo/9180/de/badge.svg)](https://gitlocalize.com/repo/9180/de?utm_source=badge) |
| Spanish  | [![gitlocalized ](https://gitlocalize.com/repo/9180/es/badge.svg)](https://gitlocalize.com/repo/9180/es?utm_source=badge) |
| French   | [![gitlocalized ](https://gitlocalize.com/repo/9180/fr/badge.svg)](https://gitlocalize.com/repo/9180/fr?utm_source=badge) |
| Italian  | [![gitlocalized ](https://gitlocalize.com/repo/9180/it/badge.svg)](https://gitlocalize.com/repo/9180/it?utm_source=badge) |
| Russian  | [![gitlocalized ](https://gitlocalize.com/repo/9180/ru/badge.svg)](https://gitlocalize.com/repo/9180/ru?utm_source=badge) |
| Chinese  | [![gitlocalized ](https://gitlocalize.com/repo/9180/zh/badge.svg)](https://gitlocalize.com/repo/9180/zh?utm_source=badge) |

> [!NOTE]
> GitLocalize may show some paragraphs as "not translated" while in fact they already are, messing up the whole page.
>
> Please double check if the page is already translated before committing anything!
