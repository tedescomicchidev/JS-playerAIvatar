## Plan: Soccer Player Avatar Customization Web App

Build a vanilla JS/HTML/CSS web application that lets users customize a soccer player avatar's clothing colors through dropdown menus, wizard navigation, and a randomize feature. The avatar uses a layered PNG overlay system with a base player image and separate clothing images positioned on top.

### Technical Constraints

- **NO JavaScript frameworks or libraries** (no React, Vue, jQuery, etc.)
- **NO CSS frameworks or libraries** (no Bootstrap, Tailwind, etc.)
- **Plain HTML5, CSS3, and vanilla JavaScript only**
- All DOM manipulation via native browser APIs (`document.getElementById`, `addEventListener`, `fetch`, etc.)

### Asset Structure

| Layer | Image Pattern | Position |
|-------|---------------|----------|
| Base | `assets/player.png` | Background layer |
| Shirt | `assets/shirt-{color}.png` | Overlay on torso |
| Pants | `assets/pants-{color}.png` | Overlay on legs |
| Shoes | `assets/shoes-{color}.png` | Overlay at feet |

**Current assets found:** `player.png`, `shirt-red.png`, `pants-yellow.png`, `shoes-black.png`

---

### Steps

1. **Create project file structure** — Set up `index.html`, `styles.css`, `app.js`, and a `data/` folder containing `shoes-colors.json`, `shirt-colors.json`, and `pants-colors.json` with color names matching the image file naming convention (e.g., `"red"` maps to `shirt-red.png`).

2. **Build HTML avatar container with layered structure** — In `index.html`, create an avatar container using a `<div class="avatar-canvas">` with `position: relative`, containing:
   - `<img id="avatar-base" src="assets/player.png">` — base layer
   - `<img id="avatar-shirt" src="assets/shirt-red.png">` — positioned absolutely on torso
   - `<img id="avatar-pants" src="assets/pants-yellow.png">` — positioned absolutely on legs
   - `<img id="avatar-shoes" src="assets/shoes-black.png">` — positioned absolutely at feet

3. **Build two-column layout with wizard controls** — Create left column for the avatar canvas, right column containing wizard steps with one dropdown per step (Shoes → T-Shirt → Pants), "Next"/"Back" navigation buttons, and a "Randomize" button.

4. **Style the UI with CSS** — In `styles.css`, implement using only native CSS:
   - Flexbox two-column layout
   - `.avatar-canvas` with `position: relative` and fixed dimensions
   - Absolute positioning for each overlay image layer
   - Step visibility classes (`.step-active`, `.step-hidden`) for wizard navigation
   - Button and dropdown styling

5. **Implement core JavaScript logic** — In `app.js`, write JSDoc-documented functions using only native browser APIs:
   - Fetch and parse JSON color data using native `fetch()` and a loop
   - Populate dropdowns dynamically from JSON using `document.createElement()`
   - `applyColor(itemType, colorName)` — swap the `src` attribute of the corresponding `<img>` element with conditional validation
   - Manage wizard step state with Next/Back handlers
   - Randomize functionality using `Math.random()` in a loop over all clothing items

6. **Wire up event listeners and initialize app** — Add `change` event listeners to dropdowns via `addEventListener()`, `click` handlers to navigation buttons, and call initialization on `DOMContentLoaded` to load JSON data and render the first wizard step.

---

### Further Considerations

1. **Additional color assets needed?** — Currently only one color variant exists per clothing type. Do you have additional images (e.g., `shirt-blue.png`, `pants-black.png`, `shoes-white.png`), or should the JSON files only reference the existing colors for now?

2. **Image positioning values?** — Do you have specific pixel offsets for where each overlay should be positioned on the avatar canvas, or should these be determined during implementation?

3. **Wizard step indicator?** — Should the UI include a visual progress indicator (e.g., "Step 1 of 3: Shoes") above the current dropdown?
