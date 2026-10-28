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
  data/profile.json       name, headshot, LinkedIn, site URLs, Moral Revolution links
  data/roles.json         current roles (About page list + sistematica chips)
  img/                    headshot, podcast, farminary, vatican, logo
  eleventy.shared.js      shared Eleventy setup
sites/laura/src/
  *.md / index.njk        one file per page; front matter `tile:` feeds the Home mosaic
  _data/press.json        Speaking & Press entries
  _data/nav.json          main navigation
  _includes/              layouts and the artwork placeholder partial
sites/sistematica/src/
  index.njk               the one-pager
  _data/                  practice areas, sample engagements, collaborations, testimonial
```

`reference/` (the plan, mockups and original images) is kept locally and is git-ignored.

## Editing content

- **Page text (laurasegafredo.com):** the Markdown in `sites/laura/src/`.
- **Home tiles:** the `tile:` block in each section page's front matter.
- **Press entries:** `sites/laura/src/_data/press.json`. An entry with an empty `url` shows its `todo` note instead of a link.
- **Roles, headshot, LinkedIn:** `shared/data/`.
- **Artwork placeholders:** search for `partials/art.njk` and replace each include with a `<figure class="frame">` holding the image.

## Commands

```sh
npm install
npm run dev:laura          # http://localhost:8081
npm run dev:sistematica    # http://localhost:8082
npm run build              # builds both into sites/*/_site
```

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
