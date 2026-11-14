# Chirag Duhoon, Portfolio

Live: [chiragduhoon.github.io/portfolio](https://chiragduhoon.github.io/portfolio/)

Personal portfolio of an AI engineering student at Bennett University: projects, achievements, certifications and contact.

## What's inside

- Selected work: Sanjeevani (AI healthcare triage, live demo), Indian food classification and calorie estimation, vehicle number plate detection.
- Achievements: Drono War 1.0 (2nd place FPV racing and autonomous mission, Rs 1,00,000+ prize), TechBlaze 1.0 second runner-up, Deep Sight Challenge.
- Certifications, photo gallery, contact, privacy policy, terms and a custom 404 page.

## Built with

Plain HTML, CSS and vanilla JavaScript. No framework, no build step. Hosted on GitHub Pages.

- Geist typeface via Google Fonts, Phosphor icons via CDN
- Scroll reveal, active nav tracking and the sticky header all use `IntersectionObserver` (no scroll listeners)
- Native `<dialog>` lightbox with captions
- Respects `prefers-reduced-motion`, keyboard accessible, skip link, visible focus states

## Run locally

```bash
git clone https://github.com/chiragduhoon/portfolio.git
cd portfolio
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Custom domain

To serve the site from your own domain instead of `chiragduhoon.github.io/portfolio`:

1. Buy a domain from any registrar.
2. In the registrar's DNS settings add either:
   - a `CNAME` record for `www` pointing to `chiragduhoon.github.io`, and
   - four `A` records for the apex (`@`) pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
3. Add a file named `CNAME` to the root of this repo containing only the domain, for example `www.chiragduhoon.com`.
4. In the repo go to Settings, Pages, set the custom domain, and turn on "Enforce HTTPS" once the certificate is issued.
5. Update the `<link rel="canonical">` and `og:url` tags in `index.html`, and change the absolute `/portfolio/` paths in `404.html` to `/`.

GitHub's reference: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## A note on reuse

Read the code and borrow techniques freely. The personal content (photos, resume, certificates and text) is mine and not for reuse.
