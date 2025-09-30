# Crossing All Borders Ministries

A fast, secure, and maintainable static site for Crossing All Borders Ministries.

Website: https://crossingallborders.org

## Summary

This repository builds a static website using Eleventy (11ty). Content is authored in Markdown and rendered with Nunjucks templates. Styling is theme-driven via CSS variables. 

Donations (cash/online) are processed through the Vanco system.

See the repository LICENSE for terms: ./LICENSE

## Key features

- Static site powered by Eleventy
- Light/dark theme support via CSS variables
- Responsive homepage (hero + cards/slideshow) optimized for mobile and desktop
- Swiper-based slideshow support for featured content
- Serverless email handling via Netlify Functions (nodemailer)
- VANCO integration for donation processing
- Cache-busting for static assets

## Tech stack

- Eleventy (11ty)
- Nunjucks templates in src/_includes
- Markdown content in src/content
- CSS variables for theming in src/assets/css
- JS enhancements in src/assets/js
- Netlify for deployment and Netlify Functions for server-side tasks

## How it works

- Templates: shared partials live in src/_includes (header.njk, footer.njk, css.njk, etc.).
- Home page: uses a centered responsive hero and tile/card components or a Swiper slideshow. 
- Assets: CSS/JS/images are passthrough-copied and cache-busted during build.
- Email: serverless function sends site emails; credentials live in Netlify environment variables.
- Donations: links/forms integrate with Vanco; sensitive keys and redirect URLs are stored in environment configuration.

## Project structure (high level)

- src/
  - _includes/ — Nunjucks partials
  - assets/
    - css/ — global and section styles
    - js/ — theme, header, slideshow scripts
    - images/ — logos and photos
  - content/ — Markdown pages and dev logs
- .eleventy.js — Eleventy configuration and passthroughs
- netlify.toml — Netlify build/dev config
- netlify/functions/ — serverless functions (email, validation)
- _site/ — generated output
- README.md — this document
- LICENSE — see repository root (link only)

## Development

Requirements: Node.js 18+

Install:
```powershell
npm install
```

Run locally:
```powershell
npx @11ty/eleventy --serve
```

Build:
```powershell
npx @11ty/eleventy
```

## Cache busting

A cache-buster plugin appends a content-based hash query string to static assets so browsers fetch updates only when the asset changes.

## Donations / Vanco

The site integrates with Vanco for cash and online donations via embedded iframes and links. All information regarding Vanco is processed and handled by Vanco. No sensitive information is stored in this repository.


## Contributing

Single-developer maintained project. Open issues or PRs for suggested fixes.

## License

See ./LICENSE