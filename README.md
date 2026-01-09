# Fussballspieler-Avatar-Gestalter

Dieses Projekt ist ein interaktiver Styler für einen Fussballspieler-Avatar. Nutzerinnen und Nutzer können Schuhe, Shirt, Hose und Ball auswählen, ohne selbst Grafiken erstellen zu müssen. Die Anwendung lädt die verfügbaren Optionen aus JSON-Dateien und aktualisiert das Avatarbild unmittelbar.

## Wichtige Funktionen
- **Mehrstufiger Assistent:** Die Steuerung erfolgt Schritt für Schritt über vier Dropdown-Felder. Zur Orientierung wird stets "Schritt X von 4" angezeigt und die Navigation über "Zurück" sowie "Weiter/Fertig" gesteuert.
- **Live-Vorschau in der Canvas:** Jede Änderung setzt sofort den passenden Layer (Schuhe, Shirt, Hose oder Ball) über dem Basis-Avatar. So lässt sich das Outfit in Echtzeit begutachten.
- **Optionen-Galerie unter dem Avatar:** Unterhalb des Avatars erscheint eine horizontale Liste mit Mini-Previews aller Farben des aktuellen Schrittes. Ein Klick auf eine Karte wählt die entsprechende Option und synchronisiert das Dropdown. Markierte Karten sind hervorgehoben.
- **Zufalls- und Reset-Funktion:** "Outfit zufällig wählen" setzt jede Ebene auf eine zufällige Farbe, während "Von vorn beginnen" sämtliche Layer entfernt, die Dropdowns zurücksetzt und den Assistenten wieder auf Schritt 1 stellt.

## Technische Details
- **Datenquellen:** Die Farbvarianten liegen in `data/*.json` (z. B. `data/shoes-colors.json`) als Liste aus `name` und `label`. Die Bilddateien befinden sich unter `assets/` und folgen dem Schema `assets/<typ>-<name>.png`.
- **DOM-Logik:** `app.js` verwaltet den gesamten Status. Beim Laden:
  1. Wird auf `DOMContentLoaded` gewartet.
  2. Alle Layer werden geleert und Event-Listener gesetzt.
  3. Die JSON-Dateien werden parallel via Fetch API geladen (`Promise.all`).
  4. Dropdowns, Canvas-Layer und Preview-Galerie werden synchron gehalten.
- **Barrierefreiheit:** Layer, die keine Auswahl besitzen, bleiben verborgen (`hidden` plus `aria-hidden="true"`). Die Card-Galerie nutzt `aria-label` und `role="listitem"` für Screenreader.

## JavaScript-Einsatz im Detail
1. **Datenstrukturen:**
  - Der Konfigurations-Array `CLOTHING_STEPS` bündelt alle Meta-Informationen zu Schuhen, Shirt, Hose und Ball in Objekten ([app.js](app.js#L5-L38)).
  - Das `state`-Objekt hält den aktuellen Schritt, referenzierte DOM-Elemente und die geladenen Farb-Optionen gesammelt an einer Stelle ([app.js](app.js#L40-L44)).

2. **Kontrollstrukturen:**
  - `forEach`-Schleifen laufen über jede Konfiguration, z. B. um Layer zurückzusetzen, Dropdowns zu befüllen oder Zufallsfarben zu setzen ([app.js](app.js#L52-L54), [app.js](app.js#L100-L130), [app.js](app.js#L361-L379)).
  - `if`-Abfragen schützen vor fehlenden DOM-Elementen, ungültigen Daten oder steuern Buttons/Navigation ([app.js](app.js#L80-L98), [app.js](app.js#L184-L207), [app.js](app.js#L243-L263)).

3. **Zweck wichtiger Funktionen:**
  - `init()` startet die App nach `DOMContentLoaded`, leert Layer und stösst die Datenladung an ([app.js](app.js#L46-L57)).
  - `loadAllColorData()` lädt alle JSON-Dateien parallel und ruft danach die Preview-Render-Logik auf ([app.js](app.js#L63-L73)).
  - `applyColor()` aktualisiert den entsprechenden Avatar-Layer, sobald eine Farbe gewählt wurde ([app.js](app.js#L132-L156)).
  - `renderPreviewsForStep()` baut die Karten-Galerie für den aktiven Schritt inklusive Klick-Handler auf ([app.js](app.js#L267-L335)).
  - `randomizeOutfit()` und `resetOutfit()` setzen die komplette Auswahl auf Zufallswerte bzw. auf den Ausgangszustand zurück ([app.js](app.js#L358-L398)).

4. **DOM-Manipulation:**
  - `populateDropdown()` erzeugt neue `option`-Elemente, setzt Platzhalter und aktualisiert `innerHTML` der Selects ([app.js](app.js#L100-L130)).
  - `renderPreviewsForStep()` erstellt Buttons, Bilder und Beschriftungen dynamisch, setzt `dataset`-Attribute und `aria`-Labels ([app.js](app.js#L267-L335)).
  - `applyColor()` und `clearLayer()` ändern `src`, `hidden` und `aria-hidden`, um Avatar-Layer ein- oder auszublenden ([app.js](app.js#L132-L156), [app.js](app.js#L401-L418)).
  - `updatePreviewSelection()` toggelt CSS-Klassen via `classList` und hält so die visuelle Auswahl synchron ([app.js](app.js#L338-L355)).

5. **Javascript Objekte:**
  - Der Konfigurations-Array `CLOTHING_STEPS` bündelt alle Meta-Informationen zu Schuhen, Shirt, Hose und Ball in Objekten ([app.js](app.js#L5-L38)).

6. **JSON-Verwendung:**
  - `fetchColorOptions()` ruft die Dateien aus `data/*.json` via Fetch API ab, prüft `response.ok`, wandelt das Ergebnis mittels `response.json()` um und validiert, ob `colors` ein Array ist ([app.js](app.js#L75-L98)).
  - `loadAllColorData()` speichert die geladenen JSON-Daten pro Kleidungsstück in `state.colorOptions` und nutzt sie anschliessend für Dropdowns und Previews ([app.js](app.js#L63-L73)).

## Entwicklung starten
1. Repository klonen und in den Projektordner wechseln.
2. Eine beliebige lokale HTTP-Serve-Lösung nutzen (z. B. die VS Code Live Preview), damit Fetch die JSON-Dateien laden kann.
3. `index.html` im Browser öffnen. Änderungen an `app.js` oder `styles.css` werden nach dem Neuladen sichtbar.

Viel Spass beim Stylen des Fussballspielers! 😊
