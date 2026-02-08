// app.js
/* =========================================================
   Fachkompetenzen – Lernziele (offline, GitHub Pages)
   - No CDN
   - PDF via local vendor/html2canvas.min.js + vendor/jspdf.umd.min.js
   - Fallback: print in new tab
   ========================================================= */

"use strict";

/** -------------------------
 *  DATA CONFIG (example)
 *  - groups[] -> items[] -> levels: vv/g/ge/u -> { color, points:[{t, ex?}] }
 *  ------------------------- */
const DATA = {
  groups: [
    {
      id: "g1",
      title: "Fachkompetenzen Deutsch",
      note: "Beurteilung entlang zentraler Lernziele (Lesen, Schreiben, Sprache).",
      items: [
        {
          id: "de_lesen",
          title: "Lesen & Textverständnis",
          levels: {
            vv: {
              color: "#111",
              points: [
                { t: "liest flüssig, sinnbetont und mit sicherer Orientierung im Text", ex: "fluency" },
                { t: "entnimmt Informationen präzise und stellt eigene Bezüge her", ex: "comprehension" },
                { t: "nutzt passende Lesestrategien selbstständig (z.B. markieren, Fragen bilden)", ex: "strategies" }
              ]
            },
            g: {
              color: "#111",
              points: [
                { t: "liest überwiegend flüssig und versteht den Text zuverlässig", ex: "fluency" },
                { t: "findet zentrale Informationen und kann sie in eigenen Worten wiedergeben", ex: "comprehension" },
                { t: "setzt Lesestrategien passend ein, wenn sie thematisiert werden", ex: "strategies" }
              ]
            },
            ge: {
              color: "#111",
              points: [
                { t: "liest teilweise stockend; Tempo und Genauigkeit sind noch nicht durchgehend stabil", ex: "fluency" },
                { t: "versteht Kernaussagen, braucht bei Details gelegentlich Unterstützung", ex: "comprehension" },
                { t: "profitiert von klaren Strategien (Abschnitte, Schlüsselwörter, Leitfragen)", ex: "strategies" }
              ]
            },
            u: {
              color: "#111",
              points: [
                { t: "liest häufig stockend; das Verständnis wird dadurch deutlich erschwert", ex: "fluency" },
                { t: "benötigt enges Coaching, um zentrale Informationen überhaupt zu sichern", ex: "comprehension" },
                { t: "braucht sehr strukturierte Unterstützung (kurze Texte, Vorentlastung, wiederholtes Üben)", ex: "strategies" }
              ]
            }
          }
        },
        {
          id: "de_schreiben",
          title: "Schreiben & Textgestaltung",
          levels: {
            vv: {
              color: "#111",
              points: [
                { t: "verfasst klare, gut strukturierte Texte mit treffendem Wortschatz", ex: "structure" },
                { t: "setzt Rechtschreibung und Grammatik sicher ein", ex: "orthography" },
                { t: "überarbeitet Texte gezielt (Inhalt, Sprache, Form)", ex: "revision" }
              ]
            },
            g: {
              color: "#111",
              points: [
                { t: "schreibt verständliche Texte mit nachvollziehbarer Gliederung", ex: "structure" },
                { t: "Rechtschreibung und Grammatik sind weitgehend sicher", ex: "orthography" },
                { t: "überarbeitet Texte nach Hinweisen und überprüft wichtige Stellen", ex: "revision" }
              ]
            },
            ge: {
              color: "#111",
              points: [
                { t: "Texte sind grundsätzlich verständlich, wirken aber noch nicht durchgehend geordnet", ex: "structure" },
                { t: "macht wiederkehrende Fehler; profitiert von gezielten Strategien (Wörterlisten, Kontrollschritte)", ex: "orthography" },
                { t: "überarbeitet Texte noch wenig selbstständig; braucht klare Checklisten", ex: "revision" }
              ]
            },
            u: {
              color: "#111",
              points: [
                { t: "Texte sind häufig schwer verständlich; Struktur und Satzbau benötigen intensive Unterstützung", ex: "structure" },
                { t: "Rechtschreibung/Grammatik sind deutlich unsicher; es braucht konsequente Übungssequenzen", ex: "orthography" },
                { t: "überarbeitet ohne enge Begleitung kaum; klare, kleinschrittige Coaching-Phasen sind nötig", ex: "revision" }
              ]
            }
          }
        },
        {
          id: "de_sprechen",
          title: "Mündliche Kommunikation",
          levels: {
            vv: {
              color: "#111",
              points: [
                { t: "spricht präzise und adressatengerecht; argumentiert überzeugend", ex: "clarity" },
                { t: "hört aktiv zu und greift Beiträge anderer sinnvoll auf", ex: "listening" },
                { t: "präsentiert sicher (Tempo, Lautstärke, Struktur)", ex: "presentation" }
              ]
            },
            g: {
              color: "#111",
              points: [
                { t: "drückt sich klar aus und kann Gedanken gut erklären", ex: "clarity" },
                { t: "hört meist aufmerksam zu und reagiert passend", ex: "listening" },
                { t: "präsentiert vorbereitet und verständlich", ex: "presentation" }
              ]
            },
            ge: {
              color: "#111",
              points: [
                { t: "formuliert verständlich, braucht aber gelegentlich Zeit oder Leitfragen", ex: "clarity" },
                { t: "hört zu, verliert jedoch vereinzelt den Faden; profitiert von Gesprächsregeln", ex: "listening" },
                { t: "präsentiert noch unsicher; klare Strukturhilfen unterstützen", ex: "presentation" }
              ]
            },
            u: {
              color: "#111",
              points: [
                { t: "drückt sich oft unklar aus; es braucht häufiges Nachfragen und Strukturierung", ex: "clarity" },
                { t: "hat Mühe, Gesprächsbeiträge zu halten; enges Coaching ist nötig", ex: "listening" },
                { t: "Präsentationen gelingen nur mit intensiver Vorbereitung und Begleitung", ex: "presentation" }
              ]
            }
          }
        }
      ]
    },
    {
      id: "g2",
      title: "Fachkompetenzen Mathematik",
      note: "Zentral: Verständnis, Strategien, Genauigkeit und Anwendung.",
      items: [
        {
          id: "ma_grundvor",
          title: "Zahlenverständnis & Grundvorstellungen",
          levels: {
            vv: {
              color: "#111",
              points: [
                { t: "versteht Zahlenbeziehungen sicher und nutzt sie flexibel", ex: "numberSense" },
                { t: "erklärt Vorgehensweisen präzise und nachvollziehbar", ex: "explain" },
                { t: "erkennt Muster/Strukturen schnell und nutzt sie für effiziente Lösungen", ex: "patterns" }
              ]
            },
            g: {
              color: "#111",
              points: [
                { t: "arbeitet mit Zahlenbeziehungen zuverlässig und sinnvoll", ex: "numberSense" },
                { t: "kann Vorgehensweisen gut erklären, wenn sie eingeführt sind", ex: "explain" },
                { t: "nutzt Muster/Strukturen in bekannten Aufgaben passend", ex: "patterns" }
              ]
            },
            ge: {
              color: "#111",
              points: [
                { t: "Zahlenbeziehungen sind grundsätzlich vorhanden, aber noch nicht durchgehend sicher", ex: "numberSense" },
                { t: "Erklärungen gelingen teilweise; Leitfragen und Beispiele helfen", ex: "explain" },
                { t: "nutzt Muster/Strukturen noch unregelmässig; profitiert von wiederholter Übung", ex: "patterns" }
              ]
            },
            u: {
              color: "#111",
              points: [
                { t: "Zahlenverständnis ist lückenhaft; grundlegende Beziehungen müssen gezielt aufgebaut werden", ex: "numberSense" },
                { t: "kann Vorgehensweisen kaum erklären; es braucht kleinschrittige Modellierung", ex: "explain" },
                { t: "Strukturen werden selten erkannt; systematische, angeleitete Übungsphasen sind nötig", ex: "patterns" }
              ]
            }
          }
        },
        {
          id: "ma_strat",
          title: "Rechenstrategien & Genauigkeit",
          levels: {
            vv: {
              color: "#111",
              points: [
                { t: "wählt passende Strategien selbstständig und rechnet sehr genau", ex: "accuracy" },
                { t: "kontrolliert Ergebnisse konsequent und erkennt Fehler sofort", ex: "check" },
                { t: "arbeitet zügig, ohne an Sorgfalt zu verlieren", ex: "pace" }
              ]
            },
            g: {
              color: "#111",
              points: [
                { t: "wendet eingeführte Strategien sicher an und rechnet zuverlässig", ex: "accuracy" },
                { t: "kontrolliert Ergebnisse in der Regel sinnvoll", ex: "check" },
                { t: "arbeitet in angemessenem Tempo", ex: "pace" }
              ]
            },
            ge: {
              color: "#111",
              points: [
                { t: "Strategien sind vorhanden, werden aber noch nicht durchgehend passend gewählt", ex: "accuracy" },
                { t: "Fehler entstehen gelegentlich durch Tempo oder Unsicherheit; Kontrollschritte helfen", ex: "check" },
                { t: "braucht in anspruchsvolleren Aufgaben mehr Zeit und klare Struktur", ex: "pace" }
              ]
            },
            u: {
              color: "#111",
              points: [
                { t: "Strategien sind unsicher; es braucht konsequente Aufbau- und Übungssequenzen", ex: "accuracy" },
                { t: "macht häufig Fehler; enges Coaching und feste Kontrollroutinen sind nötig", ex: "check" },
                { t: "Tempo ist deutlich verlangsamt oder unkontrolliert; Aufgaben müssen kleinschrittig gestaltet werden", ex: "pace" }
              ]
            }
          }
        },
        {
          id: "ma_anw",
          title: "Anwendung & Problemlösen",
          levels: {
            vv: {
              color: "#111",
              points: [
                { t: "überträgt Gelerntes souverän auf neue Aufgabenstellungen", ex: "transfer" },
                { t: "plant Lösungswege strategisch und begründet Entscheidungen", ex: "plan" },
                { t: "prüft Resultate kritisch und verbessert Lösungen eigenständig", ex: "reflect" }
              ]
            },
            g: {
              color: "#111",
              points: [
                { t: "wendet Gelerntes in vertrauten Kontexten sicher an", ex: "transfer" },
                { t: "findet passende Lösungswege und kann sie erklären", ex: "plan" },
                { t: "überprüft Resultate meist sinnvoll", ex: "reflect" }
              ]
            },
            ge: {
              color: "#111",
              points: [
                { t: "in neuen Kontexten braucht es häufig Hinweise und Strukturierung", ex: "transfer" },
                { t: "Lösungswege entstehen mit Unterstützung; Zwischenziele helfen", ex: "plan" },
                { t: "Reflexion gelingt punktuell; klare Leitfragen unterstützen", ex: "reflect" }
              ]
            },
            u: {
              color: "#111",
              points: [
                { t: "Transfer gelingt selten; Aufgaben müssen stark geführt und vereinfacht werden", ex: "transfer" },
                { t: "Lösungsplanung braucht enges Coaching und modellierte Beispiele", ex: "plan" },
                { t: "Überprüfung/Reflexion erfolgt kaum; feste Routinen sind nötig", ex: "reflect" }
              ]
            }
          }
        }
      ]
    }
  ]
};

