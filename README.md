# websites

Two static sites built with [Eleventy 3](https://www.11ty.dev/) from one codebase:

| Site | Source | Output | Default theme |
|---|---|---|---|
| laurasegafredo.com | `sites/laura/` | `sites/laura/_site/` | `primari` |
| Sistematica | `sites/sistematica/` | `sites/sistematica/_site/` | `verde` |

## Layout

```
content/               text and data (Markdown/YAML), edited through the CMS (see content/README.md)
  <site>/settings.yml  site title, URL, colour theme
  laura/pages/         text of each laura page (one file per page)
  media/               all images, including CMS uploads (served at /media/ on both sites)
shared/
  eleventy/            shared Eleventy setup (site-config.js) and the CMS collection loader
  _includes/           Nunjucks layouts, partials and macros used by both sites
  css/ js/             static assets (CSS copied unchanged from the Campiture mockups)
sites/<site>/
  eleventy.config.js   per-site config (calls shared/eleventy/site-config.js)
  netlify.toml         per-site Netlify build
  src/                 pages; src/_data/nav.yml is the main menu
sites/laura/src/admin/ Sveltia CMS (served at /admin/ on the laura site only)
design-reference/      the chosen Campiture mockups and the full copy (reference only, not built)
```

The colour theme is set per site in `content/<site>/settings.yml` and written to
`<html data-theme="...">`. There is no public theme switcher. Available themes are in `shared/css/themes.css`.

## Commands

Node 22 (see `.nvmrc`). Always run from the repo root.

```bash
npm install
npm run dev:laura          # http://localhost:8080
npm run dev:sistematica    # http://localhost:8081
npm run build              # both sites
```

## Deploy (Netlify)

One Netlify site per website, both connected to this repo:
Base directory empty (repo root), Package directory `sites/laura` or `sites/sistematica`.
Each `netlify.toml` skips the build when nothing that site depends on has changed.

## CMS

Sveltia CMS at `https://<laura site>/admin/`, configured in `sites/laura/src/admin/config.yml`
(GitHub backend on `main`, editorial workflow: every change is a draft pull request until published).
Login uses a GitHub OAuth App registered on the laura Netlify site.
