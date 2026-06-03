const fs = require("fs");
const path = require("path");

const root = __dirname;
const indexPath = path.join(root, "index.html");
const emptyPath = "C:/Users/VP/.cursor/projects/empty-window/index.html";
let html = fs.readFileSync(indexPath, "utf8").replace(/\r\n/g, "\n");
const perfCss = fs.readFileSync(path.join(root, "stats-performance-scoped.css"), "utf8");

if (html.includes('id="perfKpiConversion"')) {
  console.log("Already integrated");
  process.exit(0);
}

// 1) Scoped CSS after .stats-panel.active
const cssAnchor = ".stats-panel.active {";
const cssIdx = html.indexOf(cssAnchor);
if (cssIdx === -1) throw new Error("CSS anchor missing");
const cssEnd = html.indexOf("      .stats-kpi-row {", cssIdx);
if (cssEnd === -1) throw new Error("CSS kpi-row anchor missing");
html = html.slice(0, cssEnd) + `\n${perfCss}\n\n` + html.slice(cssEnd);

// 2) Tabs bar + performance tab
const tabsOld = `            <div class="stats-tabs" role="tablist" aria-label="Statistik-Ansichten">
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

const tabsNew = `            <div class="stats-tabs-bar">
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

html = html.replace(tabsOld, tabsNew);

// 3) Performance panel inside stats-shell
if (!fs.existsSync(path.join(root, "stats-performance-panel.fragment.html"))) {
  require("child_process").execFileSync("node", ["extract-panel.cjs"], { cwd: root, stdio: "inherit" });
}
const panel = fs.readFileSync(path.join(root, "stats-performance-panel.fragment.html"), "utf8");
const panelAnchor =
  '                  <div class="stat-eval-box stat-eval-box--location">\n                    <h3>Anfragen je Standort</h3>\n                    <div class="stat-eval-box-body"></div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </section>';
const panelIdx = html.indexOf(panelAnchor);
if (panelIdx === -1) throw new Error("Panel insert anchor missing");
const insertPoint = panelIdx + panelAnchor.indexOf("            </div>\n          </div>");
html =
  html.slice(0, insertPoint + "            </div>".length) +
  `\n\n${panel}\n` +
  html.slice(insertPoint + "            </div>".length);

// 4) setStatsTab
html = html.replace(
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
  `      function setStatsTab(tabKey) {
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
        if (tabKey === "performance" && statsPerformanceApi?.syncPerformanceSummaryKpis) {
          statsPerformanceApi.syncPerformanceSummaryKpis();
        }
      }`,
);

// 5) Standort selects + scope
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
        if (statsPerformanceApi?.syncPerformanceSummaryKpis) {
          statsPerformanceApi.syncPerformanceSummaryKpis();
        }
      }`,
);

// 6) After STATS_DETAIL_PRODUCT_ROWS - declare api holder
html = html.replace(
  "      const STATS_DETAIL_PRODUCT_ROWS = [",
  `      let statsPerformanceApi = null;

      const STATS_DETAIL_PRODUCT_ROWS = [`,
);

// 7) Load stats-performance.js before main script; init at end of main script
html = html.replace("    <script>\n", '    <script src="stats-performance.js"></script>\n    <script>\n');

html = html.replace(
  "      updateAvvConsentUI();\n    </script>",
  `      updateAvvConsentUI();

      if (typeof initStatsPerformanceModule === "function") {
        statsPerformanceApi = initStatsPerformanceModule({
          getCellValue,
          getStandorte: () => (Array.isArray(SUBTENANT_STANDORTE) ? SUBTENANT_STANDORTE : []),
          getMitarbeiterLabels: getAllMitarbeiterLabelsAcrossStandorte,
          getLeadBedarfProducts: () => STATS_DETAIL_PRODUCT_ROWS.slice(),
        });
        statsPerformanceApi.boot();
      }
    </script>`,
);

// 8) Refresh perf lists when standorte rebuild
html = html.replace(
  "        populateStatsStandortSelects();\n      }",
  `        populateStatsStandortSelects();
        if (statsPerformanceApi?.refreshPerformanceTenantLists) {
          statsPerformanceApi.refreshPerformanceTenantLists();
        }
      }`,
);

fs.writeFileSync(indexPath, html.replace(/\n/g, "\r\n"));

// Validate main script still parses
const h = fs.readFileSync(indexPath, "utf8");
const s = h.indexOf("<script>");
const e = h.indexOf("</script>", s);
const main = h.slice(s + 8, e);
try {
  new Function(main);
  console.log("OK: integrated, lines", h.split("\n").length);
} catch (err) {
  console.error("Main script parse failed:", err.message);
  process.exit(1);
}
