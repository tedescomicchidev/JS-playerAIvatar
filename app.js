/**
 * Konfiguration, die jede anpassbare Kleidungsschicht beschreibt.
 * @type {Array<{key:string,label:string,selectId:string,imgId:string,dataFile:string,assetPrefix:string}>}
 */
const CLOTHING_STEPS = [
  {
    key: "shoes",
    label: "Schuhe",
    selectId: "shoes-select",
    imgId: "avatar-shoes",
    dataFile: "data/shoes-colors.json",
    assetPrefix: "assets/shoes-",
  },
  {
    key: "shirt",
    label: "T-Shirt",
    selectId: "shirt-select",
    imgId: "avatar-shirt",
    dataFile: "data/shirt-colors.json",
    assetPrefix: "assets/shirt-",
  },
  {
    key: "pants",
    label: "Hose",
    selectId: "pants-select",
    imgId: "avatar-pants",
    dataFile: "data/pants-colors.json",
    assetPrefix: "assets/pants-",
  },
  {
    key: "ball",
    label: "Ball",
    selectId: "ball-select",
    imgId: "avatar-ball",
    dataFile: "data/ball-colors.json",
    assetPrefix: "assets/ball-",
  },
];

const state = {
  currentStep: 0,
  stepElements: [],
  colorOptions: {},
};

/**
 * Initialisiert die Anwendung, sobald das DOM bereit ist.
 */
function init() {
  state.stepElements = Array.from(document.querySelectorAll(".wizard-step"));
  // Setzt jede Kleidungsschicht zu Beginn auf einen neutralen Zustand zurück.
  CLOTHING_STEPS.forEach((config) => clearLayer(config.key));
  attachEventListeners();
  showStep(0);
  loadAllColorData();
}
document.addEventListener("DOMContentLoaded", init);

/**
 * Lädt JSON-Farbdaten für jeden Kleidungstyp und füllt die Dropdown-Menüs.
 * @returns {Promise<void>}
 */
async function loadAllColorData() {
  // Lädt die Farblisten für alle Schritte parallel, um Wartezeiten zu reduzieren.
  const tasks = CLOTHING_STEPS.map(async (config) => {
    const colors = await fetchColorOptions(config.dataFile);
    state.colorOptions[config.key] = colors;
    populateDropdown(config.selectId, colors);
  });

  await Promise.all(tasks);
  renderPreviewsForStep(state.currentStep);
}

/**
 * Ruft Farbeinträge aus einer JSON-Datei ab.
 * @param {string} url - Relativer Pfad zur JSON-Datendatei.
 * @returns {Promise<Array<{name:string,label:string}>>}
 */
async function fetchColorOptions(url) {
  try {
    const response = await fetch(url);
    // Bricht ab, wenn die Datei nicht erfolgreich geladen werden konnte.
    if (!response.ok) {
      throw new Error(`Failed to load ${url}`);
    }

    const data = await response.json();
    // Nutzt nur valide Datensätze, die tatsächlich eine Farbliste enthalten.
    if (!Array.isArray(data.colors)) {
      return [];
    }
    return data.colors;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Erstellt Optionselemente für ein Auswahlfeld (Select).
 * @param {string} selectId - Ziel-Select-Element-ID.
 * @param {Array<{name:string,label:string}>} options - Anzuzeigende Farbeinträge.
 */
function populateDropdown(selectId, options) {
  const select = document.getElementById(selectId);
  // Überspringt das Befüllen, falls das Select-Element nicht existiert.
  if (!select) {
    return;
  }

  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Farbe auswählen";
  placeholder.selected = true;
  placeholder.disabled = true;
  select.appendChild(placeholder);

  // Erzeugt für jede Farbe eine auswählbare Option.
  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option.name;
    opt.textContent = option.label;
    select.appendChild(opt);
  });

  select.disabled = options.length === 0;
}

/**
 * Aktualisiert das Avatar-Bild für den angegebenen Kleidungstyp.
 * @param {string} itemType - Schlüssel aus CLOTHING_STEPS.
 * @param {string} colorName - Vom Benutzer gewählte Farboption.
 */
