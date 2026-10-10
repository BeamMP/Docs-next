---
description: "Help improve the BeamMP docs: edit a page on GitHub, preview your changes locally, follow the style guide, and what happens when you open a pull request."
---
# Contributing

You can help improve these docs by fixing a mistake, adding something missing, or writing a page. This page shows how.

## Before you write

Read the [style guide](https://github.com/__repo__/blob/main/STYLE_GUIDE.md). It says how a page should read, when to use each box, and how to write images and links.

The English pages are the master. Change the English page, and the other languages follow. To help translate, see [Translating](#translating).

## Edit a page on GitHub

This is the fastest way for spelling, grammar and small additions. It needs some knowledge of Markdown.

1. Click **Edit this page** at the bottom of the page you want to change.
2. Fork the project into your own GitHub account.
3. Make your changes.
4. Commit them to your fork.
5. Open a pull request against [@repo@](https://github.com/__repo__).

## Preview your changes locally

For anything bigger, preview your changes as you write.

1. Fork the project and clone your fork.
2. Install [Node.js](https://nodejs.org) 22 or newer, then run `npm install`.
3. Run `npm run dev` and open the address it prints. The page updates as you edit.
4. Make your changes, then run `npm test` and `npm run check`. The check finds dead links, unclosed boxes, missing images and pages that do not render.
5. Commit to your fork and open a pull request.

## What happens next

A member of the BeamMP Mod Team reviews your pull request, and either approves it or asks for changes. When you have made the changes, we review it again. Once it is merged, it is deployed automatically.

## Translating

English is the master. The other languages have the same pages at the same paths, so a change starts in the English page.

1. Run `npm run check:translations`. It lists the translations that are out of date because their English page changed.
2. Update each one from the English page. Keep the headings, boxes, images and links, and do not translate code, commands, file names or settings keys.
3. Record the update: `npm run check:translations -- --record de/players/faq.md`.

For the mod's own settings and buttons, French and Chinese use the exact labels from the mod's translation files. German, Spanish, Italian and Russian keep the English labels, because the game shows English there. The full rules are in the [README](https://github.com/__repo__#translations).
