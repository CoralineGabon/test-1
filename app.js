'use strict';

/* =========================================================================
   APOLLINE MATHE-MAGIE — app.js
   Vanille JS, aucune dépendance externe (hormis les photos de la galerie,
   chargées depuis le CDN Pexels — licence Pexels : libres de droits,
   utilisation gratuite, attribution non requise).
   ========================================================================= */

/* -------------------------------------------------------------------------
   1. GALLERY DATA (~50 free-license photos across 3 themes)
   ------------------------------------------------------------------------- */

const CATEGORY_LABELS = {
  ballet: 'Ballett',
  fashion: 'Mode & Défilé',
  dance: 'Moderner Tanz',
};

// Real photos from Pexels (free license, no attribution required).
// URL pattern: https://images.pexels.com/photos/{pexelsId}/pexels-photo-{pexelsId}.jpeg
const RAW_GALLERY = {
  ballet: [
    { pexelsId: 8935909, title: 'Rosa Ballettschuhe' },
    { pexelsId: 35874285, title: 'Ballerina-Figur mit Spitzenschuhen' },
    { pexelsId: 10640401, title: 'Spitzenschuhe auf Holzboden' },
    { pexelsId: 8462946, title: 'Ballerina im weißen Tutu' },
    { pexelsId: 11423560, title: 'Tänzerin auf einem Stuhl' },
    { pexelsId: 6616908, title: 'Ballerina mit erhobenem Bein' },
    { pexelsId: 10628896, title: 'Schatten einer Ballerina' },
    { pexelsId: 5888633, title: 'Ballerina im Sonnenlicht' },
    { pexelsId: 11411300, title: 'Ballerina auf der Treppe' },
    { pexelsId: 2803819, title: 'Ballett-Sprung auf der Bühne' },
    { pexelsId: 17029893, title: 'Tanzpose auf der Bühne' },
    { pexelsId: 34779230, title: 'Anmutige Ballerina' },
    { pexelsId: 16233597, title: 'Tanzfigur im Ballett' },
    { pexelsId: 8853793, title: 'Ballett-Probe im Studio' },
    { pexelsId: 8462936, title: 'Ballerina beim Dehnen' },
    { pexelsId: 31337085, title: 'Ballett in Bewegung' },
    { pexelsId: 8463024, title: 'Tanzpaar in Bewegung' },
    { pexelsId: 7667554, title: 'Kinder beim Tanzen' },
    { pexelsId: 6160476, title: 'Ballerina in Schwarz' },
  ],
  fashion: [
    { pexelsId: 13045753, title: 'Model auf dem Laufsteg' },
    { pexelsId: 8793626, title: 'Model bei der Modenschau' },
    { pexelsId: 9511239, title: 'Auftritt bei der Modenschau' },
    { pexelsId: 5185590, title: 'Kleid auf dem Laufsteg' },
    { pexelsId: 14801125, title: 'Porträt im eleganten Kleid' },
    { pexelsId: 18651085, title: 'Laufsteg-Moment' },
    { pexelsId: 15740610, title: 'Blaues Kleid auf dem Laufsteg' },
    { pexelsId: 9509318, title: 'Weißes Kleid auf dem Laufsteg' },
    { pexelsId: 19837893, title: 'Rotes Kleid auf dem Laufsteg' },
    { pexelsId: 13191609, title: 'Festliches Gewand auf dem Laufsteg' },
    { pexelsId: 18650819, title: 'Model im weißen Outfit' },
    { pexelsId: 17503286, title: 'Farbenfrohes Gewand' },
    { pexelsId: 30706568, title: 'Schwarzes Kleid im Studio' },
    { pexelsId: 30736117, title: 'Weißes Kleid im Fotostudio' },
    { pexelsId: 17570989, title: 'Elegantes Schwarz im Studio' },
    { pexelsId: 35073807, title: 'Oranges Kleid, Studio-Look' },
    { pexelsId: 30736118, title: 'High-Fashion im Studio' },
  ],
  dance: [
    { pexelsId: 5368935, title: 'Streetdance am Fluss' },
    { pexelsId: 34106575, title: 'Tanzpose vor Wandbild' },
    { pexelsId: 29046685, title: 'Zeitgenössischer Tanz' },
    { pexelsId: 8928882, title: 'Tanz auf der Straße' },
    { pexelsId: 18355844, title: 'Tanzende Freunde' },
    { pexelsId: 7502601, title: 'Tanz im Freien' },
    { pexelsId: 10001398, title: 'Tanz in Schwarz-Weiß' },
    { pexelsId: 11063372, title: 'Breakdance-Moment' },
    { pexelsId: 7972032, title: 'Im Rampenlicht' },
    { pexelsId: 1260580, title: 'Tanz am Zebrastreifen' },
    { pexelsId: 17130464, title: 'Tanz auf dem Marktplatz' },
    { pexelsId: 10570889, title: 'Tanz im Weizenfeld' },
    { pexelsId: 6221578, title: 'Zeitgenössischer Tanz im Studio' },
    { pexelsId: 3949703, title: 'Tänzerin im rosa Kleid' },
    { pexelsId: 19331601, title: 'Traditioneller Tanz beim Fest' },
    { pexelsId: 15964960, title: 'Tanzende Menge' },
  ],
};

