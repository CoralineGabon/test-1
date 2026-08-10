'use strict';

/* =========================================================================
   APOLLINE MATHE-MAGIE — app.js
   Vanille JS, aucune dépendance externe.
   ========================================================================= */

/* -------------------------------------------------------------------------
   1. WARDROBE DATA (~50 items across 5 categories)
   ------------------------------------------------------------------------- */

const CATEGORY_LABELS = {
  ballerina: 'Ballerina-Outfits',
  kpopOutfit: 'K-Pop-Idol-Outfits',
  danceAcc: 'Tanz-Accessoires',
  kpopAcc: 'K-Pop & Model Accessoires',
  modelOutfit: 'Top-Model-Outfits',
};

// Raw item definitions, grouped by category (German display names).
const RAW_ITEMS = {
  ballerina: [
    { name: 'Klassisches rosa Tutu', template: 'tutu', special: null, hue: 335 },
    { name: 'Lavendel-Tutu', template: 'tutu', special: null, hue: 265 },
    { name: 'Sternen-Tutu (weiß)', template: 'tutu', special: 'stars' },
    { name: 'Goldener Trikot-Anzug', template: 'leotard', special: 'gold' },
    { name: 'Rotes Tutu', template: 'tutu', special: null, hue: 355 },
    { name: 'Blaues Übungskleid', template: 'dress', special: null, hue: 210 },
    { name: 'Mint-Tutu', template: 'tutu', special: null, hue: 165 },
    { name: 'Tanz-Umhang', template: 'cape', special: null, hue: 280 },
    { name: 'Regenbogen-Tutu', template: 'tutu', special: 'rainbow' },
    { name: 'Ballerina-Galakleid', template: 'gown', special: null, hue: 340 },
  ],
  kpopOutfit: [
    { name: 'Holo-Bühnenoutfit', template: 'jumpsuit', special: 'holo' },
    { name: 'Oversized-Pailletten-Jacke', template: 'jacket', special: 'sequin', hue: 220 },
    { name: 'Sequin-Crop-Top-Set', template: 'crop', special: 'sequin', hue: 300 },
    { name: 'Neon-Videoclip-Outfit', template: 'crop', special: 'neon' },
    { name: 'Koreanische Schuluniform', template: 'uniform', special: null, hue: 220 },
    { name: 'K-Pop-Streetwear', template: 'jacket', special: null, hue: 20 },
    { name: 'Silbernes Comeback-Kleid', template: 'dress', special: 'silver' },
    { name: 'Pastell-Idol-Set', template: 'crop', special: null, hue: 300 },
    { name: 'Bomberjacke', template: 'jacket', special: null, hue: 25 },
    { name: 'Fan-Meeting-Outfit', template: 'dress', special: null, hue: 350 },
    { name: 'Girl-Crush-Lederlook (rosa)', template: 'jumpsuit', special: null, hue: 330 },
    { name: 'Konzert-Outfit weiß-gold', template: 'jumpsuit', special: 'gold' },
    { name: 'Showcase-Outfit', template: 'crop', special: null, hue: 45 },
    { name: 'Süßes Bonbon-Rosa-Outfit', template: 'dress', special: null, hue: 330 },
    { name: 'Music-Show-Outfit', template: 'jacket', special: 'sequin', hue: 260 },
  ],
  danceAcc: [
    { name: 'Spitzenschuhe', slot: 'feet', shape: 'shoes' },
    { name: 'Dutt mit Diadem', slot: 'head', shape: 'tiara' },
    { name: 'Haarband', slot: 'head', shape: 'ribbon' },
    { name: 'Tanztasche', slot: 'held', shape: 'bag' },
    { name: 'Blumenkrone', slot: 'head', shape: 'flowerCrown' },
    { name: 'Tänzerin-Schleier', slot: 'back', shape: 'veil' },
    { name: 'Pailletten-Handschuhe', slot: 'hands', shape: 'gloves' },
    { name: 'Perlenkette', slot: 'neck', shape: 'necklace' },
    { name: 'Stern-Ohrringe', slot: 'ears', shape: 'starEarrings' },
    { name: 'Bühnen-Armband', slot: 'wrist', shape: 'bracelet' },
  ],
  kpopAcc: [
    { name: 'Bühnenmikrofon', slot: 'held', shape: 'mic' },
    { name: 'Sonnenbrille', slot: 'face', shape: 'sunglasses' },
    { name: 'Mini-Handtasche', slot: 'held', shape: 'minibag' },
    { name: 'Holo-Fächer', slot: 'held', shape: 'fan' },
    { name: 'Colorblock-Kopfhörer', slot: 'head', shape: 'headphones' },
    { name: 'Idol-Krone', slot: 'head', shape: 'crown' },
    { name: 'Lange goldene Handschuhe', slot: 'hands', shape: 'longGloves', hue: 45 },
    { name: 'Ketten-Gürtel', slot: 'belt', shape: 'chainBelt' },
    { name: 'Bucket Hat', slot: 'head', shape: 'bucketHat' },
    { name: 'Bühnen-Ohrhörer', slot: 'ears', shape: 'earpiece' },
  ],
  modelOutfit: [
    { name: 'Haute-Couture-Laufstegkleid', template: 'gown', special: null, hue: 300 },
    { name: 'Eleganter Hosenanzug', template: 'suit', special: null, hue: 230 },
    { name: 'Sternen-Abendkleid', template: 'gown', special: 'stars' },
    { name: 'Pastell-Trenchcoat', template: 'coat', special: null, hue: 30 },
    { name: 'Fashion-Jumpsuit', template: 'jumpsuit', special: null, hue: 190 },
  ],
};