/** -------------------------
 *  GLOBAL STATE
 *  ------------------------- */
const LEVEL_ORDER = ["vv", "g", "ge", "u"]; // must map to PDF order left->right
const LEVEL_LABEL = { vv: "sehr gut", g: "gut", ge: "genügend", u: "ungenügend" };
const LEVEL_SHORT = { vv: "sehr gut", g: "gut", ge: "genügend", u: "ungenügend" };

const state = {
  // overall: itemId -> "auto" | "vv" | "g" | "ge" | "u"
  overall: Object.create(null),
  // checks: itemId -> levelKey -> boolean[]
  checks: Object.create(null),
  // speech
  speech: { textRec: null, commentRec: null }
};

/** -------------------------
 *  DOM HELPERS
 *  ------------------------- */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function esc(s){
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function todayISO(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatSwissDate(iso){
  // iso: YYYY-MM-DD
  if(!iso) return "";
  const [y,m,d] = iso.split("-").map(x=>parseInt(x,10));
  if(!y || !m || !d) return iso;
  return `${String(d).padStart(2,"0")}.${String(m).padStart(2,"0")}.${y}`;
}

/** -------------------------
 *  PRONOUNS / GRAMMAR
 *  ------------------------- */
function getPronouns(){
  const g = $("#fGender").value; // m/w
  if(g === "w"){
    return {
      subj: "sie",
      poss: "ihr",
      obj: "sie",
      capSubj: "Sie",
      capPoss: "Ihr"
    };
  }
  return {
    subj: "er",
    poss: "sein",
    obj: "ihn",
    capSubj: "Er",
    capPoss: "Sein"
  };
}

/** -------------------------
 *  INIT DEFAULTS
 *  ------------------------- */
function initDefaults(){
  $("#fPlace").value = "Wädenswil";
  $("#fDate").value = todayISO();
}

/** -------------------------
 *  BUILD INITIAL STATE
 *  ------------------------- */
function initStateFromData(){
  for(const group of DATA.groups){
    for(const item of group.items){
      state.overall[item.id] = "auto";
      state.checks[item.id] = { vv: [], g: [], ge: [], u: [] };
      for(const lk of LEVEL_ORDER){
        const pts = item.levels[lk]?.points ?? [];
        state.checks[item.id][lk] = pts.map(()=>false);
      }
    }
  }
}

/** -------------------------
 *  RASTER UI RENDER
 *  ------------------------- */
function renderRaster(){
  const mount = $("#rasterMount");
  mount.innerHTML = "";

  for(const group of DATA.groups){
    const gEl = document.createElement("section");
    gEl.className = "group";
    gEl.innerHTML = `
      <div class="group__head">
        <div>
          <div class="group__title">${esc(group.title)}</div>
          <div class="group__note">${esc(group.note || "")}</div>
        </div>
      </div>
      <div class="group__body"></div>
    `;
    const body = $(".group__body", gEl);

    for(const item of group.items){
      const itemEl = document.createElement("div");
      itemEl.className = "item";
      const overallVal = state.overall[item.id] ?? "auto";

      itemEl.innerHTML = `
        <div class="item__row">
          <div>
            <div class="item__title">${esc(item.title)}</div>
            <div class="item__id">${esc(item.id)}</div>
          </div>
          <div class="item__controls">
            <label>Gesamtstufe</label>
            <select data-overall="${esc(item.id)}" aria-label="Gesamtstufe ${esc(item.title)}">
              <option value="auto"${overallVal==="auto"?" selected":""}>Auto</option>
              <option value="vv"${overallVal==="vv"?" selected":""}>sehr gut</option>
              <option value="g"${overallVal==="g"?" selected":""}>gut</option>
              <option value="ge"${overallVal==="ge"?" selected":""}>genügend</option>
              <option value="u"${overallVal==="u"?" selected":""}>ungenügend</option>
            </select>
          </div>
        </div>

        <div class="levelGrid">
          ${LEVEL_ORDER.map(lk => renderLevelColumn(item, lk)).join("")}
        </div>
      `;

      body.appendChild(itemEl);
    }

    mount.appendChild(gEl);
  }

  // wire events
  $$("select[data-overall]").forEach(sel=>{
    sel.addEventListener("change", (e)=>{
      const id = e.target.getAttribute("data-overall");
      state.overall[id] = e.target.value;
      // When overall changes, regenerate text
      refreshAll();
    });
  });

  $$("input[type=checkbox][data-item]").forEach(cb=>{
    cb.addEventListener("change", (e)=>{
      const el = e.target;
      const itemId = el.getAttribute("data-item");
      const levelKey = el.getAttribute("data-level");
      const idx = parseInt(el.getAttribute("data-idx"), 10);
      const ex = el.getAttribute("data-ex") || "";

      // update own state
      state.checks[itemId][levelKey][idx] = el.checked;

      // exclusivity enforcement (within same item across ALL levels)
      if(el.checked && ex){
        enforceExclusivity(itemId, ex, levelKey, idx);
      }

      // If overall is auto, it should follow checks
      if(state.overall[itemId] === "auto"){
        // no direct change here; computed later, but text refresh uses computed
      }

      refreshAll();
    });
  });
}

function renderLevelColumn(item, lk){
  const label = LEVEL_LABEL[lk];
  const pts = item.levels[lk]?.points ?? [];
  const checks = state.checks[item.id][lk] ?? [];
  return `
    <div class="levelCol">
      <div class="levelCol__head">${esc(label)}</div>
      <div class="levelCol__list">
        ${pts.map((p, i)=>{
          const checked = checks[i] ? " checked" : "";
          const exAttr = p.ex ? ` data-ex="${esc(p.ex)}"` : "";
          const exSmall = p.ex ? `<small>ex: ${esc(p.ex)}</small>` : "";
          return `
            <label class="cb">
              <input type="checkbox" data-item="${esc(item.id)}" data-level="${esc(lk)}" data-idx="${i}"${exAttr}${checked}/>
              <span>${esc(p.t)}${exSmall}</span>
            </label>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function enforceExclusivity(itemId, exKey, keepLevel, keepIdx){
  for(const lk of LEVEL_ORDER){
    const pts = getItemById(itemId).levels[lk]?.points ?? [];
    for(let i=0; i<pts.length; i++){
      if(lk===keepLevel && i===keepIdx) continue;
      if((pts[i]?.ex || "") === exKey){
        // uncheck state
        state.checks[itemId][lk][i] = false;
        // uncheck dom if present
        const dom = $(`input[type=checkbox][data-item="${cssEscape(itemId)}"][data-level="${cssEscape(lk)}"][data-idx="${i}"]`);
        if(dom) dom.checked = false;
      }
    }
  }
}

/** cssEscape fallback */
function cssEscape(v){
  try{ return CSS.escape(String(v)); }catch(_){ return String(v).replaceAll('"','\\"'); }
}

function getItemById(itemId){
  for(const g of DATA.groups){
    for(const it of g.items){
      if(it.id === itemId) return it;
    }
  }
  throw new Error("Item not found: " + itemId);
}

/** -------------------------
 *  COMPUTE LEVEL PER ITEM
 *  ------------------------- */
function computeItemLevel(item){
  const forced = state.overall[item.id];
  if(forced && forced !== "auto") return forced;

  // Auto: compute from checked points (weighted)
  const counts = { vv:0, g:0, ge:0, u:0 };
  for(const lk of LEVEL_ORDER){
    const arr = state.checks[item.id][lk] || [];
    counts[lk] = arr.reduce((a,b)=>a+(b?1:0),0);
  }
  const total = counts.vv + counts.g + counts.ge + counts.u;
  if(total === 0) return "g"; // neutral default for auto with no checks

  // score weights: vv=3, g=2, ge=1, u=0
  const score = counts.vv*3 + counts.g*2 + counts.ge*1 + counts.u*0;
  const avg = score / total; // 0..3

  if(avg >= 2.6) return "vv";
  if(avg >= 1.7) return "g";
  if(avg >= 0.9) return "ge";
  return "u";
}

/** -------------------------
 *  TEXT ENGINE
 *  - Generates paragraphs with mod-words wrapped in <span class="mod">...</span>
 *  ------------------------- */

// mod words to highlight (we wrap when generating)
const MOD_WORDS = [
  "oft","meist","gelegentlich","selten","durchwegs","zuverlässig","noch nicht durchgehend","punktuell","in der Regel"
];

function wrapMods(text){
  // Replace longer phrases first to avoid partial overlaps
  const sorted = [...MOD_WORDS].sort((a,b)=>b.length-a.length);
  let out = text;
  for(const w of sorted){
    const re = new RegExp(`\\b${escapeRegExp(w)}\\b`, "gi");
    out = out.replace(re, (m)=>`<span class="mod">${esc(m)}</span>`);
  }
  return out;
}
function escapeRegExp(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function generateReportHTML(){
  const pr = getPronouns();

  // build per-group paragraphs, each paragraph based on items' computed levels + chosen points
  const parts = [];
  for(const group of DATA.groups){
    const sentences = [];
    for(const item of group.items){
      const level = computeItemLevel(item);
      const pts = getSelectedPoints(item.id);

      sentences.push(buildSentenceForItem(item.title, level, pts, pr));
    }
    const paragraph = sentences.filter(Boolean).join(" ");
    if(paragraph.trim()){
      parts.push(`<p>${wrapMods(paragraph)}</p>`);
    }
  }

  // Add closing paragraph (overall tone)
  parts.push(`<p>${wrapMods(buildClosing(pr))}</p>`);

  return parts.join("\n");
}

function getSelectedPoints(itemId){
  const item = getItemById(itemId);
  const selected = [];
  for(const lk of LEVEL_ORDER){
    const pts = item.levels[lk]?.points ?? [];
    const arr = state.checks[itemId][lk] ?? [];
    for(let i=0;i<pts.length;i++){
      if(arr[i]) selected.push({ level: lk, text: pts[i].t, ex: pts[i].ex || "" });
    }
  }
  return selected;
}

function buildSentenceForItem(title, level, pts, pr){
  // sentence patterns per level (zeugnisnah)
  // keep "gut" clean: avoid unnecessary "meist" unless needed
  // ensure "genügend" supportive, "ungenügend" clear with measures
  const base = `Im Bereich <strong>${esc(title)}</strong>`;
  const hasPts = pts.length > 0;

  const focus = pickFocusSnippet(level, pts);

  if(level === "vv"){
    const s1 = `${base} zeigt ${pr.subj} eine <strong>sehr sichere</strong> und souveräne Kompetenz.`;
    const s2 = hasPts ? ` ${focus}` : ` ${pr.capSubj} arbeitet durchwegs konzentriert und nutzt passende Strategien selbstständig.`;
    return `${s1}${s2}`;
  }

  if(level === "g"){
    const s1 = `${base} erfüllt ${pr.subj} die Erwartungen <strong>zuverlässig</strong>.`;
    const s2 = hasPts ? ` ${focus}` : ` ${pr.capSubj} setzt Gelerntes in vertrauten Situationen sicher um und bleibt dabei sorgfältig.`;
    return `${s1}${s2}`;
  }

  if(level === "ge"){
    const s1 = `${base} zeigt ${pr.subj} <strong>grundsätzlich</strong> passende Ansätze, jedoch noch nicht durchgehend stabil.`;
    const s2 = hasPts ? ` ${focus}` : ` ${pr.capSubj} profitiert von klaren Strukturhilfen (Zwischenschritte, Beispiele, kurze Kontrollroutinen).`;
    const s3 = ` Mit regelmässiger Übung und gezielten Rückmeldungen kann ${pr.subj} die Sicherheit weiter ausbauen.`;
    return `${s1}${s2}${s3}`;
  }

  // u
  const s1 = `${base} sind die Lernziele aktuell <strong>noch nicht</strong> ausreichend gesichert.`;
  const s2 = hasPts ? ` ${focus}` : ` ${pr.capSubj} benötigt enges Coaching, kleinschrittige Aufgabenstellungen und feste Übungsroutinen.`;
  const s3 = ` Sinnvoll sind kurze, häufige Trainingssequenzen sowie konsequente Kontrollschritte, damit Fortschritte stabil werden.`;
  return `${s1}${s2}${s3}`;
}

function pickFocusSnippet(level, pts){
  // Use up to 2 selected points; if many, prefer matching computed level first
  const prefer = pts.filter(p=>p.level===level);
  const pool = prefer.length ? prefer : pts;

  const take = pool.slice(0, 2).map(p=>p.text);
  if(take.length === 0){
    // fallback by level
    if(level==="vv") return "Er/Sie überzeugt durchwegs mit sehr klaren, eigenständigen Lösungswegen.";
    if(level==="g") return "Er/Sie arbeitet zuverlässig und nachvollziehbar.";
    if(level==="ge") return "Er/Sie braucht gelegentlich Unterstützung, um zentrale Schritte zu sichern.";
    return "Er/Sie benötigt aktuell enges Coaching, um grundlegende Schritte aufzubauen.";
  }

  // Convert selected points into a compact, zeugnisnah sentence
  // Keep "gut" without constant softeners; only one softener at most.
  const lead =
    level==="vv" ? "Besonders positiv hervorzuheben ist, dass " :
    level==="g"  ? "Dabei zeigt sich, dass " :
    level==="ge" ? "Unterstützend wirkt, dass " :
                   "Im Fokus steht, dass ";

  const joiner = take.length===2 ? " und " : "";
  const core = take.length===2 ? `${take[0]}${joiner}${take[1]}` : take[0];

  // add one mod word sometimes for ge/u
  if(level==="ge"){
    return `${lead}${wrapPlainMod("gelegentlich")} klare Strukturhilfen helfen – konkret: ${esc(core)}.`;
  }
  if(level==="u"){
    return `${lead}${wrapPlainMod("noch nicht durchgehend")} zentrale Grundlagen gesichert sind – konkret: ${esc(core)}.`;
  }
  // vv/g: no extra softeners
  return `${lead}${esc(core)}.`;
}

function wrapPlainMod(word){
  // returns raw HTML, not escaped
  return `<span class="mod">${esc(word)}</span>`;
}

function buildClosing(pr){
  // overall tone paragraph referencing learning process; neutral & zeugnisnah
  return `Insgesamt zeigt ${pr.subj} im Kompetenzbereich eine engagierte Arbeitshaltung. Mit klaren Zielen, passenden Rückmeldungen und einer konsequenten Übungsroutine kann ${pr.subj} ${wrapPlainMod("zuverlässig")} weitere Fortschritte sichern.`;
}

/** -------------------------
 *  EDITOR SYNC
 *  ------------------------- */
let lastAutoHTML = "";

function refreshEditorIfNotModified(){
  const ed = $("#reportEditor");
  // If user hasn't touched since last auto render (simple heuristic), update.
  const current = ed.innerHTML.trim();
  if(current === "" || current === lastAutoHTML){
    const html = generateReportHTML();
    ed.innerHTML = html;
    lastAutoHTML = ed.innerHTML.trim();
  }
}

function forceRefreshEditor(){
  const ed = $("#reportEditor");
  const html = generateReportHTML();
  ed.innerHTML = html;
  lastAutoHTML = ed.innerHTML.trim();
}

function refreshAll(){
  refreshEditorIfNotModified();
  // nothing else live needed
}

/** -------------------------
 *  COPILOT WORKFLOW
 *  ------------------------- */
function buildCopilotPromptBundle(){
  const header = collectHeader();
  const textPlain = getEditorPlainText();
  const comment = ($("#teacherComment").value || "").trim();

  const prompt = [
    `Du bist eine erfahrene Schweizer Primarlehrperson und formulierst zeugnisnahe Beurteilungen.`,
    `Aufgabe: Glätte/verbessere den folgenden Fliesstext zu «Fachkompetenzen – Lernziele».`,
    `Wichtig: Ton wohlwollend und professionell, aber klar. Keine Übertreibungen. Keine Floskeln.`,
    `Pronomen gemäss Angaben verwenden: ${header.gender==="w" ? "sie/ihr" : "er/sein"}.`,
    `Behalte die Absatzstruktur. Inhalt nicht erfinden. Konkretheit erhöhen, ohne neue Fakten zu erfinden.`,
    `Wenn der Kommentar der Lehrperson vorhanden ist: als letzten Absatz integrieren (nicht als eigenes Feld).`,
    ``,
    `--- FORMULARKOPF ---`,
    `Schüler*in: ${header.student || "(ohne Name)"}`,
    `Klasse: ${header.cls || "(ohne Klasse)"}`,
    `Ort/Datum: ${header.place || ""}, ${header.dateHuman || ""}`,
    `Lehrperson: ${header.teacher || ""}`,
    ``,
    `--- AKTUELLER TEXT (bitte überarbeiten) ---`,
    textPlain || "(leer)",
    ``,
    `--- ZUSÄTZLICHE BEMERKUNGEN DER LEHRPERSON (als letzter Absatz integrieren) ---`,
    comment || "(kein Kommentar)",
    ``,
    `--- AUSGABEFORMAT ---`,
    `Gib nur den überarbeiteten Fliesstext zurück (mit Absätzen), ohne zusätzliche Erklärungen.`
  ].join("\n");

  return prompt;
}

async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    toast("In Zwischenablage kopiert.");
    return true;
  }catch(err){
    // fallback via hidden textarea
    try{
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      if(ok) toast("In Zwischenablage kopiert.");
      else toast("Kopieren nicht möglich (Browser-Rechte).");
      return ok;
    }catch(_){
      toast("Kopieren nicht möglich (Browser-Rechte).");
      return false;
    }
  }
}

function getEditorPlainText(){
  const ed = $("#reportEditor");
  // keep paragraph breaks
  const clone = ed.cloneNode(true);
  // remove mod spans but keep text
  $$("span.mod", clone).forEach(s=>{
    s.replaceWith(document.createTextNode(s.textContent));
  });
  // convert <p> to lines
  const ps = $$("p", clone);
  if(ps.length){
    return ps.map(p=>p.textContent.trim()).filter(Boolean).join("\n\n");
  }
  return clone.textContent.trim();
}

function smoothEditorText(){
  const ed = $("#reportEditor");
  const text = getEditorPlainText();
  const smoothed = text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  // write back as paragraphs, keep mod highlighting removed (intentional)
  const paras = smoothed.split(/\n{2,}/).map(s=>s.trim()).filter(Boolean);
  ed.innerHTML = paras.map(p=>`<p>${esc(p)}</p>`).join("\n");
  // re-highlight mod words
  rehighlightEditorMods();
  lastAutoHTML = ed.innerHTML.trim();
  toast("Text geglättet.");
}

function rehighlightEditorMods(){
  const ed = $("#reportEditor");
  const text = getEditorPlainText();
  const paras = text.split(/\n{2,}/).map(s=>s.trim()).filter(Boolean);
  ed.innerHTML = paras.map(p=>`<p>${wrapMods(esc(p))}</p>`).join("\n");
}

/** -------------------------
 *  OVERLAY (Copilot hover 3s)
 *  ------------------------- */
let hoverTimer = null;
function setupCopilotOverlay(){
  const btn = $("#btnCopilot");
  const overlay = $("#overlay");

  function openOverlay(){
    overlay.setAttribute("aria-hidden","false");
  }
  function closeOverlay(){
    overlay.setAttribute("aria-hidden","true");
  }

  btn.addEventListener("mouseenter", ()=>{
    hoverTimer = window.setTimeout(()=>openOverlay(), 3000);
  });
  btn.addEventListener("mouseleave", ()=>{
    if(hoverTimer) window.clearTimeout(hoverTimer);
    hoverTimer = null;
  });

  overlay.addEventListener("click",(e)=>{
    const close = e.target && e.target.getAttribute("data-close");
    if(close) closeOverlay();
  });

  document.addEventListener("keydown",(e)=>{
    if(e.key === "Escape" && overlay.getAttribute("aria-hidden")==="false"){
      closeOverlay();
    }
  });
}

/** -------------------------
 *  SPEECH RECOGNITION (Dictation)
 *  ------------------------- */
function createSpeechRecognizer(onText, onState){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR) return null;

  const rec = new SR();
  rec.lang = "de-CH";
  rec.interimResults = true;
  rec.continuous = true;

  let finalText = "";

  rec.onstart = ()=> onState?.("läuft…");
  rec.onerror = ()=> onState?.("Fehler (Browser/Permission)");
  rec.onend = ()=> onState?.("stop");

  rec.onresult = (event)=>{
    let interim = "";
    for(let i=event.resultIndex; i<event.results.length; i++){
      const res = event.results[i];
      const t = res[0]?.transcript || "";
      if(res.isFinal) finalText += t;
      else interim += t;
    }
    const combined = (finalText + " " + interim).trim();
    onText?.(combined, !!interim);
  };

  return rec;
}

function toggleDictation(target){
  if(target === "text"){
    if(!state.speech.textRec){
      state.speech.textRec = createSpeechRecognizer(
        (txt, isInterim)=> applyDictationToEditor(txt, isInterim),
        (s)=> $("#dictateTextState").textContent = s
      );
      if(!state.speech.textRec){
        toast("Diktat nicht verfügbar (SpeechRecognition fehlt).");
        return;
      }
    }
    const rec = state.speech.textRec;
    if(rec.__running){
      rec.__running = false;
      try{ rec.stop(); }catch(_){}
      $("#dictateTextState").textContent = "stop";
    }else{
      rec.__running = true;
      try{ rec.start(); }catch(_){}
    }
    return;
  }

  if(target === "comment"){
    if(!state.speech.commentRec){
      state.speech.commentRec = createSpeechRecognizer(
        (txt)=> { $("#teacherComment").value = txt; },
        (s)=> $("#dictateCommentState").textContent = s
      );
      if(!state.speech.commentRec){
        toast("Diktat nicht verfügbar (SpeechRecognition fehlt).");
        return;
      }
    }
    const rec = state.speech.commentRec;
    if(rec.__running){
      rec.__running = false;
      try{ rec.stop(); }catch(_){}
      $("#dictateCommentState").textContent = "stop";
    }else{
      rec.__running = true;
      try{ rec.start(); }catch(_){}
    }
  }
}

function applyDictationToEditor(text, isInterim){
  // Append dictation to the last paragraph for simplicity.
  // We keep it robust & predictable.
  const ed = $("#reportEditor");
  const existing = getEditorPlainText();
  let base = existing;

  if(existing.trim() === ""){
    base = text;
  }else{
    // If interim, don't permanently change; show at end
    if(isInterim){
      base = existing.replace(/\s*$/,"") + " " + text;
    }else{
      base = existing.replace(/\s*$/,"") + " " + text;
    }
  }

  const paras = base.split(/\n{2,}/).map(s=>s.trim()).filter(Boolean);
  ed.innerHTML = paras.map(p=>`<p>${wrapMods(esc(p))}</p>`).join("\n");
  lastAutoHTML = ""; // ensure future auto won't overwrite edited content
}

/** -------------------------
 *  PDF EXPORT (2 pages)
 *  - Uses html2canvas + jsPDF if available
 *  - Fallback: open print view in new tab (window.print)
 *  ------------------------- */
function collectHeader(){
  const student = ($("#fStudent").value || "").trim();
  const cls = ($("#fClass").value || "").trim();
  const gender = $("#fGender").value;
  const place = ($("#fPlace").value || "").trim();
  const dateIso = ($("#fDate").value || "").trim();
  const teacher = ($("#fTeacher").value || "").trim();

  return {
    student, cls, gender, place, dateIso,
    dateHuman: formatSwissDate(dateIso),
    teacher
  };
}

function buildPdfTableHTML(){
  // compact table: criteria rows with circles and x
  const rows = [];
  for(const group of DATA.groups){
    for(const item of group.items){
      const lvl = computeItemLevel(item);
      rows.push(renderPdfRow(item.title, lvl));
    }
  }

  const head = `
    <div class="tHead">
      <div class="tCell"><strong>Kriterium</strong></div>
      <div class="tCell"><div class="rot"><span>sehr gut</span></div></div>
      <div class="tCell"><div class="rot"><span>gut</span></div></div>
      <div class="tCell"><div class="rot"><span>genügend</span></div></div>
      <div class="tCell"><div class="rot"><span>ungenügend</span></div></div>
    </div>
  `;

  return `${head}${rows.join("")}`;
}

function renderPdfRow(title, lvl){
  // circles left->right: vv g ge u
  const cells = LEVEL_ORDER.map(k=>{
    const x = (k===lvl) ? `<span class="x">×</span>` : "";
    return `<div class="tCell circleCell"><span class="circle">○${x}</span></div>`;
  }).join("");

  return `
    <div class="tRow">
      <div class="tCell">${esc(title)}</div>
      ${cells}
    </div>
  `;
}

function buildPdfDetailsHTML(){
  // structured list of selected checkbox points per criterion
  const blocks = [];
  for(const group of DATA.groups){
    const gItems = [];
    for(const item of group.items){
      const sel = getSelectedPoints(item.id);
      if(sel.length === 0) continue;

      // keep in user language; include mod highlighting in HTML only here (optional)
      const bullets = sel.map(s=>`<li>${wrapMods(esc(s.text))}</li>`).join("");
      gItems.push(`
        <div class="dItem">
          <div class="dItem__title">${esc(item.title)}</div>
          <ul class="dItem__bullets">${bullets}</ul>
        </div>
      `);
    }
    if(gItems.length){
      blocks.push(`
        <div class="dGroup">
          <div class="dGroup__title">${esc(group.title)}</div>
          ${gItems.join("")}
        </div>
      `);
    }
  }
  return blocks.join("") || `<div style="font-size:11px;">Keine Detailpunkte ausgewählt.</div>`;
}

function stripEditorForPdf(html){
  // remove mod highlights -> plain text in B/W
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  $$("span.mod", tmp).forEach(s=>{
    s.replaceWith(document.createTextNode(s.textContent));
  });
  return tmp.innerHTML;
}

function integrateCommentIntoTextForPdf(){
  const comment = ($("#teacherComment").value || "").trim();
  const edHtml = $("#reportEditor").innerHTML || "";
  if(!comment) return edHtml;

  // Append as last paragraph; keep mod wrapping in editor but PDF will strip
  const appended = `${edHtml}\n<p>${wrapMods(esc(comment))}</p>`;
  return appended;
}

function syncPdfDom(){
  const h = collectHeader();

  $("#pStudent").textContent = h.student || "—";
  $("#pClass").textContent = h.cls || "—";
  $("#pPlace").textContent = h.place || "—";
  $("#pDate").textContent = h.dateHuman || "—";
  $("#pTeacher").textContent = h.teacher || "—";

  $("#pStudent2").textContent = h.student || "—";
  $("#pClass2").textContent = h.cls || "—";
  $("#pDate2").textContent = h.dateHuman || "—";
  $("#pTeacherSign").textContent = h.teacher || "—";

  $("#pdfTableMount").innerHTML = buildPdfTableHTML();

  const mergedHtml = integrateCommentIntoTextForPdf();
  $("#pdfTextMount").innerHTML = stripEditorForPdf(mergedHtml);

  const detailsOn = $("#chkDetailsInPdf").checked;
  const detailsBlock = $("#pdfDetailsBlock");
  if(detailsOn){
    detailsBlock.style.display = "";
    $("#pdfDetailsMount").innerHTML = buildPdfDetailsHTML();
  }else{
    detailsBlock.style.display = "none";
    $("#pdfDetailsMount").innerHTML = "";
  }
}

async function exportPdf(){
  syncPdfDom();

  const hasHtml2Canvas = typeof window.html2canvas === "function";
  const hasJsPDF = !!(window.jspdf && window.jspdf.jsPDF);

  if(!(hasHtml2Canvas && hasJsPDF)){
    toast("PDF-Bibliotheken fehlen – Print-Fallback wird verwendet.");
    return openPrintFallback();
  }

  try{
    const root = $("#pdfRoot");
    const pages = $$(".pdfPage", root);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation:"portrait", unit:"pt", format:"a4" });

    for(let i=0; i<pages.length; i++){
      const page = pages[i];

      // scale for crispness
      const canvas = await window.html2canvas(page, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: false
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Fit image to A4
      const imgW = pageWidth;
      const imgH = (canvas.height / canvas.width) * imgW;

      if(i>0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, imgW, Math.min(imgH, pageHeight));
    }

    const h = collectHeader();
    const safeName = (h.student || "OhneName").replace(/[^\p{L}\p{N}\-_ ]/gu,"").trim().replace(/\s+/g,"_");
    const fileName = `Fachkompetenzen_Lernziele_${safeName || "OhneName"}_${h.dateIso || todayISO()}.pdf`;

    pdf.save(fileName);
    toast("PDF erstellt.");
  }catch(err){
    console.error(err);
    toast("PDF-Export fehlgeschlagen – Print-Fallback.");
    openPrintFallback();
  }
}

