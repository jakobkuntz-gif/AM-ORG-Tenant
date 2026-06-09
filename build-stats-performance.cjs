const fs = require("fs");
const path = require("path");

const root = __dirname;
let code = fs.readFileSync(path.join(root, "stats-performance-module.js"), "utf8");

// Strip duplicate lead-table helpers (would override main app if injected globally)
const stripStart = code.indexOf("function parseAnfrageDatum(text)");
const stripEnd = code.indexOf("function periodToMaxDays(period)");
if (stripStart === -1 || stripEnd === -1) throw new Error("strip markers missing");
const dateHelper = `
      function perfParseAnfrageDatum(text) {
        const match = String(text || "")
          .trim()
          .match(/(\\d{2})\\.(\\d{2})\\.(\\d{4})(?:,\\s*(\\d{1,2}):(\\d{2}))?/);
        if (!match) return null;
        const day = Number(match[1]);
        const month = Number(match[2]) - 1;
        const year = Number(match[3]);
        const hours = match[4] != null ? Number(match[4]) : 0;
        const minutes = match[5] != null ? Number(match[5]) : 0;
        const date = new Date(year, month, day, hours, minutes);
        return Number.isNaN(date.getTime()) ? null : date;
      }
`;
code = code.slice(0, stripStart) + dateHelper + code.slice(stripEnd);
code = code.replace(/parseAnfrageDatum\(/g, "perfParseAnfrageDatum(");

// UI labels: Gebiet -> Standort (keep internal keys where needed)
const replacements = [
  ["Nach Gebiet", "Nach Standort"],
  ["Kein Gebiet", "Kein Standort"],
  ['return "Gebiet";', 'return "Standort";'],
  ['return "Gebiet / Mitarbeiter";', 'return "Standort / Mitarbeiter";'],
  ['return "Gebiet / Mitarbeiter / Produkt";', 'return "Standort / Mitarbeiter / Produkt";'],
  ['return "Gebiet / Produkt";', 'return "Standort / Produkt";'],
  ["Gebiet →", "Standort →"],
  ["Gebiet, Mitarbeiter", "Standort, Mitarbeiter"],
];
for (const [a, b] of replacements) code = code.split(a).join(b);

code = code.replace(/\bgebiet:/g, "standort:");
code = code.replace(/"Kein Gebiet"/g, '"Kein Standort"');
code = code.replace(/Hesena Management Domizil an der Jade/g, "Hesena Management Domizil an der Jade");
code = code.replace(/"gebiet-mitarbeiter"/g, '"standort-mitarbeiter"');
code = code.replace(/"gebiet-produkt"/g, '"standort-produkt"');
code = code.replace(/"gebiet-mitarbeiter-produkt"/g, '"standort-mitarbeiter-produkt"');
code = code.replace(/level === "gebiet"/g, 'level === "standort"');
code = code.replace(/view === "gebiet"/g, 'view === "standort"');
code = code.replace(/data-perf-view="gebiet"/g, 'data-perf-view="standort"');
code = code.replace(/perf-combo-gebiet/g, "perf-combo-standort");
code = code.replace(/filters\.gebiet/g, "filters.standort");
code = code.replace(/combo\.filters\.gebiet/g, "combo.filters.standort");
code = code.replace(/draft\.filters\.gebiet/g, "draft.filters.standort");
code = code.replace(/getGebietKeys/g, "getStandortKeys");
code = code.replace(/getGebietDimensionFoldRows/g, "getStandortDimensionFoldRows");
code = code.replace(/TENANT_GEBIETE/g, "TENANT_STANDORTE_PERF");
code = code.replace(/getMitarbeiterMapForGebiet/g, "getMitarbeiterMapForStandort");
code = code.replace(/getMitarbeiterKeysForGebiet/g, "getMitarbeiterKeysForStandort");
code = code.replace(/getMitarbeiterWithLeadsInGebiet/g, "getMitarbeiterWithLeadsInStandort");
code = code.replace(/gebietFiltersFromSelection/g, "standortFiltersFromSelection");
code = code.replace(/gebietFilters/g, "standortFilters");
code = code.replace(/gebietList/g, "standortList");
code = code.replace(/selectedGebiet/g, "selectedStandort");
code = code.replace(/kind: "gebiet"/g, 'kind: "standort"');
code = code.replace(/row\.kind === "gebiet"/g, 'row.kind === "standort"');

// Fix forEach variable names: (gebiet) -> (standort) in common patterns
code = code.replace(/TENANT_STANDORTE_PERF\.forEach\(\(gebiet\)/g, "TENANT_STANDORTE_PERF.forEach((standort)");
code = code.replace(/getCellValue\(row, "standort"\) === gebiet/g, 'getCellValue(row, "standort") === standort');
code = code.replace(/"standort", gebiet\)/g, '"standort", standort)');
code = code.replace(/\{ gebiet \}/g, "{ standort }");
code = code.replace(/, gebiet,/g, ", standort,");
code = code.replace(/parent: gebiet/g, "parent: standort");
code = code.replace(/entry\.gebiet/g, "entry.standort");
code = code.replace(/stats\.gebiet/g, "stats.standort");
code = code.replace(/gebietFlat/g, "standortFlat");
code = code.replace(/gebietNested/g, "standortNested");
code = code.replace(/PERF_BASE_DATA\[metricKey\]\.gebiet/g, "PERF_BASE_DATA[metricKey].standort");
code = code.replace(/row\.gebiet/g, "row.standort");
code = code.replace(/filters\?\.gebiet/g, "filters?.standort");
code = code.replace(/combo\.filters\?\.gebiet/g, "combo.filters?.standort");
code = code.replace(/\.gebiet\?\.nested/g, ".standort?.nested");
code = code.replace(/function defaultComboFilters\(\) \{[\s\S]*?return \{[\s\S]*?\};\s*\}/, `function defaultComboFilters() {
        return { standort: [], mitarbeiter: [], produkt: [] };
      }`);

if (!code.includes("function isComplaintPendingStatus")) {
  code = code.replace(
    /const COMPLAINT_STATUS_BREAKDOWNS = \[/,
    `function isComplaintPendingStatus(status) {
        const value = String(status || "").trim();
        return (
          value.includes("Reklamation") &&
          !isLeadSuccessfulComplaintStatus(status) &&
          !isLeadRejectedComplaintStatus(status)
        );
      }

      const COMPLAINT_STATUS_BREAKDOWNS = [`,
  );
}

code = code.replace(/const base = \["gebiet", "mitarbeiter", "produkt"\];/g, 'const base = ["standort", "mitarbeiter", "produkt"];');
code = code.replace(/getStandortKeys\(metric, period\)\.forEach\(\(gebiet\)/g, "getStandortKeys(metric, period).forEach((standort)");
code = code.replace(/function getStandortKeys\(metric, period\) \{\s*return TENANT_STANDORTE_PERF\.slice\(\);\s*\}/, `function getPerformanceStandortScope() {
        return document.getElementById("statsStandortSelectPerformance")?.value || "";
      }

      function getManagedStandortKeys() {
        return getStandorte().filter(Boolean);
      }

      function getStandortKeys(metric, period) {
        const scope = getPerformanceStandortScope();
        if (scope) return [scope];
        return getManagedStandortKeys();
      }`);
code = code.replace(/buildStatsMultiSelectHtml\("gebiet", "Gebiet", "Gebiete auswählen"/g, 'buildStatsMultiSelectHtml("standort", "Standort", "Standorte auswählen"');
code = code.replace(/readMultiFilterFromCard\(root, "gebiet", gebietKeys\)/g, 'readMultiFilterFromCard(root, "standort", standortKeys)');
code = code.replace(/const gebietKeys = getStandortKeys/g, "const standortKeys = getStandortKeys");
code = code.replace(/const gebietSel =/g, "const standortSel =");
code = code.replace(/gebietSel/g, "standortSel");
code = code.replace(/gebietKeys/g, "standortKeys");
code = code.replace(/"Gebiet", "Gebiet"/g, '"Standort", "Standort"');
code = code.replace(/row\.kind === "standort" \? "Gebiet"/g, 'row.kind === "standort" ? "Standort"');
code = code.replace(/\["Ebene", "Gebiet"/g, '["Ebene", "Standort"');

code = code.replace(
  /function getLeadsInPerformancePeriod\(period\) \{[\s\S]*?return rows\.filter\(\(row\) => \{[\s\S]*?\}\);\s*\}/,
  `function getLeadsInPerformancePeriod(period) {
        const rows = Array.from(document.querySelectorAll("#leadBody tr.lead-row"));
        const maxDays = periodToMaxDays(period);
        let filtered = maxDays == null ? rows : rows.filter((row) => {
          const date = perfParseAnfrageDatum(getCellValue(row, "anfrageDatum"));
          if (!date) return false;
          const end = new Date();
          end.setHours(23, 59, 59, 999);
          const diffDays = (end.getTime() - date.getTime()) / 86400000;
          return diffDays >= 0 && diffDays <= maxDays;
        });
        const scope = document.getElementById("statsStandortSelectPerformance")?.value || "";
        if (scope) filtered = filtered.filter((row) => getCellValue(row, "standort") === scope);
        return filtered;
      }`,
);

// Remove trailing init block; boot() handles init
const tailIdx = code.lastIndexOf("initPerformancePeriodTabs();");
if (tailIdx !== -1) {
  const lineStart = code.lastIndexOf("\n", tailIdx);
  code = code.slice(0, lineStart > -1 ? lineStart : tailIdx).trimEnd() + "\n";
}

const wrapper = `(function (global) {
  "use strict";

  function initStatsPerformanceModule(deps) {
    const getCellValue = deps.getCellValue;
    const getStandorte = deps.getStandorte;
    const getMitarbeiterLabels = deps.getMitarbeiterLabels;
    const getLeadBedarfProducts = deps.getLeadBedarfProducts;

    const SUCCESSFUL_COMPLAINT_STATUS = "Reklamation erfolgreich - geschlossen";
    const REJECTED_COMPLAINT_STATUS = "Reklamation abgelehnt - geschlossen";
    const UNASSIGNED_OWNER_OPTIONS = ["Nicht zugewiesen"];
    let TENANT_STANDORTE_PERF = [];
    let TENANT_MITARBEITER = [];
    const LEAD_BEDARF_PRODUCTS = getLeadBedarfProducts();

    function refreshPerformanceTenantLists() {
      const standorte = getStandorte().filter(Boolean);
      TENANT_STANDORTE_PERF = [...standorte, "Kein Standort"];
      const names = getMitarbeiterLabels();
      TENANT_MITARBEITER = names.length
        ? names
        : ["Melissa Kropp", "Robin Stadel", "Jakob Kuntz", "Jonas Markus"];
    }

${code
  .split("\n")
  .map((line) => (line ? "    " + line : ""))
  .join("\n")}

    function boot() {
      refreshPerformanceTenantLists();
      initPerformancePeriodTabs();
      try {
        removePerfConsolidatedSummaryBlocks();
        ensureConsolidatedExportButton();
        initPerformanceSegments();
        syncPerformanceSummaryKpis();
      } catch (perfInitError) {
        console.error("Performance charts init skipped:", perfInitError);
      }
    }

    return {
      refreshPerformanceTenantLists,
      syncPerformanceSummaryKpis,
      boot,
    };
  }

  global.initStatsPerformanceModule = initStatsPerformanceModule;
})(typeof window !== "undefined" ? window : global);
`;

fs.writeFileSync(path.join(root, "stats-performance.js"), wrapper);

// Scoped CSS — never override global .stats-tab / .stats-kpi-card
const rawCss = fs.readFileSync(path.join(root, "stats-performance-snippet.css"), "utf8");
const skipSelectors = new Set([
  ".stats-tab",
  ".stats-tab:hover",
  ".stats-tab.is-active",
  ".stats-tab-panel",
  ".stats-tab-panel.is-active",
  ".stats-kpi-grid",
  ".stats-kpi-grid.cols-3",
  ".stats-kpi-card",
  ".stats-kpi-icon",
  ".stats-kpi-value",
  ".stats-kpi-label",
  ".stats-panel",
  ".stats-panel-head",
  ".stats-panel-body",
]);

function scopeCss(css) {
  const lines = css.split("\n");
  const out = [];
  let buffer = [];
  let skipBlock = false;

  const flush = () => {
    if (!buffer.length) return;
    if (skipBlock) {
      buffer = [];
      skipBlock = false;
      return;
    }
    const block = buffer.join("\n");
    if (block.includes(".stats-perf-") || block.includes(".stats-performance-") || block.includes(".stats-bar-")) {
      const scoped = block.replace(/(^|\n)(\s*)(\.[\w][^{,\n]+)/g, (m, pre, sp, sel) => {
        const s = sel.trim();
        if (skipSelectors.has(s)) return m;
        if (s.startsWith(".stats-perf-") || s.startsWith(".stats-performance-") || s.startsWith(".stats-bar-")) {
          return `${pre}${sp}#statsPanelPerformance ${s}`;
        }
        return m;
      });
      out.push(scoped);
    }
    buffer = [];
  };

  for (const line of lines) {
    if (line.match(/^\s*\.(stats-tab|stats-kpi-grid|stats-kpi-card|stats-kpi-icon|stats-kpi-value|stats-kpi-label|stats-panel)[\s{]/)) {
      flush();
      skipBlock = true;
      buffer = [line];
      continue;
    }
    if (skipBlock) {
      buffer.push(line);
      if (line.trim() === "}") {
        flush();
      }
      continue;
    }
    buffer.push(line);
    if (line.trim() === "}" && buffer.length > 1) flush();
  }
  flush();
  return out.join("\n");
}

const layoutCss = `
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

      #meineStatistikenPage .stats-performance-period {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--muted);
      }

      #meineStatistikenPage .stats-performance-period[hidden] {
        display: none !important;
      }

      #meineStatistikenPage .stats-performance-period select {
        border: 1px solid var(--line);
        border-radius: 6px;
        padding: 6px 10px;
        font-family: inherit;
        font-size: 14px;
      }

      #statsPanelPerformance.stats-panel {
        display: none;
      }

      #statsPanelPerformance.stats-panel.active {
        display: block;
      }

      #statsPanelPerformance .stats-kpi-row--perf {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        margin-bottom: 18px;
      }

      @media (max-width: 1100px) {
        #statsPanelPerformance .stats-kpi-row--perf {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        #statsPanelPerformance .stats-kpi-row--perf {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 900px) {
        #statsPanelPerformance .stats-kpi-row--perf {
          grid-template-columns: 1fr;
        }
      }

      #statsPanelPerformance .stat-inner-body--performance {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      #statsPanelPerformance .stats-perf-segment.stats-panel {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--white);
        box-shadow: 0 1px 2px rgba(23, 44, 56, 0.06);
        overflow: hidden;
        margin-bottom: 0;
      }

      #statsPanelPerformance .stats-perf-segment .stats-panel-head {
        padding: 14px 18px;
        background: var(--primary);
        color: var(--white);
        font-size: var(--font-section-heading);
        font-weight: 700;
      }

      #statsPanelPerformance .stats-perf-segment .stats-panel-body {
        padding: 20px 22px 24px;
        background: var(--primary-surface);
      }
`;

const perfCss =
  "      /* —— Performance tab (scoped) —— */\n" +
  layoutCss +
  scopeCss(rawCss).replace(/^/gm, "      ");

fs.writeFileSync(path.join(root, "stats-performance-scoped.css"), perfCss);
console.log("Built stats-performance.js and stats-performance-scoped.css");