function applyColor(itemType, colorName) {
  const config = CLOTHING_STEPS.find((step) => step.key === itemType);
  const availableColors = state.colorOptions[itemType] || [];
  const isValid = availableColors.some((entry) => entry.name === colorName);

  // Nutzt nur gültige Farbkombinationen und überspringt unbekannte Einträge.
  if (!config || !isValid) {
    console.warn(`Color ${colorName} is not available for ${itemType}`);
    return;
  }

  const img = document.getElementById(config.imgId);
  // Aktualisiert die Bildquelle nur, wenn der Layer im DOM vorhanden ist.
  if (img) {
    img.src = `${config.assetPrefix}${colorName}.png`;
    img.hidden = false;
    img.removeAttribute("hidden");
    img.setAttribute("aria-hidden", "false");
  }
}

/**
 * Richtet alle Event-Listener für die Steuerelemente ein.
 */
function attachEventListeners() {
  // Verbindet jedes Dropdown mit seinem Änderungs-Handler.
  CLOTHING_STEPS.forEach((config) => {
    const select = document.getElementById(config.selectId);
    // Fügt nur dann Listener hinzu, wenn das Select-Element existiert.
    if (select) {
      select.addEventListener("change", (event) => {
        const target = event.target;
        // Reagiert ausschließlich auf echte Select-Elemente.
        if (target instanceof HTMLSelectElement) {
          // Löscht die Ebene, wenn wieder keine Farbe gewählt ist.
          if (!target.value) {
            clearLayer(config.key);
            updatePreviewSelection(config.key, "");
            return;
          }
          applyColor(config.key, target.value);
          updatePreviewSelection(config.key, target.value);
        }
      });
    }
  });

  const backBtn = document.getElementById("back-btn");
  const nextBtn = document.getElementById("next-btn");
  const randomizeBtn = document.getElementById("randomize-btn");
  const resetBtn = document.getElementById("reset-btn");

  // Aktiviert die Zurück-Navigation nur, wenn der Button vorhanden ist.
  if (backBtn) {
    backBtn.addEventListener("click", handleBackStep);
  }

  // Aktiviert die Weiter-Navigation nur, wenn der Button vorhanden ist.
  if (nextBtn) {
    nextBtn.addEventListener("click", handleNextStep);
  }

  // Verknüpft den Zufalls-Button nur, wenn er in der Oberfläche existiert.
  if (randomizeBtn) {
    randomizeBtn.addEventListener("click", randomizeOutfit);
  }

  // Reagiert auf den Reset-Button nur, wenn er wirklich vorhanden ist.
  if (resetBtn) {
    resetBtn.addEventListener("click", resetOutfit);
  }
}

/**
 * Wechselt den Assistenten zum vorherigen Schritt.
 */
function handleBackStep() {
  // Verhindert ein Zurückspringen vor den ersten Schritt.
  if (state.currentStep === 0) {
    return;
  }
  showStep(state.currentStep - 1);
}

/**
 * Wechselt den Assistenten zum nächsten Schritt und springt nach dem letzten Schritt wieder zum Anfang.
 */
function handleNextStep() {
  const nextIndex =
    state.currentStep === state.stepElements.length - 1 ? 0 : state.currentStep + 1;
  showStep(nextIndex);
}

/**
 * Zeigt den ausgewählten Schritt des Assistenten an und aktualisiert die zugehörigen UI-Elemente.
 * @param {number} stepIndex - Index des zu aktivierenden Schritts.
 */
function showStep(stepIndex) {
  state.currentStep = stepIndex;

  // Blendet nur den aktiven Schritt ein und versteckt alle anderen.
  state.stepElements.forEach((element, index) => {
    element.classList.toggle("step-active", index === stepIndex);
    element.classList.toggle("step-hidden", index !== stepIndex);
  });

  const backBtn = document.getElementById("back-btn");
  const nextBtn = document.getElementById("next-btn");
  const indicator = document.getElementById("step-indicator");
  const totalSteps = state.stepElements.length;
  const label = CLOTHING_STEPS[stepIndex]?.label ?? "";

  // Deaktiviert den Zurück-Button, wenn es keinen vorherigen Schritt gibt.
  if (backBtn) {
    backBtn.disabled = stepIndex === 0;
  }

  // Passt den Button-Text an, sobald der letzte Schritt erreicht ist.
  if (nextBtn) {
    nextBtn.textContent = stepIndex === totalSteps - 1 ? "Fertig" : "Weiter";
  }

  // Aktualisiert die Schrittanzeige, sofern sie existiert.
  if (indicator) {
    indicator.textContent = `Schritt ${stepIndex + 1} von ${totalSteps}: ${label}`;
  }

  renderPreviewsForStep(stepIndex);
}

