const fs = require("fs");
const path = require("path");

const root = __dirname;
const indexPath = path.join(root, "index.html");
const perfJsPath = path.join(root, "stats-performance-module.js");
const perfCssPath = path.join(root, "stats-performance-snippet.css");
const emptyWindowPath = "C:/Users/VP/.cursor/projects/empty-window/index.html";

let html = fs.readFileSync(indexPath, "utf8");
let perfJs = fs.readFileSync(perfJsPath, "utf8");
let perfCss = fs.readFileSync(perfCssPath, "utf8");

perfCss = perfCss.replace(/var\(--line-subtle\)/g, "var(--line)");
perfCss = perfCss.replace(/var\(--divider-stats\)/g, "var(--line)");
perfCss = perfCss.replace(/var\(--stats-accent[^)]*\)/g, "var(--primary-light)");
perfCss = perfCss.replace(/var\(--stats-accent-hover[^)]*\)/g, "var(--primary-surface)");
perfCss = perfCss.replace(/var\(--font-helper\)/g, "var(--type-caption)");
perfCss = perfCss.replace(/var\(--font-section-header\)/g, "var(--font-section-heading)");
perfCss = perfCss.replace(/var\(--card-elevated-shadow\)/g, "0 1px 2px rgba(23, 44, 56, 0.06)");

const uiReplacements = [
  ["Nach Gebiet", "Nach Standort"],
  ["Kein Gebiet", "Kein Standort"],
  ['return "Gebiet";', 'return "Standort";'],
  ['return "Gebiet / Mitarbeiter";', 'return "Standort / Mitarbeiter";'],
  ['return "Gebiet / Mitarbeiter / Produkt";', 'return "Standort / Mitarbeiter / Produkt";'],
  ['return "Gebiet / Produkt";', 'return "Standort / Produkt";'],
  ["Gebiet →", "Standort →"],
  ["Gebiet, Mitarbeiter", "Standort, Mitarbeiter"],
  ["perf-combo-gebiet", "perf-combo-standort"],
  ["perf-combo-gebiet-cb", "perf-combo-standort-cb"],
  ['data-perf-view="gebiet"', 'data-perf-view="standort"'],
  ['["gebiet", "mitarbeiter", "produkt"]', '["standort", "mitarbeiter", "produkt"]'],
  ['level === "gebiet"', 'level === "standort"'],
  ['"gebiet-mitarbeiter"', '"standort-mitarbeiter"'],
  ['"gebiet-mitarbeiter-produkt"', '"standort-mitarbeiter-produkt"'],
  ['"gebiet-produkt"', '"standort-produkt"'],
  ["getGebietDimensionFoldRows", "getStandortDimensionFoldRows"],
  ["gebietBlockStart", "standortBlockStart"],
  ["gebietLeads", "standortLeads"],
  ["gebietBlock", "standortBlock"],
  ["const gebiet =", "const standort ="],
  ["(gebiet)", "(standort)"],
  ["parent: gebiet", "parent: standort"],
  ["gebiet,", "standort,"],
  [" gebiet:", " standort:"],
  ["${gebiet}", "${standort}"],
  ["rollupInvestmentGebietRow", "rollupInvestmentStandortRow"],
  ["PERF_BASE_DATA", "PERF_BASE_DATA"],
];

for (const [from, to] of uiReplacements) {
  perfJs = perfJs.split(from).join(to);
}

perfJs = perfJs.replace(/\bgebiet\b/g, (match, offset, str) => {
  const before = str.slice(Math.max(0, offset - 20), offset);
  if (before.includes("PERF_BASE_DATA") || before.includes(".")) {
    const keyContext = str.slice(offset, offset + 30);
    if (keyContext.startsWith("gebiet:") || keyContext.includes("gebiet.")) return "standort";
  }
  return match === "gebiet" && /tree\[|node\.|\.gebiet|gebiet\]|"gebiet"/.test(str.slice(offset - 5, offset + 15))
    ? "standort"
    : match;
});