function pexelsUrl(pexelsId, width) {
  return `https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
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

function buildGallery() {
  const buckets = {};
  for (const cat of Object.keys(RAW_GALLERY)) {
    buckets[cat] = RAW_GALLERY[cat].map((raw) => ({
      id: `p${raw.pexelsId}`,
      category: cat,
      title: raw.title,
      thumbUrl: pexelsUrl(raw.pexelsId, 360),
      fullUrl: pexelsUrl(raw.pexelsId, 1000),
    }));
  }
  return interleave([buckets.ballet, buckets.fashion, buckets.dance]);
}

const GALLERY_ITEMS = buildGallery();
const TOTAL_ITEMS = GALLERY_ITEMS.length;
const ITEMS_BY_ID = Object.fromEntries(GALLERY_ITEMS.map((it) => [it.id, it]));

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
  unlockedIds: 'apolline_gallery_unlocked_ids',
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

function loadUnlockedIds() {
  const stored = loadJSON(STORAGE_KEYS.unlockedIds, null);
  if (Array.isArray(stored)) {
    return stored.filter((id) => ITEMS_BY_ID[id]).slice(0, TOTAL_ITEMS);
  }
  return [];
}

/* -------------------------------------------------------------------------
   4. APP STATE
   ------------------------------------------------------------------------- */

const state = {
  sessionCorrect: 0,                       // resets every reload
  unlockedIds: new Set(loadUnlockedIds()), // persists (random per unlock)
  currentQuestion: null,
  lastQuestionKey: null,
  answered: false,
};

function unlockedItems() {
  return GALLERY_ITEMS.filter((it) => state.unlockedIds.has(it.id));
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

function buildVisual(q) {
  if (q.op === 'add') return buildBarAddition(q);
  if (q.op === 'sub') return buildBarSubtraction(q);
  if (q.op === 'mul') return buildGrid(q.a, q.b, 'mul');
  return buildGrid(q.result, q.b, 'div', q.a);
}

// Bar model: proportional rectangle split into two labeled parts.
function buildBarAddition(q) {
  const width = 320;
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
  const wb = (q.b / q.a) * width;
  const wRest = width - wb;
  return `
    <div class="bar-model" role="img" aria-label="Streifenmodell Subtraktion">
      <div class="bar-row">
        <div class="bar-segment bar-total" style="width:${width}px">${q.a}</div>
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

const UNLOCK_MESSAGES = [
  'Neues Bild für deine Sammlung!',
  'Du hast ein Bild freigeschaltet!',
  'Wow, schau mal, was du gewonnen hast!',
  'Ein neuer Schatz für deine Galerie!',
  'Klasse! Deine Sammlung wächst!',
];

function randomFrom(arr) {
  return arr[randInt(0, arr.length - 1)];
}

/* -------------------------------------------------------------------------
   8. GALLERY UI (grid + showcase + collection viewer)
   ------------------------------------------------------------------------- */

const CATEGORY_ICONS = { ballet: '🩰', fashion: '👗', dance: '💃' };

// A locked thumbnail never loads its real image — just a tinted placeholder
// with a lock, so nothing is fetched (or peekable) before it's earned.
function lockedThumbHTML() {
  return `<div class="thumb-locked"><span class="lock-icon">🔒</span></div>`;
}

function unlockedThumbHTML(item) {
  return `<img class="thumb-img" src="${item.thumbUrl}" alt="${item.title}" loading="lazy"
    onerror="this.closest('.thumb-frame').classList.add('thumb-broken')">`;
}

function renderGallery() {
  const container = document.getElementById('gallery-content');
  let html = '';
  for (const catKey of Object.keys(CATEGORY_LABELS)) {
    const items = GALLERY_ITEMS.filter((it) => it.category === catKey);
    const unlockedCount = items.filter(isUnlocked).length;
    html += `<div class="gallery-category">
      <h3>${CATEGORY_ICONS[catKey]} ${CATEGORY_LABELS[catKey]} <span class="cat-count">${unlockedCount}/${items.length}</span></h3>
      <div class="gallery-grid">`;
    for (const item of items) {
      const unlocked = isUnlocked(item);
      html += `
        <button class="thumb-frame ${unlocked ? 'unlocked' : 'locked'}"
                data-item-id="${item.id}"
                ${unlocked ? '' : 'disabled aria-disabled="true"'}
                title="${unlocked ? item.title : '???'}">
          ${unlocked ? unlockedThumbHTML(item) : lockedThumbHTML()}
        </button>`;
    }
    html += `</div></div>`;
  }
  container.innerHTML = html;

  container.querySelectorAll('.thumb-frame.unlocked').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-item-id');
      const list = unlockedItems();
      const index = list.findIndex((it) => it.id === id);
      openCollectionViewer(index >= 0 ? index : 0);
    });
  });
}

