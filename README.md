# sloths.structs.zone — Structs for the Celestine Sloth Society

The [structs-webapp](https://github.com/playstructs/structs-webapp) game client
for the [Celestine Sloth Society](https://www.celestineslothsociety.com/)'s
Structs guild (`LAZY`, guild `0-13`, "The laziest space conquest").
structs-webapp is a git submodule (`structs-webapp/`, following its `main`) and
its client is built as it is: its own JavaScript, page, styles and art, in
English, with its webpack configuration as the starting point. What this
repository adds is the overlay in [`sloth/`](sloth/README.md), applied while
webpack reads webapp's sources. Nothing in the submodule is edited, so a newer
structs-webapp builds with the same overlay.

Only the client side is used. This site hosts no guild API of its own: the page
talks straight to the guild's API, its GRASS feed and its chain node, which
`beta.playstructs.com` runs for the Celestine Sloth Society.

Onboarding and tutorial telemetry is reported with the interface name
`sloths.structs.zone`, so these runs can be told apart from other clients' in
the guild's reports (`?interface_name=sloths.structs.zone`).

## Setup

```bash
git clone --recurse-submodules <this repository>
npm install          # also installs structs-webapp/src's own dependencies
npm run dev          # http://localhost:5199
```

## Updating structs-webapp

```bash
npm run update:webapp
```

This moves the submodule to the latest `main`, installs its dependencies and
runs the check, which lists what the update touched:

| Report | Meaning | What to do |
|---|---|---|
| `stale` | upstream changed the text a patch replaces | fix the patch in `sloth/patches.cjs` |
| `orphan` | a patched upstream file is gone | move or delete its patches |
| `branding` | SN Corp is named somewhere a player sees | add a patch naming the Celestine Sloth Society |
| `guild` | `sloth/public/guild.json` and `GUILD_ID` disagree | fix whichever is wrong |

`npm test` fails while any remain. The build shows stale patches as warnings.
Commit the submodule pointer together with the overlay.

## Profile pictures

Every portrait (the HUD, profile, guild roster, player search, scans, spectator
and device activation) shows the player's own picture, their `pfp` on chain,
when it is a URL a browser can load: `https` (`http` is upgraded), or `ipfs://`,
`ipns://` and `ar://` through the ipfs.io and arweave.net gateways. webapp's
generated portrait stays underneath, and shows when a player has no such
picture or it fails to load (`sloth/runtime/pfp.js`). Sector Blitz's public
raid lists are the exception: the guild API sends them only the generated
portrait's attributes, so they show a player's picture only when it is in
those too, as it is for everyone who signs up here.

### The Celestine Sloths gallery

This site hosts every sloth's picture, `#1` to `#2500`, as 320px WebP in
[`sloth/public/sloth/sloths/`](sloth/public/sloth/sloths), so any sloth is one
link:

```
https://sloths.structs.zone/sloth/sloths/<id>.webp
```

At sign-up, **Choose Sloth** beside the generated picture opens a gallery of
all of them, edge to edge in one endless scroll (more are added as the player
nears the end; images load as they come into view). A player who knows their
sloth's number finds it: the gallery jumps to it and outlines it. Clicking a
sloth chooses it. No wallet is involved: the picture is the player's choice
(`sloth/runtime/sloths.js`). The gallery's controls are webapp's own SUI
components: screen buttons, the text input and the close link. **Find** is on
only for a number the collection has. On a short screen its number field and
close link share one row.

That URL can't go into the sign-up request's `pfp`: the guild API requires it
to be JSON, which the chain then refuses as a pfp. So it goes in
`pfp_client_render_attributes` as `url` (beside the generated layers, which
other clients keep showing), the player joins with it, and when they first play,
their own key sets their `pfp` on chain to the same URL
(`MsgPlayerUpdatePfp`).

Members who have already joined change their picture from their own profile:
the edit button on their portrait opens the same gallery over the profile, and
the sloth they click becomes their `pfp` on chain at once, signed by their own
key (`MsgPlayerUpdatePfp`); the profile and HUD show it, and a line under their
name says whether it went through (`sloth/runtime/sloths.js`).

Any copy of a sloth's picture a player may have set as their `pfp` (this
site's, or the collection's `ipfs://bafybeifihpm…/<id>.png`, directly or
through any IPFS gateway) is shown from this site's copy: the same picture, a
fraction of the size of the 1200px originals.

## Sign-up and the player's key

Sign-up has no recovery key section: once the player has chosen their name,
the page makes their account's key (a mnemonic) and creates the account
straight away, with nothing shown, explained or confirmed, and goes on to
Success. If the guild can't create it, the player sees why and can try again
with the same key (`sloth/runtime/account.js`).

The Account page has **Download Player** where webapp has **Log Out**: a text
file, `<name>-<player id>.structs-player.txt`, holding the mnemonic this
browser signs with. After sign-up that is the account's own key; after an
account recovery or a device activation it is this browser's device key, which
can recover the player too, for as long as that device stays registered.

## Which guild

The site is the Celestine Sloth Society's: its guild is `0-13`, fixed in
`webpack.config.js` (`GUILD_ID`), and never looked up. Webapp normally asks its
guild API which guild it is (`/guild/this`), but the Celestine Sloth Society
shares SN Corp's API, so the page asks for `/guild/0-13` instead.

Before webapp's code starts, the page reads `0-13`'s `guild.json` (the endpoint
the guild set on chain, `https://sloths.structs.zone/guild.json`, which this
site serves from [`sloth/public/guild.json`](sloth/public/guild.json)) for its
`guild_api`, `grass_nats_websocket` and `client_websocket`
(`sloth/runtime/guild.js`). If it can't be read, it uses what it last read,
then the fallback in `webpack.config.js`. Requests carry a bearer token from the
guild's `/api/auth/token` (the same signed login as `/api/auth/login`), since a
guild's session cookie would be third-party here.

Account recovery asks the chain which guild the key's player is in before it
calls the guild API, since a shared API may log in another guild's player. A
player of another guild is moved here first: the key signs
`MsgGuildMembershipJoin` for this guild (allowed when its join minimum is 0),
and recovery goes on once the chain shows the move and the guild API knows the
player. Recovery stops instead when the player owns their guild, the guild asks
a join minimum, or the chain can't be read (`sloth/runtime/recovery.js`).

| Variable (build time) | Default | |
|---|---|---|
| `SLOTH_LCD_URL` | `https://public.testnet.structs.network` | the chain node the guild is read from |
| `SLOTH_GUILD_API` | — | a fixed guild API (a local guild in development), skipping guild.json |
| `SLOTH_GRASS_URL`, `SLOTH_CHAIN_WS` | — | override what the guild publishes |

### On chain

| | |
|---|---|
| Guild | `0-13` Celestine Sloths (the chain allows 20 characters; the site and guild.json say Celestine Sloth Society), tag `LAZY`, owned by founder player `1-14676` (`structs1c73xt4f8x2tz6mywrcwjh8252eurk4r32wp6da`) |
| Primary reactor | `3-12` NodeSafe (`structsvaloper1fz6cxatcuk9dkmdks9zun9rpn66g93et7anm64`) |
| Entry substation | `4-24`, fed by allocation `6-74` from the guild's own stake |
| Joining | open: join minimum 0, invite bypass permissioned |
| Endpoint | `https://sloths.structs.zone/guild.json` |
| Sign-up (TSA) | player `1-14677` (`structs1vjlzzupf3d6j3rj05v0m3gyfc2z29qfwqnanaq`), the host's proxy-join signer: 512 (GuildMembership) on `0-13`, 1024 (SubstationConnection) on `4-24` |
| Bank denom | `lates` / `ulates` (in guild.json) |

## Building and serving

```bash
npm run build        # dist/
```

`dist/` is a static site: `index.html` (webapp's game page), `sector-blitz/`
(webapp's public Sector Blitz leaderboard, and one page per sector), the bundles in
`js/` and webapp's `css/`, `img/`, `lottie/` and fonts, plus `guild.json` and
the Celestine Sloth Society's art in `sloth/` (the pictures are about 40 MB of
the 68 MB). It uses absolute paths, so serve it from the root of
`sloths.structs.zone`; it needs nothing else on that domain, but `guild.json`
must be readable cross-origin (`Access-Control-Allow-Origin: *`), since other
clients read it, as should `sloth/sloths/` if other clients are to show these
pictures as players' `pfp`. GitHub Pages sends that header for every file.
`.github/workflows/pages.yml` publishes it there.

## Licences

structs-webapp is Apache-2.0 (Slow Ninja Inc). The Celestine Sloth Society
artwork in `sloth/public/` (the collection's pictures by Steven Kimura, its
wordmark, cover and social avatar) is the Celestine Sloth Society's own, used
for its guild.