perfJs = perfJs.replace(/PERF_BASE_DATA = \{[\s\S]*?\n      \};\n\n      function getPerfHierarchy/m, (block) => {
  return block
    .replace(/\bgebiet:/g, "standort:")
    .replace(/Darmstadt/g, "Mainz")
    .replace(/"Kein Gebiet"/g, '"Kein Standort"');
});

const bridge = `
      const SUCCESSFUL_COMPLAINT_STATUS = "Reklamation erfolgreich - geschlossen";
      const REJECTED_COMPLAINT_STATUS = "Reklamation abgelehnt - geschlossen";
      let TENANT_GEBIETE = [];
      let TENANT_MITARBEITER = [];
      const LEAD_BEDARF_PRODUCTS = STATS_DETAIL_PRODUCT_ROWS.slice();

      function refreshPerformanceTenantLists() {
        const standorte = Array.isArray(SUBTENANT_STANDORTE)
          ? SUBTENANT_STANDORTE.filter(Boolean)
          : [];
        TENANT_GEBIETE = [...standorte, "Kein Standort"];
        const names = getAllMitarbeiterLabelsAcrossStandorte();
        TENANT_MITARBEITER = names.length
          ? names
          : ["Melissa Kropp", "Robin Stadel", "Jakob Kuntz", "Jonas Markus"];
      }

      function getLeadsInPerformancePeriodScoped(period) {
        const rows = getLeadsInPerformancePeriod(period);
        const scope =
          document.getElementById("statsStandortSelectPerformance")?.value || "";
        if (!scope) return rows;
        return rows.filter((row) => getCellValue(row, "standort") === scope);
      }
`;

perfJs = perfJs.replace(
  /function getLeadsInPerformancePeriod\(period\) \{[\s\S]*?\n      \}\n\n      function isLeadWonStatus/,
  `${bridge}
      function getLeadsInPerformancePeriod(period) {
        const rows = Array.from(document.querySelectorAll("#leadBody tr.lead-row"));
        const maxDays = periodToMaxDays(period);
        const filtered =
          maxDays == null
            ? rows
            : rows.filter((row) => {
                const date = parseAnfrageDatum(getCellValue(row, "anfrageDatum"));
                if (!date) return false;
                const end = new Date();
                end.setHours(23, 59, 59, 999);
                const diffDays = (end.getTime() - date.getTime()) / 86400000;
                return diffDays >= 0 && diffDays <= maxDays;
              });
        const scope =
          document.getElementById("statsStandortSelectPerformance")?.value || "";
        if (!scope) return filtered;
        return filtered.filter((row) => getCellValue(row, "standort") === scope);
      }

      function isLeadWonStatus`,
);

