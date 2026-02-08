// app.js (UPDATED per your requirements)
"use strict";

/* =========================================================
   Fachkompetenzen – Lernziele (offline, GitHub Pages)
   - No CDN
   - PDF via local vendor/html2canvas.min.js + vendor/jspdf.umd.min.js
   - Fallback: print in new tab (window.print)
   - IMPORTANT RULE:
     A criterion is mentioned in the generated text ONLY if:
       - at least one checkbox point is selected, OR
       - overall dropdown is set (not Auto)
     If nothing is selected and overall is Auto -> not mentioned in text.
   ========================================================= */

/** -------------------------
 *  LEVELS (global)
 *  ------------------------- */
const LEVEL_ORDER = ["ue", "gut", "gen", "noch"]; // left->right in PDF
const LEVEL_LABEL = {
  ue: "lernziele übertroffen",
  gut: "lernziele gut erreicht",
  gen: "lernziele genügend erreicht",
  noch: "lernziele noch nicht erreicht"
};

/** -------------------------
 *  DATA CONFIG (expanded, pedagogical & detailed)
 *  - groups[] -> items[] -> levels -> { color, points:[{t, ex?}] }
 *  ------------------------- */
const DATA = {
  groups: [
    {
      id: "g_strat",
      title: "Allgemeine Lernstrategien & Kompetenzen",
      note: "Überfachliche Grundlagen für selbstständiges Lernen im Unterrichtsalltag.",
      items: [
        {
          id: "ls_schriftlich",
          title: "Schriftliche Arbeitsanweisungen verstehen",
          levels: {
            ue: { color:"#111", points: [
              { t:"erfasst schriftliche Arbeitsaufträge rasch, präzise und setzt sie ohne zusätzliche Erklärungen korrekt um", ex:"core" },
              { t:"identifiziert selbstständig relevante Informationen (Material, Reihenfolge, Kriterien) und priorisiert sinnvoll", ex:"strategie" },
              { t:"fragt gezielt nach, wenn Unklarheiten bestehen, und klärt diese effizient", ex:"fragen" }
            ]},
            gut: { color:"#111", points: [
              { t:"versteht schriftliche Arbeitsaufträge zuverlässig und setzt die wesentlichen Schritte korrekt um", ex:"core" },
              { t:"achtet auf Kriterien und kann wichtige Informationen im Text markieren oder notieren, wenn es hilfreich ist", ex:"strategie" },
              { t:"stellt bei Bedarf passende Rückfragen, um Missverständnisse zu vermeiden", ex:"fragen" }
            ]},
            gen: { color:"#111", points: [
              { t:"versteht die Kernaussagen schriftlicher Arbeitsaufträge, braucht bei Details jedoch gelegentlich Unterstützung", ex:"core" },
              { t:"profitiert von Strukturhilfen (Abschnitte, Checklisten, Schlüsselwörter markieren)", ex:"strategie" },
              { t:"Rückfragen erfolgen noch nicht immer rechtzeitig; kurze Klärungen vor dem Start unterstützen", ex:"fragen" }
            ]},
            noch: { color:"#111", points: [
              { t:"hat Mühe, schriftliche Arbeitsanweisungen selbstständig zu erfassen; zentrale Schritte werden häufig übersehen", ex:"core" },
              { t:"benötigt enges Coaching (Vorlesen/Paraphrasieren, kurze Teilschritte, visuelle Stützen)", ex:"strategie" },
              { t:"braucht klare Routinen zum Nachfragen (Was ist zu tun? Womit beginne ich? Woran erkenne ich, dass es stimmt?)", ex:"fragen" }
            ]}
          }
        },
        {
          id: "ls_muendlich",
          title: "Mündliche Arbeitsanweisungen verstehen",
          levels: {
            ue: { color:"#111", points: [
              { t:"hört aufmerksam zu, erfasst mündliche Anweisungen vollständig und setzt sie unmittelbar korrekt um", ex:"core" },
              { t:"kann Aufträge sinngemäss wiedergeben und bei Bedarf in eigene Schritte übersetzen", ex:"strategie" },
              { t:"achtet selbstständig auf Abmachungen/Regeln und erinnert sich auch über längere Zeitspannen zuverlässig", ex:"gedaechtnis" }
            ]},
            gut: { color:"#111", points: [
              { t:"versteht mündliche Anweisungen zuverlässig und führt die wesentlichen Schritte korrekt aus", ex:"core" },
              { t:"kann zentrale Punkte wiederholen oder notieren, wenn Aufgaben mehrteilig sind", ex:"strategie" },
              { t:"fragt nach, wenn etwas unklar ist, und kann dann gut weiterarbeiten", ex:"fragen" }
            ]},
            gen: { color:"#111", points: [
              { t:"versteht mündliche Anweisungen grundsätzlich, verliert bei mehrteiligen Aufträgen jedoch gelegentlich den Überblick", ex:"core" },
              { t:"profitiert von kurzen Wiederholungen, Visualisierungen oder schriftlichen Stichworten", ex:"strategie" },
              { t:"braucht manchmal einen Startimpuls (Womit beginnen? Was ist der nächste Schritt?)", ex:"start" }
            ]},
            noch: { color:"#111", points: [
              { t:"mündliche Anweisungen werden häufig unvollständig verstanden; es kommt wiederholt zu Fehlstarts", ex:"core" },
              { t:"benötigt konsequent klare, kurze Teilschritte sowie Rückversicherung (Auftrag in eigenen Worten wiederholen)", ex:"strategie" },
              { t:"eine feste Struktur (z.B. 1–2–3 Schritte, Visualisierung an der Tafel) ist notwendig", ex:"struktur" }
            ]}
          }
        },
        {
          id: "ls_learningview",
          title: "Arbeitsplan/Wochenplan mit LearningView (Selbstständigkeit)",
          levels: {
            ue: { color:"#111", points: [
              { t:"arbeitet sehr selbstständig mit LearningView, plant Aufgaben vorausschauend und hält Termine zuverlässig ein", ex:"core" },
              { t:"steuert den Lernprozess bewusst (Prioritäten setzen, Pausen planen, Fortschritt reflektieren)", ex:"steuerung" },
              { t:"nutzt digitale Rückmeldungen/Materialien eigenständig und transferiert diese in die Arbeit", ex:"transfer" }
            ]},
            gut: { color:"#111", points: [
              { t:"arbeitet selbstständig mit LearningView am Arbeits-/Wochenplan und erledigt Aufgaben zuverlässig", ex:"core" },
              { t:"orientiert sich an Kriterien und nutzt Hilfen (Hinweise, Beispiele) passend", ex:"hilfen" },
              { t:"führt Aufgaben in angemessenem Tempo aus und bleibt grundsätzlich fokussiert", ex:"fokus" }
            ]},
            gen: { color:"#111", points: [
              { t:"kann mit LearningView am Arbeitsplan arbeiten, braucht jedoch gelegentlich Strukturierung oder Erinnerung", ex:"core" },
              { t:"profitiert von klaren Zwischenzielen (Was heute? Was zuerst?) und kurzen Check-ins", ex:"steuerung" },
              { t:"bei anspruchsvolleren Aufgaben hilft eine geführte Planung (Zeit, Reihenfolge, Hilfsmittel)", ex:"planung" }
            ]},
            noch: { color:"#111", points: [
              { t:"benötigt aktuell enges Coaching, um mit LearningView am Arbeits-/Wochenplan zielführend zu arbeiten", ex:"core" },
              { t:"braucht feste Routinen (Startauftrag, Zwischenkontrolle, Abschlusskontrolle) und klare Priorisierung", ex:"steuerung" },
              { t:"Aufgaben müssen kleinschrittig geplant und begleitet werden, damit Fortschritte stabil werden", ex:"planung" }
            ]}
          }
        },
        {
          id: "ls_selbstkorrektur",
          title: "Selbstkorrekturen anwenden und Lernen selbst steuern",
          levels: {
            ue: { color:"#111", points: [
              { t:"wendet Selbstkorrekturen sehr sicher und konsequent an und verbessert Ergebnisse eigenständig", ex:"core" },
              { t:"überprüft Arbeitsschritte systematisch (Kriterien, Zwischenergebnisse) und erkennt Fehler zuverlässig", ex:"kontrolle" },
              { t:"nutzt Rückmeldungen aktiv, setzt daraus konkrete nächste Schritte und dokumentiert Fortschritte", ex:"naechste" }
            ]},
            gut: { color:"#111", points: [
              { t:"wendet Selbstkorrekturen zuverlässig an und kann Fehler in der Regel selbst verbessern", ex:"core" },
              { t:"kontrolliert wichtige Stellen (Rechenwege, Texte) sinnvoll und nutzt Kriterien zunehmend selbstständig", ex:"kontrolle" },
              { t:"setzt Rückmeldungen um und arbeitet gezielt an Verbesserungen", ex:"naechste" }
            ]},
            gen: { color:"#111", points: [
              { t:"wendet Selbstkorrekturen grundsätzlich an, braucht aber gelegentlich Unterstützung, um sie korrekt zu nutzen", ex:"core" },
              { t:"profitiert von klaren Checklisten und festen Kontrollroutinen (Stopp – prüfen – verbessern)", ex:"kontrolle" },
              { t:"nächste Schritte gelingen besser, wenn sie kurz und konkret vereinbart werden", ex:"naechste" }
            ]},
            noch: { color:"#111", points: [
              { t:"wendet Selbstkorrekturen aktuell noch nicht zuverlässig an; Fehler bleiben häufig unbemerkt", ex:"core" },
              { t:"benötigt enges Coaching beim Überprüfen (Kriterien gemeinsam anwenden, Beispiele vergleichen)", ex:"kontrolle" },
              { t:"braucht klare, kleinschrittige Vereinbarungen, um Lernen wirksam zu steuern (Was übe ich? Wie oft? Woran merke ich Fortschritt?)", ex:"naechste" }
            ]}
          }
        }
      ]
    },

    {
      id: "g_ma",
      title: "Fachkompetenzen Mathematik (Grundlagen & Anwendungen)",
      note: "Beurteilung zentraler mathematischer Grundlagen sowie Anwendung und Darstellung von Lösungswegen.",
      items: [
        {
          id: "ma_zahlensystem",
          title: "Zahlenvorstellungen & Zahlensysteme (Dezimalsystem)",
          levels: {
            ue: { color:"#111", points: [
              { t:"versteht Stellenwert, Bündelung und Zerlegung sehr sicher und nutzt das Dezimalsystem flexibel in verschiedenen Kontexten", ex:"core" },
              { t:"erklärt Zahlenbeziehungen präzise (z.B. Zehner/ Hunderter/ Tausender) und begründet Vorgehensweisen nachvollziehbar", ex:"erklaeren" },
              { t:"nutzt Darstellungen (Material, Skizzen, Zahlengerade) souverän und passend", ex:"darstellung" }
            ]},
            gut: { color:"#111", points: [
              { t:"wendet das Dezimalsystem zuverlässig an und arbeitet sicher mit Stellenwert und Zerlegung", ex:"core" },
              { t:"kann Zahlenbeziehungen gut erklären, wenn sie eingeführt sind", ex:"erklaeren" },
              { t:"nutzt passende Darstellungen (Skizzen, Zahlengerade) in der Regel sinnvoll", ex:"darstellung" }
            ]},
            gen: { color:"#111", points: [
              { t:"versteht das Dezimalsystem grundsätzlich, ist bei Zerlegungen/Stellenwertwechseln jedoch gelegentlich noch unsicher", ex:"core" },
              { t:"profitiert von anschaulichen Darstellungen und wiederholter Anwendung in ähnlichen Aufgaben", ex:"darstellung" },
              { t:"Erklärungen gelingen teilweise; Leitfragen und Beispiele unterstützen", ex:"erklaeren" }
            ]},
            noch: { color:"#111", points: [
              { t:"Stellenwert und Zerlegung sind aktuell noch nicht ausreichend gesichert; es kommt häufig zu Verwechslungen", ex:"core" },
              { t:"benötigt konsequent anschauliche Stützen (Material, Zahlentafel, Zahlengerade) und kleinschrittige Übungen", ex:"darstellung" },
              { t:"braucht enges Coaching beim Erklären/Begründen von Zahlenschritten", ex:"erklaeren" }
            ]}
          }
        },
        {
          id: "ma_grundop",
          title: "Grundoperationen (Addition/Subtraktion sowie Multiplikation/Division)",
          levels: {
            ue: { color:"#111", points: [
              { t:"wendet passende Rechenstrategien sehr sicher an und rechnet auch in komplexeren Aufgaben exakt", ex:"core" },
              { t:"kontrolliert Ergebnisse konsequent (Überschlag, Umkehrrechnung) und erkennt Fehler zuverlässig", ex:"kontrolle" },
              { t:"stellt Rechenwege klar und vollständig dar und kann Vorgehensweisen präzise erklären", ex:"darstellung" }
            ]},
            gut: { color:"#111", points: [
              { t:"rechnet in den Grundoperationen zuverlässig und nutzt eingeführte Strategien sicher", ex:"core" },
              { t:"kontrolliert Ergebnisse in der Regel sinnvoll und verbessert Fehler nach Hinweisen", ex:"kontrolle" },
              { t:"stellt Rechenwege meist vollständig dar und kann wichtige Schritte erklären", ex:"darstellung" }
            ]},
            gen: { color:"#111", points: [
              { t:"wendet Grundoperationen grundsätzlich korrekt an, ist jedoch noch nicht durchgehend sicher (Tempo/Genauigkeit)", ex:"core" },
              { t:"profitiert von festen Kontrollroutinen und klaren Strategien (z.B. Teilschritte, Stellenwert-Check)", ex:"kontrolle" },
              { t:"Rechenwege sind teilweise lückenhaft; klare Darstellungshilfen unterstützen", ex:"darstellung" }
            ]},
            noch: { color:"#111", points: [
              { t:"Grundoperationen sind aktuell noch nicht ausreichend gesichert; Fehler treten häufig und wiederkehrend auf", ex:"core" },
              { t:"benötigt enges Coaching, kleinschrittige Übungssequenzen und konsequente Kontrollstrategien", ex:"kontrolle" },
              { t:"Rechenwege werden oft nicht vollständig dargestellt; strukturierende Vorgaben sind notwendig", ex:"darstellung" }
            ]}
          }
        },
        {
          id: "ma_textaufgaben",
          title: "Sach-/Textaufgaben verstehen & Lösungswege darstellen",
          levels: {
            ue: { color:"#111", points: [
              { t:"analysiert Textaufgaben sehr sicher (gesucht/gegeben), wählt passende Strategien und begründet Entscheidungen überzeugend", ex:"analyse" },
              { t:"stellt Lösungswege vollständig, geordnet und verständlich dar (Skizze, Rechnung, Satz)", ex:"darstellung" },
              { t:"prüft Resultate kritisch (Plausibilität, Einheit, Rückbezug zur Frage) und korrigiert selbstständig", ex:"kontrolle" }
            ]},
            gut: { color:"#111", points: [
              { t:"versteht Textaufgaben zuverlässig und findet in der Regel passende Lösungswege", ex:"analyse" },
              { t:"stellt Rechenwege meist vollständig dar und beantwortet die Frage passend", ex:"darstellung" },
              { t:"überprüft Ergebnisse in vielen Fällen sinnvoll (Rückbezug zur Fragestellung)", ex:"kontrolle" }
            ]},
            gen: { color:"#111", points: [
              { t:"versteht Kernaussagen, braucht bei der Auswahl des Lösungswegs jedoch gelegentlich Unterstützung", ex:"analyse" },
              { t:"profitiert von Strukturhilfen (Markieren, Skizze, Zwischenfragen) und klaren Darstellungsvorgaben", ex:"darstellung" },
              { t:"Kontrolle erfolgt noch unregelmässig; feste Prüfschritte unterstützen", ex:"kontrolle" }
            ]},
            noch: { color:"#111", points: [
              { t:"hat Mühe, Textaufgaben selbstständig zu erschliessen; die mathematische Struktur wird häufig nicht erkannt", ex:"analyse" },
              { t:"benötigt enges Coaching (Vorentlastung, Skizze, schrittweise Leitfragen) und kleinschrittige Aufgabenformate", ex:"darstellung" },
              { t:"Resultatkontrolle gelingt kaum; feste Routinen (Einheit, Plausibilität, Rücksatz) sind nötig", ex:"kontrolle" }
            ]}
          }
        },
        {
          id: "ma_groessen",
          title: "Grössen & Daten (metrisches System, Umrechnen, Proportionalität, Tabellen/Grafiken)",
          levels: {
            ue: { color:"#111", points: [
              { t:"versteht Präfixe im metrischen System sehr sicher und rechnet Grössen flexibel und korrekt um", ex:"metrisch" },
              { t:"erkennt proportionale Zusammenhänge zuverlässig und kann diese nachvollziehbar darstellen", ex:"proportional" },
              { t:"liest, interpretiert und erstellt Tabellen/Grafiken präzise (Achsen, Einheiten, Aussage)", ex:"daten" }
            ]},
            gut: { color:"#111", points: [
              { t:"wendet das metrische System zuverlässig an und kann gängige Umrechnungen korrekt durchführen", ex:"metrisch" },
              { t:"versteht grundlegende Zusammenhänge/Proportionalität in vertrauten Kontexten und nutzt passende Verfahren", ex:"proportional" },
              { t:"kann Tabellen/Grafiken lesen und wichtige Informationen entnehmen; Darstellungen gelingen in der Regel korrekt", ex:"daten" }
            ]},
            gen: { color:"#111", points: [
              { t:"versteht Grössen grundsätzlich, ist bei Umrechnungen oder Präfixen jedoch gelegentlich unsicher", ex:"metrisch" },
              { t:"proportionale Zusammenhänge gelingen punktuell; Beispiele und klare Strategien unterstützen", ex:"proportional" },
              { t:"bei Tabellen/Grafiken braucht es manchmal Hilfe (Achsen, Einheiten, Übertragen von Werten)", ex:"daten" }
            ]},
            noch: { color:"#111", points: [
              { t:"Präfixe/Umrechnungen sind noch nicht ausreichend gesichert; es kommt häufig zu Verwechslungen", ex:"metrisch" },
              { t:"Zusammenhänge/Proportionalität werden selten erkannt; es braucht enges Coaching und viele anschauliche Beispiele", ex:"proportional" },
              { t:"Tabellen/Grafiken können aktuell nur mit starker Unterstützung gelesen oder erstellt werden", ex:"daten" }
            ]}
          }
        },
        {
          id: "ma_geo",
          title: "Geometrie & Raum (Linien, Flächen, Körper, Symmetrie, Orientierung, räumliche Vorstellung)",
          levels: {
            ue: { color:"#111", points: [
              { t:"erkennt und beschreibt geometrische Eigenschaften sehr sicher (Formen/Körper, Kanten/Ecken/Flächen) und nutzt Fachsprache präzise", ex:"core" },
              { t:"arbeitet souverän mit Symmetrie, Mustern und Orientierung im Raum; Darstellungen sind genau und sauber", ex:"sym" },
              { t:"zeigt ein ausgeprägtes räumliches Vorstellungsvermögen (Ansichten, Netze, Transformationen) und begründet Lösungen überzeugend", ex:"raum" }
            ]},
            gut: { color:"#111", points: [
              { t:"benennt und nutzt grundlegende geometrische Begriffe korrekt und arbeitet zuverlässig mit Formen/Körpern", ex:"core" },
              { t:"Symmetrie und Orientierung gelingen in der Regel sicher; Zeichnungen sind meist sauber", ex:"sym" },
              { t:"räumliche Vorstellungen (z.B. Netze/Ansichten) gelingen in vertrauten Aufgabenstellungen gut", ex:"raum" }
            ]},
            gen: { color:"#111", points: [
              { t:"kennt zentrale Begriffe, ist bei Eigenschaften/Unterscheidungen jedoch noch nicht durchgehend sicher", ex:"core" },
              { t:"bei Symmetrie/Orientierung braucht es gelegentlich Hilfe (Hilfslinien, Beispiele, Schrittfolgen)", ex:"sym" },
              { t:"räumliches Vorstellen gelingt punktuell; anschauliche Materialien und Training unterstützen", ex:"raum" }
            ]},
            noch: { color:"#111", points: [
              { t:"geometrische Grundlagen sind aktuell noch nicht ausreichend gesichert; Begriffe/Eigenschaften werden häufig verwechselt", ex:"core" },
              { t:"benötigt enges Coaching bei Symmetrie/Orientierung sowie klare, kleinschrittige Vorgehensweisen", ex:"sym" },
              { t:"räumliche Vorstellungen (Netze/Ansichten) gelingen selten; es braucht systematische Aufbauübungen mit Material", ex:"raum" }
            ]}
          }
        }
      ]
    }
  ]
};

