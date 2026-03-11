# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Minnecrapolis Webrung — a webring system hosted on GitHub Pages at webrung.com. Members embed a JavaScript widget (`webrung.js`) on their sites that shows a fixed footer bar linking to other ring members. The hub site (`index.html`) lists all participants and provides setup instructions.

## Architecture

- **`sites.json`** — Central data file containing ring metadata (`ring` object with name/url/repo) and the `sites` array of member entries (url, name, description). This is the primary file modified when adding members.
- **`webrung.js`** — Embeddable widget script. Uses a closed Shadow DOM to isolate styles. Fetches `sites.json` from the same origin as the script's `src` attribute. Supports `data-theme`, `data-bg`, `data-text`, `data-accent` attributes for theming. Dismissal state stored in `sessionStorage`.
- **`index.html`** — Hub page that fetches `sites.json` at runtime and dynamically renders the site list, code snippets, and ring name. All content is driven by `sites.json` values.
- **`style.css`** — Styles for the hub page only (widget styles are self-contained in `webrung.js` via Shadow DOM).

## No Build System

This is a static site with no build step, no dependencies, and no package manager. All JavaScript is vanilla ES5-compatible (no modules, no transpilation). Just edit files and deploy.

## Deployment

Pushes to `main` auto-deploy via GitHub Actions (`.github/workflows/pages.yml`). The workflow uploads the entire repo root as a Pages artifact.

## Validation

A CI workflow (`.github/workflows/validate.yml`) runs `python3 -m json.tool sites.json` to validate JSON on PRs that touch `sites.json` and on pushes to `main`.

## Adding a New Site

Add an entry to the `sites` array in `sites.json`:
```json
{
  "url": "https://example.com",
  "name": "Site Name",
  "description": "Short description"
}
```
No other files need to change — both the hub page and the widget read from `sites.json` at runtime.
