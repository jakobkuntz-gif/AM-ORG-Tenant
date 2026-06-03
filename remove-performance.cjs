const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "index.html");
let html = fs.readFileSync(indexPath, "utf8");

// 1) Remove performance CSS block (keeps original .stats-kpi-row that follows)
const cssStart = html.indexOf("      /* —— Performance tab (ported) —— */");
const cssEnd = html.indexOf("      .stats-kpi-row {\n        display: grid;");
if (cssStart === -1 || cssEnd === -1 || cssEnd <= cssStart) {
  throw new Error("Performance CSS markers not found");
}
html = html.slice(0, cssStart) + html.slice(cssEnd);

// 2) Revert stats tabs bar to simple tabs (from HEAD pattern)
const tabsBarStart = html.indexOf('            <div class="stats-tabs-bar">');
const tabsBarEnd = html.indexOf(
  '            <div\n              id="statsPanelOverview"',
);
if (tabsBarStart === -1 || tabsBarEnd === -1) {
  throw new Error("Stats tabs bar markers not found");
}
const tabsReplacement = `            <div class="stats-tabs" role="tablist" aria-label="Statistik-Ansichten">
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
            </div>

`;
html = html.slice(0, tabsBarStart) + tabsReplacement + html.slice(tabsBarEnd);

// 3) Remove performance panel
const perfPanelStart = html.indexOf('            <div\n              id="statsPanelPerformance"');
const perfPanelEnd = html.indexOf(
  '        <input\n          id="profileUploadInput"',
);
if (perfPanelStart === -1 || perfPanelEnd === -1) {
  throw new Error("Performance panel markers not found");
}
// Keep closing structure before profileUploadInput
const beforePanel = html.lastIndexOf("            </div>", perfPanelStart);
const auswertungenClose = html.lastIndexOf("            </div>\n\n", perfPanelStart);
const cutStart = html.lastIndexOf("\n\n            <div", perfPanelStart);
html =
  html.slice(0, cutStart >= auswertungenClose ? cutStart : perfPanelStart) +
  "\n" +
  html.slice(perfPanelEnd);

// 4) Remove performance JS module
const jsStart = html.indexOf("      /* —— Performance module (ported) —— */");
const jsEnd = html.indexOf("      populateLeadOverviewRows(100);");
if (jsStart === -1 || jsEnd === -1) {
  throw new Error("Performance JS markers not found");
}
html = html.slice(0, jsStart) + html.slice(jsEnd);

// 5) Revert setStatsTab
html = html.replace(
  /      function setStatsTab\(tabKey\) \{[\s\S]*?if \(tabKey === "performance"[\s\S]*?\n      \}/,
  `      function setStatsTab(tabKey) {
        document.querySelectorAll(".stats-tab").forEach((btn) => {
          const active = btn.dataset.statsTab === tabKey;
          btn.classList.toggle("active", active);
          btn.setAttribute("aria-selected", active ? "true" : "false");
        });
        document.querySelectorAll(".stats-panel").forEach((panel) => {
          panel.classList.toggle("active", panel.dataset.statsPanel === tabKey);
        });
      }`,
);

// 6) Revert standort scope helpers
html = html.replace(
  `        if (typeof syncPerformanceSummaryKpis === "function") syncPerformanceSummaryKpis();\n      }`,
  "      }",
);
html = html.replace(
  'const ids = ["statsStandortSelectKpi", "statsStandortSelectDetailsMain", "statsStandortSelectEvalMain", "statsStandortSelectPerformance"];',
  'const ids = ["statsStandortSelectKpi", "statsStandortSelectDetailsMain", "statsStandortSelectEvalMain"];',
);
html = html.replace(
  `      buildAssignableStandorte();
      refreshPerformanceTenantLists();`,
  "      buildAssignableStandorte();",
);

fs.writeFileSync(indexPath, html);

const h = fs.readFileSync(indexPath, "utf8");
const s = h.indexOf("<script>");
const code = h.slice(s + 8, h.lastIndexOf("</script>"));
try {
  new Function(code);
  console.log("OK: script parses, lines", h.split("\n").length);
} catch (e) {
  console.error("FAIL:", e.message);
  process.exit(1);
}
console.log("Removed performance integration");
