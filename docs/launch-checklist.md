# Launch checklist

Follow these steps in order. Everything else is already in the repository.

## 1. Netlify sites

Create two sites with **Add new project > Import an existing project > GitHub > `sistematicabiz/websites`**, branch `main`.

| Setting | Laura | Sistematica |
|---|---|---|
| Base directory | empty | empty |
| Package directory | `sites/laura` | `sites/sistematica` |
| Build command | from `netlify.toml` | from `netlify.toml` |
| Publish directory | from `netlify.toml` | from `netlify.toml` |

- [ ] Create the Laura site.
- [ ] Create the Sistematica site.
- [ ] If the import screen has no Package directory field, set it in **Project configuration > Developer settings > Continuous deployment > Build settings > Configure**, then redeploy.
- [ ] Check that each deploy log runs the right `npm run build:...` command.
- [ ] Open both `*.netlify.app` addresses and click through every page.

## 2. CMS login

- [ ] In GitHub, open **Settings > Developer settings > OAuth Apps > New OAuth App**.
  - Homepage URL: `https://laurasegafredo.com`
  - Authorization callback URL: `https://api.netlify.com/auth/done`
- [ ] Copy the Client ID, generate a Client Secret and copy it. It is shown only once.
- [ ] On the **Laura** Netlify site, open **Project configuration > Security > OAuth > Install Provider**, choose GitHub and paste both values. This is not the Identity section.
- [ ] Open `https://<laura-site>.netlify.app/admin/` and sign in with GitHub.
- [ ] Make a small test edit, save it, check its preview, publish it, then revert it.
- [ ] If the preview button does not appear, tell the developer: `preview_context` may need setting in the CMS config.
- [ ] Check that **Ready** and **Publish** work. Sveltia approves the pull request when an entry moves to Ready, and GitHub does not allow approving your own, so do not require pull request approvals on `main`.

## 3. Forms

- [ ] In **Forms** on each site, enable form detection, then redeploy so the form is registered.
- [ ] Check that the forms appear as `contact-laura` and `contact-sistematica`.
- [ ] Add an email notification to the dedicated contact address (to be created) on each site: **Project configuration > Notifications > Emails and webhooks > Form submission notifications**.
- [ ] Send a test message from each site. It should land on the thank-you page and reach the inbox.

**Spam:** both forms have a hidden honeypot field (`company-website`), and Netlify also filters submissions automatically. Check the **Spam** tab under Forms now and then, since real messages are occasionally caught. If spam becomes a problem, turn on reCAPTCHA for the form.

## 4. Daily Substack rebuild

- [ ] On the Laura site, open **Project configuration > Developer settings > Continuous deployment > Build hooks** and add a hook named `Daily rebuild` for branch `main`.
- [ ] In GitHub, open **Settings > Secrets and variables > Actions** and add the secret `NETLIFY_BUILD_HOOK_LAURA` with the hook URL.
- [ ] In the **Actions** tab, run **Daily rebuild (Laura)** by hand and check that a new Netlify deploy starts.

GitHub pauses scheduled workflows after 60 days without repository activity on public repositories. If the list stops updating, re-enable the workflow in the Actions tab.

## 5. Domains and HTTPS

Lower the DNS TTL a day ahead if the domains are already in use, and note the current records first.

- [ ] Confirm the real address of Sistematica. The code assumes `https://sistematica.biz`.
- [ ] Add `laurasegafredo.com` under **Domain management** on the Laura site.
- [ ] Add `sistematica.biz` under **Domain management** on the Sistematica site.
- [ ] Create the DNS records Netlify shows for the apex and `www` of each domain, keeping any existing email (MX) records.
- [ ] Wait for the HTTPS certificates, then enable **Force HTTPS** if it is offered.
- [ ] Check that `www` redirects to the main address.
- [ ] If the domain differs from the settings, update **Site address** and the Sistematica links in the CMS.

## 6. Laura's access

- [ ] Add Laura to `sistematicabiz/websites` with the **Write** role. Read-only accounts cannot sign in to the CMS.
- [ ] Laura accepts the invitation and signs in at `https://laurasegafredo.com/admin/`.
- [ ] Share `docs/editing-guide.md` with Laura.

## 7. Before announcing

- [ ] Replace the placeholder testimonial on Sistematica, or clear its quotation to hide it.
- [ ] Add the NABE link, if there is one.
- [ ] Replace the placeholder favicon and share images when the logo is ready.
- [ ] Test a shared link with the LinkedIn Post Inspector.
- [ ] Submit both `sitemap.xml` files in Google Search Console.
- [ ] Check a wrong address on each site to see the 404 page.