/**
 * Baut die Vorschauliste für den aktiven Schritt auf und synchronisiert sie mit der aktuellen Auswahl.
 * @param {number} stepIndex
 */
function renderPreviewsForStep(stepIndex) {
  const container = document.getElementById("option-preview-list");
  const title = document.getElementById("preview-title");

  if (!container || !title) {
    return;
  }

  const config = CLOTHING_STEPS[stepIndex];

  if (!config) {
    container.dataset.stepKey = "";
    container.innerHTML = "";
    title.textContent = "";
    return;
  }

  const options = state.colorOptions[config.key] || [];
  const select = document.getElementById(config.selectId);
  const currentValue = select?.value ?? "";

  container.dataset.stepKey = config.key;
  container.innerHTML = "";
  title.textContent = `${config.label}-Optionen`;

  if (options.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "option-preview-empty";
    emptyMessage.textContent = "Optionen werden geladen ...";
    container.appendChild(emptyMessage);
    return;
  }

  options.forEach((option) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "option-preview-card";
    card.dataset.value = option.name;
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-label", `${config.label} ${option.label}`);

    if (option.name === currentValue) {
      card.classList.add("is-selected");
    }

    card.addEventListener("click", () => {
      const selectElement = document.getElementById(config.selectId);
      if (selectElement) {
        selectElement.value = option.name;
        selectElement.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    const img = document.createElement("img");
    img.src = `${config.assetPrefix}${option.name}.png`;
    img.alt = `${config.label}: ${option.label}`;
    img.loading = "lazy";

    const caption = document.createElement("span");
    caption.textContent = option.label;

    card.appendChild(img);
    card.appendChild(caption);
    container.appendChild(card);
  });
}

/**
 * Hebt die aktive Vorschauoption hervor, sobald sich die Auswahl ändert.
 * @param {string} stepKey
 * @param {string} colorValue
 */
function updatePreviewSelection(stepKey, colorValue) {
  const container = document.getElementById("option-preview-list");

  if (!container || container.dataset.stepKey !== stepKey) {
    return;
  }

  const currentValue = colorValue ?? "";
  const cards = container.querySelectorAll(".option-preview-card");
  cards.forEach((card) => {
    const isSelected = Boolean(currentValue) && card.dataset.value === currentValue;
    card.classList.toggle("is-selected", isSelected);
  });
}

/**
 * Wendet zufällige Farben auf alle Kleidungsstücke an und hält den Status synchron.
 */
function randomizeOutfit() {
  // Durchläuft alle Layer und weist ihnen zufällige Farben zu.
  CLOTHING_STEPS.forEach((config) => {
    const options = state.colorOptions[config.key] || [];
    // Überspringt Layer ohne vorhandene Farboptionen.
    if (options.length === 0) {
      return;
    }
    const randomColor = options[Math.floor(Math.random() * options.length)];
    applyColor(config.key, randomColor.name);

    const select = document.getElementById(config.selectId);
    // Synchronisiert die Dropdown-Auswahl mit der zufällig gesetzten Farbe.
    if (select) {
      select.value = randomColor.name;
    }

    updatePreviewSelection(config.key, randomColor.name);
  });
}

/**
 * Setzt die Auswahl und Avatar-Schichten auf den Ausgangszustand zurück.
 */
function resetOutfit() {
  // Setzt alle Dropdowns und Layer Schritt für Schritt zurück.
  CLOTHING_STEPS.forEach((config) => {
    const select = document.getElementById(config.selectId);
    // Springt nur bei vorhandenen Selects auf die Platzhalter-Option.
    if (select) {
      select.selectedIndex = 0;
      select.value = "";
    }
    clearLayer(config.key);
    updatePreviewSelection(config.key, "");
  });
  showStep(0);
}

/**
 * Entfernt die aktuelle Grafikschicht und blendet den Layer aus.
 * @param {string} itemType
 */
function clearLayer(itemType) {
  const config = CLOTHING_STEPS.find((step) => step.key === itemType);
  // Überspringt die Operation, wenn es keine passende Konfiguration gibt.
  if (!config) {
    return;
  }
  const img = document.getElementById(config.imgId);
  // Versteckt die Ebene nur dann, wenn das Bild im DOM existiert.
  if (img) {
    img.removeAttribute("src");
    img.hidden = true;
    img.setAttribute("hidden", "");
    img.setAttribute("aria-hidden", "true");
  }
}
