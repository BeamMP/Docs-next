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

The docs are translated into several languages, using [GitLocalize](https://gitlocalize.com/repo/9180). GitLocalize can show a paragraph as "not translated" when it already is, so check that a page is not already translated before you change it.
