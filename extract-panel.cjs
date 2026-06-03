const fs = require("fs");
const lines = fs
  .readFileSync("C:/Users/VP/.cursor/projects/empty-window/index.html", "utf8")
  .split("\n");
const slice = lines.slice(6535, 6775).join("\n");
let panel = slice;
panel = panel
  .replace(/class="stats-tab-panel"/, 'class="stats-panel"')
  .replace(/ hidden/g, "")
  .replace(/stats-kpi-grid cols-3/g, "stats-kpi-row stats-kpi-row--perf")
  .replace(
    /<p class="stats-kpi-value"([^>]*)>([^<]*)<\/p>\s*<p class="stats-kpi-label"([^>]*)>([^<]*)<\/p>/g,
    '<span class="stats-kpi-value"$1>$2</span><span class="stats-kpi-label"$3>$4</span>',
  )
  .replace(/Nach Gebiet/g, "Nach Standort")
  .replace(/Gebiet →/g, "Standort →")
  .replace(/data-perf-view="gebiet"/g, 'data-perf-view="standort"');

const shell = `<div
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
                <div class="stat-inner-body stat-inner-body--performance">
`;

panel = panel.replace(
  /<div id="statsPanelPerformance" class="stats-panel" role="tabpanel">/,
  shell,
);
panel = `${panel}
                </div>
              </div>
            </div>`;

fs.writeFileSync("stats-performance-panel.fragment.html", panel);
console.log("lines", panel.split("\n").length, "metrics", panel.split('data-perf-metric="').length - 1);
