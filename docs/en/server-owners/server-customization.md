---
description: "Make your BeamMP server stand out in the server list: format its name and description with colours and styles, and add tags so players can find it."
---
# Server Customization

This page shows how to change the way your server looks in the server list. Set these values in `ServerConfig.toml`, or in the matching fields of your hosting panel. For every other setting, see [Server Configuration](/en/server-owners/configuration).

## Name and description

- `Name` is the name of your server in the server list.
- `Description` is the description of your server in the server list. It shows only for a public server.

The BeamMP backend limits how long they can be. See [Limits](/en/server-owners/manual#limits).

## Format the name and description {#format-the-name-and-description}

Put a code in front of the text you want to change. A colour code replaces the colour before it. Style codes, such as bold, add to each other. `^r` clears all colours and styles. For example, `Name = "^l^4Red and bold^r normal text"` shows "Red and bold" in bold red, then "normal text" with no formatting.

| Value | Color | Value | Effect |
|:-----:|-------|:-----:|--------|
| `^0` | <span class="mp-color mp-color-0">Black</span> | `^r` | <span class="mp-effect">Reset</span> (clears all colors and effects) |
| `^1` | <span class="mp-color mp-color-1">Blue</span> | `^p` | <span class="mp-effect">New<br>line</span> (descriptions only) |
| `^2` | <span class="mp-color mp-color-2">Green</span> | `^n` | <span class="mp-effect mp-underline">Underline</span> |
| `^3` | <span class="mp-color mp-color-3">Baby blue</span> | `^l` | <span class="mp-effect mp-bold">Bold</span> |
| `^4` | <span class="mp-color mp-color-4">Red</span> | `^m` | <span class="mp-effect mp-line-through">Strike-through</span> |
| `^5` | <span class="mp-color mp-color-5">Pink</span> | `^o` | <span class="mp-effect mp-italic">Italic</span> |
| `^6` | <span class="mp-color mp-color-6">Orange</span> |  |  |
| `^7` | <span class="mp-color mp-color-7">Grey</span> |  |  |
| `^8` | <span class="mp-color mp-color-8">Dark grey</span> |  |  |
| `^9` | <span class="mp-color mp-color-9">Light purple</span> |  |  |
| `^a` | <span class="mp-color mp-color-a">Light green</span> |  |  |
| `^b` | <span class="mp-color mp-color-b">Light blue</span> |  |  |
| `^c` | <span class="mp-color mp-color-c">Light red</span> |  |  |
| `^d` | <span class="mp-color mp-color-d">Light pink</span> |  |  |
| `^e` | <span class="mp-color mp-color-e">Yellow</span> |  |  |
| `^f` | <span class="mp-color mp-color-f">White</span> |  |  |

Type a name below to see how it looks in the server list:

<ServerNamePreview />

## Add tags {#add-tags}

Tags let players search for a type of server. A new `ServerConfig.toml` has the tag `Freeroam`: `Tags = "Freeroam"`.

To add more, separate them with commas: `Tags = "Events,Offroad,Lang:English"`. Tags are not case sensitive. Choose them from this list:

::: tabs

== Age/Content

- `Mature/18+`

== Gameplay Types

- `Freeroam`
- `Roleplay`
- `Economy`
- `Traffic`
- `Challenge`
- `Drift`

== Racing Categories

- `Racing`
- `Racing:NASCAR`
- `Racing:Track`
- `Racing:Drag`
- `Racing:Rally`
- `Touge`

== Off-Roading

- `Offroad`
- `Crawling`
- `Rally`
- `Dakar`

== Destruction Events

- `Derby`
- `Arena`

== Weather and Time Conditions

- `Snow/Ice`
- `Rain`
- `Night`
- `Weather`

== Gamemodes

- `Gamemode`
- `Gamemode:Racing`
- `Gamemode:Rally`
- `Gamemode:Drag`
- `Gamemode:Derby`
- `Gamemode:Infection`
- `Gamemode:Cops-Robbers`
- `Gamemode:Delivery`
- `Gamemode:Sumo`

== Community and Events

- `Scenarios`
- `Events`
- `Leaderboard`

== Mods

- `Modded`
- `Mod:BeamPaint`
- `Mod:BeamJoy`
- `Mod:CEI`

== Languages

- `Lang:English`
- `Lang:Russian`
- `Lang:French`
- `Lang:Spanish`
- `Lang:Portuguese`
- `Lang:German`
- `Lang:Polish`
- `Lang:Arabic`

== Other

- `Vanilla`
- `Moderated`

:::


If a tag you need is missing, request it in the [server tags thread on the forum](https://forum.beammp.com/t/introducing-server-tags/1320081).
