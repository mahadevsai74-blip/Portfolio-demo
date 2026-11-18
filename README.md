# Mahadev Sai - personal portfolio

Open `index.html` in Chrome or Edge. If it is already open, press Ctrl+F5 to load the updated design.

The site works directly from your computer without installing packages or using an internet connection.

## New design

- Dark violet and cyan theme, with a light theme available through the circular button in the header.
- Animated particle globe that responds to the mouse, plus floating code graphics.
- Scroll reveals, reading progress, interactive language cards, and responsive layouts.
- Reduced-motion support. Globe rendering pauses while offscreen or in a background tab.

## Edit the site

| File | Purpose |
| --- | --- |
| `index.html` | Your content, navigation, and contact links |
| `styles.css` | Themes, layout, graphic styling, and responsive sizes |
| `script.js` | Canvas globe, theme switch, and scroll effects |
| `favicon.svg` | Browser tab icon |

Edit the variables at the beginning of `styles.css` to change the dark theme colors. The `body[data-theme=light]` rule sets the light theme colors.

The theme choice is remembered when browser storage is available. Browsers may restrict storage when opening local files; the switch still works for the current visit.

## Preview checks

1. Open `index.html` and test the theme switch.
2. Click the navigation links, email link, and GitHub link.
3. Resize the window to check the mobile layout.
4. Press F12, then Ctrl+Shift+M in Chrome or Edge to test phone sizes.

## Save your first commit

In a terminal opened in this folder:

```powershell
git add index.html styles.css script.js favicon.svg README.md .gitignore
git commit -m "Create interactive portfolio with animated globe"
```

If Git asks for your identity, configure it for this project, then retry the commit:

```powershell
git config user.name "Mahadev Sai"
git config user.email "YOUR_PREFERRED_COMMIT_EMAIL"
```

Use the email you want recorded in your commits, or your GitHub private commit email. A commit saves a local snapshot; uploading to GitHub is separate.