// Pastel kawaii color palette generator (HSL based, deterministic per index).
function paletteFor(hueSeed, special) {
  if (special === 'gold') return { primary: '#f5c542', secondary: '#fff2c2', accent: '#ffffff' };
  if (special === 'silver') return { primary: '#cfd8e3', secondary: '#f0f4f8', accent: '#ffffff' };
  if (special === 'stars') return { primary: '#ffffff', secondary: '#eef1ff', accent: '#ffd54f' };
  if (special === 'rainbow') return { primary: 'url(#rainbowGrad)', secondary: '#ffffff', accent: '#ffd54f' };
  if (special === 'holo') return { primary: 'url(#holoGrad)', secondary: '#e0d4ff', accent: '#ffffff' };
  if (special === 'sequin') return { primary: `hsl(${hueSeed},70%,75%)`, secondary: `hsl(${hueSeed},80%,90%)`, accent: '#ffffff' };
  if (special === 'neon') return { primary: `hsl(${hueSeed},90%,65%)`, secondary: `hsl(${(hueSeed + 40) % 360},90%,70%)`, accent: '#ffffff' };
  return {
    primary: `hsl(${hueSeed},70%,80%)`,
    secondary: `hsl(${hueSeed},70%,92%)`,
    accent: `hsl(${(hueSeed + 30) % 360},70%,60%)`,
  };
}

// Round-robin interleave of several arrays to build a varied unlock order.
function interleave(arrays) {
  const result = [];
  const maxLen = Math.max(...arrays.map((a) => a.length));
  for (let i = 0; i < maxLen; i++) {
    for (const arr of arrays) {
      if (i < arr.length) result.push(arr[i]);
    }
  }
  return result;
}

function buildWardrobe() {
  const buckets = {};
  for (const cat of Object.keys(RAW_ITEMS)) {
    buckets[cat] = RAW_ITEMS[cat].map((raw, i) => {
      const id = `${cat}_${i}`;
      const autoHue = Math.round((i / RAW_ITEMS[cat].length) * 360 + (cat.length * 17) % 360) % 360;
      const hueSeed = (typeof raw.hue === 'number') ? raw.hue : autoHue;
      if (raw.slot) {
        // accessory
        return {
          id,
          name: raw.name,
          category: cat,
          slot: raw.slot,
          kind: 'accessory',
          shape: raw.shape,
          color: `hsl(${hueSeed},75%,70%)`,
          accentColor: `hsl(${(hueSeed + 40) % 360},80%,60%)`,
        };
      }
      return {
        id,
        name: raw.name,
        category: cat,
        slot: 'outfit',
        kind: 'outfit',
        template: raw.template,
        colors: paletteFor(hueSeed, raw.special),
      };
    });
  }
  const order = interleave([
    buckets.ballerina,
    buckets.kpopOutfit,
    buckets.danceAcc,
    buckets.kpopAcc,
    buckets.modelOutfit,
  ]);
  return order;
}

const WARDROBE_ITEMS = buildWardrobe();
const TOTAL_ITEMS = WARDROBE_ITEMS.length;
const ITEMS_BY_ID = Object.fromEntries(WARDROBE_ITEMS.map((it) => [it.id, it]));

/* -------------------------------------------------------------------------
   2. UNLOCK PROGRESSION
   ------------------------------------------------------------------------- */

// Cumulative unlock count reached once `count` correct answers (this session)
// have been given. Milestones every 10; deltas alternate +1, +2, +1, +2, ...
// This reproduces exactly: 10->1, 20->3, 30->4, 40->6, 50->7, ...
function unlockedCountForSessionTotal(count) {
  const milestoneIndex = Math.floor(count / 10);
  if (milestoneIndex <= 0) return 0;
  let cumulative = 0;
  for (let i = 1; i <= milestoneIndex; i++) {
    cumulative += (i % 2 === 1) ? 1 : 2;
  }
  return Math.min(cumulative, TOTAL_ITEMS);
}

/* -------------------------------------------------------------------------
   3. STORAGE HELPERS (robust against empty / corrupt localStorage)
   ------------------------------------------------------------------------- */

