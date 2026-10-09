# BeamMP Docs style guide

This is how a page is written. The English page is the master: the other
languages follow it, so what is decided here applies to all of them.

The goal of every page is that a reader with one problem finds the answer in under a minute.

## Who we write for

Three audiences, which are the three sections of the navigation: **players** (install, join, fix
problems), **server owners** (host, forward ports, maintain), **developers** (scripting, mods, the game's
own APIs). Write for one of them per page and say which at the top if it is not obvious. Assume
the reader knows how to play BeamNG.drive and nothing else.

## Voice

- Talk to the reader: "you", present tense, active voice. "Open the Launcher", not "The Launcher
  should be opened".
- Short sentences, one idea each. If a sentence needs a second comma, split it.
- Say what to do before why. Put the reason after the step, if it is needed at all.
- No jokes, idioms or slang ("fire up", "a piece of cake"): they translate badly.
- No filler ("simply", "just", "easily", "obviously"). If it were obvious they would not be reading.
- No temporary language ("currently", "recently", "new feature"). Write what is true, and if it is
  tied to a version, name the version.

## Anatomy of a page

```markdown
---
description: "One or two sentences, up to 160 characters, saying what the page helps you do."
---
# Forward ports for your server

One sentence saying who this is for and what they will have at the end.

## Before you start

## Steps
```

1. **One `# Title`** per page, in Title Case, the same words as the navigation entry (a reference page may add
   what it is a reference for, such as "Server Scripting Reference (Version 3.X)"). No
   "Introduction", "Overview" or "Guide" as a title on its own.
2. **A `description:`** in the front matter on every page. It is what search results and the card a
   shared link shows (Discord, Slack) display, so write it for a stranger. Without one, the first
   paragraph is used, which is usually not as good. Put it in double quotes: a colon inside an
   unquoted description breaks the page.
3. **An opening sentence** under the title: who it is for and what they get.
4. **Headings** `##` and `###` only, in sentence case ("Forward the port", not "Forward The
   Port"). Do not skip levels. Do not number headings by hand; number the steps in a list.
5. **No "this site is under construction" box.** A page is either ready to link or not published.

## Steps and lists

- A procedure is a numbered list, one action per item, starting with a verb. Put the result after it:
  "Click **Apply**. The server restarts."
- A list of options or facts is a bullet list. Three or more items; otherwise write a sentence.
- Do not nest more than two levels. Split the page instead.

## Boxes

Use a box only when the reader could get hurt or lose time by missing it.

| Box | Use it for |
|---|---|
| `::: danger` | Data loss, a security risk, something that cannot be undone |
| `::: warning` | A step that often goes wrong, or a limit the reader must know |
| `::: tip` | A shortcut or better way, never a required step |
| `::: info` | A fact that helps but is not needed to finish |
| `::: details Title` | Long optional material (a table of every option, a long log) |
| `::: question Title` | A short question and answer inside a longer page |

`note`, `quote`, `success`, `failure`, `bug` and `example` exist but are rare: ask whether a plain
sentence works first. A page with more than three boxes has too many. The exception is a reference page that lists many
items, such as the settings page, where each item can be a `::: details` entry. Never put a step inside a
box. Give a box a title only if it adds something ("Windows only"); otherwise leave it out.

## Code, commands and names

- Commands, file names, paths, settings and values go in `code`. A block of more than one line
  goes in a fenced block with its language (` ```lua `, ` ```toml `, ` ```bash `).
- Things the reader clicks or sees in a window are **bold**, spelled exactly as they appear.
- Keys are written `Ctrl` + `C`.
- Do not translate or reformat code, or put prompts (`$`) in front of commands someone will copy.
- Show a setting with its default and what it does: `Port = 30814` is the port players connect to.

## Images

- Only when a picture saves a paragraph: a window that is hard to find, a setting that is easy to
  misread. Not for decoration.
- Always alt text that says what the picture shows, not "image" or "screenshot".
- Store in `docs/assets/content/`, named for what it shows (`router-port-forwarding.png`).
  Do not write `<figure>` or width attributes in a page; images fill the column.
- If the picture looks wrong on the other theme (a white window on a dark page), give a light and a
  dark version: `![Alt text](/assets/content/name-light.png){.only-light}` and the same with
  `-dark` and `{.only-dark}`. Crop to the relevant part.
- Never a screenshot containing someone's name, IP address, key or account details.

## Shared parts

When the same steps belong on two pages (getting an AuthKey is on both server setup pages), write them once in a
`_parts` folder next to the pages and include them: `<!--@include: ./_parts/authkey.md-->`. A part is not a
page of its own. Write its images and links as they should look from the pages that include it.

## Downloads

A file the reader downloads (a zip, an installer) goes in `docs/public/assets/content/` and is linked with a
root path: `[examplePlugin.zip](/assets/content/ResourcesForExamplePlugin.zip)`. A relative link to a file
is not published and gives a 404.

## Links

- Link to other docs pages with the full path, no extension: `[Port forwarding](/en/server-owners/port-forwarding)`.
  Not relative paths, not `.md`. The build repairs a few mistakes but the check fails on a dead link.
- Link text says where it goes ("the port forwarding guide"), never "here" or the URL.
- The repository is written `https://github.com/__repo__` and `@repo@`, never typed out.
- An outside link goes to the most stable page, not a search or a login.

## Words we use

| Write | Not |
|---|---|
| BeamMP, BeamNG.drive | BeamMp, BeamNG, Beamng |
| the Launcher (the BeamMP Launcher, capital L) | the launcher, the loader |
| server, mod | Server or Mod in the middle of a sentence |
| AuthKey | auth key, Authkey |
| port forwarding | port-forwarding as a noun |
| sign in (verb), sign-in (noun) | login as a verb |
| Windows, Linux, macOS | MacOS, win |

Spell out an acronym the first time on a page: "Carrier-grade NAT (CGNAT)".

## Writing for translation

Every page is translated into six languages, by people and tools that see one sentence at a time.

- One idea per sentence, subject and verb close together.
- Same word for the same thing within a page and across pages (see the table above).
- No sentence that depends on a picture or on the sentence before it.
- Put what must not change (names, code, settings) in `code` or bold so it is clear.
- Do not edit a translated page for facts: change the English page, and the translation follows.
- A new English page shows in another language's menus only once that language has the page, so
  nobody is sent to a page that is not there. Until then that language keeps its old page, if it has one.

## What the build checks

`npm run check` stops these: dead links, `:::` boxes that are not closed, MkDocs leftovers
(`!!!`, `===`, `:material-...:`), images that do not exist, pages that do not render, and any
address of the old MkDocs site that would stop working. Voice, headings and descriptions are for
the person writing and the person reviewing.

## Before you open a pull request

- [ ] A `description:` and one `# Title` that matches the navigation.
- [ ] Every step tested by doing it, on the version the page names.
- [ ] No box that is not needed; no step inside a box.
- [ ] `npm run check` passes.
- [ ] You looked at the page, in light and dark, on a narrow window.