function openPrintFallback(){
  // Open a clean tab with the pdfRoot HTML and print
  syncPdfDom();

  const root = $("#pdfRoot").cloneNode(true);
  // ensure visible in new doc
  root.style.position = "static";
  root.style.left = "0";
  root.style.top = "0";

  const css = getPdfRelevantCss();

  const win = window.open("", "_blank");
  if(!win){
    toast("Popup blockiert – bitte Popups erlauben oder manuell drucken.");
    return;
  }

  win.document.open();
  win.document.write(`<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Fachkompetenzen – Lernziele (Print)</title>
<style>
  ${css}
  @media print{
    body{margin:0}
    .pdfPage{page-break-after:always}
  }
</style>
</head>
<body>
</body>
</html>`);
  win.document.close();
  win.document.body.appendChild(root);

  // wait a tick, then print
  setTimeout(()=>{
    try{ win.focus(); win.print(); }catch(_){}
  }, 350);
}

function getPdfRelevantCss(){
  // Minimal subset to render pdfRoot nicely in fallback.
  // We read from styles.css via best-effort: copy computed styles isn't feasible offline.
  // So we embed a compact set mirroring the PDF CSS classes.
  return `
    body{background:#fff;color:#000;font-family:"Times New Roman",Times,serif;}
    .pdfRoot{width:794px;background:#fff;}
    .pdfPage{width:794px;height:1123px;padding:42px 44px;position:relative;}
    .pdfHeader{border-bottom:1px solid #000;padding-bottom:10px;margin-bottom:12px;}
    .pdfTitle{font-size:18px;font-weight:700;letter-spacing:.2px;}
    .pdfMeta{margin-top:8px;display:grid;grid-template-columns:1.4fr .8fr 1fr;gap:6px 12px;font-size:11px;}
    .pdfBlock{margin-top:12px}
    .pdfSectionTitle{font-size:12px;font-weight:700;margin:0 0 6px;text-transform:uppercase;letter-spacing:.6px;}
    .pdfText{font-size:12px;line-height:1.45;}
    .pdfText p{margin:0 0 8px}
    .pdfText p:last-child{margin:0}
    .pdfFooterNote{position:absolute;bottom:26px;left:44px;right:44px;font-size:9.5px;color:#111;border-top:1px solid #000;padding-top:6px;}
    .pdfTable{border:1px solid #000;font-size:11px;}
    .tHead,.tRow{display:grid;grid-template-columns:1fr 42px 42px 42px 42px;}
    .tHead{border-bottom:1px solid #000;align-items:stretch;}
    .tHead .tCell{padding:8px 6px;border-left:1px solid #000;display:flex;align-items:flex-end;justify-content:center;}
    .tHead .tCell:first-child{border-left:none;justify-content:flex-start;align-items:center;font-weight:700;}
    .rot{height:72px;display:flex;align-items:center;justify-content:center;}
    .rot span{display:inline-block;transform:rotate(-90deg);transform-origin:center;white-space:nowrap;font-weight:700;letter-spacing:.2px;}
    .tRow{border-top:1px solid #000;align-items:center;}
    .tRow:first-child{border-top:none}
    .tRow .tCell{padding:8px 6px;border-left:1px solid #000;}
    .tRow .tCell:first-child{border-left:none}
    .circleCell{text-align:center;font-size:16px;line-height:1;}
    .circle{display:inline-block;width:18px;text-align:center;font-family:"Times New Roman",Times,serif;}
    .circle .x{position:relative;top:-1px;font-weight:700;}
    .linesBox{border:1px solid #000;padding:14px 14px 10px;height:520px;}
    .line{border-bottom:1px solid #000;height:48px;}
    .signGrid{margin-top:22px;display:grid;grid-template-columns:1fr 1fr;gap:18px;}
    .sign{border:1px solid #000;padding:12px;height:90px;}
    .sign__label{font-size:11px;font-weight:700;}
    .sign__line{border-bottom:1px solid #000;margin-top:38px;}
    .pdfDetails{font-size:11px;line-height:1.35;}
    .dGroup{margin:0 0 8px;}
    .dGroup__title{font-weight:700;margin:0 0 4px;}
    .dItem{margin:0 0 4px;}
    .dItem__title{font-weight:700;}
    .dItem__bullets{margin:2px 0 0 14px;}
    .dItem__bullets li{margin:0 0 2px;}
  `;
}