const STORAGE_KEYS = {
  unlockedCount: 'apolline_unlocked_count', // legacy key, migrated on load
  unlockedIds: 'apolline_unlocked_ids',
  equipped: 'apolline_equipped',
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (e) {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // localStorage unavailable (private mode / quota) -> fail silently
  }
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Loads the set of unlocked item ids. Migrates from the old "first N items
// in a fixed order" scheme (apolline_unlocked_count) to a random selection,
// so nobody's already-earned progress is lost when this scheme changed.
function loadUnlockedIds() {
  const stored = loadJSON(STORAGE_KEYS.unlockedIds, null);
  if (Array.isArray(stored)) {
    return stored.filter((id) => ITEMS_BY_ID[id]).slice(0, TOTAL_ITEMS);
  }
  const legacyCount = loadJSON(STORAGE_KEYS.unlockedCount, 0);
  if (typeof legacyCount === 'number' && legacyCount > 0) {
    const migrated = shuffle(WARDROBE_ITEMS.map((it) => it.id)).slice(0, Math.min(legacyCount, TOTAL_ITEMS));
    saveJSON(STORAGE_KEYS.unlockedIds, migrated);
    return migrated;
  }
  return [];
}

function loadEquipped() {
  const v = loadJSON(STORAGE_KEYS.equipped, {});
  return (v && typeof v === 'object') ? v : {};
}

/* -------------------------------------------------------------------------
   4. APP STATE
   ------------------------------------------------------------------------- */

const state = {
  sessionCorrect: 0,                       // resets every reload
  unlockedIds: new Set(loadUnlockedIds()), // persists (random per unlock)
  equipped: loadEquipped(),                // persists: { slot: itemId }
  currentQuestion: null,
  lastQuestionKey: null,
  answered: false,
};

function unlockedItems() {
  return WARDROBE_ITEMS.filter((it) => state.unlockedIds.has(it.id));
}

function isUnlocked(item) {
  return state.unlockedIds.has(item.id);
}

/* -------------------------------------------------------------------------
   5. MATH QUESTION GENERATION
   ------------------------------------------------------------------------- */

const OPERATIONS = ['add', 'sub', 'mul', 'div'];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  let attempt;
  let key;
  do {
    const op = OPERATIONS[randInt(0, OPERATIONS.length - 1)];
    attempt = buildQuestion(op);
    key = `${attempt.op}_${attempt.a}_${attempt.b}`;
  } while (key === state.lastQuestionKey);
  state.lastQuestionKey = key;
  return attempt;
}

function buildQuestion(op) {
  if (op === 'add') {
    const a = randInt(1, 89);
    const b = randInt(1, 100 - a);
    return { op, a, b, result: a + b, symbol: '+' };
  }
  if (op === 'sub') {
    const a = randInt(10, 100);
    const b = randInt(1, a - 1);
    return { op, a, b, result: a - b, symbol: '−' };
  }
  if (op === 'mul') {
    const a = randInt(1, 10);
    const b = randInt(1, 10);
    return { op, a, b, result: a * b, symbol: '×' };
  }
  // division: exact, derived from multiplication tables
  const divisor = randInt(1, 10);
  const quotient = randInt(1, 10);
  const dividend = divisor * quotient;
  return { op, a: dividend, b: divisor, result: quotient, symbol: '÷' };
}

/* -------------------------------------------------------------------------
   6. SINGAPORE-STYLE VISUAL REPRESENTATION
   ------------------------------------------------------------------------- */