function toggleGalleryPanel() {
  document.getElementById('gallery-panel').classList.toggle('open');
}

function renderShowcase() {
  const container = document.getElementById('showcase-content');
  const list = unlockedItems();
  if (list.length === 0) {
    container.innerHTML = `
      <div class="showcase-empty">
        <div class="showcase-empty-icon">🖼️</div>
        <p>Löse Aufgaben, um deine ersten Bilder freizuschalten!</p>
      </div>`;
    return;
  }
  const latest = list[list.length - 1];
  container.innerHTML = `
    <p class="showcase-label">Zuletzt freigeschaltet</p>
    <button class="showcase-frame" id="showcase-open-btn" title="${latest.title}">
      <img src="${latest.thumbUrl}" alt="${latest.title}"
        onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'viewer-broken',textContent:'Bild nicht verfügbar'}))">
    </button>
    <p class="showcase-title">${latest.title}</p>
    <p class="showcase-count">${list.length} / ${TOTAL_ITEMS} Bilder gesammelt</p>`;
  const openBtn = document.getElementById('showcase-open-btn');
  if (openBtn) {
    openBtn.addEventListener('click', () => openCollectionViewer(list.length - 1));
  }
}

/* -------------------------------------------------------------------------
   9. COLLECTION VIEWER (full-screen, navigable through unlocked images)
   ------------------------------------------------------------------------- */

let viewerIndex = 0;

function openCollectionViewer(startIndex) {
  const list = unlockedItems();
  if (list.length === 0) return;
  viewerIndex = Math.max(0, Math.min(startIndex || 0, list.length - 1));
  renderCollectionViewer();
  document.getElementById('collection-viewer').classList.add('visible');
}

function closeCollectionViewer() {
  document.getElementById('collection-viewer').classList.remove('visible');
}

function stepCollectionViewer(delta) {
  const list = unlockedItems();
  if (list.length === 0) return;
  viewerIndex = (viewerIndex + delta + list.length) % list.length;
  renderCollectionViewer();
}