const emptyHtml = fs.readFileSync(emptyWindowPath, "utf8");
const perfPanelMatch = emptyHtml.match(
  /<div id="statsPanelPerformance"[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
);
if (!perfPanelMatch) throw new Error("Performance panel HTML not found in source");
let perfPanelHtml = perfPanelMatch[0]
  .replace(/<\/div>\s*<\/section>$/, "")
  .replace(/class="stats-tab-panel"/g, 'class="stats-panel"')
  .replace(/ hidden/g, "")
  .replace(/is-active/g, "active")
  .replace(/stats-kpi-grid cols-3/g, "stats-kpi-row stats-kpi-row--perf")
  .replace(/<p class="stats-kpi-value"/g, '<span class="stats-kpi-value"')
  .replace(/<\/p>\s*<p class="stats-kpi-label"/g, '</span><span class="stats-kpi-label"')
  .replace(/<\/p>\s*<\/div>\s*<\/div>\s*<button/g, "</span></div></div><button")
  .replace(/Nach Gebiet/g, "Nach Standort")
  .replace(/Gebiet →/g, "Standort →")
  .replace(/data-perf-view="gebiet"/g, 'data-perf-view="standort"');

perfPanelHtml = perfPanelHtml.replace(
  /<div id="statsPanelPerformance" class="stats-panel" role="tabpanel">/,
  `<div
              id="statsPanelPerformance"
              class="stats-panel"
              role="tabpanel"
              data-stats-panel="performance"
            >
              <div class="auth-card stats-card-performance">
                <div class="stat-inner-head stat-inner-head--split">
                  <span>Performance</span>
                  <div class="stat-inner-head-toolbar">
                    <label for="statsStandortSelectPerformance">Standort</label>
                    <select
                      id="statsStandortSelectPerformance"
                      class="stats-standort-select"
                      aria-label="Standort: Performance"
                    >
                      <option value="" selected>Alle Standorte</option>
                    </select>
                  </div>
                </div>
                <div class="stat-inner-body stat-inner-body--performance">`,
);

perfPanelHtml = perfPanelHtml.replace(
  /<\/div>\s*$/,
  `</div></div></div>`,
);

const tabsBarOld = `<div class="stats-tabs" role="tablist" aria-label="Statistik-Ansichten">
              <button
                type="button"
                class="stats-tab active"
                role="tab"
                aria-selected="true"
                data-stats-tab="overview"
              >
                Übersicht
              </button>
              <button
                type="button"
                class="stats-tab"
                role="tab"
                aria-selected="false"
                data-stats-tab="details"
              >
                Details
              </button>
              <button
                type="button"
                class="stats-tab"
                role="tab"
                aria-selected="false"
                data-stats-tab="auswertungen"
              >
                Auswertungen
              </button>
            </div>`;

const tabsBarNew = `<div class="stats-tabs-bar">
              <div class="stats-tabs" role="tablist" aria-label="Statistik-Ansichten">
                <button
                  type="button"
                  class="stats-tab active"
                  role="tab"
                  aria-selected="true"
                  data-stats-tab="overview"
                >
                  Übersicht
                </button>
                <button
                  type="button"
                  class="stats-tab"
                  role="tab"
                  aria-selected="false"
                  data-stats-tab="details"
                >
                  Details
                </button>
                <button
                  type="button"
                  class="stats-tab"
                  role="tab"
                  aria-selected="false"
                  data-stats-tab="auswertungen"
                >
                  Auswertungen
                </button>
                <button
                  type="button"
                  class="stats-tab"
                  role="tab"
                  aria-selected="false"
                  data-stats-tab="performance"
                >
                  Performance
                </button>
              </div>
              <label class="stats-filter stats-performance-period" id="statsPerformancePeriodWrap" hidden>
                Zeitraum:
                <select id="statsPerformancePeriod" aria-label="Zeitraum für Performance-Kennzahlen">
                  <option value="gesamt" selected>Gesamt</option>
                  <option value="day">Letzter Tag</option>
                  <option value="7d">Letzte 7 Tage</option>
                  <option value="30d">Letzte 30 Tage</option>
                  <option value="60d">Letzte 60 Tage</option>
                </select>
              </label>
            </div>`;

if (!html.includes(tabsBarOld)) throw new Error("Stats tabs block not found");
html = html.replace(tabsBarOld, tabsBarNew);

const auswertungenPanelEnd =
  '            </div>\n          </div>\n        </section>\n\n        <input\n          id="profileUploadInput"';
if (!html.includes(auswertungenPanelEnd.split("\n")[0])) {
  throw new Error("Auswertungen panel end anchor not found");
}
html = html.replace(
  auswertungenPanelEnd,
  `            </div>\n\n${perfPanelHtml}\n          </div>\n        </section>\n\n        <input\n          id="profileUploadInput"`,
);

if (!html.includes("/* —— Performance tab (ported) —— */")) {
  html = html.replace(
    "      .stats-panel.active {\n        display: block;\n      }",
    `      .stats-panel.active {\n        display: block;\n      }

      /* —— Performance tab (ported) —— */
${perfCss
  .split("\n")
  .map((line) => (line ? "      " + line : ""))
  .join("\n")}

      .stats-tabs-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px 16px;
        margin-bottom: 20px;
      }

      .stats-tabs-bar .stats-tabs {
        margin-bottom: 0;
        flex: 1 1 auto;
      }

      .stats-performance-period {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--muted);
      }

      .stats-performance-period[hidden] {
        display: none !important;
      }

      .stats-performance-period select {
        border: 1px solid var(--line);
        border-radius: 6px;
        padding: 6px 10px;
        font-family: inherit;
        font-size: 14px;
      }

      .stats-kpi-row--perf {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        margin-bottom: 18px;
      }

      @media (max-width: 900px) {
        .stats-kpi-row--perf {
          grid-template-columns: 1fr;
        }
      }

      .stat-inner-body--performance {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .stats-card-performance .stats-panel {
        margin-bottom: 0;
      }`,
  );
}

const setStatsTabOld = `      function setStatsTab(tabKey) {
        document.querySelectorAll(".stats-tab").forEach((btn) => {
          const active = btn.dataset.statsTab === tabKey;
          btn.classList.toggle("active", active);
          btn.setAttribute("aria-selected", active ? "true" : "false");
        });
        document.querySelectorAll(".stats-panel").forEach((panel) => {
          panel.classList.toggle("active", panel.dataset.statsPanel === tabKey);
        });
      }`;

const setStatsTabNew = `      function setStatsTab(tabKey) {
        document.querySelectorAll(".stats-tab").forEach((btn) => {
          const active = btn.dataset.statsTab === tabKey;
          btn.classList.toggle("active", active);
          btn.setAttribute("aria-selected", active ? "true" : "false");
        });
        document.querySelectorAll(".stats-panel").forEach((panel) => {
          panel.classList.toggle("active", panel.dataset.statsPanel === tabKey);
        });
        const periodWrap = document.getElementById("statsPerformancePeriodWrap");
        if (periodWrap) {
          if (tabKey === "performance") periodWrap.removeAttribute("hidden");
          else periodWrap.setAttribute("hidden", "");
        }
        if (tabKey === "performance" && typeof syncPerformanceSummaryKpis === "function") {
          syncPerformanceSummaryKpis();
        }
      }`;

if (!html.includes(setStatsTabOld)) throw new Error("setStatsTab not found");
html = html.replace(setStatsTabOld, setStatsTabNew);

html = html.replace(
  'const ids = ["statsStandortSelectKpi", "statsStandortSelectDetailsMain", "statsStandortSelectEvalMain"];',
  'const ids = ["statsStandortSelectKpi", "statsStandortSelectDetailsMain", "statsStandortSelectEvalMain", "statsStandortSelectPerformance"];',
);

html = html.replace(
  `        const eva = meineStatistikenPage.querySelector(".stats-card-auswertungen");
        if (eva) renderStatsAuswertungenCard(eva, payload);
      }`,
  `        const eva = meineStatistikenPage.querySelector(".stats-card-auswertungen");
        if (eva) renderStatsAuswertungenCard(eva, payload);
        if (typeof syncPerformanceSummaryKpis === "function") syncPerformanceSummaryKpis();
      }`,
);

const perfBlockMarker = "      /* —— Performance module (ported) —— */";
if (!html.includes(perfBlockMarker)) {
  const initAnchor = "      populateLeadOverviewRows(100);\n      buildAssignableStandorte();";
  const perfBlock =
    perfBlockMarker +
    "\n" +
    perfJs
      .split("\n")
      .map((line) => (line ? "      " + line : ""))
      .join("\n") +
    "\n";
  html = html.replace(initAnchor, perfBlock + "\n      " + initAnchor);
  html = html.replace(
    "      buildAssignableStandorte();",
    `      buildAssignableStandorte();
      refreshPerformanceTenantLists();`,
  );
}

fs.writeFileSync(indexPath, html);
console.log("Integration complete:", indexPath);
