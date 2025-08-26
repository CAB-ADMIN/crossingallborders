# Crossing All Borders Ministry Website

A fast, secure, and maintainable static site for Crossing All Borders Ministry.

Website: https://crossingallborders.org

## About Crossing All Borders

Crossing All Borders Ministry exists to share the love of Christ through missions, outreach, and service. This site helps communicate the mission, highlight opportunities to serve, and keep supporters informed.

## Tech Stack

- Eleventy (11ty) static site generator
- Nunjucks templates (src/_includes)
- Markdown content (src/content)
- CSS with design tokens (CSS variables, light/dark themes)
- Markdown-It and plugins:
  - markdown-it-attrs, footnote, mark, sub, sup, container
- Plugins:
  - @mightyplow/eleventy-plugin-cache-buster (content-hash query params)
  - @quasibit/eleventy-plugin-sitemap (XML sitemap)

## How It Works

- Content authoring
  - Pages and dev logs are Markdown with front matter.
  - Logs use a simple, essay-style header (author, date, version, update type) and paragraph sections.
- Templates
  - Shared partials in src/_includes (header.njk, banner.njk, footer.njk, css.njk).
  - Logs layout uses a top-right essay header and optional photo gallery.
- Assets
  - CSS/JS/images live under src/assets and are passthrough-copied.
  - Styles use CSS variables (no hardcoded colors) for easy theming.
- Performance
  - Minifier compresses output in _site.
  - Cache buster appends ?v=<hash> to CSS/JS so browsers fetch fresh files only when content changes.

## Project Structure

- src/
  - _includes/ … Nunjucks partials (css.njk, header.njk, banner.njk, footer.njk, logs.njk, etc.)
  - assets/
    - css/ … global styles and section styles
    - js/ … site scripts
    - images/ … images and logos
  - content/
    - logs/
      - Docs/
        - template.md … dev log template
- _site/ … build output (do not edit)
- .eleventy.js … Eleventy config
- package.json … scripts and metadata

## Development

Prerequisites: Node.js 18+ (LTS recommended)

Install:
```powershell
npm install
```

Run locally (serve with live reload):
```powershell
npx @11ty/eleventy --serve
```

Build for production:
```powershell
npx @11ty/eleventy
```

Recommended package.json scripts:
```json
{
  "scripts": {
    "start": "eleventy --serve",
    "build": "eleventy",
    "clean": "rimraf _site",
    "build:clean": "rimraf _site && eleventy"
  }
}
```

On Windows, install rimraf if you use the clean scripts:
```powershell
npm i -D rimraf
```

## Cache Busting Notes

- The cache buster plugin scans built HTML and appends ?v=<md5> based on the asset’s file content.
- Only changed files get a new hash; unchanged files keep the same URL for optimal caching.
- Ensure assets are available before HTML is processed (passthrough copies in .eleventy.js handle this).


## Writing Development Logs

Use the provided template (src/content/logs/Docs/template.md):

```markdown
---
description: "Template document for development logs."
postDate: "08-20-2025"
author: "Silas Schlax"
version: "x.x.x"
subtitle: "patch/minor/major"
devTime: "x hours"
layout: "logs"
sitemap:
  ignore: true
title: "Version x.x.x Log"
page_title: "Version x.x.x Log"
permalink: "development-logs/logs/docs/template/index.html"
hasPhotos: false
photos: []
---

Intro paragraph explaining the update, what changed, and why.

### Page/Feature affected
- High-level change summary

### Another Area
- What changed and the impact
```


## Deployment

- Build: `npx @11ty/eleventy`
- Deploy the `_site` folder to any static host (Netlify, GitHub Pages, Cloudflare Pages, S3, etc.).
- Because of cache busting, users receive updated assets immediately on each deploy.

## Contributing

Single-developer project maintained for a non-profit. Open issues or PRs for suggestions and fixes.

## License

See repository