function renderCollectionViewer() {
  const list = unlockedItems();
  const overlay = document.getElementById('collection-viewer');
  if (list.length === 0) {
    overlay.innerHTML = '';
    return;
  }
  const item = list[viewerIndex];
  overlay.innerHTML = `
    <div class="viewer-topbar">
      <span class="viewer-counter">${viewerIndex + 1} / ${list.length}</span>
      <button id="viewer-close-btn" class="close-btn" aria-label="Schließen">✕</button>
    </div>
    <div class="viewer-stage">
      <button id="viewer-prev-btn" class="viewer-nav-btn" aria-label="Zurück" ${list.length < 2 ? 'disabled' : ''}>‹</button>
      <img class="viewer-image" src="${item.fullUrl}" alt="${item.title}"
        onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'viewer-broken',textContent:'Bild konnte nicht geladen werden 😢'}))">
      <button id="viewer-next-btn" class="viewer-nav-btn" aria-label="Weiter" ${list.length < 2 ? 'disabled' : ''}>›</button>
    </div>
    <p class="viewer-caption">${CATEGORY_ICONS[item.category]} ${item.title}</p>`;

  document.getElementById('viewer-close-btn').addEventListener('click', closeCollectionViewer);
  document.getElementById('viewer-prev-btn').addEventListener('click', () => stepCollectionViewer(-1));
  document.getElementById('viewer-next-btn').addEventListener('click', () => stepCollectionViewer(1));
}

/* -------------------------------------------------------------------------
   10. PROGRESS BAR & UNLOCK LOGIC
   ------------------------------------------------------------------------- */

function updateProgressBar() {
  const bar = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (state.unlockedIds.size >= TOTAL_ITEMS) {
    bar.style.width = '100%';
    label.textContent = 'Alle Bilder freigeschaltet! 🎉';
    return;
  }
  const progressInMilestone = state.sessionCorrect % 10;
  const pct = (progressInMilestone / 10) * 100;
  bar.style.width = `${pct}%`;
  label.textContent = `⭐ ${progressInMilestone} / 10 für das nächste Bild!`;
}

// Picks newly-unlocked items at random from whatever is still locked, so the
// reveal order is a surprise every time (including on a fresh replay).
function checkUnlocks() {
  const target = unlockedCountForSessionTotal(state.sessionCorrect);
  const currentCount = state.unlockedIds.size;
  if (target > currentCount) {
    const needed = target - currentCount;
    const locked = GALLERY_ITEMS.filter((it) => !state.unlockedIds.has(it.id));
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
  renderShowcase();
  renderGallery();
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
      renderGallery();
      renderShowcase();
      showUnlockAnimation(newlyUnlocked);
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
  const item = items[0];
  const moreCount = items.length - 1;
  overlay.innerHTML = `
    <div class="unlock-modal">
      <div class="unlock-stars">✨⭐✨⭐✨</div>
      <h2>${randomFrom(UNLOCK_MESSAGES)}</h2>
      <button class="unlock-image-frame" id="unlock-image-btn" title="${item.title}">
        <img src="${item.fullUrl}" alt="${item.title}"
          onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'viewer-broken',textContent:'Bild konnte nicht geladen werden 😢'}))">
      </button>
      <p class="unlock-item-title">${CATEGORY_ICONS[item.category]} ${item.title}${moreCount > 0 ? ` <span class="unlock-more">+${moreCount} weitere</span>` : ''}</p>
      <button id="unlock-continue-btn" class="primary-btn">Weiter ✨</button>
    </div>`;
  overlay.classList.add('visible');
  launchConfetti(40);
  document.getElementById('unlock-continue-btn').addEventListener('click', () => {
    overlay.classList.remove('visible');
    overlay.innerHTML = '';
  });
  const imageBtn = document.getElementById('unlock-image-btn');
  if (imageBtn) {
    imageBtn.addEventListener('click', () => {
      overlay.classList.remove('visible');
      overlay.innerHTML = '';
      const list = unlockedItems();
      const index = list.findIndex((it) => it.id === item.id);
      openCollectionViewer(index >= 0 ? index : 0);
    });
  }
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
  document.getElementById('gallery-toggle-btn').addEventListener('click', toggleGalleryPanel);
  document.getElementById('gallery-close-btn').addEventListener('click', toggleGalleryPanel);
  document.getElementById('collection-toggle-btn').addEventListener('click', () => openCollectionViewer(unlockedItems().length - 1));
  restrictToDigits(document.getElementById('answer-input'));

  document.addEventListener('keydown', (e) => {
    const viewer = document.getElementById('collection-viewer');
    if (!viewer.classList.contains('visible')) return;
    if (e.key === 'Escape') closeCollectionViewer();
    if (e.key === 'ArrowLeft') stepCollectionViewer(-1);
    if (e.key === 'ArrowRight') stepCollectionViewer(1);
  });
}

document.addEventListener('DOMContentLoaded', init);
