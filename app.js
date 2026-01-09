/**
 * Konfiguration, die jede anpassbare Kleidungsschicht beschreibt.
 * @type {Array<{key:string,label:string,selectId:string,imgId:string,dataFile:string,assetPrefix:string}>}
 */
const CLOTHING_STEPS = [
  {
    key: "shoes",
    label: "Shoes",
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
    label: "Pants",
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
  const tasks = CLOTHING_STEPS.map(async (config) => {
    const colors = await fetchColorOptions(config.dataFile);
    state.colorOptions[config.key] = colors;
    populateDropdown(config.selectId, colors);

    if (colors.length > 0) {
      applyColor(config.key, colors[0].name);
      const select = document.getElementById(config.selectId);
      if (select) {
        select.value = colors[0].name;
      }
    }
  });

  await Promise.all(tasks);
}

/**
 * Ruft Farbeinträge aus einer JSON-Datei ab.
 * @param {string} url - Relativer Pfad zur JSON-Datendatei.
 * @returns {Promise<Array<{name:string,label:string}>>}
 */
async function fetchColorOptions(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${url}`);
    }

    const data = await response.json();
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
  if (!select) {
    return;
  }

  select.innerHTML = "";

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

  if (!config || !isValid) {
    console.warn(`Color ${colorName} is not available for ${itemType}`);
    return;
  }

  const img = document.getElementById(config.imgId);
  if (img) {
    img.src = `${config.assetPrefix}${colorName}.png`;
  }
}

/**
 * Richtet alle Event-Listener für die Steuerelemente ein.
 */
function attachEventListeners() {
  CLOTHING_STEPS.forEach((config) => {
    const select = document.getElementById(config.selectId);
    if (select) {
      select.addEventListener("change", (event) => {
        const target = event.target;
        if (target instanceof HTMLSelectElement) {
          applyColor(config.key, target.value);
        }
      });
    }
  });

  const backBtn = document.getElementById("back-btn");
  const nextBtn = document.getElementById("next-btn");
  const randomizeBtn = document.getElementById("randomize-btn");

  if (backBtn) {
    backBtn.addEventListener("click", handleBackStep);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", handleNextStep);
  }

  if (randomizeBtn) {
    randomizeBtn.addEventListener("click", randomizeOutfit);
  }
}

/**
 * Wechselt den Assistenten zum vorherigen Schritt.
 */
function handleBackStep() {
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

  state.stepElements.forEach((element, index) => {
    element.classList.toggle("step-active", index === stepIndex);
    element.classList.toggle("step-hidden", index !== stepIndex);
  });

  const backBtn = document.getElementById("back-btn");
  const nextBtn = document.getElementById("next-btn");
  const indicator = document.getElementById("step-indicator");
  const totalSteps = state.stepElements.length;
  const label = CLOTHING_STEPS[stepIndex]?.label ?? "";

  if (backBtn) {
    backBtn.disabled = stepIndex === 0;
  }

  if (nextBtn) {
    nextBtn.textContent = stepIndex === totalSteps - 1 ? "Finish" : "Next";
  }

  if (indicator) {
    indicator.textContent = `Step ${stepIndex + 1} of ${totalSteps}: ${label}`;
  }
}

/**
 * Wendet zufällige Farben auf alle Kleidungsstücke an und hält den Status synchron.
 */
function randomizeOutfit() {
  CLOTHING_STEPS.forEach((config) => {
    const options = state.colorOptions[config.key] || [];
    if (options.length === 0) {
      return;
    }
    const randomColor = options[Math.floor(Math.random() * options.length)];
    applyColor(config.key, randomColor.name);

    const select = document.getElementById(config.selectId);
    if (select) {
      select.value = randomColor.name;
    }
  });
}
