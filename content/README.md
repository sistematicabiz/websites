# Content

Text and data for the two sites, edited through the CMS (`/admin/` on the laura site).
Each folder of `.md` files is a CMS collection: front matter = fields, body = long text.

- `laura/settings.yml`, `sistematica/settings.yml`: site-wide settings (title, URL, colour theme, links, footer)
- `laura/pages/`, `sistematica/pages/`: the text and photos of each page (CMS: Pages (Laura), Pages (Sistematica)).
  Headings accept `&shy;` to mark where a long word may break; longer texts are Markdown.
- `laura/speaking/`: Speaking & Press items (the /speaking/ page; `featured: true` also shows them on the home page)
- `shared/roles/`: Laura's roles, used by About, Finance & Climate and the Sistematica bio
- `sistematica/collaborations/`: "Selected collaborations" on the Sistematica home page
- `media/`: all images (including the original mockup photos), served at `/media/` by both sites

Lists are sorted by `order` (lowest first, missing last), then by `date` (newest first).
After changing the CMS config or a content file by hand, run `npm run check:cms`: it lists keys the CMS
would drop on save, missing required fields, invalid select values and missing images.