/** -------------------------
 *  GLOBAL STATE
 *  ------------------------- */
const state = {
  overall: Object.create(null), // itemId -> "auto" | levelKey
  checks: Object.create(null),  // itemId -> levelKey -> boolean[]
  speech: { textRec: null, commentRec: null }
};

/** -------------------------
 *  DOM HELPERS
 *  ------------------------- */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function esc(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function todayISO(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatSwissDate(iso){
  if(!iso) return "";
  const [y,m,d] = iso.split("-").map(x=>parseInt(x,10));
  if(!y || !m || !d) return iso;
  return `${String(d).padStart(2,"0")}.${String(m).padStart(2,"0")}.${y}`;
}

function cssEscape(v){
  try{ return CSS.escape(String(v)); }catch(_){ return String(v).replaceAll('"','\\"'); }
}

/** -------------------------
 *  PRONOUNS
 *  ------------------------- */
function getPronouns(){
  const g = $("#fGender").value; // m/w
  if(g === "w"){
    return { subj:"sie", obj:"sie", poss:"ihr", capSubj:"Sie", capPoss:"Ihr" };
  }
  return { subj:"er", obj:"ihn", poss:"sein", capSubj:"Er", capPoss:"Sein" };
}

/** -------------------------
 *  INIT
 *  ------------------------- */
function initDefaults(){
  $("#fPlace").value = "Wädenswil";
  $("#fDate").value = todayISO();
}

function initStateFromData(){
  for(const group of DATA.groups){
    for(const item of group.items){
      state.overall[item.id] = "auto";
      state.checks[item.id] = Object.create(null);
      for(const lk of LEVEL_ORDER){
        const pts = item.levels[lk]?.points ?? [];
        state.checks[item.id][lk] = pts.map(()=>false);
      }
    }
  }
}

/** -------------------------
 *  RASTER RENDER
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
      const overallVal = state.overall[item.id] ?? "auto";
      const itemEl = document.createElement("div");
      itemEl.className = "item";
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
              ${LEVEL_ORDER.map(lk=>`<option value="${lk}"${overallVal===lk?" selected":""}>${esc(LEVEL_LABEL[lk])}</option>`).join("")}
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

  // events
  $$("select[data-overall]").forEach(sel=>{
    sel.addEventListener("change", (e)=>{
      const id = e.target.getAttribute("data-overall");
      state.overall[id] = e.target.value;
      refreshAll();
    });
  });

  $$("input[type=checkbox][data-item]").forEach(cb=>{
    cb.addEventListener("change",(e)=>{
      const el = e.target;
      const itemId = el.getAttribute("data-item");
      const levelKey = el.getAttribute("data-level");
      const idx = parseInt(el.getAttribute("data-idx"), 10);
      const ex = el.getAttribute("data-ex") || "";

      state.checks[itemId][levelKey][idx] = el.checked;

      if(el.checked && ex){
        enforceExclusivity(itemId, ex, levelKey, idx);
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
        ${pts.map((p,i)=>{
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

function getItemById(itemId){
  for(const g of DATA.groups){
    for(const it of g.items){
      if(it.id === itemId) return it;
    }
  }
  throw new Error("Item not found: " + itemId);
}

function enforceExclusivity(itemId, exKey, keepLevel, keepIdx){
  const item = getItemById(itemId);
  for(const lk of LEVEL_ORDER){
    const pts = item.levels[lk]?.points ?? [];
    for(let i=0;i<pts.length;i++){
      if(lk===keepLevel && i===keepIdx) continue;
      if((pts[i]?.ex || "") === exKey){
        state.checks[itemId][lk][i] = false;
        const dom = $(`input[type=checkbox][data-item="${cssEscape(itemId)}"][data-level="${cssEscape(lk)}"][data-idx="${i}"]`);
        if(dom) dom.checked = false;
      }
    }
  }
}

/** -------------------------
 *  SELECTION RULE
 *  - Mention in text only if: any checkbox OR overall not auto
 *  ------------------------- */
function hasAnySelection(itemId){
  if(state.overall[itemId] && state.overall[itemId] !== "auto") return true;
  for(const lk of LEVEL_ORDER){
    const arr = state.checks[itemId][lk] || [];
    if(arr.some(Boolean)) return true;
  }
  return false;
}

/** -------------------------
 *  LEVEL COMPUTATION
 *  - returns null if no selection AND overall is Auto
 *  - if overall forced (not Auto) -> that level
 *  - else compute weighted from selected checkboxes
 *  ------------------------- */
function computeItemLevel(item){
  const forced = state.overall[item.id];
  if(forced && forced !== "auto") return forced;

  const counts = Object.create(null);
  for(const lk of LEVEL_ORDER){
    const arr = state.checks[item.id][lk] || [];
    counts[lk] = arr.reduce((a,b)=>a+(b?1:0),0);
  }
  const total = LEVEL_ORDER.reduce((s,lk)=>s+counts[lk],0);
  if(total === 0) return null; // IMPORTANT: no selection -> no level

  // weights: ue=3, gut=2, gen=1, noch=0
  const weight = { ue:3, gut:2, gen:1, noch:0 };
  const score = LEVEL_ORDER.reduce((s,lk)=>s + counts[lk]*weight[lk], 0);
  const avg = score / total;

  if(avg >= 2.6) return "ue";
  if(avg >= 1.7) return "gut";
  if(avg >= 0.9) return "gen";
  return "noch";
}

/** -------------------------
 *  TEXT ENGINE
 *  ------------------------- */
const MOD_WORDS = [
  "oft","meist","gelegentlich","selten","durchwegs","zuverlässig","noch nicht durchgehend","punktuell","in der Regel"
];

function escapeRegExp(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function wrapMods(text){
  const sorted = [...MOD_WORDS].sort((a,b)=>b.length-a.length);
  let out = text;
  for(const w of sorted){
    const re = new RegExp(`\\b${escapeRegExp(w)}\\b`, "gi");
    out = out.replace(re, (m)=>`<span class="mod">${esc(m)}</span>`);
  }
  return out;
}
function wrapPlainMod(word){ return `<span class="mod">${esc(word)}</span>`; }

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

function pickFocusSnippet(level, pts){
  if(!pts || pts.length === 0){
    // if no points but overall forced, keep general but meaningful
    if(level === "ue") return "Die Lernziele werden nicht nur sicher erreicht, sondern in der Umsetzung sichtbar übertroffen.";
    if(level === "gut") return "Die Lernziele werden gut erreicht; Vorgehensweisen sind nachvollziehbar und solide abgesichert.";
    if(level === "gen") return `Die Lernziele werden im Kern erreicht; mit ${wrapPlainMod("gelegentlich")}er Unterstützung können wichtige Schritte weiter stabilisiert werden.`;
    return `Die Lernziele sind ${wrapPlainMod("noch nicht durchgehend")} gesichert; es braucht klare Strukturierung und enges Coaching.`;
  }

  const prefer = pts.filter(p=>p.level===level);
  const pool = prefer.length ? prefer : pts;
  const take = pool.slice(0, 2).map(p=>p.text);
  const lead =
    level==="ue" ? "Besonders hervorzuheben ist, dass " :
    level==="gut" ? "Dabei zeigt sich, dass " :
    level==="gen" ? "Unterstützend wirkt, dass " :
    "Im Fokus steht, dass ";

  const core = take.length===2 ? `${take[0]} und ${take[1]}` : take[0];

  if(level==="gen"){
    return `${lead}${wrapPlainMod("gelegentlich")} klare Strukturhilfen helfen – konkret: ${esc(core)}.`;
  }
  if(level==="noch"){
    return `${lead}${wrapPlainMod("noch nicht durchgehend")} zentrale Grundlagen gesichert sind – konkret: ${esc(core)}.`;
  }
  return `${lead}${esc(core)}.`;
}

function buildSentenceForItem(title, level, pts, pr){
  // level is one of LEVEL_ORDER
  const base = `Im Bereich <strong>${esc(title)}</strong>`;

  if(level === "ue"){
    const s1 = `${base} werden die Lernziele <strong>übertroffen</strong>.`;
    const s2 = ` ${pickFocusSnippet(level, pts)}`;
    return `${s1}${s2}`;
  }
  if(level === "gut"){
    const s1 = `${base} werden die Lernziele <strong>gut erreicht</strong>.`;
    const s2 = ` ${pickFocusSnippet(level, pts)}`;
    return `${s1}${s2}`;
  }
  if(level === "gen"){
    const s1 = `${base} werden die Lernziele <strong>genügend erreicht</strong>.`;
    const s2 = ` ${pickFocusSnippet(level, pts)}`;
    const s3 = ` Mit klaren Zwischenzielen und passenden Übungsroutinen kann ${pr.subj} die Sicherheit weiter ausbauen.`;
    return `${s1}${s2}${s3}`;
  }
  // noch
  const s1 = `${base} sind die Lernziele <strong>noch nicht erreicht</strong>.`;
  const s2 = ` ${pickFocusSnippet(level, pts)}`;
  const s3 = ` Sinnvoll sind kleinschrittige Aufbauphasen, häufige kurze Trainingssequenzen und feste Kontrollschritte, damit Fortschritte stabil werden.`;
  return `${s1}${s2}${s3}`;
}

function buildClosing(pr, mentionedCount){
  if(mentionedCount === 0){
    return `Es wurden aktuell noch keine Kriterien ausgewählt. Sobald Einschätzungen gesetzt sind, wird hier automatisch eine aussagekräftige Gesamtbeurteilung erstellt.`;
  }
  return `Insgesamt zeigt ${pr.subj} eine engagierte Arbeitshaltung. Mit klaren Zielen, gezielten Rückmeldungen und einer konsequenten Übungsroutine kann ${pr.subj} ${wrapPlainMod("zuverlässig")} weitere Fortschritte sichern.`;
}

function generateReportHTML(){
  const pr = getPronouns();
  const parts = [];
  let mentioned = 0;

  for(const group of DATA.groups){
    const sentences = [];

    for(const item of group.items){
      if(!hasAnySelection(item.id)) continue; // IMPORTANT RULE
      const level = computeItemLevel(item);
      // if overall forced but no points, level is forced; if still null (shouldn't), skip
      if(!level) continue;

      const pts = getSelectedPoints(item.id);
      sentences.push(buildSentenceForItem(item.title, level, pts, pr));
      mentioned++;
    }

    const paragraph = sentences.filter(Boolean).join(" ");
    if(paragraph.trim()){
      parts.push(`<p>${wrapMods(paragraph)}</p>`);
    }
  }

  parts.push(`<p>${wrapMods(buildClosing(pr, mentioned))}</p>`);
  return parts.join("\n");
}

/** -------------------------
 *  EDITOR SYNC
 *  ------------------------- */
let lastAutoHTML = "";

function refreshEditorIfNotModified(){
  const ed = $("#reportEditor");
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
}

/** -------------------------
 *  TEXT UTILITIES
 *  ------------------------- */
function getEditorPlainText(){
  const ed = $("#reportEditor");
  const clone = ed.cloneNode(true);
  $$("span.mod", clone).forEach(s=>s.replaceWith(document.createTextNode(s.textContent)));
  const ps = $$("p", clone);
  if(ps.length){
    return ps.map(p=>p.textContent.trim()).filter(Boolean).join("\n\n");
  }
  return clone.textContent.trim();
}

function rehighlightEditorMods(){
  const ed = $("#reportEditor");
  const text = getEditorPlainText();
  const paras = text.split(/\n{2,}/).map(s=>s.trim()).filter(Boolean);
  ed.innerHTML = paras.map(p=>`<p>${wrapMods(esc(p))}</p>`).join("\n");
}

function smoothEditorText(){
  const ed = $("#reportEditor");
  const text = getEditorPlainText();
  const smoothed = text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  const paras = smoothed.split(/\n{2,}/).map(s=>s.trim()).filter(Boolean);
  ed.innerHTML = paras.map(p=>`<p>${esc(p)}</p>`).join("\n");
  rehighlightEditorMods();
  lastAutoHTML = ed.innerHTML.trim();
  toast("Text geglättet.");
}

/** -------------------------
 *  CLIPBOARD / COPILOT
 *  ------------------------- */
function collectHeader(){
  const student = ($("#fStudent").value || "").trim();
  const cls = ($("#fClass").value || "").trim();
  const gender = $("#fGender").value;
  const place = ($("#fPlace").value || "").trim();
  const dateIso = ($("#fDate").value || "").trim();
  const teacher = ($("#fTeacher").value || "").trim();
  return { student, cls, gender, place, dateIso, dateHuman: formatSwissDate(dateIso), teacher };
}

function buildCopilotPromptBundle(){
  const header = collectHeader();
  const textPlain = getEditorPlainText();
  const comment = ($("#teacherComment").value || "").trim();

  return [
    `Du bist eine erfahrene Schweizer Lehrperson und formulierst zeugnisnahe, pädagogisch präzise Beurteilungen.`,
    `Aufgabe: Überarbeite den folgenden Fliesstext zu «Fachkompetenzen – Lernziele».`,
    `Qualität: sprachlich präzise, wohlwollend, aber aussagekräftig. Keine Floskeln, keine Übertreibung.`,
    `Wichtig: Inhalt NICHT erfinden. Nur glätten, konkretisieren, Redundanz reduzieren.`,
    `Pronomen gemäss Angaben verwenden: ${header.gender==="w" ? "sie/ihr" : "er/sein"}.`,
    `Behalte die Absatzstruktur.`,
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
}

async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    toast("In Zwischenablage kopiert.");
    return true;
  }catch(_){
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
      toast(ok ? "In Zwischenablage kopiert." : "Kopieren nicht möglich (Browser-Rechte).");
      return ok;
    }catch(__){
      toast("Kopieren nicht möglich (Browser-Rechte).");
      return false;
    }
  }
}

/** -------------------------
 *  OVERLAY (hover 3s on Copilot button)
 *  ------------------------- */
let hoverTimer = null;
function setupCopilotOverlay(){
  const btn = $("#btnCopilot");
  const overlay = $("#overlay");

  function openOverlay(){ overlay.setAttribute("aria-hidden","false"); }
  function closeOverlay(){ overlay.setAttribute("aria-hidden","true"); }

  btn.addEventListener("mouseenter", ()=>{ hoverTimer = setTimeout(openOverlay, 3000); });
  btn.addEventListener("mouseleave", ()=>{ if(hoverTimer) clearTimeout(hoverTimer); hoverTimer=null; });

  overlay.addEventListener("click",(e)=>{
    if(e.target && e.target.getAttribute("data-close")) closeOverlay();
  });

  document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape" && overlay.getAttribute("aria-hidden")==="false") closeOverlay();
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
    for(let i=event.resultIndex;i<event.results.length;i++){
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
        (txt)=> applyDictationToEditor(txt),
        (s)=> $("#dictateTextState").textContent = s
      );
      if(!state.speech.textRec){ toast("Diktat nicht verfügbar (SpeechRecognition fehlt)."); return; }
    }
    const rec = state.speech.textRec;
    if(rec.__running){ rec.__running=false; try{rec.stop();}catch(_){}; }
    else{ rec.__running=true; try{rec.start();}catch(_){}; }
    return;
  }

  if(target === "comment"){
    if(!state.speech.commentRec){
      state.speech.commentRec = createSpeechRecognizer(
        (txt)=> { $("#teacherComment").value = txt; },
        (s)=> $("#dictateCommentState").textContent = s
      );
      if(!state.speech.commentRec){ toast("Diktat nicht verfügbar (SpeechRecognition fehlt)."); return; }
    }
    const rec = state.speech.commentRec;
    if(rec.__running){ rec.__running=false; try{rec.stop();}catch(_){}; }
    else{ rec.__running=true; try{rec.start();}catch(_){}; }
  }
}

