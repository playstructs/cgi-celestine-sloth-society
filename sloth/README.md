# The Celestine Sloth Society overlay

Everything in this directory is applied to the `structs-webapp` submodule as it
is built. Nothing in the submodule is edited. The client stays in English;
there is no translation layer.

| Path | What it is |
|---|---|
| `patches.cjs` | `[exact upstream text, replacement]` pairs per upstream file: the guild connection, recovery, the telemetry name, players' own pictures, the sloth picker, sign-up without a recovery key, Download Player, and the Celestine Sloth Society in place of SN Corp in sign-up and the tutorial |
| `runtime/` | Loaded before webapp's entry as `__sloth`: `guild` (`guild.js`, the services of the guild the page plays through, the Celestine Sloth Society `0-13`), `recovery` (`recovery.js`, moving a recovered player of another guild into it), `pfp` (`pfp.js`, every portrait showing the player's `pfp` URL over the generated one, and setting a sign-up sloth as `pfp` on chain), `sloths` (`sloths.js`, the Celestine Sloths gallery, at sign-up and on a member's own profile) and `account` (`account.js`, creating the account at sign-up without a recovery key section, and Download Player in place of Log Out) |
| `public/` | Static files served over webapp's: `guild.json` (guild `0-13`'s on-chain endpoint), `favicon.ico`, and `sloth/` with `sloth.css`, the sign-up badge, the guild logo, icons and `sloths/`, every sloth's picture |
| `page.cjs` | Renders webapp's Twig page (`templates/`) to `index.html`, adding Google Tag Manager (`GTM-58HZKHDD`), the icons and `sloth.css` |
| `overlay.cjs`, `loader.cjs` | Apply `patches.cjs` to each source file webpack reads |
| `check.cjs` | `npm run check` / `npm test`: stale or orphaned patches, SN Corp left on screen, guild.json against `GUILD_ID` |

## Writing a patch

```js
'js/view_models/signup/Orientation7ViewModel.js': [
  ['on behalf of SN.CORPORATION.`', 'on behalf of CELESTINE SLOTH SOCIETY.`'],
],
```

- The first string is copied exactly from the upstream file; every occurrence
  is replaced, in one pass, longest first.
- Include enough around it (quotes, tags) that it only matches what you mean,
  never an id, class, storage key or anything sent to the guild or the chain.
  CSS classes such as `snc-logo` keep webapp's names.
- One key per upstream file: a second entry for the same file replaces the
  first.

## The art

All of it is made from the Celestine Sloth Society archive in
`../CelestineSlothSociety` (retrieved from celestineslothsociety.com, the
collection's IPFS files and @CelestineSloths):

- `public/sloth/sloths/<id>.webp`: every sloth, `#1` to `#2500`, resized from
  the collection's 1200px PNGs (`CelestineSlothSociety/images/`) to 320px WebP
  at quality 82, about 16 KB each and 40 MB in all (the originals are 526 MB).
  To remake them:

  ```bash
  seq 1 2500 | xargs -P 16 -I{} cwebp -quiet -resize 320 320 -q 82 -m 6 -sharp_yuv ../CelestineSlothSociety/images/{}.png -o sloth/public/sloth/sloths/{}.webp
  ```

- `public/sloth/img/celestine-sloth-society-badge.png`: the website's
  wordmark, re-stacked as CELESTINE / SLOTH / SOCIETY in the top of a 384px
  square, the shape of webapp's 192px sign-up logo slot, with "THE LAZIEST
  SPACE CONQUEST." set under it by webapp's own motto line.
- `celestine-sloth-society-logo.jpg`: the collection cover, 512px, for
  `guild.json`.
- `apple-touch-icon.png` is the social avatar (the wordmark over sloths);
  `favicon.ico` and `favicon-32x32.png` are sloth #1's face, which reads better
  than lettering at 16–48px.