/** -------------------------
 *  TOAST (tiny)
 *  ------------------------- */
let toastTimer = null;
function toast(msg){
  let el = $("#__toast");
  if(!el){
    el = document.createElement("div");
    el.id = "__toast";
    el.style.position = "fixed";
    el.style.bottom = "14px";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.background = "rgba(17,24,39,.92)";
    el.style.color = "#fff";
    el.style.padding = "10px 12px";
    el.style.borderRadius = "12px";
    el.style.fontSize = "13px";
    el.style.fontWeight = "700";
    el.style.zIndex = "9999";
    el.style.boxShadow = "0 10px 30px rgba(0,0,0,.2)";
    el.style.maxWidth = "92vw";
    el.style.textAlign = "center";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = "block";
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ el.style.display="none"; }, 2200);
}

/** -------------------------
 *  WIRE UI
 *  ------------------------- */
function wireUi(){
  $("#btnCopyPrompt").addEventListener("click", async ()=>{
    const bundle = buildCopilotPromptBundle();
    await copyToClipboard(bundle);
  });

  $("#btnCopilot").addEventListener("click", async ()=>{
    const bundle = buildCopilotPromptBundle();
    const ok = await copyToClipboard(bundle);
    // even if copy fails, still open
    window.open("https://copilot.microsoft.com/", "_blank", "noopener,noreferrer");
    if(!ok) toast("Hinweis: Prompt konnte nicht automatisch kopiert werden.");
  });

  $("#btnSmooth").addEventListener("click", ()=>{
    smoothEditorText();
  });

  $("#btnPdf").addEventListener("click", ()=>{
    exportPdf();
  });

  // regenerate on header changes that affect grammar / meta
  ["#fGender","#fStudent","#fClass","#fPlace","#fDate","#fTeacher"].forEach(sel=>{
    $(sel).addEventListener("change", ()=>{
      // pronouns can change; regenerate if not user-modified
      refreshAll();
    });
    $(sel).addEventListener("input", ()=>{
      refreshAll();
    });
  });

  $("#teacherComment").addEventListener("input", ()=>{
    // no auto injection into editor during editing; only for pdf export
  });

  $("#btnDictateText").addEventListener("click", ()=> toggleDictation("text"));
  $("#btnDictateComment").addEventListener("click", ()=> toggleDictation("comment"));

  // if user types in editor, stop auto-overwrite
  $("#reportEditor").addEventListener("input", ()=>{
    lastAutoHTML = ""; // mark as modified
    // keep mod highlights if user pasted plain text without spans:
    // lightweight rehighlight on paste is safer than on each input.
  });

  $("#reportEditor").addEventListener("paste", ()=>{
    setTimeout(()=>rehighlightEditorMods(), 0);
  });

  setupCopilotOverlay();
}

/** -------------------------
 *  BOOT
 *  ------------------------- */
function boot(){
  initDefaults();
  initStateFromData();
  renderRaster();
  // initial text
  forceRefreshEditor();
  wireUi();
}

document.addEventListener("DOMContentLoaded", boot);
