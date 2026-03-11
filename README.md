<p align="center">
  <img src="logo.jpg" alt="Webrung" width="200">
</p>

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

## Contributing via Fork & Pull Request

If you want to join the ring (or propose any change), the standard workflow is to fork the repo and submit a pull request:

1. **Fork the repository**
   Click the **Fork** button at the top-right of the [GitHub repo](https://github.com/minnecrapolis/minnecrapolis-webring) (or visit `https://github.com/minnecrapolis/minnecrapolis-webring/fork`). This creates your own copy under your GitHub account.

2. **Clone your fork locally** (optional — you can also edit directly on GitHub)
   ```bash
   git clone https://github.com/YOUR-USERNAME/minnecrapolis-webring.git
   cd minnecrapolis-webring
   ```

3. **Create a branch for your change**
   ```bash
   git checkout -b add-my-site
   ```

4. **Make your changes**
   To join the ring, add your site to the `sites` array in `sites.json`:
   ```json
   {
     "url": "https://yoursite.com",
     "name": "Your Site Name",
     "description": "A short description of your site"
   }
   ```

5. **Commit and push**
   ```bash
   git add sites.json
   git commit -m "Add yoursite.com to the ring"
   git push origin add-my-site
   ```

6. **Open a pull request**
   Go to your fork on GitHub. You'll see a banner offering to **Compare & pull request**. Click it, review your changes, and submit the PR back to the `main` branch of `minnecrapolis/minnecrapolis-webring`.

7. **Wait for review**
   A CI check will validate your `sites.json` formatting automatically. Once a maintainer approves and merges, your site will appear in the ring.

> **Tip:** If you prefer not to use git locally, you can edit `sites.json` directly on GitHub by navigating to the file in your fork and clicking the pencil icon, then opening a PR from there.

## Troubleshooting: Content Security Policy (CSP)

Some sites enforce a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) that blocks external scripts and/or fetch requests. If your site has a CSP, the webrung widget may fail silently or show errors in the browser console.

### How to tell if CSP is blocking the widget

Open your browser's developer tools (F12 or Cmd+Option+I) and check the **Console** tab. CSP violations look like:

```
Refused to load the script 'https://webrung.com/webrung.js' because it violates
the following Content Security Policy directive: "script-src 'self'"
```

or:

```
Refused to connect to 'https://webrung.com/sites.json' because it violates
the following Content Security Policy directive: "connect-src 'self'"
```

You may also see these in the **Network** tab as blocked requests (status `(blocked:csp)`).

### How to fix it

You need to allow `webrung.com` in two CSP directives: `script-src` (to load the widget JS) and `connect-src` (to let the widget fetch `sites.json`).

**If your CSP is set via a `<meta>` tag:**

Find the `<meta http-equiv="Content-Security-Policy" ...>` tag in your HTML and add `https://webrung.com` to the `script-src` and `connect-src` directives:

```html
<meta http-equiv="Content-Security-Policy"
  content="script-src 'self' https://webrung.com; connect-src 'self' https://webrung.com;">
```

**If your CSP is set via an HTTP header** (e.g., in Nginx, Apache, Netlify, Vercel, or Cloudflare):

Add `https://webrung.com` to both `script-src` and `connect-src`. For example, in Nginx:

```nginx
add_header Content-Security-Policy "script-src 'self' https://webrung.com; connect-src 'self' https://webrung.com;" always;
```

In a Netlify `_headers` file:

```
/*
  Content-Security-Policy: script-src 'self' https://webrung.com; connect-src 'self' https://webrung.com;
```

In a Vercel `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "script-src 'self' https://webrung.com; connect-src 'self' https://webrung.com;"
        }
      ]
    }
  ]
}
```

> **Important:** The examples above show only the directives needed for the webrung widget. Merge them with your existing CSP directives — don't replace your entire policy.

### Self-hosting as an alternative

If you cannot modify your CSP, or prefer not to allow external scripts, you can self-host the widget files:

1. Download `webrung.js` and `sites.json` from [webrung.com](https://webrung.com)
2. Place them on your own domain (same directory, or adjust the script `src` path)
3. Reference your local copy instead:
   ```html
   <script src="/webrung.js"></script>
   ```

Since both files are served from your own origin, no CSP changes are needed. Note that the `sites.json` will not auto-update when new members join — you'd need to re-download it periodically.

## Hosting

Designed for GitHub Pages with a custom domain. Enable Pages in repo settings (Settings > Pages > Deploy from branch `main`), then point your domain's DNS to GitHub Pages.
