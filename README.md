# websites

Eleventy sources for two static sites, built from one repo:

| Site | Folder | Pages |
| --- | --- | --- |
| laurasegafredo.com | `sites/laura/` | Home, About, Writing & Podcast (Moral Revolution), Finance & Climate, Teaching & Research, Land & Regeneration, Speaking & Press, Contact |
| sistematica.biz | `sites/sistematica/` | One page: hero, what I do, why Sistem(at)ica, selected collaborations, about, testimonial, contact |

Both use design direction B, "Tessera" (Bodoni Moda + Jost, colour bands, triangle-mosaic frames).

## Layout

```
shared/
  css/tessera.css         design B stylesheet, mobile first (adapted from the mockup's b.css)
  js/tessera.js           draws the triangle mosaics into <canvas data-tessera>
  js/nav.js               mobile menu toggle (laurasegafredo.com)
  data/profile.yaml       name, headshot, LinkedIn, site URLs, Moral Revolution links
  data/roles.yaml         current roles (About page list + sistematica chips)
  img/                    headshot, podcast, farminary, vatican, logo
  eleventy.shared.js      shared Eleventy setup
sites/laura/src/
  *.md / index.njk        one file per page; front matter `tile:` feeds the Home mosaic
  _data/press.yaml        Speaking & Press entries
  _data/nav.yaml          main navigation
  _includes/              layouts and the artwork placeholder partial
sites/sistematica/src/
  index.njk               the one-pager
  _data/                  practice areas, sample engagements, collaborations, testimonial
```

`reference/` (the plan, mockups and original images) is kept locally and is git-ignored.

## Editing content

All data files are YAML (`.yaml`). Each one starts with a comment explaining its fields.

- **Page text (laurasegafredo.com):** the Markdown in `sites/laura/src/`.
- **Home tiles:** the `tile:` block in each section page's front matter.
- **Press entries:** `sites/laura/src/_data/press.yaml`. An entry with an empty `url` shows its `todo` note instead of a link.
- **Roles, headshot, LinkedIn:** `shared/data/`.
- **Artwork placeholders:** search for `partials/art.njk` and replace each include with a `<figure class="frame">` holding the image.

## Latest Moral Revolution posts

The Writing & Podcast page shows the three newest posts from the Moral Revolution Substack as cards. It works in
three pieces:

- `npm run fetch:substack` (`scripts/fetch-substack.js`) reads the RSS feed (`<substack address>/feed`, from
  `shared/data/profile.yaml`) and writes the latest posts to `sites/laura/src/_data/substack.yaml`. The file is only
  rewritten when the posts changed. Don't edit it by hand: the next fetch overwrites it.
- `sites/laura/src/_includes/partials/substack-posts.njk` renders the cards. A page includes it with
  `{% set substackCount = 3 %}{% include "partials/substack-posts.njk" %}`.
- The build itself only reads `substack.yaml`, so it never needs the network.

**On your Mac:** run `npm run fetch:substack` to pick up new posts, then commit `substack.yaml`.
**On Netlify:** the build command runs the fetch first, so every deploy shows the latest posts. A new post only appears
after a deploy.

If the feed can't be reached (offline, Substack down, 10-second timeout), the fetch leaves `substack.yaml` untouched and
the build carries on with the committed posts. With no `substack.yaml` at all, the cards section is left out. To test the
fallback: `SUBSTACK_FEED=https://feed.invalid/feed npm run fetch:substack`.

## Commands

```sh
npm install
npm run dev:laura          # http://localhost:8081
npm run dev:sistematica    # http://localhost:8082
npm run build              # builds both into sites/*/_site
npm run build:local        # builds both into sites/*/_local, for opening from Finder
```

The normal build (`_site`, what Netlify publishes) uses root paths like `/css/…`, which only work on a web server. `build:local` writes a separate copy with relative links, so you can double-click `sites/laura/_local/index.html` or `sites/sistematica/_local/index.html` and browse every page from disk. Fonts still load from Google Fonts (needs internet), and the contact forms only work on Netlify.

## Deploying on Netlify

Create **two** Netlify sites from this same GitHub repo:

| Netlify setting | laurasegafredo.com | sistematica.biz |
| --- | --- | --- |
| Base directory | *(empty, repo root)* | *(empty, repo root)* |
| Package directory | `sites/laura` | `sites/sistematica` |

Each `netlify.toml` sets the build command and publish folder, and skips the build when nothing in that site, `shared/` or the dependencies changed.

**Contact forms** use Netlify Forms (`contact-laura`, `contact-sistematica`). After the first deploy, open *Site configuration → Forms → Form notifications* on each site and add an email notification:

- laurasegafredo.com → laura.segafredo@gmail.com
- sistematica.biz → sistematicabiz@gmail.com
