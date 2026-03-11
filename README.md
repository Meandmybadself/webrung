# Webrung

A customizable webring system. Members add a small JavaScript widget to their site, connecting them to a ring of interesting pages visitors can explore.

**Live site:** [webrung.com](https://webrung.com)

## How it works

1. A participant includes `webrung.js` on their site
2. The script injects a small footer bar showing the ring name and a link to visit a random member site
3. The hub site at webrung.com lists all participants and provides setup instructions

## Join the ring

1. Add the widget to your site before the closing `</body>` tag:

```html
<script src="https://webrung.com/webrung.js"></script>
```

2. Submit a pull request adding your site to `sites.json`:

```json
{
  "url": "https://yoursite.com",
  "name": "Your Site Name",
  "description": "A short description of your site"
}
```

## Widget customization

The widget supports theming via data attributes:

| Attribute      | Values                        | Description              |
|----------------|-------------------------------|--------------------------|
| `data-theme`   | `light` (default), `dark`     | Built-in color theme     |
| `data-bg`      | Any CSS color                 | Background color         |
| `data-text`    | Any CSS color                 | Text color               |
| `data-accent`  | Any CSS color                 | Link color               |

### Dark theme

```html
<script src="https://webrung.com/webrung.js" data-theme="dark"></script>
```

### Custom colors

```html
<script src="https://webrung.com/webrung.js"
  data-bg="#2d1b69" data-text="#e8e0ff" data-accent="#bb86fc"></script>
```

### Respond to user's color scheme preference

```html
<script id="webrung-script" src="https://webrung.com/webrung.js" data-theme="light"></script>
<script>
  var ws = document.getElementById("webrung-script");
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    ws.setAttribute("data-theme", "dark");
  }
</script>
```

## Project structure

```
├── sites.json    # Ring config + participant list
├── webrung.js    # Embeddable widget
├── index.html    # Hub site
├── style.css     # Hub site styles
└── CNAME         # GitHub Pages custom domain
```

## Configuration

Ring-level settings live in the `ring` object in `sites.json`:

- `name` — Display name of the webring
- `url` — URL where the hub site is hosted
- `repo` — GitHub repository URL (for linking in join instructions)

## Hosting

Designed for GitHub Pages with a custom domain. Enable Pages in repo settings (Settings > Pages > Deploy from branch `main`), then point your domain's DNS to GitHub Pages.