function applyDictationToEditor(text){
  // predictable: replace editor with dictated text as paragraph(s)
  const ed = $("#reportEditor");
  const base = (text || "").trim();
  const paras = base.split(/\n{2,}/).map(s=>s.trim()).filter(Boolean);
  ed.innerHTML = paras.length ? paras.map(p=>`<p>${wrapMods(esc(p))}</p>`).join("\n") : "";
  lastAutoHTML = ""; // mark as modified
}

/** -------------------------
 *  PDF (2 pages)
 *  - Table still shows all criteria (zeugnisnah)
 *  - If a criterion has no selection -> no X in circles
 *  - Text respects selection rule (only selected criteria)
 *  ------------------------- */
function buildPdfTableHTML(){
  const rows = [];
  for(const group of DATA.groups){
    for(const item of group.items){
      const lvl = computeItemLevel(item); // can be null
      rows.push(renderPdfRow(item.title, lvl));
    }
  }

  const head = `
    <div class="tHead">
      <div class="tCell"><strong>Kriterium</strong></div>
      <div class="tCell"><div class="rot"><span>lernziele übertroffen</span></div></div>
      <div class="tCell"><div class="rot"><span>lernziele gut erreicht</span></div></div>
      <div class="tCell"><div class="rot"><span>lernziele genügend erreicht</span></div></div>
      <div class="tCell"><div class="rot"><span>lernziele noch nicht erreicht</span></div></div>
    </div>
  `;
  return `${head}${rows.join("")}`;
}

