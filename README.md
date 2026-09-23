# AstraUtilities

**Everything Minecraft developers need.** A fast, free, static Minecraft developer toolbox for colors, gradients, MiniMessage, resource-pack starter files, plugin descriptors, GUI YAML, JSON, Unicode, and more.

## Highlights

- No backend, account, or build step required
- GitHub Pages compatible with relative asset paths
- Local-only clipboard, download, settings, favorites, and recent tool history
- Responsive dark developer-tool interface
- Functional core tools: fonts, emoji copying, colors, gradients, MiniMessage, commands, MOTD, GUI YAML, resource-pack JSON, `plugin.yml`, JSON, and YAML helpers

## Local development

Open `index.html` in a browser. For service worker/offline behavior, serve the repository through any static web server.

## GitHub Pages deployment

1. Create a GitHub repository and upload this project.
2. Push to `main`.
3. Open **Settings → Pages**.
4. Choose **GitHub Actions** as the deployment source.
5. Wait for the workflow to complete.

## Project structure

```text
index.html              Main static app
404.html                Custom fallback page
assets/css/style.css    Responsive UI system
assets/js/app.js        Client-side tools and interactions
.github/workflows       GitHub Pages deployment
```

## Contributing

Contributions should keep tools client-side, accessible, mobile-friendly, and genuinely functional. Avoid placeholder-only tools.

## License

MIT. See `LICENSE`.