function svgEl(tag, attrs, children) {
  const attrStr = Object.entries(attrs || {}).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<${tag} ${attrStr}>${children || ''}</${tag}>`;
}

function buildVisual(q) {
  if (q.op === 'add') return buildBarAddition(q);
  if (q.op === 'sub') return buildBarSubtraction(q);
  if (q.op === 'mul') return buildGrid(q.a, q.b, 'mul');
  return buildGrid(q.result, q.b, 'div', q.a);
}

// Bar model: proportional rectangle split into two labeled parts.
function buildBarAddition(q) {
  const total = 100;
  const width = 320;
  const wa = Math.max(24, (q.a / total) * width * (100 / q.result <= 1 ? 1 : 1));
  const waFinal = (q.a / (q.a + q.b)) * width;
  const wbFinal = width - waFinal;
  return `
    <div class="bar-model" role="img" aria-label="Streifenmodell Addition">
      <div class="bar-row">
        <div class="bar-segment bar-a" style="width:${waFinal}px">${q.a}</div>
        <div class="bar-segment bar-b" style="width:${wbFinal}px">${q.b}</div>
      </div>
      <div class="bar-row bar-total-row">
        <div class="bar-segment bar-total" style="width:${width}px">?</div>
      </div>
    </div>`;
}

function buildBarSubtraction(q) {
  const width = 320;
  const wTotal = width;
  const wb = (q.b / q.a) * width;
  const wRest = width - wb;
  return `
    <div class="bar-model" role="img" aria-label="Streifenmodell Subtraktion">
      <div class="bar-row">
        <div class="bar-segment bar-total" style="width:${wTotal}px">${q.a}</div>
      </div>
      <div class="bar-row">
        <div class="bar-segment bar-b" style="width:${wb}px">${q.b}</div>
        <div class="bar-segment bar-question" style="width:${wRest}px">?</div>
      </div>
    </div>`;
}

// Array / grid model for multiplication and division.
function buildGrid(rows, cols, mode, dividendLabel) {
  rows = Math.max(1, Math.min(10, rows));
  cols = Math.max(1, Math.min(10, cols));
  let html = '<div class="grid-model" role="img" aria-label="Punktefeld">';
  if (mode === 'div') {
    html += `<div class="grid-caption">${dividendLabel} in ${cols}er-Gruppen</div>`;
  }
  html += '<div class="grid-rows">';
  for (let r = 0; r < rows; r++) {
    html += '<div class="grid-row">';
    for (let c = 0; c < cols; c++) {
      html += '<span class="grid-dot"></span>';
    }
    html += '</div>';
  }
  html += '</div></div>';
  return html;
}

function buildExplanationVisual(q) {
  if (q.op === 'mul') {
    return `<p class="explain-text">${q.a} × ${q.b} = ${q.result} ✨</p>`;
  }
  if (q.op === 'div') {
    return `<p class="explain-text">${q.a} ÷ ${q.b} = ${q.result}, weil ${q.b} × ${q.result} = ${q.a} ✨</p>`;
  }
  if (q.op === 'add') {
    return `<p class="explain-text">${q.a} + ${q.b} = ${q.result} ✨</p>`;
  }
  return `<p class="explain-text">${q.a} − ${q.b} = ${q.result} ✨</p>`;
}

/* -------------------------------------------------------------------------
   7. ENCOURAGEMENT MESSAGES (German)
   ------------------------------------------------------------------------- */

const PRAISE_MESSAGES = [
  'Super!', 'Wunderbar!', 'Klasse gemacht, Apolline!', 'Du bist eine Mathe-Königin!',
  'Fantastisch!', 'Genau richtig!', 'Bravo, weiter so!', 'Du strahlst wie ein Star! ✨',
  'Perfekt gerechnet!', 'Toll gemacht!', 'Hurra, richtig!', 'Yay, das war Spitzenklasse!',
  'Mathe-Zauberin am Werk! 🪄', 'Du rockst das! 🎤', 'Sensationell!', 'Ein Volltreffer!',
  'Bühne frei für dich, Superstar! 🌟', 'Traumhaft gerechnet!', 'Du glänzt wie ein Diamant! 💎',
  'Applaus, Applaus! 👏', 'Mega gemacht!', 'Das war zauberhaft! ✨', 'Champion-Level erreicht! 🏆',
  'Du tanzt durch die Matheaufgaben! 💃', 'Grandios!', 'Volltreffer, Apolline!',
];

const GENTLE_MESSAGES = [
  'Fast geschafft! Schau dir die Lösung an.',
  'Kein Problem, das üben wir noch!',
  'Nicht schlimm, beim nächsten Mal klappt es!',
  'Gute Idee, aber schau mal hier die richtige Lösung.',
];

function randomFrom(arr) {
  return arr[randInt(0, arr.length - 1)];
}

/* -------------------------------------------------------------------------
   8. DOLL RENDERING (SVG)
   ------------------------------------------------------------------------- */

// Builds a simple, anatomically-safe garment silhouette from a list of
// {y, half} waypoints given TOP TO BOTTOM (shoulder -> hem). The path always
// walks down the left side in increasing y, bulges the hem gently downward
// (natural drape direction), then walks back up the right side — so the
// shape can never come out inverted regardless of the waypoints chosen.
function garmentPath(waypoints, hemBulge) {
  hemBulge = hemBulge === undefined ? 8 : hemBulge;
  const left = waypoints.map((p) => ({ x: 100 - p.half, y: p.y }));
  const right = waypoints.map((p) => ({ x: 100 + p.half, y: p.y }));
  const n = waypoints.length;
  let d = `M ${left[0].x},${left[0].y}`;
  for (let i = 1; i < n; i++) d += ` L ${left[i].x},${left[i].y}`;
  const hemY = waypoints[n - 1].y + hemBulge;
  d += ` Q 100,${hemY} ${right[n - 1].x},${right[n - 1].y}`;
  for (let i = n - 2; i >= 0; i--) d += ` L ${right[i].x},${right[i].y}`;
  d += ' Z';
  return d;
}

const OUTFIT_TEMPLATES = {
  // Fitted bodice, then a sudden wide flare — classic ballet tutu.
  tutu: (c) => `
    <path d="${garmentPath([{ y: 92, half: 14 }, { y: 118, half: 13 }, { y: 120, half: 40 }], 8)}" fill="${c.secondary}"/>
    <path d="${garmentPath([{ y: 92, half: 14 }, { y: 118, half: 13 }], 4)}" fill="${c.primary}"/>`,
  leotard: (c) => `
    <path d="${garmentPath([{ y: 92, half: 14 }, { y: 155, half: 13 }], 6)}" fill="${c.primary}"/>`,
  dress: (c) => `
    <path d="${garmentPath([{ y: 92, half: 15 }, { y: 130, half: 16 }, { y: 175, half: 24 }], 8)}" fill="${c.primary}"/>
    <path d="${garmentPath([{ y: 92, half: 15 }, { y: 112, half: 16 }], 3)}" fill="${c.secondary}"/>`,
  cape: (c) => `
    <path d="${garmentPath([{ y: 88, half: 20 }, { y: 160, half: 34 }], 10)}" fill="${c.primary}" opacity="0.85"/>
    <path d="${garmentPath([{ y: 92, half: 14 }, { y: 155, half: 13 }], 6)}" fill="${c.secondary}"/>`,
  gown: (c) => `
    <path d="${garmentPath([{ y: 90, half: 16 }, { y: 130, half: 18 }, { y: 205, half: 30 }], 10)}" fill="${c.primary}"/>
    <path d="${garmentPath([{ y: 90, half: 16 }, { y: 112, half: 17 }], 3)}" fill="${c.secondary}"/>`,
  jumpsuit: (c) => `
    <path d="${garmentPath([{ y: 92, half: 15 }, { y: 150, half: 16 }, { y: 210, half: 14 }], 6)}" fill="${c.primary}"/>
    <path d="${garmentPath([{ y: 92, half: 15 }, { y: 112, half: 16 }], 3)}" fill="${c.secondary}"/>`,
  jacket: (c) => `
    <path d="${garmentPath([{ y: 145, half: 15 }, { y: 175, half: 24 }], 8)}" fill="${c.secondary}"/>
    <path d="${garmentPath([{ y: 88, half: 17 }, { y: 145, half: 16 }], 4)}" fill="${c.primary}"/>`,
  crop: (c) => `
    <path d="${garmentPath([{ y: 128, half: 14 }, { y: 172, half: 26 }], 8)}" fill="${c.secondary}"/>
    <path d="${garmentPath([{ y: 92, half: 14 }, { y: 118, half: 13 }], 4)}" fill="${c.primary}"/>`,
  uniform: (c) => `
    <path d="${garmentPath([{ y: 132, half: 14 }, { y: 168, half: 22 }], 6)}" fill="${c.secondary}"/>
    <path d="${garmentPath([{ y: 90, half: 15 }, { y: 128, half: 14 }], 4)}" fill="${c.primary}"/>
    <path d="M92,90 L100,108 L108,90" fill="none" stroke="${c.accent}" stroke-width="2"/>`,
  suit: (c) => `
    <path d="${garmentPath([{ y: 90, half: 15 }, { y: 150, half: 15 }, { y: 205, half: 13 }], 5)}" fill="${c.primary}"/>
    <path d="M88,90 L100,118 L112,90" fill="none" stroke="${c.accent}" stroke-width="2"/>`,
  coat: (c) => `
    <path d="${garmentPath([{ y: 88, half: 18 }, { y: 150, half: 19 }, { y: 210, half: 26 }], 9)}" fill="${c.primary}"/>
    <path d="M100,90 L100,205" stroke="${c.accent}" stroke-width="1.5" opacity="0.5"/>`,
};

const ACCESSORY_RENDERERS = {
  shoes: (c) => `<ellipse cx="88" cy="238" rx="9" ry="5" fill="${c.color}"/><ellipse cx="112" cy="238" rx="9" ry="5" fill="${c.color}"/>`,
  tiara: (c) => `<path d="M84,38 L92,24 L100,34 L108,24 L116,38 Z" fill="${c.color}" stroke="${c.accentColor}" stroke-width="1"/>`,
  ribbon: (c) => `<path d="M70,40 Q78,28 88,38 Q78,44 70,40 Z" fill="${c.color}"/><circle cx="72" cy="39" r="3" fill="${c.accentColor}"/>`,
  bag: (c) => `<rect x="130" y="150" width="18" height="16" rx="3" fill="${c.color}"/><path d="M133,150 Q139,140 145,150" fill="none" stroke="${c.accentColor}" stroke-width="2"/>`,
  flowerCrown: (c) => `<circle cx="82" cy="34" r="4" fill="${c.color}"/><circle cx="94" cy="28" r="4" fill="${c.accentColor}"/><circle cx="106" cy="28" r="4" fill="${c.color}"/><circle cx="118" cy="34" r="4" fill="${c.accentColor}"/>`,
  veil: (c) => `<path d="M100,30 Q60,60 66,120 Q70,70 100,50 Q130,70 134,120 Q140,60 100,30 Z" fill="${c.color}" opacity="0.35"/>`,
  gloves: (c) => `<ellipse cx="68" cy="132" rx="7" ry="9" fill="${c.color}"/><ellipse cx="132" cy="132" rx="7" ry="9" fill="${c.color}"/>`,
  necklace: (c) => `<path d="M85,96 Q100,112 115,96" fill="none" stroke="${c.color}" stroke-width="3" stroke-linecap="round"/>`,
  starEarrings: (c) => `<path d="M67,65 l2,4 l4,0 l-3,3 l1,4 l-4,-2 l-4,2 l1,-4 l-3,-3 l4,0 z" fill="${c.color}"/><path d="M133,65 l2,4 l4,0 l-3,3 l1,4 l-4,-2 l-4,2 l1,-4 l-3,-3 l4,0 z" fill="${c.color}"/>`,
  bracelet: (c) => `<ellipse cx="66" cy="122" rx="5" ry="3" fill="none" stroke="${c.color}" stroke-width="2"/>`,
  mic: (c) => `<rect x="140" y="110" width="7" height="18" rx="3" fill="${c.color}"/><circle cx="143.5" cy="106" r="6" fill="${c.accentColor}"/>`,
  sunglasses: (c) => `<rect x="82" y="60" width="15" height="9" rx="3" fill="${c.color}"/><rect x="103" y="60" width="15" height="9" rx="3" fill="${c.color}"/><path d="M97,64 L103,64" stroke="${c.color}" stroke-width="2"/>`,
  minibag: (c) => `<rect x="128" y="148" width="14" height="12" rx="2" fill="${c.color}"/><path d="M131,148 Q135,142 139,148" fill="none" stroke="${c.accentColor}" stroke-width="1.5"/>`,
  fan: (c) => `<path d="M136,110 Q150,90 148,120 Q142,112 136,110 Z" fill="${c.color}"/>`,
  headphones: (c) => `<path d="M70,62 Q100,24 130,62" fill="none" stroke="${c.color}" stroke-width="4"/><circle cx="69" cy="64" r="7" fill="${c.accentColor}"/><circle cx="131" cy="64" r="7" fill="${c.accentColor}"/>`,
  crown: (c) => `<path d="M82,36 L88,20 L96,32 L100,18 L104,32 L112,20 L118,36 Z" fill="${c.color}" stroke="${c.accentColor}" stroke-width="1"/>`,
  longGloves: (c) => `<rect x="63" y="112" width="10" height="28" rx="5" fill="${c.color}"/><rect x="127" y="112" width="10" height="28" rx="5" fill="${c.color}"/>`,
  chainBelt: (c) => `<rect x="78" y="118" width="44" height="6" rx="3" fill="none" stroke="${c.color}" stroke-width="2" stroke-dasharray="3,2"/>`,
  bucketHat: (c) => `<path d="M78,32 Q100,18 122,32 L126,42 L74,42 Z" fill="${c.color}"/>`,
  earpiece: (c) => `<circle cx="68" cy="65" r="3" fill="${c.color}"/><path d="M68,68 Q66,74 70,78" fill="none" stroke="${c.color}" stroke-width="1.5"/>`,
};

function renderDollSVG() {
  const outfitId = state.equipped.outfit;
  const outfitItem = outfitId ? ITEMS_BY_ID[outfitId] : null;
  const outfitSVG = outfitItem && OUTFIT_TEMPLATES[outfitItem.template]
    ? OUTFIT_TEMPLATES[outfitItem.template](outfitItem.colors)
    : OUTFIT_TEMPLATES.dress(paletteFor(330, null));

  let accessoriesSVG = '';
  for (const slot of Object.keys(state.equipped)) {
    if (slot === 'outfit') continue;
    const itemId = state.equipped[slot];
    const item = itemId ? ITEMS_BY_ID[itemId] : null;
    if (item && ACCESSORY_RENDERERS[item.shape]) {
      accessoriesSVG += ACCESSORY_RENDERERS[item.shape](item);
    }
  }

  return `
  <svg viewBox="0 0 200 250" class="doll-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rainbowGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ff9aa2"/>
        <stop offset="20%" stop-color="#ffd6a5"/>
        <stop offset="40%" stop-color="#fdffb6"/>
        <stop offset="60%" stop-color="#caffbf"/>
        <stop offset="80%" stop-color="#9bf6ff"/>
        <stop offset="100%" stop-color="#bdb2ff"/>
      </linearGradient>
      <linearGradient id="holoGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#a0c4ff"/>
        <stop offset="50%" stop-color="#bdb2ff"/>
        <stop offset="100%" stop-color="#ffc6ff"/>
      </linearGradient>
    </defs>
    <!-- legs -->
    <rect x="90" y="150" width="8" height="70" rx="4" fill="#ffe0c2"/>
    <rect x="102" y="150" width="8" height="70" rx="4" fill="#ffe0c2"/>
    <!-- arms -->
    <rect x="62" y="98" width="9" height="45" rx="4" fill="#ffe0c2"/>
    <rect x="129" y="98" width="9" height="45" rx="4" fill="#ffe0c2"/>
    <!-- outfit -->
    <g class="doll-outfit">${outfitSVG}</g>
    <!-- head -->
    <circle cx="100" cy="60" r="34" fill="#ffe0c2"/>
    <!-- hair back -->
    <path d="M64,55 Q60,100 74,120 Q66,90 70,55 Z" fill="#7a5233"/>
    <path d="M136,55 Q140,100 126,120 Q134,90 130,55 Z" fill="#7a5233"/>
    <!-- hair top -->
    <path d="M64,54 Q66,18 100,16 Q134,18 136,54 Q120,36 100,36 Q80,36 64,54 Z" fill="#8a6440"/>
    <!-- eyes (big, idol style) -->
    <ellipse cx="86" cy="62" rx="7" ry="9" fill="#3a2a20"/>
    <ellipse cx="114" cy="62" rx="7" ry="9" fill="#3a2a20"/>
    <circle cx="88" cy="59" r="2.2" fill="#fff"/>
    <circle cx="116" cy="59" r="2.2" fill="#fff"/>
    <!-- blush -->
    <ellipse cx="78" cy="72" rx="5" ry="3" fill="#ffb6c1" opacity="0.6"/>
    <ellipse cx="122" cy="72" rx="5" ry="3" fill="#ffb6c1" opacity="0.6"/>
    <!-- smile -->
    <path d="M92,78 Q100,84 108,78" fill="none" stroke="#c97a53" stroke-width="2" stroke-linecap="round"/>
    <!-- accessories -->
    <g class="doll-accessories">${accessoriesSVG}</g>
  </svg>`;
}

function renderDoll() {
  const container = document.getElementById('doll-display');
  container.innerHTML = renderDollSVG();
}

/* -------------------------------------------------------------------------
   9. WARDROBE UI
   ------------------------------------------------------------------------- */

function renderWardrobe() {
  const container = document.getElementById('wardrobe-content');
  let html = '';
  for (const catKey of Object.keys(CATEGORY_LABELS)) {
    const items = WARDROBE_ITEMS.filter((it) => it.category === catKey);
    html += `<div class="wardrobe-category">
      <h3>${CATEGORY_LABELS[catKey]}</h3>
      <div class="wardrobe-grid">`;
    for (const item of items) {
      const unlocked = isUnlocked(item);
      const equipped = state.equipped[item.slot] === item.id;
      html += `
        <button class="wardrobe-item ${unlocked ? 'unlocked' : 'locked'} ${equipped ? 'equipped' : ''}"
                data-item-id="${item.id}"
                ${unlocked ? '' : 'disabled aria-disabled="true"'}
                title="${item.name}">
          <span class="wardrobe-icon">${unlocked ? itemPreviewIcon(item) : '🔒'}</span>
          <span class="wardrobe-name">${unlocked ? item.name : '???'}</span>
        </button>`;
    }
    html += `</div></div>`;
  }
  container.innerHTML = html;

  container.querySelectorAll('.wardrobe-item.unlocked').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-item-id');
      toggleEquip(id);
    });
  });
}

function itemPreviewIcon(item) {
  if (item.kind === 'outfit') return '👗';
  const icons = {
    feet: '🥿', head: '👑', held: '👜', back: '🌌',
    hands: '🧤', neck: '📏', ears: '⭐', wrist: '💍',
    face: '🕶️', belt: '⛓️',
  };
  return icons[item.slot] || '✨';
}

function toggleEquip(itemId) {
  const item = ITEMS_BY_ID[itemId];
  if (!item || !isUnlocked(item)) return;
  if (state.equipped[item.slot] === itemId) {
    delete state.equipped[item.slot];
  } else {
    state.equipped[item.slot] = itemId;
  }
  saveJSON(STORAGE_KEYS.equipped, state.equipped);
  renderDoll();
  renderWardrobe();
}

function toggleWardrobePanel() {
  const panel = document.getElementById('wardrobe-panel');
  panel.classList.toggle('open');
}

/* -------------------------------------------------------------------------
   10. PROGRESS BAR & UNLOCK LOGIC
   ------------------------------------------------------------------------- */

function updateProgressBar() {
  const bar = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (state.unlockedIds.size >= TOTAL_ITEMS) {
    bar.style.width = '100%';
    label.textContent = 'Alle Outfits freigeschaltet! 🎉';
    return;
  }
  const progressInMilestone = state.sessionCorrect % 10;
  const pct = (progressInMilestone / 10) * 100;
  bar.style.width = `${pct}%`;
  label.textContent = `⭐ ${progressInMilestone} / 10 für das nächste Outfit!`;
}

// Picks newly-unlocked items at random from whatever is still locked, so the
// reveal order is a surprise every time (including on a fresh replay).
function checkUnlocks() {
  const target = unlockedCountForSessionTotal(state.sessionCorrect);
  const currentCount = state.unlockedIds.size;
  if (target > currentCount) {
    const needed = target - currentCount;
    const locked = WARDROBE_ITEMS.filter((it) => !state.unlockedIds.has(it.id));
    const chosen = shuffle(locked).slice(0, needed);
    chosen.forEach((it) => state.unlockedIds.add(it.id));
    saveJSON(STORAGE_KEYS.unlockedIds, Array.from(state.unlockedIds));
    return chosen;
  }
  return [];
}

/* -------------------------------------------------------------------------
   11. GAME FLOW
   ------------------------------------------------------------------------- */

function startGame() {
  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  renderDoll();
  renderWardrobe();
  updateProgressBar();
  nextQuestion();
}

function nextQuestion() {
  state.answered = false;
  state.currentQuestion = generateQuestion();
  renderQuestion();
}

function renderQuestion() {
  const q = state.currentQuestion;
  document.getElementById('question-text').textContent = `${q.a} ${q.symbol} ${q.b} = ?`;
  document.getElementById('question-visual').innerHTML = buildVisual(q);
  const input = document.getElementById('answer-input');
  input.value = '';
  input.readOnly = false;
  input.focus();
  document.getElementById('feedback-panel').innerHTML = '';
  document.getElementById('feedback-panel').className = 'feedback-panel';
  document.getElementById('check-btn').textContent = 'Prüfen';
}

function submitAnswer() {
  if (state.answered) {
    nextQuestion();
    return;
  }
  const input = document.getElementById('answer-input');
  const raw = input.value.trim();
  if (raw === '') {
    input.focus();
    return;
  }
  const userAnswer = parseInt(raw, 10);
  const q = state.currentQuestion;
  const correct = userAnswer === q.result;
  state.answered = true;
  input.readOnly = true;

  const feedbackPanel = document.getElementById('feedback-panel');
  document.getElementById('check-btn').textContent = 'Nächste Aufgabe';

  if (correct) {
    state.sessionCorrect++;
    feedbackPanel.className = 'feedback-panel feedback-correct';
    feedbackPanel.innerHTML = `<p class="feedback-message">${randomFrom(PRAISE_MESSAGES)} ✅</p>`;
    launchConfetti(45);
    launchSparkleBurst();
    updateProgressBar();
    const newlyUnlocked = checkUnlocks();
    if (newlyUnlocked.length > 0) {
      showUnlockAnimation(newlyUnlocked);
      renderWardrobe();
    }
  } else {
    feedbackPanel.className = 'feedback-panel feedback-incorrect';
    feedbackPanel.innerHTML = `
      <p class="feedback-message">${randomFrom(GENTLE_MESSAGES)}</p>
      ${buildExplanationVisual(q)}`;
  }
}

/* -------------------------------------------------------------------------
   12. CONFETTI & UNLOCK ANIMATIONS
   ------------------------------------------------------------------------- */

function launchConfetti(count) {
  const layer = document.getElementById('confetti-layer');
  const colors = ['#ff9aa2', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#bdb2ff', '#ffd700'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[randInt(0, colors.length - 1)];
    piece.style.animationDuration = `${0.8 + Math.random() * 0.8}s`;
    piece.style.animationDelay = `${Math.random() * 0.2}s`;
    layer.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

// A handful of floating sparkle emoji rising from the question card, for
// extra festivity on every correct answer (separate from the falling confetti).
function launchSparkleBurst() {
  const card = document.querySelector('.question-card');
  if (!card) return;
  const sparkles = ['✨', '⭐', '🌟', '💖', '🎉'];
  const rect = card.getBoundingClientRect();
  for (let i = 0; i < 10; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle-piece';
    el.textContent = sparkles[randInt(0, sparkles.length - 1)];
    el.style.left = `${rect.left + rect.width * Math.random()}px`;
    el.style.top = `${rect.top + rect.height * 0.5}px`;
    el.style.setProperty('--drift', `${randInt(-40, 40)}px`);
    el.style.animationDuration = `${0.9 + Math.random() * 0.6}s`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

function showUnlockAnimation(items) {
  const overlay = document.getElementById('unlock-overlay');
  const itemNames = items.map((it) => it.name).join(', ');
  overlay.innerHTML = `
    <div class="unlock-modal">
      <div class="gift-box">
        <div class="gift-lid"></div>
        <div class="gift-base"></div>
      </div>
      <div class="unlock-stars">✨⭐✨⭐✨</div>
      <h2>Neu freigeschaltet!</h2>
      <p>${itemNames}</p>
      <button id="unlock-continue-btn" class="primary-btn">Weiter ✨</button>
    </div>`;
  overlay.classList.add('visible');
  launchConfetti(40);
  document.getElementById('unlock-continue-btn').addEventListener('click', () => {
    overlay.classList.remove('visible');
    overlay.innerHTML = '';
  });
}

/* -------------------------------------------------------------------------
   13. EVENT WIRING
   ------------------------------------------------------------------------- */

function restrictToDigits(input) {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g, '');
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitAnswer();
    }
  });
}

function init() {
  document.getElementById('play-btn').addEventListener('click', startGame);
  document.getElementById('check-btn').addEventListener('click', submitAnswer);
  document.getElementById('wardrobe-toggle-btn').addEventListener('click', toggleWardrobePanel);
  document.getElementById('wardrobe-close-btn').addEventListener('click', toggleWardrobePanel);
  restrictToDigits(document.getElementById('answer-input'));
}

document.addEventListener('DOMContentLoaded', init);
