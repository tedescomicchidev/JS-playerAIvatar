## Plan: Soccer Player Avatar Customization Web App

Build a vanilla JS/HTML/CSS web application that lets users customize a soccer player avatar's clothing colors through dropdown menus, wizard navigation, and a randomize feature. Since this is a greenfield project with no existing assets, the implementation will need to create all files from scratch, including a layered SVG avatar for color manipulation.

### Steps

1. **Create project file structure** — Set up `index.html`, `styles.css`, `app.js`, and a `data/` folder containing `shoes-colors.json`, `shirt-colors.json`, and `pants-colors.json` with hex color values and labels.

2. **Design layered SVG avatar** — Create or obtain an SVG soccer player image with separate `<path>` or `<g>` elements for shoes, t-shirt, and pants, each with unique IDs (e.g., `#avatar-shoes`, `#avatar-shirt`, `#avatar-pants`) to enable targeted DOM color manipulation via `element.style.fill`.

3. **Build HTML layout with wizard structure** — In `index.html`, create a two-column layout: left column for the inline SVG avatar, right column for wizard steps containing one dropdown per step, "Next"/"Back" navigation buttons, and a "Randomize" button.

4. **Style the UI with CSS** — In `styles.css`, implement flexbox/grid layout for the two-column design, style the dropdowns and buttons, and add step visibility classes (`.step-active`, `.step-hidden`) for wizard navigation.

5. **Implement core JavaScript logic** — In `app.js`, write JSDoc-documented functions to: (a) fetch and parse JSON color data using a loop, (b) populate dropdowns dynamically, (c) apply selected colors to SVG elements via DOM manipulation with conditional logic for validation, (d) manage wizard step state with Next/Back handlers, and (e) implement randomize functionality using `Math.random()` in a loop.

6. **Wire up event listeners and initialize app** — Add `change` event listeners to dropdowns, `click` handlers to navigation buttons, and call initialization on `DOMContentLoaded` to load JSON data and render the first wizard step.

### Further Considerations

1. **Avatar asset source?** — Will you provide a base player image, or should the plan include creating a simple placeholder SVG with colored regions?

2. **Color format preference?** — JSON files can store colors as hex codes (e.g., `#FF5733`) or named CSS colors — which do you prefer for the data files?

3. **Wizard step indicator?** — Should the UI include a visual progress indicator (e.g., "Step 2 of 3") or step dots above the dropdowns?
