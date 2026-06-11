(function (global) {
  "use strict";

  function initStatsPerformanceModule(deps) {
    const getCellValue = deps.getCellValue;
    const getStandorte = deps.getStandorte;
    const getMitarbeiterLabels = deps.getMitarbeiterLabels;
    const getLeadBedarfProducts = deps.getLeadBedarfProducts;
    const getReklamationRecords = deps.getReklamationRecords || (() => []);
    const getStandortSelection = deps.getStandortSelection || (() => ({ isAll: true, selected: [] }));
    const getActiveStandorte = deps.getActiveStandorte || (() => getStandorte().filter(Boolean));

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

    const PERF_METRIC_META = {
            conversion: { column: "Umwandlungsquoten", fill: "blue" },
            complaints: { column: "Reklamation", fill: "blue" },
            investment: { column: "Investition", fill: "green" },
            handlingTime: { column: "Gesamtbearbeitungszeit", fill: "blue" },
            timeToContact: { column: "Reaktionszeit", fill: "blue" },
            responseRate: { column: "Kontaktquote", fill: "blue" },
          };

          const PERF_SUMMARY_METRICS = [
            ["conversion", "perfKpiConversion"],
            ["complaints", "perfKpiComplaints"],
            ["investment", "perfKpiInvestment"],
            ["timeToContact", "perfKpiTimeToContact"],
            ["responseRate", "perfKpiResponseRate"],
            ["handlingTime", "perfKpiHandlingTime"],
          ];

          const COMBO_FILTER_NONE = "__NONE__";

          const PERF_BASE_DATA = {
            conversion: {
              produkt: {
                flat: {
                  "Stationäre Pflege": 40.8,
                  "Std. Betreuung": 34.6,
                  "Betreutes Wohnen": 30.2,
                  Haushaltshilfe: 35.5,
                  Unbekannt: 26.8,
                  Bewerbung: 31.4,
                },
              },
              standort: {
                flat: { "newcare home Hasbergen": 38.2, "newcare home Till": 31.8, "Kein Standort": 28.6 },
                nested: {
                  "newcare home Hasbergen": { "Stationäre Pflege": 42.0, "Std. Betreuung": 35.5 },
                  "newcare home Till": { "Betreutes Wohnen": 29.4, Haushaltshilfe: 34.1 },
                  "Kein Standort": { Unbekannt: 26.2 },
                },
              },
              mitarbeiter: {
                flat: { "Jakob Kuntz": 36.7, "Jonas Markus": 34.2, "Lea Schneider": 30.9 },
                nested: {
                  "Jakob Kuntz": { "Stationäre Pflege": 40.2, "Std. Betreuung": 33.8 },
                  "Jonas Markus": { "Betreutes Wohnen": 31.5, Haushaltshilfe: 37.0 },
                  "Lea Schneider": { Unbekannt: 27.4, Bewerbung: 32.1 },
                },
              },
            },
            complaints: {
              produkt: {
                flat: {
                  "Stationäre Pflege": 1.4,
                  "Std. Betreuung": 1.9,
                  "Betreutes Wohnen": 2.5,
                  Haushaltshilfe: 1.8,
                  Unbekannt: 2.8,
                  Bewerbung: 2.0,
                },
              },
              standort: {
                flat: { "newcare home Hasbergen": 1.6, "newcare home Till": 2.3, "Kein Standort": 2.4 },
                nested: {
                  "newcare home Hasbergen": { "Stationäre Pflege": 1.2, "Std. Betreuung": 2.0 },
                  "newcare home Till": { "Betreutes Wohnen": 2.8, Haushaltshilfe: 1.9 },
                  "Kein Standort": { Unbekannt: 2.7 },
                },
              },
              mitarbeiter: {
                flat: { "Jakob Kuntz": 1.5, "Jonas Markus": 2.0, "Lea Schneider": 2.5 },
                nested: {
                  "Jakob Kuntz": { "Stationäre Pflege": 1.1, "Std. Betreuung": 1.8 },
                  "Jonas Markus": { "Betreutes Wohnen": 2.2, Haushaltshilfe: 1.7 },
                  "Lea Schneider": { Unbekannt: 2.9, Bewerbung: 2.1 },
                },
              },
            },
            investment: {
              produkt: {
                flat: {
                  "Stationäre Pflege": 258,
                  "Std. Betreuung": 281,
                  "Betreutes Wohnen": 300,
                  Haushaltshilfe: 276,
                  Unbekannt: 315,
                  Bewerbung: 289,
                },
              },
              standort: {
                flat: { "newcare home Hasbergen": 265, "newcare home Till": 292, "Kein Standort": 298 },
                nested: {
                  "newcare home Hasbergen": { "Stationäre Pflege": 248, "Std. Betreuung": 279 },
                  "newcare home Till": { "Betreutes Wohnen": 305, Haushaltshilfe: 278 },
                  "Kein Standort": { Unbekannt: 312 },
                },
              },
              mitarbeiter: {
                flat: { "Jakob Kuntz": 271, "Jonas Markus": 288, "Lea Schneider": 301 },
                nested: {
                  "Jakob Kuntz": { "Stationäre Pflege": 255, "Std. Betreuung": 284 },
                  "Jonas Markus": { "Betreutes Wohnen": 296, Haushaltshilfe: 275 },
                  "Lea Schneider": { Unbekannt: 318, Bewerbung: 289 },
                },
              },
            },
          };

          const PERF_PERIOD_DATA = {
            gesamt: PERF_BASE_DATA,
            "30d": PERF_BASE_DATA,
            "60d": PERF_BASE_DATA,
            day: null,
            "7d": null,
          };

          const PERF_HIERARCHY_LEVELS = {
            "standort-mitarbeiter": { label: "1 — Standort → Mitarbeiter", short: "Standort → Mitarbeiter" },
            "standort-mitarbeiter-produkt": {
              label: "2 — Standort → Mitarbeiter → Produkt",
              short: "Standort → Mitarbeiter → Produkt",
            },
            "standort-produkt": { label: "3 — Standort → Produkt (ohne Mitarbeiter)", short: "Standort → Produkt" },
          };

          const DEMO_GEBIET_EMPLOYEE_STATS = [
            {
              standort: "newcare home Hasbergen",
              mitarbeiter: "Jakob Kuntz",
              conversion: { standort: 38.2, employee: 39.5, produkt: { "Stationäre Pflege": 42.0, "Std. Betreuung": 33.8 } },
              complaints: { standort: 1.6, employee: 1.4, produkt: { "Stationäre Pflege": 1.1, "Std. Betreuung": 1.8 } },
              investment: { standort: 265, employee: 258, produkt: { "Stationäre Pflege": 255, "Std. Betreuung": 284 } },
            },
            {
              standort: "newcare home Hasbergen",
              mitarbeiter: "Jonas Markus",
              conversion: { standort: 38.2, employee: 37.2, produkt: { Haushaltshilfe: 37.0, "Betreutes Wohnen": 36.5 } },
              complaints: { standort: 1.6, employee: 1.7, produkt: { Haushaltshilfe: 1.7, "Betreutes Wohnen": 1.5 } },
              investment: { standort: 265, employee: 272, produkt: { Haushaltshilfe: 275, "Betreutes Wohnen": 268 } },
            },
            {
              standort: "newcare home Moyland",
              mitarbeiter: "Marie Becker",
              conversion: { standort: 33.5, employee: 34.8, produkt: { "Betreutes Wohnen": 35.2, Kurzzeitpflege: 32.1 } },
              complaints: { standort: 2.0, employee: 1.9, produkt: { "Betreutes Wohnen": 2.1, Kurzzeitpflege: 1.7 } },
              investment: { standort: 278, employee: 271, produkt: { "Betreutes Wohnen": 268, Kurzzeitpflege: 282 } },
            },
            {
              standort: "newcare home Moyland",
              mitarbeiter: "Tim Wagner",
              conversion: { standort: 33.5, employee: 32.1, produkt: { Tagespflege: 31.4, Haushaltshilfe: 33.0 } },
              complaints: { standort: 2.0, employee: 2.1, produkt: { Tagespflege: 2.2, Haushaltshilfe: 1.9 } },
              investment: { standort: 278, employee: 285, produkt: { Tagespflege: 288, Haushaltshilfe: 279 } },
            },
            {
              standort: "newcare home Vellmar",
              mitarbeiter: "Sara Hoffmann",
              conversion: { standort: 29.8, employee: 31.2, produkt: { "Std. Betreuung": 32.0, Pflegedienst: 29.8 } },
              complaints: { standort: 2.2, employee: 2.0, produkt: { "Std. Betreuung": 1.9, Pflegedienst: 2.1 } },
              investment: { standort: 288, employee: 295, produkt: { "Std. Betreuung": 292, Pflegedienst: 301 } },
            },
            {
              standort: "newcare home Vellmar",
              mitarbeiter: "Felix Braun",
              conversion: { standort: 29.8, employee: 28.4, produkt: { Bewerbung: 30.1, Haushaltshilfe: 26.8 } },
              complaints: { standort: 2.2, employee: 2.3, produkt: { Bewerbung: 2.4, Haushaltshilfe: 2.1 } },
              investment: { standort: 288, employee: 302, produkt: { Bewerbung: 305, Haushaltshilfe: 296 } },
            },
            {
              standort: "Kein Standort",
              mitarbeiter: "Lea Schneider",
              conversion: { standort: 28.6, employee: 30.9, produkt: { Bewerbung: 32.1, Unbekannt: 27.4 } },
              complaints: { standort: 2.4, employee: 2.5, produkt: { Bewerbung: 2.1, Unbekannt: 2.9 } },
              investment: { standort: 298, employee: 301, produkt: { Bewerbung: 289, Unbekannt: 318 } },
            },
          ];

          /** Gebiete ohne Mitarbeiter — Gebiet-Durchschnitt inkl. zugehöriger Produkte. */
          const DEMO_GEBIET_ONLY_STATS = [
            {
              standort: "newcare home Radevormwald",
              conversion: {
                standort: 27.4,
                produkt: { Bewerbung: 30.1, "24 Stunden Betreuung": 26.5, "Betreutes Wohnen": 28.2 },
              },
              complaints: {
                standort: 2.6,
                produkt: { Bewerbung: 2.5, "24 Stunden Betreuung": 2.2, "Betreutes Wohnen": 2.7 },
              },
              investment: {
                standort: 305,
                produkt: { Bewerbung: 302, "24 Stunden Betreuung": 310, "Betreutes Wohnen": 298 },
              },
            },
            {
              standort: "newcare home Till",
              conversion: {
                standort: 31.8,
                produkt: { "Betreutes Wohnen": 31.5, Haushaltshilfe: 34.1, "Ambulante Pflege": 30.4 },
              },
              complaints: {
                standort: 2.3,
                produkt: { "Betreutes Wohnen": 2.2, Haushaltshilfe: 1.9, "Ambulante Pflege": 2.4 },
              },
              investment: {
                standort: 292,
                produkt: { "Betreutes Wohnen": 296, Haushaltshilfe: 278, "Ambulante Pflege": 288 },
              },
            },
            {
              standort: "newcare home Fritzlar",
              conversion: {
                standort: 36.1,
                produkt: { "Std. Betreuung": 38.0, Pflegedienst: 34.2, Kurzzeitpflege: 35.5 },
              },
              complaints: {
                standort: 1.8,
                produkt: { "Std. Betreuung": 1.5, Pflegedienst: 1.9, Kurzzeitpflege: 1.7 },
              },
              investment: {
                standort: 272,
                produkt: { "Std. Betreuung": 260, Pflegedienst: 279, Kurzzeitpflege: 268 },
              },
            },
          ];

          function buildPerfHierarchyForMetric(metricKey) {
            const tree = {};
            DEMO_GEBIET_EMPLOYEE_STATS.forEach((entry) => {
              const stats = entry[metricKey];
              if (!tree[entry.standort]) {
                tree[entry.standort] = {
                  value: stats.standort,
                  mitarbeiter: {},
                  produkt: {},
                };
              }
              tree[entry.standort].mitarbeiter[entry.mitarbeiter] = {
                value: stats.employee,
                produkt: { ...stats.produkt },
              };
              Object.entries(stats.produkt).forEach(([product, value]) => {
                if (tree[entry.standort].produkt[product] == null) {
                  tree[entry.standort].produkt[product] = value;
                }
              });
            });
            DEMO_GEBIET_ONLY_STATS.forEach((entry) => {
              if (tree[entry.standort]) return;
              const stats = entry[metricKey];
              tree[entry.standort] = {
                value: stats.standort,
                mitarbeiter: {},
                produkt: { ...stats.produkt },
              };
            });
            return tree;
          }

          const PERF_HIERARCHY_BASE = {
            conversion: buildPerfHierarchyForMetric("conversion"),
            complaints: buildPerfHierarchyForMetric("complaints"),
            investment: buildPerfHierarchyForMetric("investment"),
          };

          const PERF_HIERARCHY_PERIOD = {
            gesamt: PERF_HIERARCHY_BASE,
            "30d": PERF_HIERARCHY_BASE,
            "60d": PERF_HIERARCHY_BASE,
            day: null,
            "7d": null,
          };

          function fallbackProductMetric(metricKey, index) {
            const samples = {
              conversion: [12.4, 18.6, 22.2, 25.5, 27.4, 28.4, 29.0, 26.8, 24.0, 19.8, 21.5, 23.2, 17.6, 20.0, 14.1],
              complaints: [5.4, 6.9, 7.5, 6.8, 8.0, 7.3, 9.6, 8.8, 5.5, 7.2, 6.7, 7.1, 8.4, 6.9, 7.0],
              investment: [420, 1280, 2100, 3760, 4890, 5520, 6100, 7450, 8200, 9100, 2400, 1850, 6900, 3300, 5100],
            };
            const list = samples[metricKey] || samples.conversion;
            return list[index % list.length];
          }

          function collectTenantProduktCatalog(metric, period) {
            const products = new Set(LEAD_BEDARF_PRODUCTS);
            const addKeys = (keys) => keys.forEach((key) => products.add(key));
            addKeys(getDimensionKeys(metric, period, "produkt"));
            const tree = getPerfHierarchy(metric, period) || PERF_HIERARCHY_BASE[metric] || {};
            Object.values(tree).forEach((node) => {
              addKeys(Object.keys(node.produkt || {}));
              Object.values(node.mitarbeiter || {}).forEach((maNode) => {
                addKeys(Object.keys(maNode.produkt || {}));
              });
            });
            const nested = getPerfMetricData(metric, period)?.mitarbeiter?.nested;
            if (nested) {
              Object.values(nested).forEach((entry) => addKeys(Object.keys(entry)));
            }
            return Array.from(products).sort((a, b) => a.localeCompare(b, "de"));
          }

          function syncPerfBaseDataFromDemo() {
            ["conversion", "complaints", "investment"].forEach((metricKey) => {
              const standortFlat = {};
              const standortNested = {};
              const mitarbeiterFlat = {};
              const mitarbeiterNested = {};
              const produktFlat = {};
              DEMO_GEBIET_EMPLOYEE_STATS.forEach((entry) => {
                const stats = entry[metricKey];
                standortFlat[entry.standort] = stats.standort;
                standortNested[entry.standort] = { ...stats.produkt };
                mitarbeiterFlat[entry.mitarbeiter] = stats.employee;
                mitarbeiterNested[entry.mitarbeiter] = { ...stats.produkt };
                Object.entries(stats.produkt).forEach(([product, value]) => {
                  if (produktFlat[product] === undefined) produktFlat[product] = value;
                });
              });
              DEMO_GEBIET_ONLY_STATS.forEach((entry) => {
                const stats = entry[metricKey];
                if (standortFlat[entry.standort] == null) standortFlat[entry.standort] = stats.standort;
                standortNested[entry.standort] = { ...stats.produkt };
              });
              collectTenantProduktCatalog(metricKey, "gesamt").forEach((product, index) => {
                if (produktFlat[product] == null) {
                  produktFlat[product] = fallbackProductMetric(metricKey, index);
                }
              });
              PERF_BASE_DATA[metricKey].standort.flat = standortFlat;
              PERF_BASE_DATA[metricKey].standort.nested = standortNested;
              PERF_BASE_DATA[metricKey].mitarbeiter.flat = mitarbeiterFlat;
              PERF_BASE_DATA[metricKey].mitarbeiter.nested = mitarbeiterNested;
              PERF_BASE_DATA[metricKey].produkt.flat = produktFlat;
            });
          }

          try {
            syncPerfBaseDataFromDemo();
          } catch (perfSyncError) {
            console.error("Performance demo data sync failed:", perfSyncError);
          }

          const perfSegmentState = new WeakMap();

          // Whether a higher value is an improvement (drives delta colour).
          const PERF_METRIC_HIGHER_IS_BETTER = {
            conversion: true,
            responseRate: true,
            complaints: false,
            investment: false,
            timeToContact: false,
            handlingTime: false,
          };

          // Shared period/comparison engine (see stats-period-controls.js). Owns the
          // preset/custom period state, resolved ranges, Vergleichen toggle and the
          // deterministic range scale factor — identical behavior on both stats panels.
          const perfPeriodCtl = global.StatsPeriodControls.create({
            panelSelector: "#statsPanelPerformance",
            tabSelector: ".stats-perf-period-tab",
            periodDatasetKey: "perfPeriod",
            dataStartIso: "2026-01-01",
            periodToMaxDays: (period) => periodToMaxDays(period),
            ids: {
              rangeValue: "perfRangeValue",
              customRange: "perfCustomRange",
              customVon: "perfCustomVon",
              customBis: "perfCustomBis",
              customApply: "perfCustomApply",
              customError: "perfCustomError",
              compareToggle: "perfCompareToggle",
              compareOptions: "perfCompareOptions",
              compareModeName: "perfCompareMode",
              compareCustom: "perfCompareCustom",
              compareVon: "perfCompareVon",
              compareBis: "perfCompareBis",
              compareApply: "perfCompareApply",
              compareError: "perfCompareError",
              compareRangeValue: "perfCompareRangeValue",
            },
            onChange: () => syncPerformanceSummaryKpis(),
          });
          const perfRangeState = perfPeriodCtl.state;

          function getPerformancePeriod() {
            return perfPeriodCtl.getPeriod();
          }

          function getResolvedPerfRange() {
            return perfPeriodCtl.getResolvedRange();
          }

          function getResolvedCompareRange() {
            return perfPeriodCtl.getResolvedCompareRange();
          }

          function perfRangeScaleFactor(range, metric) {
            return perfPeriodCtl.scaleFactor(range, metric);
          }

          function getPerformancePeriodLabel() {
            return perfPeriodCtl.getRangeLabel();
          }

          function updatePerfRangeLine() {
            perfPeriodCtl.updateRangeLine();
          }

          function initPerformancePeriodTabs() {
            perfPeriodCtl.initTabs();
          }

          function initPerformancePeriodControls() {
            perfPeriodCtl.initControls();
          }

          function resetPerformanceControls() {
            perfPeriodCtl.reset();
          }

          const PERF_EXPORT_LEVEL = "standort-mitarbeiter-produkt";

          function getPerfFullBreakdownRows(metric, period) {
            return filterPerfDisplayRows(
              getHierarchyRows(metric, period, PERF_EXPORT_LEVEL, {}, "detail", []),
            );
          }

          function perfExportRowFields(row) {
            let standort = "";
            let mitarbeiter = "";
            let produkt = "";
            if (row.kind === "standort") {
              standort = row.label || row.path || "";
            } else if (row.kind === "mitarbeiter") {
              standort = row.parent || "";
              mitarbeiter = row.label || row.path || "";
            } else if (row.kind === "produkt") {
              if (row.depth === 2) {
                standort = row.standort || "";
                mitarbeiter = row.parent || "";
                produkt = row.label || "";
              } else {
                standort = row.parent || "";
                produkt = row.label || "";
              }
            }
            const ebene =
              row.kind === "standort" ? "Standort" : row.kind === "mitarbeiter" ? "Mitarbeiter" : "Produkt";
            return { ebene, standort, mitarbeiter, produkt };
          }

          function formatPerfCsvRawValue(metric, value) {
            if (value == null || Number.isNaN(value)) return "";
            if (metric === "investment") return String(Math.round(value));
            if (metric === "handlingTime" || metric === "timeToContact") {
              return value.toFixed(1).replace(".", ",");
            }
            return value.toFixed(2).replace(".", ",");
          }

          function perfMetricUnit(metric) {
            if (metric === "investment") return "EUR";
            if (metric === "handlingTime" || metric === "timeToContact") return "Std.";
            return "%";
          }

          function escapeCsvField(value) {
            const text = String(value ?? "");
            if (/[;"\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
            return text;
          }

          function buildPerfSegmentCsv(metric, period) {
            const meta = PERF_METRIC_META[metric];
            const title = perfMetricDisplayTitle(metric);
            const periodLabel = getPerformancePeriodLabel();
            const unit = perfMetricUnit(metric);
            const header = ["Ebene", "Standort", "Mitarbeiter", "Produkt", meta?.column || "Wert", "Einheit"];
            const lines = [
              `Bericht;${escapeCsvField(title)}`,
              `Zeitraum;${escapeCsvField(periodLabel)}`,
              `Aufschlüsselung;Standort → Mitarbeiter → Produkt (vollständig)`,
              "",
              header.map(escapeCsvField).join(";"),
            ];
            getPerfFullBreakdownRows(metric, period).forEach((row) => {
              const { ebene, standort, mitarbeiter, produkt } = perfExportRowFields(row);
              lines.push(
                [
                  ebene,
                  standort,
                  mitarbeiter,
                  produkt,
                  formatPerfCsvRawValue(metric, row.value),
                  unit,
                ]
                  .map(escapeCsvField)
                  .join(";"),
              );
            });
            return `\uFEFF${lines.join("\r\n")}`;
          }

          function downloadTextFile(filename, content, mimeType) {
            try {
              const blob = new Blob([content], { type: mimeType });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = filename;
              link.rel = "noopener";
              link.style.display = "none";
              document.body.appendChild(link);
              link.click();
              window.setTimeout(() => {
                link.remove();
                URL.revokeObjectURL(url);
              }, 200);
            } catch (downloadError) {
              console.error("CSV-Export fehlgeschlagen:", downloadError);
              window.alert(
                "Export fehlgeschlagen. Bitte die Seite über http://localhost:5173/ öffnen (npm run start:clickdummy).",
              );
            }
          }

          function perfSegmentExportFilename(metric, period) {
            const title = perfMetricDisplayTitle(metric);
            const slug = title
              .toLowerCase()
              .replace(/ä/g, "ae")
              .replace(/ö/g, "oe")
              .replace(/ü/g, "ue")
              .replace(/ß/g, "ss")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
            return `${slug || metric}-${period}.csv`;
          }

          function perfMetricDisplayTitle(metric) {
            const fromSegment = document
              .querySelector(
                `.stats-perf-segment[data-perf-metric="${metric}"] .stats-perf-panel-title`,
              )
              ?.textContent?.trim();
            if (fromSegment) return fromSegment;
            const fromKpi = document
              .querySelector(
                `.stats-perf-kpi-card[data-perf-metric="${metric}"] .stats-perf-kpi-title`,
              )
              ?.textContent?.trim();
            return fromKpi || PERF_METRIC_META[metric]?.column || metric;
          }

          function buildPerfSegmentSheetAoA(metric, period) {
            const meta = PERF_METRIC_META[metric];
            const title = perfMetricDisplayTitle(metric);
            const periodLabel = getPerformancePeriodLabel();
            const unit = perfMetricUnit(metric);
            const header = [
              "Ebene",
              "Standort",
              "Mitarbeiter",
              "Produkt",
              meta?.column || "Wert",
              "Einheit",
            ];
            const rows = [
              ["Bericht", title],
              ["Zeitraum", periodLabel],
              ["Aufschlüsselung", "Standort → Mitarbeiter → Produkt (vollständig)"],
              [],
              header,
            ];
            getPerfFullBreakdownRows(metric, period).forEach((row) => {
              const { ebene, standort, mitarbeiter, produkt } = perfExportRowFields(row);
              rows.push([
                ebene,
                standort,
                mitarbeiter,
                produkt,
                formatPerfCsvRawValue(metric, row.value),
                unit,
              ]);
            });
            return rows;
          }

          function perfWorkbookSheetName(metric, usedNames) {
            let name = perfMetricDisplayTitle(metric)
              .replace(/[:\\/?*[\]]/g, " ")
              .trim()
              .slice(0, 31);
            if (!name) name = String(metric).slice(0, 31);
            let candidate = name;
            let n = 2;
            while (usedNames.has(candidate.toLowerCase())) {
              const suffix = ` (${n})`;
              candidate = `${name.slice(0, Math.max(1, 31 - suffix.length))}${suffix}`;
              n += 1;
            }
            usedNames.add(candidate.toLowerCase());
            return candidate;
          }

          function perfConsolidatedExportFilename(period, extension = "csv") {
            const periodLabel = getPerformancePeriodLabel();
            const slug = periodLabel
              .toLowerCase()
              .replace(/ä/g, "ae")
              .replace(/ö/g, "oe")
              .replace(/ü/g, "ue")
              .replace(/ß/g, "ss")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
            return `performance-kpis-${slug || period}.${extension}`;
          }

          function buildPerfConsolidatedCsv(period) {
            const blocks = [];
            PERF_CONSOLIDATED_EXPORT_METRICS.forEach((metric) => {
              if (!getPerfFullBreakdownRows(metric, period).length) return;
              const title = perfMetricDisplayTitle(metric);
              const segmentCsv = buildPerfSegmentCsv(metric, period).replace(/^\uFEFF/, "");
              blocks.push(`=== ${title} ===\r\n${segmentCsv}`);
            });
            return `\uFEFF${blocks.join("\r\n\r\n")}`;
          }

          function buildPerfConsolidatedWorkbook(period, metrics) {
            const wb = XLSX.utils.book_new();
            const usedNames = new Set();
            metrics.forEach((metric) => {
              const ws = XLSX.utils.aoa_to_sheet(buildPerfSegmentSheetAoA(metric, period));
              XLSX.utils.book_append_sheet(wb, ws, perfWorkbookSheetName(metric, usedNames));
            });
            return wb;
          }

          function downloadBinaryFile(filename, buffer, mimeType) {
            try {
              const blob = new Blob([buffer], { type: mimeType });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = filename;
              link.rel = "noopener";
              link.style.display = "none";
              document.body.appendChild(link);
              link.click();
              window.setTimeout(() => {
                link.remove();
                URL.revokeObjectURL(url);
              }, 200);
            } catch (downloadError) {
              console.error("Excel-Export fehlgeschlagen:", downloadError);
              window.alert(
                "Export fehlgeschlagen. Bitte die Seite über http://localhost:5173/ öffnen (npm run start:clickdummy).",
              );
            }
          }

          const PERF_CONSOLIDATED_EXPORT_METRICS = [
            "conversion",
            "complaints",
            "investment",
            "timeToContact",
            "responseRate",
            "handlingTime",
          ];

          function exportPerformanceConsolidatedCsv() {
            const period = getPerformancePeriod();
            const metricsWithData = PERF_CONSOLIDATED_EXPORT_METRICS.filter((metric) =>
              getPerfFullBreakdownRows(metric, period).length,
            );
            if (!metricsWithData.length) {
              window.alert("Keine Daten für den gewählten Zeitraum zum Exportieren.");
              return;
            }
            if (typeof XLSX !== "undefined" && XLSX.utils?.book_new && XLSX.write) {
              const wb = buildPerfConsolidatedWorkbook(period, metricsWithData);
              const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
              downloadBinaryFile(
                perfConsolidatedExportFilename(period, "xlsx"),
                buffer,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              );
              return;
            }
            const csv = buildPerfConsolidatedCsv(period);
            downloadTextFile(
              perfConsolidatedExportFilename(period, "csv"),
              csv,
              "text/csv;charset=utf-8",
            );
          }

          function ensureConsolidatedExportButton() {
            const panel = document.getElementById("statsPanelPerformance");
            const card = panel?.querySelector(".stats-card-performance");
            if (!card) return;
            panel
              ?.querySelector(
                ".stat-inner-head-toolbar .stats-perf-consolidated-export-btn, .stat-inner-head-toolbar .stats-perf-head-export",
              )
              ?.closest(".stats-perf-export-toggle, .stats-perf-head-export")
              ?.remove();
            if (card.querySelector(".stats-perf-consolidated-export-anchor")) return;
            const anchor = document.createElement("div");
            anchor.className = "stats-perf-consolidated-export-anchor";
            anchor.innerHTML = `<div class="stats-perf-viz-toggle stats-perf-export-toggle" role="group" aria-label="Gesamtexport">
                <button type="button" class="stats-perf-viz-btn stats-perf-export-btn stats-perf-consolidated-export-btn is-active" title="Alle Performance-KPIs als Excel exportieren (je KPI ein Tabellenblatt)" aria-label="Alle Performance-KPIs als Excel exportieren (je KPI ein Tabellenblatt)">
                  <i class="fa-solid fa-download" aria-hidden="true"></i>
                </button>
              </div>`;
            card.appendChild(anchor);
            anchor
              .querySelector(".stats-perf-consolidated-export-btn")
              ?.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                exportPerformanceConsolidatedCsv();
              });
          }

          function ensurePerfExportBar(segment) {
            const body = segment.querySelector(".stats-panel-body");
            if (!body) return null;
            let bar = body.querySelector(".stats-perf-export-bar");
            if (!bar) {
              bar = document.createElement("div");
              bar.className = "stats-perf-export-bar";
              bar.innerHTML = `<div class="stats-perf-viz-toggle stats-perf-export-toggle" role="group" aria-label="Export">
                  <button type="button" class="stats-perf-viz-btn stats-perf-export-btn is-active" title="Als CSV exportieren (vollständige Aufschlüsselung)" aria-label="Als CSV exportieren (vollständige Aufschlüsselung)">
                    <i class="fa-solid fa-download" aria-hidden="true"></i>
                  </button>
                </div>`;
              body.appendChild(bar);
              bar.querySelector(".stats-perf-export-btn")?.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                exportPerformanceSegmentCsv(segment);
              });
            }
            return bar;
          }

          function exportPerformanceSegmentCsv(segment) {
            const metric = segment?.dataset?.perfMetric;
            if (!metric) return;
            const period = getPerformancePeriod();
            const rows = getPerfFullBreakdownRows(metric, period);
            if (!rows.length) {
              window.alert("Keine Daten für den gewählten Zeitraum zum Exportieren.");
              return;
            }
            const csv = buildPerfSegmentCsv(metric, period);
            downloadTextFile(perfSegmentExportFilename(metric, period), csv, "text/csv;charset=utf-8");
          }

          
          function perfParseAnfrageDatum(text) {
            const match = String(text || "")
              .trim()
              .match(/(\d{2})\.(\d{2})\.(\d{4})(?:,\s*(\d{1,2}):(\d{2}))?/);
            if (!match) return null;
            const day = Number(match[1]);
            const month = Number(match[2]) - 1;
            const year = Number(match[3]);
            const hours = match[4] != null ? Number(match[4]) : 0;
            const minutes = match[5] != null ? Number(match[5]) : 0;
            const date = new Date(year, month, day, hours, minutes);
            return Number.isNaN(date.getTime()) ? null : date;
          }
    function periodToMaxDays(period) {
            if (period === "day") return 1;
            if (period === "7d") return 7;
            if (period === "30d") return 30;
            if (period === "60d") return 60;
            return null;
          }

          function getLeadsInPerformancePeriod(period) {
            const rows = Array.from(document.querySelectorAll("#leadBody tr.lead-row"));
            let filtered;
            if (period === "custom") {
              const range = getResolvedPerfRange();
              const startMs = new Date(range.start).setHours(0, 0, 0, 0);
              const endMs = new Date(range.end).setHours(23, 59, 59, 999);
              filtered = rows.filter((row) => {
                const date = perfParseAnfrageDatum(getCellValue(row, "anfrageDatum"));
                if (!date) return false;
                const t = date.getTime();
                return t >= startMs && t <= endMs;
              });
            } else {
              const maxDays = periodToMaxDays(period);
              filtered = maxDays == null ? rows : rows.filter((row) => {
                const date = perfParseAnfrageDatum(getCellValue(row, "anfrageDatum"));
                if (!date) return false;
                const end = new Date();
                end.setHours(23, 59, 59, 999);
                const diffDays = (end.getTime() - date.getTime()) / 86400000;
                return diffDays >= 0 && diffDays <= maxDays;
              });
            }
            const { isAll } = getStandortSelection();
            if (!isAll) {
              const active = new Set(getActiveStandorte().filter(Boolean));
              filtered = filtered.filter((row) => active.has(getCellValue(row, "standort")));
            }
            return filtered;
          }

          function isLeadWonStatus(status) {
            return String(status || "").trim() === "Gewonnen";
          }

          function isLeadComplaintStatus(status) {
            const value = String(status || "").trim();
            return value.includes("Reklamation");
          }

          function isLeadSuccessfulComplaintStatus(status) {
            return String(status || "").trim() === SUCCESSFUL_COMPLAINT_STATUS;
          }

          function isLeadRejectedComplaintStatus(status) {
            return String(status || "").trim() === REJECTED_COMPLAINT_STATUS;
          }

          function isLeadExcludedFromConversionDenominator(status) {
            return isLeadSuccessfulComplaintStatus(status);
          }

          /** All leads that incur lead cost (excludes successful complaints with no charge). */
          function leadsEligibleForInvestmentSpend(leads) {
            return leads.filter((row) => !isLeadSuccessfulComplaintStatus(getLeadRowStatus(row)));
          }

          function getLeadRowStatus(row) {
            return (row?.dataset?.status || getCellValue(row, "status") || "").trim();
          }

          function leadPriceForProduct(bedarf, ref) {
            const seed = hashLabelSeed(`${String(bedarf || "").trim()}|${ref || ""}`);
            const pick = (min, max) => min + (seed % (max - min + 1));
            const b = String(bedarf || "")
              .trim()
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            if (b.includes("hausnotruf")) return pick(10, 30);
            if (b.includes("sitzlift")) return pick(150, 200);
            if (b.includes("1:1") || b.includes("intensivpflege")) return pick(150, 200);
            if (
              b.includes("ambulant") ||
              b.includes("pflegedienst") ||
              b.includes("tagespflege") ||
              b.includes("haushaltshilfe") ||
              b.includes("std. betreuung")
            ) {
              return pick(40, 80);
            }
            if (
              b.includes("station") ||
              b.includes("betreut") ||
              b.includes("vollstation") ||
              b.includes("kurzzeit")
            ) {
              return pick(80, 140);
            }
            if (b.includes("unbekannt") || b === "-") return 50;
            return pick(40, 80);
          }

          function getLeadRowPrice(row) {
            const stored = row?.dataset?.leadCost ?? row?.dataset?.leadPrice;
            if (stored != null && stored !== "") {
              const parsed = parseInt(stored, 10);
              if (Number.isFinite(parsed)) return parsed;
            }
            return leadPriceForProduct(getCellValue(row, "bedarf"), getCellValue(row, "anfragenNummer"));
          }

          function ensureLeadRowPrice(row) {
            if (!row) return;
            if (row.dataset.leadCost != null && row.dataset.leadCost !== "") return;
            if (row.dataset.leadPrice != null && row.dataset.leadPrice !== "") return;
            const price = leadPriceForProduct(
              getCellValue(row, "bedarf"),
              getCellValue(row, "anfragenNummer"),
            );
            row.dataset.leadPrice = String(price);
            row.dataset.leadCost = String(price);
          }

          function getLeadAnfragenNummer(row) {
            return getCellValue(row, "anfragenNummer");
          }

          function getLeadCreatedTimeMs(row) {
            const date = perfParseAnfrageDatum(getCellValue(row, "anfrageDatum"));
            return date ? date.getTime() : null;
          }

          function getLeadFirstActionTimeMs(row) {
            const stored = row?.dataset?.firstActionAt ?? row?.dataset?.perfFirstActionMs;
            if (stored == null || stored === "") return null;
            const parsed = Number(stored);
            return Number.isFinite(parsed) ? parsed : null;
          }

          function getLeadClosedTimeMs(row) {
            const stored = row?.dataset?.closedAt ?? row?.dataset?.perfClosedMs;
            if (stored == null || stored === "") return null;
            const parsed = Number(stored);
            return Number.isFinite(parsed) ? parsed : null;
          }

          function getLeadStatusChangeCount(row) {
            const parsed = parseInt(row?.dataset?.perfStatusChangeCount || "0", 10);
            return Number.isFinite(parsed) ? parsed : 0;
          }

          function isLeadClosedOrWonStatus(status) {
            const value = String(status || "").trim();
            return value === "Geschlossen" || value === "Gewonnen";
          }

          function getReklamationRecordForLead(row) {
            const leadId = getLeadAnfragenNummer(row);
            if (!leadId) return null;
            return getReklamationRecords().find((record) => record.leadId === leadId) || null;
          }

          function isLeadSuccessfullyReklamiert(row) {
            const record = getReklamationRecordForLead(row);
            if (record) return record.outcome === "successful";
            return isLeadSuccessfulComplaintStatus(getLeadRowStatus(row));
          }

          function filterReklamationRecordsByPeriod(records, period) {
            const maxDays = periodToMaxDays(period);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            const { isAll } = getStandortSelection();
            const active = isAll ? null : new Set(getActiveStandorte().filter(Boolean));
            return records.filter((record) => {
              if (active && !active.has(record.standort)) return false;
              if (maxDays == null) return true;
              const diffDays = (end.getTime() - record.submittedAtMs) / 86400000;
              return diffDays >= 0 && diffDays <= maxDays;
            });
          }

          function getReklamationRecordsForLeadGroup(leads, period) {
            const leadIds = new Set(leads.map((row) => getLeadAnfragenNummer(row)).filter(Boolean));
            if (!leadIds.size) return [];
            return filterReklamationRecordsByPeriod(getReklamationRecords(), period).filter((record) =>
              leadIds.has(record.leadId),
            );
          }

          function averageNumericValues(values) {
            const nums = values.filter((value) => value != null && !Number.isNaN(value));
            if (!nums.length) return null;
            return nums.reduce((acc, value) => acc + value, 0) / nums.length;
          }

          function leadsEligibleForConversionMetric(leads) {
            return leads.filter((row) => !isLeadSuccessfullyReklamiert(row));
          }

          function randomItem(list) {
            if (!list.length) return "";
            return list[Math.floor(Math.random() * list.length)];
          }

          function hashLabelSeed(label) {
            let hash = 0;
            const text = String(label || "");
            for (let i = 0; i < text.length; i += 1) {
              hash = (hash * 31 + text.charCodeAt(i)) % 9973;
            }
            return hash;
          }

          /** Clickdummy: stable per-Standort demo values in realistic ranges. */
          function demoMetricValueForStandort(metric, standort) {
            const seed = hashLabelSeed(`${metric}::${standort}`);
            if (metric === "conversion") {
              return Math.round((10 + (seed % 201) / 10) * 10) / 10;
            }
            if (metric === "complaints") {
              return Math.round((5 + (seed % 51) / 10) * 10) / 10;
            }
            if (metric === "investment") {
              return 100 + (seed % 9901);
            }
            if (metric === "handlingTime") {
              return Math.round((4 + (seed % 681) / 10) * 10) / 10;
            }
            if (metric === "timeToContact") {
              return 15 + (seed % 166);
            }
            if (metric === "responseRate") {
              return Math.round((40 + (seed % 56)) * 10) / 10;
            }
            return null;
          }

          function computePerfSummaryKpiFromStandortBreakdown(metric, period, leadsOverride) {
            const leads = leadsOverride ?? getLeadsInPerformancePeriod(period);
            if (!leads.length) return null;
            return computeGroupMetricFromLeads(leads, metric, period);
          }

          function perfSparklineEndOfDay(date) {
            const d = new Date(date);
            d.setHours(23, 59, 59, 999);
            return d;
          }

          function perfSparklineStartOfDay(date) {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d;
          }

          function getPerfSparklineBuckets(period) {
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            const buckets = [];

            if (period === "day") {
              for (let i = 23; i >= 0; i -= 1) {
                const bucketEnd = new Date(end);
                bucketEnd.setHours(end.getHours() - i, 59, 59, 999);
                const bucketStart = new Date(bucketEnd);
                bucketStart.setHours(bucketEnd.getHours(), 0, 0, 0);
                buckets.push({
                  key: `h-${bucketStart.getTime()}`,
                  start: bucketStart,
                  end: bucketEnd,
                });
              }
              return buckets;
            }

            if (period === "7d") {
              for (let i = 6; i >= 0; i -= 1) {
                const bucketEnd = perfSparklineEndOfDay(new Date(end.getTime() - i * 86400000));
                const bucketStart = perfSparklineStartOfDay(new Date(bucketEnd));
                buckets.push({
                  key: `d-${bucketStart.getTime()}`,
                  start: bucketStart,
                  end: bucketEnd,
                });
              }
              return buckets;
            }

            if (period === "30d") {
              const weekCount = Math.ceil(30 / 7);
              for (let i = weekCount - 1; i >= 0; i -= 1) {
                const bucketEnd = perfSparklineEndOfDay(new Date(end.getTime() - i * 7 * 86400000));
                const bucketStart = perfSparklineStartOfDay(
                  new Date(bucketEnd.getTime() - 6 * 86400000),
                );
                buckets.push({
                  key: `w-${bucketStart.getTime()}`,
                  start: bucketStart,
                  end: bucketEnd,
                });
              }
              return buckets;
            }

            if (period === "60d") {
              const biweekCount = Math.ceil(60 / 14);
              for (let i = biweekCount - 1; i >= 0; i -= 1) {
                const bucketEnd = perfSparklineEndOfDay(new Date(end.getTime() - i * 14 * 86400000));
                const bucketStart = perfSparklineStartOfDay(
                  new Date(bucketEnd.getTime() - 13 * 86400000),
                );
                buckets.push({
                  key: `bw-${bucketStart.getTime()}`,
                  start: bucketStart,
                  end: bucketEnd,
                });
              }
              return buckets;
            }

            for (let i = 11; i >= 0; i -= 1) {
              const monthEnd = new Date(end.getFullYear(), end.getMonth() - i + 1, 0, 23, 59, 59, 999);
              const monthStart = new Date(monthEnd.getFullYear(), monthEnd.getMonth(), 1, 0, 0, 0, 0);
              buckets.push({
                key: `m-${monthStart.getTime()}`,
                start: monthStart,
                end: monthEnd,
              });
            }
            return buckets;
          }

          function filterLeadsToSparklineBucket(leads, start, end) {
            const startMs = start.getTime();
            const endMs = end.getTime();
            return leads.filter((row) => {
              const date = perfParseAnfrageDatum(getCellValue(row, "anfrageDatum"));
              if (!date) return false;
              const ms = date.getTime();
              return ms >= startMs && ms <= endMs;
            });
          }

          function computePerfKpiForSparklineBucket(metric, period, bucket) {
            const periodLeads = getLeadsInPerformancePeriod(period);
            const bucketLeads = filterLeadsToSparklineBucket(periodLeads, bucket.start, bucket.end);
            return computePerfSummaryKpiFromStandortBreakdown(metric, period, bucketLeads);
          }

          function fillSparklineSeries(values, fallback) {
            const out = [];
            let last = fallback;
            values.forEach((value) => {
              if (value != null && !Number.isNaN(value)) {
                last = value;
                out.push(value);
              } else if (last != null && !Number.isNaN(last)) {
                out.push(last);
              } else if (fallback != null && !Number.isNaN(fallback)) {
                out.push(fallback);
              }
            });
            return out;
          }

          function buildSparklinePath(values, width, height) {
            if (!values || values.length < 2) return "";
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min || 1;
            const padY = height * 0.12;
            return values
              .map((value, index) => {
                const x = (index / (values.length - 1)) * width;
                const y = padY + (1 - (value - min) / range) * (height - 2 * padY);
                return `${index ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
              })
              .join(" ");
          }

          function ensurePerfKpiSparklineSvg(card) {
            let svg = card.querySelector(".stats-perf-kpi-sparkline");
            if (!svg) {
              svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              svg.classList.add("stats-perf-kpi-sparkline");
              svg.setAttribute("aria-hidden", "true");
              svg.setAttribute("preserveAspectRatio", "none");
              const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
              path.classList.add("stats-perf-kpi-sparkline-line");
              path.setAttribute("fill", "none");
              path.setAttribute("stroke", "#dceef9");
              path.setAttribute("stroke-width", "1.5");
              path.setAttribute("vector-effect", "non-scaling-stroke");
              svg.appendChild(path);
              card.insertBefore(svg, card.firstChild);
            }
            return svg;
          }

          function updatePerfKpiSparkline(card, metric, period) {
            const svg = ensurePerfKpiSparklineSvg(card);
            const path = svg.querySelector(".stats-perf-kpi-sparkline-line");
            const buckets = getPerfSparklineBuckets(period);
            const summary = computePerfSummaryKpiFromStandortBreakdown(metric, period);
            const rawValues = buckets.map((bucket) =>
              computePerfKpiForSparklineBucket(metric, period, bucket),
            );
            const series = fillSparklineSeries(rawValues, summary);
            const d = buildSparklinePath(series, 100, 100);
            svg.setAttribute("viewBox", "0 0 100 100");
            path.setAttribute("d", d);
          }

          function syncPerformanceSparklines() {
            const period = getPerformancePeriod();
            document
              .querySelectorAll("#statsPanelPerformance .stats-perf-kpi-card[data-perf-metric]")
              .forEach((card) => {
                updatePerfKpiSparkline(card, card.dataset.perfMetric, period);
              });
          }

          function computeGroupMetricFromLeads(leads, metric, period = getPerformancePeriod()) {
            if (!leads.length) return null;
            if (metric === "conversion") {
              const eligible = leadsEligibleForConversionMetric(leads);
              if (!eligible.length) return null;
              const won = eligible.filter((row) => isLeadWonStatus(getLeadRowStatus(row))).length;
              return (won / eligible.length) * 100;
            }
            if (metric === "complaints") {
              const submitted = getReklamationRecordsForLeadGroup(leads, period).length;
              return (submitted / leads.length) * 100;
            }
            if (metric === "investment") {
              const totalCost = leads.reduce((acc, row) => acc + getLeadRowPrice(row), 0);
              const reklCost = leads
                .filter((row) => isLeadSuccessfullyReklamiert(row))
                .reduce((acc, row) => acc + getLeadRowPrice(row), 0);
              const netCost = totalCost - reklCost;
              const neukunden = leads.filter((row) => isLeadWonStatus(getLeadRowStatus(row)));
              if (!neukunden.length) return null;
              return netCost / neukunden.length;
            }
            if (metric === "timeToContact") {
              const hours = leads
                .map((row) => {
                  const created = getLeadCreatedTimeMs(row);
                  const firstAction = getLeadFirstActionTimeMs(row);
                  if (created == null || firstAction == null) return null;
                  const delta = (firstAction - created) / 3600000;
                  return delta >= 0 ? delta : null;
                })
                .filter((value) => value != null);
              return averageNumericValues(hours);
            }
            if (metric === "responseRate") {
              const contacted = leads.filter((row) => getLeadStatusChangeCount(row) > 0).length;
              return (contacted / leads.length) * 100;
            }
            if (metric === "handlingTime") {
              const hours = leads
                .filter((row) => isLeadClosedOrWonStatus(getLeadRowStatus(row)))
                .map((row) => {
                  const firstAction = getLeadFirstActionTimeMs(row);
                  const closed = getLeadClosedTimeMs(row);
                  if (firstAction == null || closed == null) return null;
                  const delta = (closed - firstAction) / 3600000;
                  return delta >= 0 ? delta : null;
                })
                .filter((value) => value != null);
              return averageNumericValues(hours);
            }
            return null;
          }

          function lookupPerfFlatValue(metric, period, dimension, label) {
            return getPerfMetricData(metric, period)?.[dimension]?.flat?.[label] ?? null;
          }

          const MIN_LEADS_FOR_COMPUTED_METRIC = 6;

          function metricValueForLeadGroup(leads, metric, period, dimension, label) {
            if (!leads.length) return null;
            const computed = computeGroupMetricFromLeads(leads, metric, period);
            if (computed != null) return computed;
            if (
              metric === "investment" ||
              metric === "handlingTime" ||
              metric === "timeToContact"
            ) {
              return null;
            }
            return lookupPerfFlatValue(metric, period, dimension, label);
          }

          function resolveMetricValue(leads, metric, period, dimension, label, preferredValue) {
            if (leads.length > 0) {
              const computed = computeGroupMetricFromLeads(leads, metric, period);
              if (computed != null) return computed;
              if (
                metric === "investment" ||
                metric === "handlingTime" ||
                metric === "timeToContact"
              ) {
                return null;
              }
            }
            if (metric === "investment") return null;
            if (preferredValue != null && !Number.isNaN(preferredValue)) return preferredValue;
            const flat = lookupPerfFlatValue(metric, period, dimension, label);
            if (flat != null) return flat;
            return preferredValue ?? null;
          }

          function weightedAverageMetricValues(entries) {
            let totalWeight = 0;
            let sum = 0;
            entries.forEach(({ value, weight }) => {
              if (value == null || Number.isNaN(value)) return;
              const w = Math.max(weight, 1);
              totalWeight += w;
              sum += value * w;
            });
            return totalWeight ? sum / totalWeight : null;
          }

          function comboRowSublabel() {
            return "";
          }

          function complaintShareOfAllLeads(leads, period) {
            if (!leads.length) return null;
            const submitted = getReklamationRecordsForLeadGroup(leads, period).length;
            return (submitted / leads.length) * 100;
          }

          /** Share of eingereichte Reklamationen; status rows sum to 100%. */
          function complaintShareOfSubmitted(records, outcome) {
            if (!records.length) return null;
            const count = records.filter((record) => record.outcome === outcome).length;
            return (count / records.length) * 100;
          }

          function isComplaintPendingStatus(status) {
            const value = String(status || "").trim();
            return (
              value.includes("Reklamation") &&
              !isLeadSuccessfulComplaintStatus(status) &&
              !isLeadRejectedComplaintStatus(status)
            );
          }

          const COMPLAINT_STATUS_BREAKDOWNS = [
            { label: "Erfolgreiche Reklamationen", outcome: "successful" },
            { label: "Abgelehnte Reklamationen", outcome: "rejected" },
            { label: "In Bearbeitung", outcome: "pending" },
          ];

          function markComplaintParentRow(rows) {
            for (let i = rows.length - 1; i >= 0; i -= 1) {
              const row = rows[i];
              if (row.kind === "complaint-status" || row.kind === "complaint-group-divider") continue;
              row.isComplaintParent = true;
              return;
            }
          }

          function appendComplaintStatusBreakdownRows(rows, leads, period, parentLabel, depth, extra = {}) {
            const { includeSublabel = false, ...rowExtra } = extra;
            if (rows.length) markComplaintParentRow(rows);
            const records = getReklamationRecordsForLeadGroup(leads, period);
            const submitted = records.length;
            COMPLAINT_STATUS_BREAKDOWNS.forEach(({ label, outcome }) => {
              rows.push({
                label,
                value: submitted ? complaintShareOfSubmitted(records, outcome) : 0,
                kind: "complaint-status",
                depth,
                parent: parentLabel,
                path: `${parentLabel} · ${label}`,
                ...(includeSublabel ? { sublabel: "Anteil der eingereichten Reklamationen" } : {}),
                ...rowExtra,
              });
            });
            rows.push({
              kind: "complaint-group-divider",
              label: "",
              value: null,
              depth,
              parent: parentLabel,
              path: `${parentLabel}::__divider`,
            });
          }

          function getComplaintStatusFoldRows(period) {
            const leads = getLeadsInPerformancePeriod(period);
            if (!leads.length) return [];
            const rows = [
              {
                label: "Eingereichte Reklamationen",
                value: complaintShareOfAllLeads(leads, period),
                kind: "complaint-group",
                depth: 0,
                path: "Eingereichte Reklamationen",
                sublabel: "Anteil aller Leads",
                isComplaintParent: true,
              },
            ];
            appendComplaintStatusBreakdownRows(rows, leads, period, "Eingereichte Reklamationen", 1, {
              includeSublabel: true,
            });
            return rows;
          }

          function perfSegmentDimensionViews(metric) {
            const base = ["standort", "mitarbeiter", "produkt"];
            if (metric === "complaints") {
              return ["complaint-status", ...base];
            }
            return base;
          }

          function getManagedStandortKeys() {
            return getStandorte().filter(Boolean);
          }

          function getStandortDimensionFoldRows(metric, period) {
            const periodLeads = getLeadsInPerformancePeriod(period);
            const rows = [];
            getStandortKeys(metric, period).forEach((standort) => {
              const standortLeads = periodLeads.filter((row) => getCellValue(row, "standort") === standort);
              if (!standortLeads.length) return;
              if (metric === "complaints") {
                rows.push({
                  label: standort,
                  value: complaintShareOfAllLeads(standortLeads, period) ?? 0,
                  kind: "standort",
                  depth: 0,
                  path: standort,
                });
                appendComplaintStatusBreakdownRows(rows, standortLeads, period, standort, 1);
                return;
              }
              rows.push({
                label: standort,
                value: computeGroupMetricFromLeads(standortLeads, metric, period) ?? 0,
                kind: "standort",
                depth: 0,
                path: standort,
              });
            });
            return rows;
          }

          function getDimensionFoldRows(metric, period, view) {
            const periodLeads = getLeadsInPerformancePeriod(period);
            if (view === "complaint-status") {
              return metric === "complaints" ? getComplaintStatusFoldRows(period) : [];
            }
            if (view === "standort") {
              return getStandortDimensionFoldRows(metric, period);
            }
            if (view === "mitarbeiter") {
              const rows = [];
              TENANT_MITARBEITER.forEach((label) => {
                const groupLeads = periodLeads.filter((row) => getCellValue(row, "zustandigkeit") === label);
                if (!groupLeads.length) return;
                if (metric === "complaints") {
                  rows.push({
                    label,
                    value: complaintShareOfAllLeads(groupLeads, period) ?? 0,
                    kind: "mitarbeiter",
                    depth: 0,
                    path: label,
                  });
                  appendComplaintStatusBreakdownRows(rows, groupLeads, period, label, 1);
                  return;
                }
                const value = metricValueForLeadGroup(groupLeads, metric, period, "mitarbeiter", label);
                rows.push({ label, value: value ?? 0, kind: "mitarbeiter", depth: 0, path: label });
              });
              return rows;
            }
            if (view === "produkt") {
              const rows = [];
              collectTenantProduktCatalog(metric, period).forEach((label) => {
                const groupLeads = periodLeads.filter((row) => getCellValue(row, "bedarf") === label);
                if (!groupLeads.length) return;
                if (metric === "complaints") {
                  rows.push({
                    label,
                    value: complaintShareOfAllLeads(groupLeads, period) ?? 0,
                    kind: "produkt",
                    depth: 0,
                    path: label,
                  });
                  appendComplaintStatusBreakdownRows(rows, groupLeads, period, label, 1);
                  return;
                }
                const value = metricValueForLeadGroup(groupLeads, metric, period, "produkt", label);
                rows.push({ label, value: value ?? 0, kind: "produkt", depth: 0, path: label });
              });
              return rows;
            }
            return [];
          }

          function getPerfMetricData(metric, period) {
            const bucket = PERF_PERIOD_DATA[period];
            if (!bucket) return null;
            return bucket[metric] || null;
          }

          function formatPerfHandlingTime(value) {
            return `${value.toFixed(1).replace(".", ",")} Std.`;
          }

          function formatPerfTimeToContact(value) {
            return formatPerfHandlingTime(value);
          }

          function formatPerfValue(metric, value) {
            if (value == null || Number.isNaN(value)) return "—";
            if (metric === "investment") return `${Math.round(value)} €`;
            if (metric === "handlingTime") return formatPerfHandlingTime(value);
            if (metric === "timeToContact") return formatPerfTimeToContact(value);
            return `${value.toFixed(1).replace(".", ",")}%`;
          }

          function parsePerfSummaryValue(metric, text) {
            if (!text || text === "—") return null;
            if (metric === "investment") {
              const n = parseInt(String(text).replace(/[^\d]/g, ""), 10);
              return Number.isFinite(n) ? n : null;
            }
            if (metric === "handlingTime") {
              const n = parseFloat(
                String(text).replace(/Std\.?/gi, "").replace(",", ".").trim(),
              );
              return Number.isFinite(n) ? n : null;
            }
            if (metric === "timeToContact") {
              const n = parseFloat(
                String(text).replace(/Std\.?/gi, "").replace(",", ".").trim(),
              );
              return Number.isFinite(n) ? n : null;
            }
            const n = parseFloat(String(text).replace("%", "").replace(",", ".").trim());
            return Number.isFinite(n) ? n : null;
          }

          function getDimensionKeys(metric, period, dimension) {
            const dim = getPerfMetricData(metric, period)?.[dimension];
            if (!dim?.flat) return [];
            return Object.keys(dim.flat);
          }

          function getFlatRows(metric, period, dimension) {
            const dim = getPerfMetricData(metric, period)?.[dimension];
            if (!dim?.flat) return [];
            return Object.entries(dim.flat).map(([label, value]) => ({ label, value, kind: "flat" }));
          }

          function getPerfHierarchy(metric, period) {
            const bucket = PERF_HIERARCHY_PERIOD[period];
            if (!bucket) return null;
            return bucket[metric] || null;
          }

          function getStandortKeys(metric, period) {
            const { isAll } = getStandortSelection();
            if (!isAll) {
              return getActiveStandorte().filter(Boolean);
            }
            return getManagedStandortKeys();
          }

          function defaultComboFilters() {
            return { standort: [], mitarbeiter: [], produkt: [] };
          }

          function asFilterArray(value) {
            if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
            const single = String(value || "").trim();
            return single ? [single] : [];
          }

          function isComboFilterNone(selected) {
            return asFilterArray(selected).includes(COMBO_FILTER_NONE);
          }

          function comboLevelAllowsProduktFilter(level) {
            return level === "standort-mitarbeiter-produkt" || level === "standort-produkt";
          }

          function isComboCompareReady(filters, level) {
            const standort = asFilterArray(filters?.standort);
            const mitarbeiter = asFilterArray(filters?.mitarbeiter);
            const produkt = asFilterArray(filters?.produkt);
            if (isComboFilterNone(standort) || isComboFilterNone(mitarbeiter)) return false;
            if (comboLevelAllowsProduktFilter(level) && isComboFilterNone(produkt)) return false;
            return true;
          }

          function syncComboCompareButtonState(segment, draft) {
            const btn = segment?.querySelector(".stats-perf-combo-compare");
            if (!btn) return;
            const ready = isComboCompareReady(draft?.filters, draft?.level);
            btn.disabled = !ready;
            btn.setAttribute("aria-disabled", ready ? "false" : "true");
          }

          function comboDetailLevelForLevel(level) {
            return comboLevelAllowsProduktFilter(level) ? "detail" : "summary";
          }

          function isFilterAllSelected(selected, allOptions) {
            const list = asFilterArray(selected);
            if (isComboFilterNone(list)) return false;
            return !list.length || list.length >= allOptions.length;
          }

          function multiSelectTriggerLabel(selected, allOptions, placeholder) {
            const list = asFilterArray(selected);
            if (isComboFilterNone(list)) return "Keine ausgewählt";
            if (isFilterAllSelected(list, allOptions)) return placeholder;
            if (list.length === 1) return list[0];
            return `${list.length} ausgewählt`;
          }

          function matchesMultiFilter(label, selectedList) {
            const list = asFilterArray(selectedList);
            if (!list.length) return true;
            return list.includes(String(label || "").trim());
          }

          function getAllTenantProduktKeys(metric, period) {
            return collectTenantProduktCatalog(metric, period);
          }

          function getTenantProduktRows(metric, period, selectedProdukte = []) {
            const list = asFilterArray(selectedProdukte);
            let rows = getDimensionFoldRows(metric, period, "produkt");
            if (list.length) rows = rows.filter((row) => list.includes(row.label));
            return rows;
          }

          function getMitarbeiterKeysForCombo(metric, period, standortSelection) {
            const standorte = asFilterArray(standortSelection);
            if (!standorte.length) return getAllAssignableMitarbeiter(metric, period);
            const names = new Set();
            standorte.forEach((standort) => {
              getMitarbeiterWithLeadsInStandort(standort, period).forEach((name) => names.add(name));
            });
            return Array.from(names).sort((a, b) => a.localeCompare(b, "de"));
          }

          function getProduktKeysForCombo(metric, period, standortSelection, mitarbeiterSelection) {
            const standorte = asFilterArray(standortSelection);
            const mas = asFilterArray(mitarbeiterSelection);
            let leads = getLeadsInPerformancePeriod(period);
            if (standorte.length) {
              leads = leads.filter((row) => standorte.includes(getCellValue(row, "standort")));
            }
            if (mas.length) {
              leads = leads.filter((row) => mas.includes(getCellValue(row, "zustandigkeit")));
            }
            if (!leads.length) return getAllTenantProduktKeys(metric, period);
            return getProduktKeysFromLeads(leads);
          }

          function normalizeComboFilters(combo, metric, period) {
            if (!combo.filters) combo.filters = defaultComboFilters();
            if (combo.filters && typeof combo.filters.standort === "object" && !Array.isArray(combo.filters.standort)) {
              const keys = getStandortKeys(metric, period);
              const active = keys.filter((k) => combo.filters.standort[k] !== false);
              combo.filters = {
                standort: active,
                mitarbeiter: asFilterArray(combo.filters.mitarbeiter),
                produkt: asFilterArray(combo.filters.produkt),
              };
            }
            combo.filters.standort = asFilterArray(combo.filters.standort);
            combo.filters.mitarbeiter = asFilterArray(combo.filters.mitarbeiter);
            combo.filters.produkt = asFilterArray(combo.filters.produkt);

            const allowedMa = getMitarbeiterKeysForCombo(metric, period, combo.filters.standort);
            if (!isComboFilterNone(combo.filters.mitarbeiter)) {
              combo.filters.mitarbeiter = combo.filters.mitarbeiter.filter((name) => allowedMa.includes(name));
            }

            const allowedProducts = getProduktKeysForCombo(
              metric,
              period,
              combo.filters.standort,
              combo.filters.mitarbeiter,
            );
            if (!isComboFilterNone(combo.filters.produkt)) {
              combo.filters.produkt = combo.filters.produkt.filter((name) => allowedProducts.includes(name));
            }
            return combo.filters;
          }

          function getMitarbeiterKeysForStandort(metric, period, standort) {
            return getMitarbeiterWithLeadsInStandort(standort, period);
          }

          /** Employees who actually have leads in this Standort (not only home assignment). */
          function getMitarbeiterWithLeadsInStandort(standort, period) {
            const leads = getLeadsInPerformancePeriod(period).filter(
              (row) => getCellValue(row, "standort") === standort,
            );
            const names = new Set();
            leads.forEach((row) => {
              const name = getCellValue(row, "zustandigkeit");
              if (name && name !== "-" && !UNASSIGNED_OWNER_OPTIONS.includes(name)) names.add(name);
            });
            return Array.from(names).sort((a, b) => a.localeCompare(b, "de"));
          }

          function getProduktKeysFromLeads(leads) {
            const products = new Set();
            leads.forEach((row) => {
              const product = getCellValue(row, "bedarf");
              if (product && product !== "-") products.add(product);
            });
            return Array.from(products).sort((a, b) => a.localeCompare(b, "de"));
          }

          function getAllAssignableMitarbeiter(metric, period) {
            const fromLeads = new Set();
            getLeadsInPerformancePeriod(period).forEach((row) => {
              const name = getCellValue(row, "zustandigkeit");
              if (TENANT_MITARBEITER.includes(name)) fromLeads.add(name);
            });
            if (fromLeads.size) {
              return Array.from(fromLeads).sort((a, b) => a.localeCompare(b, "de"));
            }
            return TENANT_MITARBEITER.slice();
          }

          function standortFiltersFromSelection(selectedStandort, metric, period) {
            const keys = getStandortKeys(metric, period);
            const list = asFilterArray(selectedStandort);
            const filters = {};
            if (isComboFilterNone(list)) {
              keys.forEach((key) => {
                filters[key] = false;
              });
              return filters;
            }
            keys.forEach((key) => {
              filters[key] = !list.length || list.includes(key);
            });
            return filters;
          }

          function getEmployeesProductRows(metric, period, mitarbeiterSelection, detailLevel) {
            const list = asFilterArray(mitarbeiterSelection);
            const names = list.length ? list : getAllAssignableMitarbeiter(metric, period);
            let rows = [];
            names.forEach((ma) => {
              rows = rows.concat(getEmployeeProductRows(metric, period, ma, detailLevel));
            });
            return rows;
          }

          function getEmployeeProductRows(metric, period, mitarbeiter, detailLevel) {
            const dim = getPerfMetricData(metric, period)?.mitarbeiter;
            const value = dim?.flat?.[mitarbeiter];
            const nested = dim?.nested?.[mitarbeiter];
            if (value == null) return [];
            const showChildren = detailLevel === "detail";
            const rows = [
              {
                label: mitarbeiter,
                value,
                kind: "mitarbeiter",
                depth: 0,
                path: mitarbeiter,
              },
            ];
            if (showChildren && nested) {
              Object.entries(nested).forEach(([produkt, produktValue]) => {
                rows.push({
                  label: produkt,
                  value: produktValue,
                  kind: "produkt",
                  depth: 1,
                  parent: mitarbeiter,
                  path: `${mitarbeiter} · ${produkt}`,
                });
              });
            }
            return rows;
          }

          function filterComboRowsByProdukt(rows, produktSelection, level) {
            if (level && !comboLevelAllowsProduktFilter(level)) {
              return rows.filter((row) => row.kind !== "produkt");
            }
            let filtered = rows;
            if (level === "standort-mitarbeiter-produkt") {
              filtered = filtered.filter((row) => row.kind !== "produkt" || row.depth === 2);
            }
            const list = asFilterArray(produktSelection);
            if (!list.length) return filtered;
            const hasMatch = filtered.some(
              (r) => (r.kind === "produkt" || r.kind === "flat") && list.includes(r.label),
            );
            if (!hasMatch) return filtered;
            filtered = filtered.filter(
              (r) => (r.kind !== "produkt" && r.kind !== "flat") || list.includes(r.label),
            );
            if (level === "standort-mitarbeiter-produkt") {
              const maWithProduct = new Set(
                filtered
                  .filter((r) => r.kind === "produkt" && r.depth === 2)
                  .map((r) => r.parent)
                  .filter(Boolean),
              );
              filtered = filtered.filter((r) => {
                if (r.kind === "mitarbeiter") return maWithProduct.has(r.label);
                return true;
              });
            }
            return filtered;
          }

          function applyLeanComboRowDisplay(rows, combo) {
            const mitarbeiterList = asFilterArray(combo.filters?.mitarbeiter);
            const produktList = asFilterArray(combo.filters?.produkt);

            const result = rows.filter((row) => {
              if (mitarbeiterList.length && row.kind === "mitarbeiter" && !mitarbeiterList.includes(row.label)) {
                return false;
              }
              if (produktList.length && row.kind === "produkt" && !produktList.includes(row.label)) {
                return false;
              }
              return true;
            });

            return result.map((row) => ({
              ...row,
              parent: undefined,
              standort: undefined,
              path: row.label,
            }));
          }

          function getComboPreviewRows(combo, metric, period, options = {}) {
            normalizeComboFilters(combo, metric, period);
            const standortList = asFilterArray(combo.filters.standort);
            const mitarbeiterList = asFilterArray(combo.filters.mitarbeiter);
            const produktList = asFilterArray(combo.filters.produkt);
            const summaryOnly = options.summaryOnly === true;

            if (
              isComboFilterNone(standortList) ||
              isComboFilterNone(mitarbeiterList) ||
              isComboFilterNone(produktList)
            ) {
              return [];
            }

            const standortFilters = standortFiltersFromSelection(standortList, metric, period);
            let rows = getHierarchyRows(
              metric,
              period,
              combo.level,
              standortFilters,
              combo.detailLevel,
              mitarbeiterList,
            );
            rows = filterComboRowsByProdukt(rows, produktList, combo.level);
            rows = applyLeanComboRowDisplay(rows, combo);
            if (summaryOnly) rows = rows.filter((r) => r.depth === 0);
            return rows;
          }

          /** Full hierarchy rows (Standort → Mitarbeiter → Produkt) for combo results — keeps parent/path context. */
          function getComboHierarchyRows(combo, metric, period) {
            normalizeComboFilters(combo, metric, period);
            const standortList = asFilterArray(combo.filters.standort);
            const mitarbeiterList = asFilterArray(combo.filters.mitarbeiter);
            const produktList = asFilterArray(combo.filters.produkt);

            if (
              isComboFilterNone(standortList) ||
              isComboFilterNone(mitarbeiterList) ||
              isComboFilterNone(produktList)
            ) {
              return [];
            }

            const standortFilters = standortFiltersFromSelection(standortList, metric, period);
            const rows = getHierarchyRows(
              metric,
              period,
              combo.level,
              standortFilters,
              combo.detailLevel,
              mitarbeiterList,
            );
            return filterComboRowsByProdukt(rows, produktList, combo.level);
          }

          function comboPreviewTableHeader(combo, metric, period) {
            normalizeComboFilters(combo, metric, period);
            const standortList = asFilterArray(combo.filters.standort);
            const mitarbeiterList = asFilterArray(combo.filters.mitarbeiter);
            const produktList = asFilterArray(combo.filters.produkt);
            if (mitarbeiterList.length && !standortList.length) return "Mitarbeiter / Produkt";
            if (produktList.length && combo.level === "standort-produkt") return "Standort / Produkt";
            if (produktList.length && combo.level === "standort-mitarbeiter-produkt") {
              return "Standort / Mitarbeiter / Produkt";
            }
            return hierarchyTableHeader(combo.level);
          }

          function syncComboLevelForFilters(combo, metric, period) {
            normalizeComboFilters(combo, metric, period);
            const standortList = asFilterArray(combo.filters.standort);
            const mitarbeiterList = asFilterArray(combo.filters.mitarbeiter);
            const produktList = asFilterArray(combo.filters.produkt);
            if (!standortList.length && !mitarbeiterList.length) {
              combo.detailLevel = "detail";
              return;
            }
            if (produktList.length) {
              combo.level = "standort-mitarbeiter-produkt";
              combo.detailLevel = "detail";
              return;
            }
            if (mitarbeiterList.length && !standortList.length) {
              combo.detailLevel = "detail";
              return;
            }
            if (standortList.length && mitarbeiterList.length) {
              combo.level = "standort-mitarbeiter-produkt";
              combo.detailLevel = "detail";
              return;
            }
            if (standortList.length) {
              combo.level = "standort-mitarbeiter";
            }
          }

          function normalizePerfCombo(combo, metric, period) {
            normalizeComboFilters(combo, metric, period);
            if (combo.level === "standort") combo.level = "standort-mitarbeiter";
            if (!combo.level) {
              let level = "standort-mitarbeiter";
              if (combo.primary === "standort" && combo.secondary === "produkt") level = "standort-produkt";
              else if (combo.primary === "mitarbeiter" || combo.secondary === "produkt") {
                level = "standort-mitarbeiter-produkt";
              }
              combo.level = level;
            }
            if (!PERF_HIERARCHY_LEVELS[combo.level]) combo.level = "standort-mitarbeiter";
            combo.detailLevel = comboDetailLevelForLevel(combo.level);
            if (!comboLevelAllowsProduktFilter(combo.level)) {
              combo.filters.produkt = [];
            }
            return combo;
          }

          function hierarchyLevelLabel(level) {
            return PERF_HIERARCHY_LEVELS[level]?.short || level;
          }

          function comboSectionHeadline(combo) {
            return hierarchyLevelLabel(combo.level);
          }

          /** Arithmetic mean of direct child row values (investition parent roll-up). */
          function averageMetricChildValues(childRows) {
            const values = childRows
              .map((row) => row.value)
              .filter((v) => typeof v === "number" && !Number.isNaN(v));
            if (!values.length) return null;
            return values.reduce((sum, v) => sum + v, 0) / values.length;
          }

          function rollupInvestmentGebietRow(rows, gebietBlockStart) {
            const gebietRow = rows[gebietBlockStart];
            if (!gebietRow || gebietRow.kind !== "standort") return;
            const children = [];
            for (let i = gebietBlockStart + 1; i < rows.length; i += 1) {
              const row = rows[i];
              if (row.kind === "standort" && row.depth === 0) break;
              if (row.depth === 1) children.push(row);
            }
            const avg = averageMetricChildValues(children);
            if (avg != null) gebietRow.value = avg;
          }

          function rollupInvestmentMitarbeiterRow(rows, maRowIndex, mitarbeiterLabel) {
            const maRow = rows[maRowIndex];
            if (!maRow || maRow.kind !== "mitarbeiter") return;
            const children = [];
            for (let i = maRowIndex + 1; i < rows.length; i += 1) {
              const row = rows[i];
              if (row.kind === "standort" && row.depth === 0) break;
              if (row.kind === "mitarbeiter" && row.depth === 1) break;
              if (row.kind === "produkt" && row.depth === 2 && row.parent === mitarbeiterLabel) {
                children.push(row);
              }
            }
            const avg = averageMetricChildValues(children);
            if (avg != null) maRow.value = avg;
          }

          function getProduktMapForGebiet(metric, period, standort, node) {
            if (node?.produkt && Object.keys(node.produkt).length) return node.produkt;
            const nested = getPerfMetricData(metric, period)?.standort?.nested?.[standort];
            if (nested && Object.keys(nested).length) return { ...nested };
            const leads = getLeadsInPerformancePeriod(period).filter(
              (row) => getCellValue(row, "standort") === standort,
            );
            const map = {};
            const products = new Set();
            leads.forEach((row) => {
              const product = getCellValue(row, "bedarf");
              if (product && product !== "-") products.add(product);
            });
            products.forEach((product) => {
              const productLeads = leads.filter((row) => getCellValue(row, "bedarf") === product);
              const value = computeGroupMetricFromLeads(productLeads, metric, period);
              if (value != null) map[product] = value;
            });
            if (Object.keys(map).length) return map;
            return {};
          }

          function getMitarbeiterMapForStandort(metric, period, standort, node) {
            const leads = getLeadsInPerformancePeriod(period).filter(
              (row) => getCellValue(row, "standort") === standort,
            );
            const mitarbeiterNames = getMitarbeiterWithLeadsInStandort(standort, period);
            const map = {};
            mitarbeiterNames.forEach((mitarbeiter) => {
              const maLeads = leads.filter((row) => getCellValue(row, "zustandigkeit") === mitarbeiter);
              if (!maLeads.length) return;
              const produkt = {};
              const products = new Set();
              maLeads.forEach((row) => {
                const product = getCellValue(row, "bedarf");
                if (product && product !== "-") products.add(product);
              });
              products.forEach((product) => {
                const productLeads = maLeads.filter((row) => getCellValue(row, "bedarf") === product);
                const preferred = node?.mitarbeiter?.[mitarbeiter]?.produkt?.[product];
                const value = resolveMetricValue(productLeads, metric, period, "produkt", product, preferred);
                if (value != null) produkt[product] = value;
              });
              const preferredMa = node?.mitarbeiter?.[mitarbeiter]?.value;
              const value = resolveMetricValue(
                maLeads,
                metric,
                period,
                "mitarbeiter",
                mitarbeiter,
                preferredMa,
              );
              map[mitarbeiter] = { value: value ?? preferredMa ?? 0, produkt };
            });
            return map;
          }

          function getHierarchyRows(metric, period, level, standortFilters, detailLevel, mitarbeiterFilter = []) {
            const tree = getPerfHierarchy(metric, period) || {};
            const rows = [];
            const showMitarbeiter = level === "standort-mitarbeiter" || level === "standort-mitarbeiter-produkt";
            const showProduktUnderMitarbeiter = level === "standort-mitarbeiter-produkt";
            const showProduktUnderGebiet = level === "standort-produkt";
            const employeeFilter = asFilterArray(mitarbeiterFilter);

            getStandortKeys(metric, period).forEach((standort) => {
              if (standortFilters[standort] === false) return;
              const node = tree[standort];
              const standortLeads = getLeadsInPerformancePeriod(period).filter(
                (row) => getCellValue(row, "standort") === standort,
              );
              const mitarbeiterMap = getMitarbeiterMapForStandort(metric, period, standort, node);
              const maPrepared = [];
              const standortBlockStart = rows.length;

              Object.entries(mitarbeiterMap).forEach(([mitarbeiter, maNode]) => {
                if (employeeFilter.length && !employeeFilter.includes(mitarbeiter)) return;
                const maLeads = standortLeads.filter(
                  (row) => getCellValue(row, "zustandigkeit") === mitarbeiter,
                );
                const maValue = resolveMetricValue(
                  maLeads,
                  metric,
                  period,
                  "mitarbeiter",
                  mitarbeiter,
                  maNode?.value,
                );
                maPrepared.push({ mitarbeiter, maNode, maLeads, maValue });
              });

              let standortValue =
                metricValueForLeadGroup(standortLeads, metric, period, "standort", standort) ??
                node?.value ??
                lookupPerfFlatValue(metric, period, "standort", standort) ??
                null;
              if (metric === "complaints") {
                standortValue = complaintShareOfAllLeads(standortLeads, period);
              } else if (maPrepared.length && metric !== "investment") {
                const fromEmployees = weightedAverageMetricValues(
                  maPrepared.map((entry) => ({
                    value: entry.maValue,
                    weight: entry.maLeads.length,
                  })),
                );
                if (fromEmployees != null) standortValue = fromEmployees;
              }

              rows.push({
                label: standort,
                value:
                  metric === "investment"
                    ? null
                    : standortValue ?? (metric === "investment" ? null : 0),
                kind: "standort",
                depth: 0,
                path: standort,
              });

              if (metric === "complaints") {
                appendComplaintStatusBreakdownRows(rows, standortLeads, period, standort, 1, { standort });
              }

              if (level === "standort") return;

              if (showProduktUnderGebiet) {
                getProduktKeysFromLeads(standortLeads).forEach((produkt) => {
                  const produktLeads = standortLeads.filter((row) => getCellValue(row, "bedarf") === produkt);
                  if (!produktLeads.length) return;
                  const produktValue =
                    metric === "complaints"
                      ? complaintShareOfAllLeads(produktLeads, period)
                      : resolveMetricValue(produktLeads, metric, period, "produkt", produkt, null);
                  if (metric === "investment" && produktValue == null) return;
                  rows.push({
                    label: produkt,
                    value: produktValue ?? (metric === "investment" ? null : 0),
                    kind: "produkt",
                    depth: 1,
                    parent: standort,
                    path: `${standort} · ${produkt}`,
                  });
                  if (metric === "complaints") {
                    appendComplaintStatusBreakdownRows(rows, produktLeads, period, produkt, 2, {
                      standort,
                      parent: standort,
                    });
                  }
                });
                if (metric === "investment") rollupInvestmentGebietRow(rows, standortBlockStart);
                return;
              }

              if (!showMitarbeiter) return;

              if (!maPrepared.length) {
                if (metric === "investment") {
                  rows[standortBlockStart].value = computeGroupMetricFromLeads(standortLeads, metric, period);
                }
                return;
              }

              maPrepared.forEach(({ mitarbeiter, maNode, maLeads, maValue }) => {
                const maRowIndex = rows.length;
                const maDisplayValue =
                  metric === "complaints"
                    ? complaintShareOfAllLeads(maLeads, period)
                    : metric === "investment" && showProduktUnderMitarbeiter
                      ? null
                      : maValue ?? (metric === "investment" ? null : 0);
                rows.push({
                  label: mitarbeiter,
                  value: maDisplayValue,
                  kind: "mitarbeiter",
                  depth: 1,
                  parent: standort,
                  path: mitarbeiter,
                });

                if (metric === "complaints") {
                  appendComplaintStatusBreakdownRows(rows, maLeads, period, mitarbeiter, 2, {
                    standort,
                    parent: standort,
                  });
                }

                if (showProduktUnderMitarbeiter) {
                  getProduktKeysFromLeads(maLeads).forEach((produkt) => {
                    const produktLeads = maLeads.filter((row) => getCellValue(row, "bedarf") === produkt);
                    if (!produktLeads.length) return;
                    const produktValue =
                      metric === "complaints"
                        ? complaintShareOfAllLeads(produktLeads, period)
                        : resolveMetricValue(produktLeads, metric, period, "produkt", produkt, null);
                    if (metric === "investment" && produktValue == null) return;
                    rows.push({
                      label: produkt,
                      value: produktValue ?? (metric === "investment" ? null : 0),
                      kind: "produkt",
                      depth: 2,
                      parent: mitarbeiter,
                      standort,
                      path: `${standort} · ${mitarbeiter} · ${produkt}`,
                    });
                    if (metric === "complaints") {
                      appendComplaintStatusBreakdownRows(rows, produktLeads, period, produkt, 3, {
                        standort,
                        parent: mitarbeiter,
                      });
                    }
                  });
                  if (metric === "investment") {
                    rollupInvestmentMitarbeiterRow(rows, maRowIndex, mitarbeiter);
                  }
                }
              });
              if (metric === "investment") rollupInvestmentGebietRow(rows, standortBlockStart);
            });

            return rows;
          }

          function hierarchyTableHeader(level) {
            if (level === "standort") return "Standort";
            if (level === "standort-mitarbeiter") return "Standort / Mitarbeiter";
            if (level === "standort-mitarbeiter-produkt") return "Standort / Mitarbeiter / Produkt";
            if (level === "standort-produkt") return "Standort / Produkt";
            return "Hierarchie";
          }

          function isPerfConsolidatedRow(row, options = {}) {
            if (row.kind === "standort") return true;
            if (row.kind === "mitarbeiter" && (row.depth == null || row.depth === 0)) return true;
            if (row.kind === "produkt" && (row.depth == null || row.depth === 0)) return true;
            if (row.kind === "flat" && options.consolidatedFlat) return true;
            if (row.kind === "complaint-group") return true;
            return false;
          }

          function isPerfBreakdownRow(row) {
            return row.depth != null && row.depth >= 1;
          }

          function getPerfRowContext(row) {
            if (row.sublabel != null && String(row.sublabel).trim() !== "") {
              return String(row.sublabel).trim();
            }
            if (row.kind === "complaint-group" || row.kind === "complaint-status") {
              return "";
            }
            if (row.kind === "standort" || row.kind === "flat" || row.kind === "mitarbeiter" || row.kind === "produkt") {
              return "";
            }
            return row.parent || "";
          }

          function calcBarWidths(rows, metric, refValue) {
            if (
              metric === "complaints" &&
              rows.some((row) => row.kind === "complaint-group" || row.kind === "complaint-status")
            ) {
              const parents = rows.filter((row) => row.kind === "complaint-group");
              const children = rows.filter((row) => row.kind === "complaint-status");
              const parentNums = parents.map((r) => r.value).filter((v) => typeof v === "number");
              const childNums = children.map((r) => r.value).filter((v) => typeof v === "number");
              let parentMax = parentNums.length ? Math.max(...parentNums) : 1;
              const childMax = childNums.length ? Math.max(...childNums) : 1;
              if (refValue != null) parentMax = Math.max(parentMax, refValue);
              return rows.map((row) => {
                if (typeof row.value !== "number") return { ...row, width: 0 };
                if (row.kind === "complaint-group") {
                  return { ...row, width: Math.max(4, (row.value / parentMax) * 100) };
                }
                if (row.kind === "complaint-status") {
                  return { ...row, width: Math.max(4, (row.value / childMax) * 100) };
                }
                const max = Math.max(parentMax, childMax, 1);
                return { ...row, width: Math.max(4, (row.value / max) * 100) };
              });
            }
            const nums = rows.map((r) => r.value).filter((v) => typeof v === "number");
            let max = nums.length ? Math.max(...nums) : 1;
            if (refValue != null) max = Math.max(max, refValue);
            if (metric === "investment") {
              const cap = 10000;
              return rows.map((row) => ({
                ...row,
                width:
                  typeof row.value === "number"
                    ? Math.min(100, Math.max(4, (row.value / cap) * 100))
                    : 0,
              }));
            }
            if (metric === "conversion" || metric === "complaints" || metric === "responseRate") {
              return rows.map((row) => ({
                ...row,
                width:
                  typeof row.value === "number"
                    ? Math.min(100, Math.max(4, row.value))
                    : 0,
              }));
            }
            if (metric === "handlingTime") {
              const cap = 72;
              return rows.map((row) => ({
                ...row,
                width:
                  typeof row.value === "number"
                    ? Math.min(100, Math.max(4, (row.value / cap) * 100))
                    : 0,
              }));
            }
            if (metric === "timeToContact") {
              const cap = 48;
              return rows.map((row) => ({
                ...row,
                width:
                  typeof row.value === "number"
                    ? Math.min(100, Math.max(4, (row.value / cap) * 100))
                    : 0,
              }));
            }
            return rows.map((row) => ({
              ...row,
              width: typeof row.value === "number" ? Math.max(4, (row.value / max) * 100) : 0,
            }));
          }

          function renderPerfBarChart(container, rows, metric, options = {}) {
            if (!container) return;
            container.classList.remove("has-table");
            if (options.leanHierarchy) container.classList.add("is-lean-hierarchy");
            else container.classList.remove("is-lean-hierarchy");
            const meta = PERF_METRIC_META[metric];
            const fillClass = options.fillClass || meta?.fill || "blue";
            const comboIndex = options.comboIndex;
            const fillExtra = comboIndex != null ? ` combo-${comboIndex}` : "";
            const refValue = options.refValue ?? null;
            if (!rows.length) {
              container.innerHTML = '<p class="stats-perf-empty">Keine Daten für den gewählten Zeitraum.</p>';
              return;
            }
            const dataRows = filterPerfDisplayRows(rows).filter(
              (row) => row.kind !== "combo-header" && row.kind !== "complaint-group-divider",
            );
            const sized = calcBarWidths(dataRows, metric, refValue);
            const sizedByKey = new Map(
              sized.map((row) => [`${row.kind}|${row.path}|${row.label}|${row.depth}`, row]),
            );
            const leanHierarchy = options.leanHierarchy === true;
            container.innerHTML = rows
              .map((row) => {
                if (row.kind === "combo-header") {
                  return `<div class="stats-perf-combo-section-head">${row.label}</div>`;
                }
                if (row.kind === "complaint-group-divider") {
                  return '<div class="stats-complaint-group-divider" role="presentation"></div>';
                }
                const sizedRow =
                  sizedByKey.get(`${row.kind}|${row.path}|${row.label}|${row.depth}`) || row;
                const displayLabel = sizedRow.label || sizedRow.path || "";
                const context = leanHierarchy
                  ? ""
                  : sizedRow.sublabel != null && String(sizedRow.sublabel).trim() !== ""
                    ? String(sizedRow.sublabel).trim()
                    : getPerfRowContext(sizedRow);
                const sub = context ? `<small>${context}</small>` : "";
                const depthClass =
                  sizedRow.depth === 1
                    ? " is-depth-1"
                    : sizedRow.depth === 2
                      ? " is-depth-2"
                      : sizedRow.depth >= 3
                        ? " is-depth-3"
                        : "";
                const complaintParentClass =
                  sizedRow.isComplaintParent || sizedRow.kind === "complaint-group"
                    ? " is-complaint-parent"
                    : "";
                const complaintStatusClass =
                  sizedRow.kind === "complaint-status" ? " is-complaint-status" : "";
                const tierClass =
                  complaintParentClass || complaintStatusClass
                    ? ""
                    : isPerfConsolidatedRow(sizedRow, options)
                      ? " is-consolidated"
                      : isPerfBreakdownRow(sizedRow)
                        ? " is-breakdown"
                        : "";
                const labelClass = `stats-bar-label${depthClass}`;
                const comboFill =
                  sizedRow.comboIndex != null ? ` combo-${sizedRow.comboIndex % PERF_COMBO_COLORS.length}` : fillExtra;
                return `<div class="stats-bar-row dense${tierClass}${depthClass}${complaintParentClass}${complaintStatusClass}">
                  <span class="${labelClass}">${displayLabel}${sub}</span>
                  <div class="stats-bar-track">
                    <div class="stats-bar-fill ${fillClass}${comboFill}" style="width:${sizedRow.width}%"></div>
                  </div>
                  <span class="stats-bar-value">${formatPerfValue(metric, sizedRow.value)}</span>
                </div>`;
              })
              .join("");
          }

          function escapePerfHtml(text) {
            return String(text ?? "")
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;");
          }

          function perfViewColLabel(view) {
            if (view === "complaint-status") return "Status";
            if (view === "standort") return "Standort";
            if (view === "mitarbeiter") return "Mitarbeiter";
            if (view === "produkt") return "Produkt";
            return "Eintrag";
          }

          function getPerfSegmentVizMode(segment) {
            const state = perfSegmentState.get(segment);
            return state?.vizMode === "table" ? "table" : "bars";
          }

          function syncPerfVizToggleUi(segment, mode) {
            if (!segment) return;
            const activeMode = mode === "table" ? "table" : "bars";
            segment.querySelectorAll(".stats-perf-viz-btn[data-viz-mode]").forEach((btn) => {
              const isActive = btn.dataset.vizMode === activeMode;
              btn.classList.toggle("is-active", isActive);
              btn.setAttribute("aria-pressed", isActive ? "true" : "false");
            });
          }

          function renderPerfViz(container, rows, metric, colLabel, mode, options = {}) {
            if (!container) return;
            container.classList.toggle("has-table", mode === "table");
            if (mode === "table") {
              renderPerfTable(container, rows, colLabel, metric, options);
            } else {
              renderPerfBarChart(container, rows, metric, options);
            }
          }

          function renderPerfTable(mount, rows, colLabel, metric, options = {}) {
            if (!mount) return;
            const meta = PERF_METRIC_META[metric];
            const dataRows = filterPerfDisplayRows(rows).filter(
              (row) => row.kind !== "combo-header" && row.kind !== "complaint-group-divider",
            );
            if (!dataRows.length) {
              mount.innerHTML = '<p class="stats-perf-empty">Keine Daten für den gewählten Zeitraum.</p>';
              return;
            }
            const leanHierarchy = options.leanHierarchy === true;
            const displayRows = filterPerfDisplayRows(rows);
            const body = displayRows
              .map((row) => {
                if (row.kind === "complaint-group-divider") {
                  return '<tr class="stats-complaint-group-divider"><td colspan="3" aria-hidden="true"></td></tr>';
                }
                if (row.kind === "combo-header") return "";
                let cls = "";
                if (row.isComplaintParent || row.kind === "complaint-group") {
                  cls = "is-complaint-parent";
                } else if (row.kind === "complaint-status") {
                  cls = "is-complaint-status";
                } else if (leanHierarchy) {
                  if (row.kind === "standort" || (row.kind === "mitarbeiter" && row.depth === 0)) {
                    cls = "is-area";
                  } else if (row.kind === "produkt" && row.depth > 0) {
                    cls = "is-product";
                  } else if (row.kind === "mitarbeiter") {
                    cls = "is-employee";
                  }
                } else if (isPerfConsolidatedRow(row, options)) {
                  cls = "is-area";
                } else if (row.kind === "mitarbeiter") {
                  cls = "is-employee";
                } else if (row.kind === "produkt") {
                  cls = "is-product";
                }
                const cellLabel = escapePerfHtml(row.label || row.path || "");
                const context = leanHierarchy ? "" : getPerfRowContext(row);
                const cellHtml = context
                  ? `${cellLabel}<span class="stats-perf-cell-context">${escapePerfHtml(context)}</span>`
                  : cellLabel;
                return `<tr class="${cls}"><td>${cellHtml}</td><td class="spacer" aria-hidden="true"></td><td class="num">${formatPerfValue(metric, row.value)}</td></tr>`;
              })
              .join("");
            mount.innerHTML = `<div class="stats-perf-table-wrap"><table class="stats-perf-table"><colgroup><col class="col-label" /><col class="col-spacer" /><col class="col-value" /></colgroup><thead><tr><th>${escapePerfHtml(colLabel)}</th><th class="spacer" aria-hidden="true"></th><th class="num">${escapePerfHtml(meta.column)}</th></tr></thead><tbody>${body}</tbody></table></div>`;
          }

          const PERF_KPI_REF_IDS = Object.fromEntries(
            PERF_SUMMARY_METRICS.map(([metric, id]) => [metric, id]),
          );

          function getPerfSegmentRefValue(metric) {
            const kpiId = PERF_KPI_REF_IDS[metric];
            if (!kpiId) return null;
            return parsePerfSummaryValue(metric, document.getElementById(kpiId)?.textContent);
          }

          function removePerfConsolidatedSummaryBlocks(root = document) {
            root.querySelectorAll(".stats-perf-consolidated").forEach((el) => el.remove());
          }

          function filterPerfDisplayRows(rows) {
            return rows.filter((row) => {
              if (row.kind === "consolidated-summary" || row.kind === "consolidated-ref") return false;
              const label = String(row.label || row.path || "").trim();
              return label.toLowerCase() !== "konsolidiert";
            });
          }

          function renderSimpleDimensionFold(segment, metric, period, view) {
            const fold = segment.querySelector(`[data-perf-view="${view}"]`);
            if (!fold) return;
            let rows = filterPerfDisplayRows(getDimensionFoldRows(metric, period, view));
            const refValue = getPerfSegmentRefValue(metric);
            const chartOptions = {
              refValue,
              consolidatedFlat: true,
            };
            const vizMode = getPerfSegmentVizMode(segment);
            renderPerfViz(
              fold.querySelector(".stats-perf-viz"),
              rows,
              metric,
              perfViewColLabel(view),
              vizMode,
              chartOptions,
            );
          }

          function buildStatsMultiSelectHtml(dimension, fieldLabel, placeholder, options, selected, disabled = false) {
            const selectedList = asFilterArray(selected);
            const noneSelected = isComboFilterNone(selectedList);
            const allSelected = !noneSelected && isFilterAllSelected(selectedList, options);
            const selectedSet = new Set(selectedList);
            const summary = disabled
              ? "Nicht verfügbar"
              : multiSelectTriggerLabel(selectedList, options, placeholder);
            const optionsHtml = options
              .map((option) => {
                const safe = option.replace(/"/g, "&quot;");
                const checked = !noneSelected && (allSelected || selectedSet.has(option)) ? " checked" : "";
                const inputDisabled = disabled ? " disabled" : "";
                return `<label class="stats-multi-select-option">
                  <input type="checkbox" class="perf-combo-${dimension}-cb" value="${safe}"${checked}${inputDisabled} />
                  <span>${option}</span>
                </label>`;
              })
              .join("");
            const disabledClass = disabled ? " is-disabled" : "";
            const triggerDisabled = disabled ? " disabled" : "";
            return `<div class="stats-multi-select${disabledClass}" data-multi-dimension="${dimension}" data-placeholder="${placeholder.replace(/"/g, "&quot;")}"${disabled ? ' data-filter-disabled="1"' : ""}>
                <span class="stats-multi-select-field-label">${fieldLabel}</span>
                <button type="button" class="stats-multi-select-trigger" aria-expanded="false" aria-haspopup="listbox"${triggerDisabled}${disabled ? ' title="Bei dieser Analyseebene nicht verfügbar"' : ""}>
                  <span class="stats-multi-select-trigger-text">${summary}</span>
                  <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
                </button>
                <div class="stats-multi-select-panel" hidden role="listbox">
                  <button type="button" class="stats-multi-select-toggle-all">Alle aus/abwählen</button>
                  <div class="stats-multi-select-options">${optionsHtml}</div>
                </div>
              </div>`;
          }

          function readMultiFilterFromCard(card, dimension, allOptions) {
            const checkboxes = Array.from(card.querySelectorAll(`.perf-combo-${dimension}-cb`));
            const checked = checkboxes.filter((cb) => cb.checked).map((cb) => cb.value);
            if (!checkboxes.length) return [];
            if (!checked.length) return [COMBO_FILTER_NONE];
            if (checked.length >= allOptions.length) return [];
            return checked;
          }

          function isMultiSelectFullyChecked(multiEl, dimension) {
            const checkboxes = Array.from(multiEl.querySelectorAll(`.perf-combo-${dimension}-cb`));
            if (!checkboxes.length) return true;
            return checkboxes.every((cb) => cb.checked);
          }

          function toggleStatsMultiSelectAll(multiEl) {
            const dimension = multiEl.dataset.multiDimension;
            if (!dimension) return;
            const selectAll = !isMultiSelectFullyChecked(multiEl, dimension);
            multiEl.querySelectorAll(`.perf-combo-${dimension}-cb`).forEach((cb) => {
              cb.checked = selectAll;
            });
          }

          function defaultPerfSegmentState() {
            return {
              vizMode: "bars",
              draft: {
                level: "standort-mitarbeiter",
                detailLevel: "detail",
                filters: defaultComboFilters(),
                name: "",
              },
              selected: [],
            };
          }

          function normalizePerfSegmentState(state, metric, period) {
            if (state.combos && !state.selected) {
              state.selected = state.combos;
              delete state.combos;
            }
            if (!state.draft) {
              state.draft = defaultPerfSegmentState().draft;
            }
            if (!state.selected) state.selected = [];
            if (state.vizMode === "pie") state.vizMode = "bars";
            if (state.vizMode !== "table" && state.vizMode !== "bars") {
              state.vizMode = "bars";
            }
            state.draft = normalizePerfCombo({ ...state.draft }, metric, period);
            state.selected = state.selected.map((combo) => normalizePerfCombo({ ...combo }, metric, period));
            return state;
          }

          function getComboConfiguratorRoot(segment) {
            return segment.querySelector(".stats-perf-combo-configurator");
          }

          function readDraftFromConfigurator(segment, metric, period) {
            const root = getComboConfiguratorRoot(segment);
            if (!root) return defaultPerfSegmentState().draft;
            const draft = {
              level: root.querySelector(".perf-combo-level")?.value || "standort-mitarbeiter",
              name: root.querySelector(".perf-combo-name")?.value?.trim() || "",
              detailLevel: "detail",
              filters: defaultComboFilters(),
            };
            const standortKeys = getStandortKeys(metric, period);
            draft.filters.standort = readMultiFilterFromCard(root, "standort", standortKeys);
            const maKeys = getMitarbeiterKeysForCombo(metric, period, draft.filters.standort);
            draft.filters.mitarbeiter = readMultiFilterFromCard(root, "mitarbeiter", maKeys);
            const produktKeys = getProduktKeysForCombo(
              metric,
              period,
              draft.filters.standort,
              draft.filters.mitarbeiter,
            );
            draft.filters.produkt = readMultiFilterFromCard(root, "produkt", produktKeys);
            return normalizePerfCombo(draft, metric, period);
          }

          function syncDraftFromConfigurator(segment, metric, period) {
            const state = perfSegmentState.get(segment);
            if (!state) return;
            Object.assign(state.draft, readDraftFromConfigurator(segment, metric, period));
          }

          function getOpenComboMultiDimensions(segment) {
            const root = getComboConfiguratorRoot(segment);
            if (!root) return [];
            return [...root.querySelectorAll(".stats-multi-select.is-open")]
              .map((el) => el.dataset.multiDimension)
              .filter(Boolean);
          }

          function restoreOpenComboMultiSelects(segment, dimensions) {
            const root = getComboConfiguratorRoot(segment);
            if (!root || !dimensions.length) return;
            dimensions.forEach((dimension) => {
              const multi = root.querySelector(
                `.stats-multi-select[data-multi-dimension="${dimension}"]`,
              );
              if (!multi || multi.dataset.filterDisabled === "1") return;
              multi.classList.add("is-open");
              const trigger = multi.querySelector(".stats-multi-select-trigger");
              const panelEl = multi.querySelector(".stats-multi-select-panel");
              if (trigger) trigger.setAttribute("aria-expanded", "true");
              if (panelEl) panelEl.hidden = false;
            });
          }

          function applyComboFiltersFromConfigurator(segment) {
            const metric = segment.dataset.perfMetric;
            const period = getPerformancePeriod();
            const state = perfSegmentState.get(segment);
            if (!state) return;
            const openDimensions = getOpenComboMultiDimensions(segment);
            syncDraftFromConfigurator(segment, metric, period);
            state.draft = normalizePerfCombo(state.draft, metric, period);
            renderComboConfigurator(segment, metric, period, state.draft);
            restoreOpenComboMultiSelects(segment, openDimensions);
          }

          function applyComboCompareFromConfigurator(segment) {
            const metric = segment.dataset.perfMetric;
            const period = getPerformancePeriod();
            const state = perfSegmentState.get(segment);
            if (!state) return;
            syncDraftFromConfigurator(segment, metric, period);
            state.draft = normalizePerfCombo(state.draft, metric, period);
            if (!isComboCompareReady(state.draft.filters, state.draft.level)) {
              syncComboCompareButtonState(segment, state.draft);
              return;
            }
            state.selected = [cloneCombo(state.draft)];
            renderComboResults(segment, metric, period);
          }

          function cloneCombo(combo) {
            return {
              level: combo.level,
              detailLevel: combo.detailLevel,
              name: combo.name,
              filters: {
                standort: [...asFilterArray(combo.filters?.standort)],
                mitarbeiter: [...asFilterArray(combo.filters?.mitarbeiter)],
                produkt: [...asFilterArray(combo.filters?.produkt)],
              },
            };
          }

          function getSelectedComboDisplayRows(selected, metric, period) {
            const rows = [];
            selected.forEach((combo, comboIndex) => {
              rows.push({
                kind: "combo-header",
                label: comboSectionHeadline(combo),
                depth: -1,
                comboIndex,
                value: null,
                width: 0,
              });
              getComboHierarchyRows(combo, metric, period).forEach((row) => {
                rows.push({
                  ...row,
                  sublabel: comboRowSublabel(row, combo.level),
                  comboIndex,
                });
              });
            });
            return rows;
          }

          function updateStatsMultiSelectTrigger(multiSelectEl, selected, allOptions, placeholder) {
            const textEl = multiSelectEl?.querySelector(".stats-multi-select-trigger-text");
            if (textEl) {
              textEl.textContent = multiSelectTriggerLabel(selected, allOptions, placeholder);
            }
          }

          function closeAllStatsMultiSelects(exceptEl = null) {
            document.querySelectorAll(".stats-multi-select.is-open").forEach((el) => {
              if (exceptEl && el === exceptEl) return;
              el.classList.remove("is-open");
              const trigger = el.querySelector(".stats-multi-select-trigger");
              const panel = el.querySelector(".stats-multi-select-panel");
              if (trigger) trigger.setAttribute("aria-expanded", "false");
              if (panel) panel.hidden = true;
            });
          }

          function buildComboFilterHtml(metric, period, filters, level) {
            const standortKeys = getStandortKeys(metric, period);
            if (!standortKeys.length) return "<p class=\"stats-perf-empty\">Keine Filter verfügbar.</p>";
            const standortSel = asFilterArray(filters?.standort);
            const maSel = asFilterArray(filters?.mitarbeiter);
            const produktSel = asFilterArray(filters?.produkt);
            const maKeys = getMitarbeiterKeysForCombo(metric, period, standortSel);
            const produktKeys = getProduktKeysForCombo(metric, period, standortSel, maSel);
            const produktFilterDisabled = !comboLevelAllowsProduktFilter(level);
            return `<div class="stats-perf-combo-filters">
                ${buildStatsMultiSelectHtml("standort", "Standort", "Standorte auswählen", standortKeys, standortSel)}
                ${buildStatsMultiSelectHtml("mitarbeiter", "Mitarbeiter", "Mitarbeiter auswählen", maKeys, maSel)}
                ${buildStatsMultiSelectHtml("produkt", "Produkt", "Produkte auswählen", produktKeys, produktSel, produktFilterDisabled)}
              </div>`;
          }

          function renderComboConfigurator(segment, metric, period, draft) {
            const mount = getComboConfiguratorRoot(segment);
            if (!mount) return;
            const levelOptions = Object.entries(PERF_HIERARCHY_LEVELS)
              .map(
                ([id, meta]) =>
                  `<option value="${id}" ${draft.level === id ? "selected" : ""}>${meta.label}</option>`,
              )
              .join("");
            mount.innerHTML = `
              <div class="stats-perf-combo-config">
                <label class="stats-perf-combo-field">Name
                  <input type="text" class="perf-combo-name" value="${(draft.name || "").replace(/"/g, "&quot;")}" placeholder="${hierarchyLevelLabel(draft.level).replace(/"/g, "&quot;")}" maxlength="48" />
                </label>
                <label class="stats-perf-combo-field">Analyseebene
                  <select class="perf-combo-level">${levelOptions}</select>
                </label>
              </div>
              ${buildComboFilterHtml(metric, period, draft.filters, draft.level)}
              <div class="stats-perf-combo-compare-wrap">
                <button type="button" class="btn btn-primary stats-perf-combo-compare" disabled>Jetzt vergleichen</button>
              </div>`;
            syncComboCompareButtonState(segment, draft);
          }

          function renderComboResults(segment, metric, period) {
            const state = perfSegmentState.get(segment);
            const viz = segment.querySelector(".stats-perf-combo-results-viz");
            if (!viz || !state) return;
            const selected = state.selected || [];
            const refValue = getPerfSegmentRefValue(metric);
            if (!selected.length) {
              viz.innerHTML =
                '<p class="stats-perf-empty">Wählen Sie Analyseebene und Filter und klicken Sie auf „Jetzt vergleichen“.</p>';
              return;
            }
            const rows = filterPerfDisplayRows(getSelectedComboDisplayRows(selected, metric, period));
            const level = selected[0]?.level || "standort-mitarbeiter";
            renderPerfBarChart(viz, rows, metric, {
              refValue,
              leanHierarchy: false,
            });
          }

          function refreshPerformanceSegment(segment) {
            const metric = segment.dataset.perfMetric;
            if (!metric) return;
            ensurePerfExportBar(segment);
            removePerfConsolidatedSummaryBlocks(segment);
            const period = getPerformancePeriod();
            let state = perfSegmentState.get(segment);
            if (!state) {
              state = defaultPerfSegmentState();
              perfSegmentState.set(segment, state);
            }
            normalizePerfSegmentState(state, metric, period);
            syncPerfVizToggleUi(segment, state.vizMode);
            perfSegmentDimensionViews(metric).forEach((view) =>
              renderSimpleDimensionFold(segment, metric, period, view),
            );
            renderComboConfigurator(segment, metric, period, state.draft);
            renderComboResults(segment, metric, period);
          }

          function refreshAllPerformanceSegments() {
            document.querySelectorAll(".stats-perf-segment[data-perf-metric]").forEach(refreshPerformanceSegment);
          }

          function renderPerformanceFoldOnOpen(fold) {
            if (!fold?.open || fold.classList.contains("stats-perf-combo-fold")) return;
            const segment = fold.closest(".stats-perf-segment[data-perf-metric]");
            if (!segment) return;
            const view = fold.dataset.perfView;
            if (!view) return;
            renderSimpleDimensionFold(segment, segment.dataset.perfMetric, getPerformancePeriod(), view);
          }

          const PERF_DETAIL_DEFAULT_ORDER = [
            "conversion",
            "complaints",
            "investment",
            "timeToContact",
            "responseRate",
            "handlingTime",
          ];
          let perfDetailOpenOrder = [];

          function applyPerfDetailStackOrder() {
            const stack = document.querySelector("#statsPanelPerformance .stats-performance-stack");
            if (!stack) return;
            const byMetric = new Map(
              [...stack.querySelectorAll(".stats-perf-segment[data-perf-metric]")].map((segment) => [
                segment.dataset.perfMetric,
                segment,
              ]),
            );
            const ordered = [
              ...perfDetailOpenOrder.map((metric) => byMetric.get(metric)).filter(Boolean),
              ...PERF_DETAIL_DEFAULT_ORDER.filter((metric) => !perfDetailOpenOrder.includes(metric))
                .map((metric) => byMetric.get(metric))
                .filter(Boolean),
            ];
            ordered.forEach((segment) => stack.appendChild(segment));
          }

          function syncPerfDetailUi() {
            const panel = document.getElementById("statsPanelPerformance");
            if (!panel) return;
            const consolidated = perfDetailOpenOrder.length === 0;
            const perfCard = panel.querySelector(".stats-card-performance");
            const exportAnchor = panel.querySelector(".stats-perf-consolidated-export-anchor");
            perfCard?.classList.toggle("is-perf-consolidated-view", consolidated);
            if (exportAnchor) exportAnchor.hidden = !consolidated;
            panel.querySelectorAll(".stats-perf-kpi-card").forEach((card) => {
              const metric = card.dataset.perfMetric;
              const isOpen = perfDetailOpenOrder.includes(metric);
              card.classList.toggle("is-detail-open", isOpen);
              const btn = card.querySelector(".stats-perf-detail-btn");
              if (btn) btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
            });
          }

          function openPerfDetail(metric) {
            const panel = document.getElementById("statsPanelPerformance");
            if (!panel || !metric) return;
            panel.querySelectorAll(".stats-perf-segment[data-perf-metric]").forEach((seg) => {
              const isTarget = seg.dataset.perfMetric === metric;
              seg.classList.toggle("is-detail-hidden", !isTarget);
            });
            perfDetailOpenOrder = [metric];
            const segment = panel.querySelector(`.stats-perf-segment[data-perf-metric="${metric}"]`);
            if (!segment) return;
            segment.classList.remove("is-detail-hidden");
            refreshPerformanceSegment(segment);
            applyPerfDetailStackOrder();
            syncPerfDetailUi();
            const standortFold = segment.querySelector('[data-perf-view="standort"]');
            if (standortFold) {
              standortFold.open = true;
              renderPerformanceFoldOnOpen(standortFold);
            }
            segment.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }

          function closePerfDetail(metric) {
            const panel = document.getElementById("statsPanelPerformance");
            if (!panel) return;
            if (metric) {
              perfDetailOpenOrder = perfDetailOpenOrder.filter((m) => m !== metric);
              const segment = panel.querySelector(`.stats-perf-segment[data-perf-metric="${metric}"]`);
              segment?.classList.add("is-detail-hidden");
            } else {
              perfDetailOpenOrder = [];
              panel.querySelectorAll(".stats-perf-segment[data-perf-metric]").forEach((segment) => {
                segment.classList.add("is-detail-hidden");
              });
            }
            applyPerfDetailStackOrder();
            syncPerfDetailUi();
          }

          function initPerformanceSegments() {
            const panel = document.getElementById("statsPanelPerformance");
            if (!panel) return;
            closePerfDetail();
            syncPerfDetailUi();
            panel.addEventListener("toggle", (event) => {
              const fold = event.target.closest(".stats-perf-fold[data-perf-view]");
              if (fold) renderPerformanceFoldOnOpen(fold);
            });
            panel.addEventListener("click", (event) => {
              const detailCloseBtn = event.target.closest(".stats-perf-detail-close");
              if (detailCloseBtn) {
                const segment = detailCloseBtn.closest(".stats-perf-segment[data-perf-metric]");
                closePerfDetail(segment?.dataset.perfMetric);
                return;
              }
              const detailOpenBtn = event.target.closest(".stats-perf-detail-btn");
              if (detailOpenBtn) {
                const metric = detailOpenBtn.dataset.perfMetric;
                const panelEl = document.getElementById("statsPanelPerformance");
                const segment = panelEl?.querySelector(
                  `.stats-perf-segment[data-perf-metric="${metric}"]`,
                );
                const isOpen = segment && !segment.classList.contains("is-detail-hidden");
                if (isOpen) {
                  closePerfDetail(metric);
                } else {
                  openPerfDetail(metric);
                }
                return;
              }
              const consolidatedExportBtn = event.target.closest(
                ".stats-perf-consolidated-export-btn",
              );
              if (consolidatedExportBtn) {
                exportPerformanceConsolidatedCsv();
                return;
              }
              const exportBtn = event.target.closest(
                ".stats-perf-export-btn:not(.stats-perf-consolidated-export-btn)",
              );
              if (exportBtn) {
                const segment = exportBtn.closest(".stats-perf-segment[data-perf-metric]");
                if (segment) exportPerformanceSegmentCsv(segment);
                return;
              }
              const vizBtn = event.target.closest(".stats-perf-viz-btn[data-viz-mode]");
              if (vizBtn) {
                const segment = vizBtn.closest(".stats-perf-segment[data-perf-metric]");
                if (!segment) return;
                const mode = vizBtn.dataset.vizMode;
                let state = perfSegmentState.get(segment);
                if (!state) {
                  state = defaultPerfSegmentState();
                  perfSegmentState.set(segment, state);
                }
                state.vizMode = mode === "table" ? "table" : "bars";
                syncPerfVizToggleUi(segment, state.vizMode);
                refreshPerformanceSegment(segment);
                return;
              }
              const toggleAllBtn = event.target.closest(".stats-multi-select-toggle-all");
              if (toggleAllBtn) {
                event.preventDefault();
                const multi = toggleAllBtn.closest(".stats-multi-select");
                const segment = multi?.closest(".stats-perf-segment[data-perf-metric]");
                if (!multi || !segment) return;
                toggleStatsMultiSelectAll(multi);
                applyComboFiltersFromConfigurator(segment);
                return;
              }
              const trigger = event.target.closest(".stats-multi-select-trigger");
              if (trigger) {
                const multi = trigger.closest(".stats-multi-select");
                if (!multi || multi.dataset.filterDisabled === "1") return;
                const open = !multi.classList.contains("is-open");
                closeAllStatsMultiSelects(open ? multi : null);
                multi.classList.toggle("is-open", open);
                trigger.setAttribute("aria-expanded", open ? "true" : "false");
                const panel = multi.querySelector(".stats-multi-select-panel");
                if (panel) panel.hidden = !open;
                return;
              }
              if (!event.target.closest(".stats-multi-select")) {
                closeAllStatsMultiSelects();
              }
              const compareBtn = event.target.closest(".stats-perf-combo-compare");
              const segment = event.target.closest(".stats-perf-segment[data-perf-metric]");
              if (!segment) return;
              if (compareBtn) {
                if (compareBtn.disabled) return;
                applyComboCompareFromConfigurator(segment);
                return;
              }
            });
            panel.addEventListener("change", (event) => {
              const segment = event.target.closest(".stats-perf-segment[data-perf-metric]");
              if (!segment) return;
              const configurator = event.target.closest(".stats-perf-combo-configurator");
              if (!configurator) return;
              const state = perfSegmentState.get(segment);
              if (!state) return;
              const metric = segment.dataset.perfMetric;
              const period = getPerformancePeriod();
              if (event.target.classList.contains("perf-combo-level")) {
                syncDraftFromConfigurator(segment, metric, period);
                state.draft = normalizePerfCombo(state.draft, metric, period);
                renderComboConfigurator(segment, metric, period, state.draft);
                return;
              }
              const gebietCb = event.target.classList.contains("perf-combo-standort-cb");
              const maCb = event.target.classList.contains("perf-combo-mitarbeiter-cb");
              const produktCb = event.target.classList.contains("perf-combo-produkt-cb");
              if (gebietCb || maCb || produktCb) {
                event.stopPropagation();
                applyComboFiltersFromConfigurator(segment);
              }
            });
            panel.addEventListener("input", (event) => {
              if (!event.target.classList.contains("perf-combo-name")) return;
              const segment = event.target.closest(".stats-perf-segment[data-perf-metric]");
              if (!segment || !event.target.closest(".stats-perf-combo-configurator")) return;
              const state = perfSegmentState.get(segment);
              if (!state) return;
              state.draft.name = event.target.value;
            });
            document.addEventListener("click", (event) => {
              if (event.target.closest(".stats-multi-select")) return;
              closeAllStatsMultiSelects();
            });

            refreshAllPerformanceSegments();
          }

          function formatPerfSummaryKpi(metric, value, leadCount) {
            if (!leadCount || value == null || Number.isNaN(value)) return "—";
            if (metric === "investment") return `${Math.round(value).toLocaleString("de-DE")} €`;
            if (metric === "handlingTime") return formatPerfHandlingTime(value);
            if (metric === "timeToContact") return formatPerfTimeToContact(value);
            return `${value.toFixed(1).replace(".", ",")}%`;
          }

          // Real "Gesamt" value for a metric (respects the Standort filter).
          function getPerfBaseMetricValue(metric) {
            const leads = getLeadsInPerformancePeriod("gesamt");
            leads.forEach(ensureLeadRowPrice);
            return computeGroupMetricFromLeads(leads, metric, "gesamt");
          }

          function clampPerfMetricValue(metric, value) {
            if (value == null || Number.isNaN(value)) return null;
            if (perfMetricUnit(metric) === "%") return Math.min(100, Math.max(0, value));
            return Math.max(0, value);
          }

          // Displayed value for a range = real base scaled by the deterministic
          // range/metric factor (Gesamt factor is 1, i.e. the real base value).
          function getPerfMetricValueForRange(metric, range) {
            const base = getPerfBaseMetricValue(metric);
            if (base == null) return null;
            return clampPerfMetricValue(metric, base * perfRangeScaleFactor(range, metric));
          }

          function formatPerfDelta(deltaPct) {
            const rounded = Math.round(deltaPct);
            return `${rounded > 0 ? "+" : ""}${rounded} %`;
          }

          function perfDeltaColor(metric, deltaPct) {
            if (Math.round(deltaPct) === 0) return "#707070";
            const higherIsBetter = PERF_METRIC_HIGHER_IS_BETTER[metric] !== false;
            const improved = deltaPct > 0 === higherIsBetter;
            return improved ? "#77993C" : "#E74C3C";
          }

          function renderPerfKpiComparison(metric, valueEl, currentValue) {
            const card = valueEl.closest(".stats-perf-kpi-card");
            if (!card) return;
            const textWrap = valueEl.closest(".stats-perf-kpi-text") || card;
            let deltaEl = card.querySelector(".stats-perf-kpi-delta");
            let compareEl = card.querySelector(".stats-perf-kpi-compare");
            if (!perfRangeState.compare) {
              if (deltaEl) deltaEl.remove();
              if (compareEl) compareEl.remove();
              return;
            }
            const compareValue = getPerfMetricValueForRange(metric, getResolvedCompareRange());
            if (!deltaEl) {
              deltaEl = document.createElement("span");
              deltaEl.className = "stats-perf-kpi-delta";
              valueEl.insertAdjacentElement("afterend", deltaEl);
            }
            if (!compareEl) {
              compareEl = document.createElement("span");
              compareEl.className = "stats-perf-kpi-compare";
              const helper = textWrap.querySelector(".stats-perf-kpi-helper");
              if (helper) helper.insertAdjacentElement("afterend", compareEl);
              else textWrap.appendChild(compareEl);
            }
            if (currentValue == null || compareValue == null || !compareValue) {
              deltaEl.textContent = "–";
              deltaEl.style.color = "#707070";
              compareEl.textContent = `Vergleich: ${formatPerfSummaryKpi(metric, compareValue, compareValue == null ? 0 : 1)}`;
              return;
            }
            const deltaPct = ((currentValue - compareValue) / compareValue) * 100;
            deltaEl.textContent = formatPerfDelta(deltaPct);
            deltaEl.style.color = perfDeltaColor(metric, deltaPct);
            compareEl.textContent = `Vergleich: ${formatPerfSummaryKpi(metric, compareValue, 1)}`;
          }

          function syncPerformanceSummaryKpis() {
            const range = getResolvedPerfRange();
            const hasLeads = getLeadsInPerformancePeriod("gesamt").length > 0;
            PERF_SUMMARY_METRICS.forEach(([metric, elementId]) => {
              const el = document.getElementById(elementId);
              if (!el) return;
              const value = getPerfMetricValueForRange(metric, range);
              el.textContent = formatPerfSummaryKpi(metric, value, hasLeads ? 1 : 0);
              renderPerfKpiComparison(metric, el, value);
            });
            updatePerfRangeLine();
            syncPerformanceSparklines();
            refreshAllPerformanceSegments();
          }


    function boot() {
      refreshPerformanceTenantLists();
      initPerformancePeriodTabs();
      initPerformancePeriodControls();
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
      resetPerformanceControls,
      boot,
    };
  }

  global.initStatsPerformanceModule = initStatsPerformanceModule;
})(typeof window !== "undefined" ? window : global);
