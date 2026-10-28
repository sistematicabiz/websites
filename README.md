# websites

Eleventy sources for two static sites, built from one repo:

| Site | Folder | Pages |
| --- | --- | --- |
| laurasegafredo.com | `sites/laura/` | Home, About, Writing & Podcast (Moral Revolution), Finance & Climate, Teaching & Research, Land & Regeneration, Speaking & Press, Contact |
| sistematica.biz | `sites/sistematica/` | One page: hero, what I do, why Sistem(at)ica, collaborations, about, testimonial, contact |

## Layout

```
shared/
  css/tessera.css         Tessera design system (custom CSS, mobile first)
  data/profile.json       name, headshot, LinkedIn, contact emails (both sites)
  data/roles.json         Laura's roles, shown as chips (both sites)
  img/                    headshot and other shared images
  js/nav.js               mobile menu toggle
  eleventy.shared.js      shared Eleventy setup
sites/laura/
  src/*.md                one Markdown file per page
  src/_data/              nav.json, press.json, site.json
  src/_includes/          layouts and partials
  src/css/site.css        site-specific CSS
  netlify.toml
sites/sistematica/
  src/index.njk           the one-pager
  src/_data/              services, collaborations, testimonial, site
  src/css/site.css
  netlify.toml
```

## Editing content

- **Page text (laurasegafredo.com):** edit the Markdown in `sites/laura/src/`. The `abstract` in each page's front matter is used both as the page intro and on its Home tile.
- **Press entries:** `sites/laura/src/_data/press.json`.
- **Roles, headshot, LinkedIn:** `shared/data/`. Replace `shared/img/headshot.svg` with a real photo and update `profile.json`.
- **sistematica.biz sections:** the JSON files in `sites/sistematica/src/_data/` plus the copy in `src/index.njk`.

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

Each `netlify.toml` sets the build command and publish folder. Builds are triggered on every push to `main`.

**Contact forms** use Netlify Forms (`contact-laura`, `contact-sistematica`). After the first deploy, open *Site configuration → Forms → Form notifications* on each site and add an email notification:

- laurasegafredo.com → laura.segafredo@gmail.com
- sistematica.biz → sistematicabiz@gmail.com