function renderPdfRow(title, lvl){
  const cells = LEVEL_ORDER.map(k=>{
    const x = (lvl && k===lvl) ? `<span class="x">×</span>` : "";
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
  const blocks = [];
  for(const group of DATA.groups){
    const gItems = [];
    for(const item of group.items){
      const sel = getSelectedPoints(item.id);
      if(sel.length === 0) continue;
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
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  $$("span.mod", tmp).forEach(s=>s.replaceWith(document.createTextNode(s.textContent)));
  return tmp.innerHTML;
}

function integrateCommentIntoTextForPdf(){
  const comment = ($("#teacherComment").value || "").trim();
  const edHtml = $("#reportEditor").innerHTML || "";
  if(!comment) return edHtml;
  return `${edHtml}\n<p>${wrapMods(esc(comment))}</p>`;
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

    for(let i=0;i<pages.length;i++){
      const page = pages[i];
      const canvas = await window.html2canvas(page, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: false
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgW = pageWidth;
      const imgH = (canvas.height / canvas.width) * imgW;

      if(i>0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, imgW, Math.min(imgH, pageHeight));
    }

    const h = collectHeader();
    const safeName = (h.student || "OhneName")
      .replace(/[^\p{L}\p{N}\-_ ]/gu,"")
      .trim()
      .replace(/\s+/g,"_");
    const fileName = `Fachkompetenzen_Lernziele_${safeName || "OhneName"}_${h.dateIso || todayISO()}.pdf`;
    pdf.save(fileName);
    toast("PDF erstellt.");
  }catch(err){
    console.error(err);
    toast("PDF-Export fehlgeschlagen – Print-Fallback.");
    openPrintFallback();
  }
}

function getPdfRelevantCss(){
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
    .tHead,.tRow{display:grid;grid-template-columns:1fr 60px 60px 60px 60px;}
    .tHead{border-bottom:1px solid #000;align-items:stretch;}
    .tHead .tCell{padding:8px 6px;border-left:1px solid #000;display:flex;align-items:flex-end;justify-content:center;}
    .tHead .tCell:first-child{border-left:none;justify-content:flex-start;align-items:center;font-weight:700;}
    .rot{height:86px;display:flex;align-items:center;justify-content:center;}
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
    .dItem{margin:0 0 6px;}
    .dItem__title{font-weight:700;}
    .dItem__bullets{margin:2px 0 0 14px;}
    .dItem__bullets li{margin:0 0 2px;}
  `;
}

function openPrintFallback(){
  syncPdfDom();

  const root = $("#pdfRoot").cloneNode(true);
  root.style.position = "static";
  root.style.left = "0";
  root.style.top = "0";

  const css = getPdfRelevantCss();
  const win = window.open("", "_blank");
  if(!win){ toast("Popup blockiert – bitte Popups erlauben oder manuell drucken."); return; }

  win.document.open();
  win.document.write(`<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Fachkompetenzen – Lernziele (Print)</title>
<style>${css}@media print{body{margin:0}.pdfPage{page-break-after:always}}</style>
</head>
<body></body>
</html>`);
  win.document.close();
  win.document.body.appendChild(root);

  setTimeout(()=>{ try{ win.focus(); win.print(); }catch(_){} }, 350);
}

/** -------------------------
 *  TOAST
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
 *  UI WIRING
 *  ------------------------- */
function wireUi(){
  $("#btnCopyPrompt").addEventListener("click", async ()=>{
    const bundle = buildCopilotPromptBundle();
    await copyToClipboard(bundle);
  });

  $("#btnCopilot").addEventListener("click", async ()=>{
    const bundle = buildCopilotPromptBundle();
    const ok = await copyToClipboard(bundle);
    window.open("https://copilot.microsoft.com/", "_blank", "noopener,noreferrer");
    if(!ok) toast("Hinweis: Prompt konnte nicht automatisch kopiert werden.");
  });

  $("#btnSmooth").addEventListener("click", smoothEditorText);
  $("#btnPdf").addEventListener("click", exportPdf);

  ["#fGender","#fStudent","#fClass","#fPlace","#fDate","#fTeacher"].forEach(sel=>{
    $(sel).addEventListener("change", refreshAll);
    $(sel).addEventListener("input", refreshAll);
  });

  $("#btnDictateText").addEventListener("click", ()=> toggleDictation("text"));
  $("#btnDictateComment").addEventListener("click", ()=> toggleDictation("comment"));

  $("#reportEditor").addEventListener("input", ()=>{ lastAutoHTML = ""; });
  $("#reportEditor").addEventListener("paste", ()=>{ setTimeout(rehighlightEditorMods, 0); });

  setupCopilotOverlay();
}

/** -------------------------
 *  BOOT
 *  ------------------------- */
function boot(){
  initDefaults();
  initStateFromData();
  renderRaster();
  forceRefreshEditor();
  wireUi();
}

document.addEventListener("DOMContentLoaded", boot);
