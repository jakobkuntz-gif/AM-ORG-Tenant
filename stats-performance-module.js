const PERF_METRIC_META = {
        conversion: { column: "Umwandlungsquoten", fill: "blue" },
        complaints: { column: "Reklamation", fill: "blue" },
        investment: { column: "Investition", fill: "green" },
      };
      const COMBO_FILTER_NONE = "__NONE__";
      const UNASSIGNED_OWNER_OPTIONS = ["Nicht zugewiesen"];

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
          gebiet: {
            flat: { "newcare home Hasbergen": 38.2, "newcare home Till": 31.8, "Kein Gebiet": 28.6 },
            nested: {
              "newcare home Hasbergen": { "Stationäre Pflege": 42.0, "Std. Betreuung": 35.5 },
              "newcare home Till": { "Betreutes Wohnen": 29.4, Haushaltshilfe: 34.1 },
              "Kein Gebiet": { Unbekannt: 26.2 },
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
          gebiet: {
            flat: { "newcare home Hasbergen": 1.6, "newcare home Till": 2.3, "Kein Gebiet": 2.4 },
            nested: {
              "newcare home Hasbergen": { "Stationäre Pflege": 1.2, "Std. Betreuung": 2.0 },
              "newcare home Till": { "Betreutes Wohnen": 2.8, Haushaltshilfe: 1.9 },
              "Kein Gebiet": { Unbekannt: 2.7 },
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
          gebiet: {
            flat: { "newcare home Hasbergen": 265, "newcare home Till": 292, "Kein Gebiet": 298 },
            nested: {
              "newcare home Hasbergen": { "Stationäre Pflege": 248, "Std. Betreuung": 279 },
              "newcare home Till": { "Betreutes Wohnen": 305, Haushaltshilfe: 278 },
              "Kein Gebiet": { Unbekannt: 312 },
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
        "gebiet-mitarbeiter": { label: "1 — Gebiet → Mitarbeiter", short: "Gebiet → Mitarbeiter" },
        "gebiet-mitarbeiter-produkt": {
          label: "2 — Gebiet → Mitarbeiter → Produkt",
          short: "Gebiet → Mitarbeiter → Produkt",
        },
        "gebiet-produkt": { label: "3 — Gebiet → Produkt (ohne Mitarbeiter)", short: "Gebiet → Produkt" },
      };

      const DEMO_GEBIET_EMPLOYEE_STATS = [
        {
          gebiet: "newcare home Hasbergen",
          mitarbeiter: "Jakob Kuntz",
          conversion: { gebiet: 38.2, employee: 39.5, produkt: { "Stationäre Pflege": 42.0, "Std. Betreuung": 33.8 } },
          complaints: { gebiet: 1.6, employee: 1.4, produkt: { "Stationäre Pflege": 1.1, "Std. Betreuung": 1.8 } },
          investment: { gebiet: 265, employee: 258, produkt: { "Stationäre Pflege": 255, "Std. Betreuung": 284 } },
        },
        {
          gebiet: "newcare home Hasbergen",
          mitarbeiter: "Jonas Markus",
          conversion: { gebiet: 38.2, employee: 37.2, produkt: { Haushaltshilfe: 37.0, "Betreutes Wohnen": 36.5 } },
          complaints: { gebiet: 1.6, employee: 1.7, produkt: { Haushaltshilfe: 1.7, "Betreutes Wohnen": 1.5 } },
          investment: { gebiet: 265, employee: 272, produkt: { Haushaltshilfe: 275, "Betreutes Wohnen": 268 } },
        },
        {
          gebiet: "newcare home Moyland",
          mitarbeiter: "Marie Becker",
          conversion: { gebiet: 33.5, employee: 34.8, produkt: { "Betreutes Wohnen": 35.2, Kurzzeitpflege: 32.1 } },
          complaints: { gebiet: 2.0, employee: 1.9, produkt: { "Betreutes Wohnen": 2.1, Kurzzeitpflege: 1.7 } },
          investment: { gebiet: 278, employee: 271, produkt: { "Betreutes Wohnen": 268, Kurzzeitpflege: 282 } },
        },
        {
          gebiet: "newcare home Moyland",
          mitarbeiter: "Tim Wagner",
          conversion: { gebiet: 33.5, employee: 32.1, produkt: { Tagespflege: 31.4, Haushaltshilfe: 33.0 } },
          complaints: { gebiet: 2.0, employee: 2.1, produkt: { Tagespflege: 2.2, Haushaltshilfe: 1.9 } },
          investment: { gebiet: 278, employee: 285, produkt: { Tagespflege: 288, Haushaltshilfe: 279 } },
        },
        {
          gebiet: "newcare home Vellmar",
          mitarbeiter: "Sara Hoffmann",
          conversion: { gebiet: 29.8, employee: 31.2, produkt: { "Std. Betreuung": 32.0, Pflegedienst: 29.8 } },
          complaints: { gebiet: 2.2, employee: 2.0, produkt: { "Std. Betreuung": 1.9, Pflegedienst: 2.1 } },
          investment: { gebiet: 288, employee: 295, produkt: { "Std. Betreuung": 292, Pflegedienst: 301 } },
        },
        {
          gebiet: "newcare home Vellmar",
          mitarbeiter: "Felix Braun",
          conversion: { gebiet: 29.8, employee: 28.4, produkt: { Bewerbung: 30.1, Haushaltshilfe: 26.8 } },
          complaints: { gebiet: 2.2, employee: 2.3, produkt: { Bewerbung: 2.4, Haushaltshilfe: 2.1 } },
          investment: { gebiet: 288, employee: 302, produkt: { Bewerbung: 305, Haushaltshilfe: 296 } },
        },
        {
          gebiet: "Kein Gebiet",
          mitarbeiter: "Lea Schneider",
          conversion: { gebiet: 28.6, employee: 30.9, produkt: { Bewerbung: 32.1, Unbekannt: 27.4 } },
          complaints: { gebiet: 2.4, employee: 2.5, produkt: { Bewerbung: 2.1, Unbekannt: 2.9 } },
          investment: { gebiet: 298, employee: 301, produkt: { Bewerbung: 289, Unbekannt: 318 } },
        },
      ];

      /** Gebiete ohne Mitarbeiter — Gebiet-Durchschnitt inkl. zugehöriger Produkte. */
      const DEMO_GEBIET_ONLY_STATS = [
        {
          gebiet: "newcare home Radevormwald",
          conversion: {
            gebiet: 27.4,
            produkt: { Bewerbung: 30.1, "24 Stunden Betreuung": 26.5, "Betreutes Wohnen": 28.2 },
          },
          complaints: {
            gebiet: 2.6,
            produkt: { Bewerbung: 2.5, "24 Stunden Betreuung": 2.2, "Betreutes Wohnen": 2.7 },
          },
          investment: {
            gebiet: 305,
            produkt: { Bewerbung: 302, "24 Stunden Betreuung": 310, "Betreutes Wohnen": 298 },
          },
        },
        {
          gebiet: "newcare home Till",
          conversion: {
            gebiet: 31.8,
            produkt: { "Betreutes Wohnen": 31.5, Haushaltshilfe: 34.1, "Ambulante Pflege": 30.4 },
          },
          complaints: {
            gebiet: 2.3,
            produkt: { "Betreutes Wohnen": 2.2, Haushaltshilfe: 1.9, "Ambulante Pflege": 2.4 },
          },
          investment: {
            gebiet: 292,
            produkt: { "Betreutes Wohnen": 296, Haushaltshilfe: 278, "Ambulante Pflege": 288 },
          },
        },
        {
          gebiet: "newcare home Fritzlar",
          conversion: {
            gebiet: 36.1,
            produkt: { "Std. Betreuung": 38.0, Pflegedienst: 34.2, Kurzzeitpflege: 35.5 },
          },
          complaints: {
            gebiet: 1.8,
            produkt: { "Std. Betreuung": 1.5, Pflegedienst: 1.9, Kurzzeitpflege: 1.7 },
          },
          investment: {
            gebiet: 272,
            produkt: { "Std. Betreuung": 260, Pflegedienst: 279, Kurzzeitpflege: 268 },
          },
        },
      ];

      function buildPerfHierarchyForMetric(metricKey) {
        const tree = {};
        DEMO_GEBIET_EMPLOYEE_STATS.forEach((entry) => {
          const stats = entry[metricKey];
          if (!tree[entry.gebiet]) {
            tree[entry.gebiet] = {
              value: stats.gebiet,
              mitarbeiter: {},
              produkt: {},
            };
          }
          tree[entry.gebiet].mitarbeiter[entry.mitarbeiter] = {
            value: stats.employee,
            produkt: { ...stats.produkt },
          };
          Object.entries(stats.produkt).forEach(([product, value]) => {
            if (tree[entry.gebiet].produkt[product] == null) {
              tree[entry.gebiet].produkt[product] = value;
            }
          });
        });
        DEMO_GEBIET_ONLY_STATS.forEach((entry) => {
          if (tree[entry.gebiet]) return;
          const stats = entry[metricKey];
          tree[entry.gebiet] = {
            value: stats.gebiet,
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
          conversion: [40.8, 34.6, 30.2, 35.5, 31.4, 28.4, 32.0, 26.8, 38.0, 29.8, 36.5, 33.2, 27.6, 31.0, 34.1],
          complaints: [1.4, 1.9, 2.5, 1.8, 2.0, 2.3, 1.6, 2.8, 1.5, 2.2, 1.7, 2.1, 2.4, 1.9, 2.0],
          investment: [258, 281, 300, 276, 289, 295, 266, 315, 260, 301, 272, 285, 298, 268, 279],
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
          const gebietFlat = {};
          const gebietNested = {};
          const mitarbeiterFlat = {};
          const mitarbeiterNested = {};
          const produktFlat = {};
          DEMO_GEBIET_EMPLOYEE_STATS.forEach((entry) => {
            const stats = entry[metricKey];
            gebietFlat[entry.gebiet] = stats.gebiet;
            gebietNested[entry.gebiet] = { ...stats.produkt };
            mitarbeiterFlat[entry.mitarbeiter] = stats.employee;
            mitarbeiterNested[entry.mitarbeiter] = { ...stats.produkt };
            Object.entries(stats.produkt).forEach(([product, value]) => {
              if (produktFlat[product] === undefined) produktFlat[product] = value;
            });
          });
          DEMO_GEBIET_ONLY_STATS.forEach((entry) => {
            const stats = entry[metricKey];
            if (gebietFlat[entry.gebiet] == null) gebietFlat[entry.gebiet] = stats.gebiet;
            gebietNested[entry.gebiet] = { ...stats.produkt };
          });
          collectTenantProduktCatalog(metricKey, "gesamt").forEach((product, index) => {
            if (produktFlat[product] == null) {
              produktFlat[product] = fallbackProductMetric(metricKey, index);
            }
          });
          PERF_BASE_DATA[metricKey].gebiet.flat = gebietFlat;
          PERF_BASE_DATA[metricKey].gebiet.nested = gebietNested;
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

      function getPerformancePeriod() {
        const active = document.querySelector(
          "#statsPanelPerformance .stats-perf-period-tab.is-active, #statsPanelPerformance .stats-perf-period-tab[aria-selected='true']",
        );
        return active?.dataset?.perfPeriod || "gesamt";
      }

      function getPerformancePeriodLabel() {
        const labels = { gesamt: "Gesamt", day: "1T", "7d": "7T", "30d": "30T", "60d": "60T" };
        return labels[getPerformancePeriod()] || "Gesamt";
      }

      const PERF_EXPORT_LEVEL = "gebiet-mitarbeiter-produkt";

      function getPerfFullBreakdownRows(metric, period) {
        return filterPerfDisplayRows(
          getHierarchyRows(metric, period, PERF_EXPORT_LEVEL, {}, "detail", []),
        );
      }

      function perfExportRowFields(row) {
        let gebiet = "";
        let mitarbeiter = "";
        let produkt = "";
        if (row.kind === "gebiet") {
          gebiet = row.label || row.path || "";
        } else if (row.kind === "mitarbeiter") {
          gebiet = row.parent || "";
          mitarbeiter = row.label || row.path || "";
        } else if (row.kind === "produkt") {
          if (row.depth === 2) {
            gebiet = row.gebiet || "";
            mitarbeiter = row.parent || "";
            produkt = row.label || "";
          } else {
            gebiet = row.parent || "";
            produkt = row.label || "";
          }
        }
        const ebene =
          row.kind === "gebiet" ? "Gebiet" : row.kind === "mitarbeiter" ? "Mitarbeiter" : "Produkt";
        return { ebene, gebiet, mitarbeiter, produkt };
      }

      function formatPerfCsvRawValue(metric, value) {
        if (value == null || Number.isNaN(value)) return "";
        if (metric === "investment") return String(Math.round(value));
        return value.toFixed(2).replace(".", ",");
      }

      function escapeCsvField(value) {
        const text = String(value ?? "");
        if (/[;"\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
        return text;
      }

      function buildPerfSegmentCsv(metric, period) {
        const meta = PERF_METRIC_META[metric];
        const title =
          document
            .querySelector(
              `.stats-perf-segment[data-perf-metric="${metric}"] .stats-perf-panel-title`,
            )
            ?.textContent?.trim() || metric;
        const periodLabel = getPerformancePeriodLabel();
        const unit = metric === "investment" ? "EUR" : "%";
        const header = ["Ebene", "Gebiet", "Mitarbeiter", "Produkt", meta?.column || "Wert", "Einheit"];
        const lines = [
          `Bericht;${escapeCsvField(title)}`,
          `Zeitraum;${escapeCsvField(periodLabel)}`,
          `Aufschlüsselung;Gebiet → Mitarbeiter → Produkt (vollständig)`,
          "",
          header.map(escapeCsvField).join(";"),
        ];
        getPerfFullBreakdownRows(metric, period).forEach((row) => {
          const { ebene, gebiet, mitarbeiter, produkt } = perfExportRowFields(row);
          lines.push(
            [
              ebene,
              gebiet,
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
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }

      function perfSegmentExportFilename(metric, period) {
        const title =
          document
            .querySelector(
              `.stats-perf-segment[data-perf-metric="${metric}"] .stats-perf-panel-title`,
            )
            ?.textContent?.trim() || metric;
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

      function ensurePerfExportBar(segment) {
        const body = segment.querySelector(".stats-panel-body");
        if (!body) return null;
        let bar = body.querySelector(".stats-perf-export-bar");
        if (!bar) {
          bar = document.createElement("div");
          bar.className = "stats-perf-export-bar";
          bar.innerHTML = `<div class="stats-perf-viz-toggle stats-perf-export-toggle" role="group" aria-label="Export">
              <button type="button" class="stats-perf-viz-btn stats-perf-export-btn is-active" title="Als CSV exportieren (vollständige Aufschlüsselung)" aria-label="Als CSV exportieren (vollständige Aufschlüsselung)">
                <i class="fa-solid fa-file-export" aria-hidden="true"></i>
              </button>
            </div>`;
          body.appendChild(bar);
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

      function parseAnfrageDatum(text) {
        const match = String(text || "").trim().match(/(\d{2})\.(\d{2})\.(\d{4})(?:,\s*(\d{1,2}):(\d{2}))?/);
        if (!match) return null;
        const day = Number(match[1]);
        const month = Number(match[2]) - 1;
        const year = Number(match[3]);
        const hours = match[4] != null ? Number(match[4]) : 0;
        const minutes = match[5] != null ? Number(match[5]) : 0;
        const date = new Date(year, month, day, hours, minutes);
        return Number.isNaN(date.getTime()) ? null : date;
      }

      function getLeadAnfrageDatumSortTime(row) {
        const date = parseAnfrageDatum(getCellValue(row, "anfrageDatum"));
        return date ? date.getTime() : 0;
      }

      function compareLeadRowsByAnfrageDatum(a, b, direction) {
        const diff = getLeadAnfrageDatumSortTime(a) - getLeadAnfrageDatumSortTime(b);
        return direction === "asc" ? diff : -diff;
      }

      function sortLeadRows(rows) {
        if (leadTableSort.key !== "anfrageDatum") return rows;
        return [...rows].sort((a, b) =>
          compareLeadRowsByAnfrageDatum(a, b, leadTableSort.direction),
        );
      }

      function syncLeadBodyDomOrder(sortedRows) {
        if (!leadBody || !sortedRows.length) return;
        const sortedSet = new Set(sortedRows);
        const rest = getLeadRows().filter((row) => !sortedSet.has(row));
        sortedRows.forEach((row) => leadBody.appendChild(row));
        rest.forEach((row) => leadBody.appendChild(row));
      }

      function syncLeadTableSortHeaderUi() {
        const th = document.querySelector('th.lead-sortable-th[data-sort-key="anfrageDatum"]');
        const btn = document.querySelector(".lead-sort-btn[data-sort-key='anfrageDatum']");
        if (!th || !btn) return;
        const isDesc = leadTableSort.direction === "desc";
        th.classList.add("is-sort-active");
        th.setAttribute("aria-sort", isDesc ? "descending" : "ascending");
        const icon = btn.querySelector(".lead-sort-icon");
        if (icon) {
          icon.className = `fa-solid ${
            isDesc ? "fa-arrow-down-wide-short" : "fa-arrow-up-wide-short"
          } lead-sort-icon`;
        }
        btn.setAttribute(
          "aria-label",
          isDesc
            ? "Nach Anfrage-Datum sortieren: neueste zuerst"
            : "Nach Anfrage-Datum sortieren: älteste zuerst",
        );
        btn.title = isDesc ? "Neueste zuerst" : "Älteste zuerst";
      }

      function toggleLeadAnfrageDatumSort() {
        leadTableSort.direction = leadTableSort.direction === "desc" ? "asc" : "desc";
        syncLeadTableSortHeaderUi();
        applyFilter(true);
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
        const maxDays = periodToMaxDays(period);
        if (maxDays == null) return rows;
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return rows.filter((row) => {
          const date = parseAnfrageDatum(getCellValue(row, "anfrageDatum"));
          if (!date) return false;
          const diffDays = (end.getTime() - date.getTime()) / 86400000;
          return diffDays >= 0 && diffDays <= maxDays;
        });
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
        return 20 + (seed % 61);
      }

      function getLeadRowPrice(row) {
        const stored = row?.dataset?.leadPrice;
        if (stored != null && stored !== "") {
          const parsed = parseInt(stored, 10);
          if (Number.isFinite(parsed)) return parsed;
        }
        return leadPriceForProduct(getCellValue(row, "bedarf"), getCellValue(row, "anfragenNummer"));
      }

      function ensureLeadRowPrice(row) {
        if (!row) return;
        if (row.dataset.leadPrice != null && row.dataset.leadPrice !== "") return;
        row.dataset.leadPrice = String(
          leadPriceForProduct(getCellValue(row, "bedarf"), getCellValue(row, "anfragenNummer")),
        );
      }

      function leadsEligibleForConversionMetric(leads) {
        return leads.filter((row) => !isLeadExcludedFromConversionDenominator(getLeadRowStatus(row)));
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

      function computeGroupMetricFromLeads(leads, metric) {
        if (!leads.length) return null;
        if (metric === "conversion") {
          const eligible = leadsEligibleForConversionMetric(leads);
          if (!eligible.length) return null;
          const won = eligible.filter((row) => isLeadWonStatus(getLeadRowStatus(row))).length;
          return (won / eligible.length) * 100;
        }
        if (metric === "complaints") {
          const complaints = leads.filter((row) => isLeadComplaintStatus(getLeadRowStatus(row))).length;
          return (complaints / leads.length) * 100;
        }
        if (metric === "investment") {
          const spendBase = leadsEligibleForInvestmentSpend(leads);
          if (!spendBase.length) return null;
          const totalCost = spendBase.reduce((acc, row) => acc + getLeadRowPrice(row), 0);
          const neukunden = spendBase.filter((row) => isLeadWonStatus(getLeadRowStatus(row)));
          if (!neukunden.length) return totalCost;
          return totalCost / neukunden.length;
        }
        return null;
      }

      function lookupPerfFlatValue(metric, period, dimension, label) {
        return getPerfMetricData(metric, period)?.[dimension]?.flat?.[label] ?? null;
      }

      const MIN_LEADS_FOR_COMPUTED_METRIC = 6;

      function metricValueForLeadGroup(leads, metric, period, dimension, label) {
        if (leads.length > 0) {
          const computed = computeGroupMetricFromLeads(leads, metric);
          if (computed != null) return computed;
          if (metric === "investment") return null;
        }
        return lookupPerfFlatValue(metric, period, dimension, label);
      }

      function resolveMetricValue(leads, metric, period, dimension, label, preferredValue) {
        if (leads.length > 0) {
          const computed = computeGroupMetricFromLeads(leads, metric);
          if (computed != null) return computed;
          if (metric === "investment") return null;
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

      function countComplaintLeads(leads, statusFn) {
        return leads.filter((row) => statusFn(getLeadRowStatus(row))).length;
      }

      /** Share of all leads in the period (Reklamationsrate). */
      function complaintShareOfAllLeads(leads, statusFn) {
        if (!leads.length) return null;
        return (countComplaintLeads(leads, statusFn) / leads.length) * 100;
      }

      /** Share of eingereichte Reklamationen; status rows sum to 100%. */
      function complaintShareOfSubmitted(leads, statusFn) {
        const submitted = countComplaintLeads(leads, isLeadComplaintStatus);
        if (!submitted) return null;
        return (countComplaintLeads(leads, statusFn) / submitted) * 100;
      }

      const COMPLAINT_STATUS_BREAKDOWNS = [
        { label: "Erfolgreiche Reklamationen", statusFn: isLeadSuccessfulComplaintStatus },
        { label: "Abgelehnte Reklamationen", statusFn: isLeadRejectedComplaintStatus },
        { label: "In Bearbeitung", statusFn: isComplaintPendingStatus },
      ];

      function markComplaintParentRow(rows) {
        for (let i = rows.length - 1; i >= 0; i -= 1) {
          const row = rows[i];
          if (row.kind === "complaint-status" || row.kind === "complaint-group-divider") continue;
          row.isComplaintParent = true;
          return;
        }
      }

      function appendComplaintStatusBreakdownRows(rows, leads, parentLabel, depth, extra = {}) {
        const { includeSublabel = false, ...rowExtra } = extra;
        if (rows.length) markComplaintParentRow(rows);
        const submitted = countComplaintLeads(leads, isLeadComplaintStatus);
        COMPLAINT_STATUS_BREAKDOWNS.forEach(({ label, statusFn }) => {
          rows.push({
            label,
            value: submitted ? complaintShareOfSubmitted(leads, statusFn) : 0,
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
            value: complaintShareOfAllLeads(leads, isLeadComplaintStatus),
            kind: "complaint-group",
            depth: 0,
            path: "Eingereichte Reklamationen",
            sublabel: "Anteil aller Leads",
            isComplaintParent: true,
          },
        ];
        appendComplaintStatusBreakdownRows(rows, leads, "Eingereichte Reklamationen", 1, {
          includeSublabel: true,
        });
        return rows;
      }

      function perfSegmentDimensionViews(metric) {
        const base = ["gebiet", "mitarbeiter", "produkt"];
        if (metric === "complaints") {
          return ["complaint-status", ...base];
        }
        return base;
      }

      function getGebietDimensionFoldRows(metric, period) {
        const periodLeads = getLeadsInPerformancePeriod(period);
        const tree = getPerfHierarchy(metric, period) || {};
        const rows = [];
        TENANT_GEBIETE.forEach((gebiet) => {
          const node = tree[gebiet];
          const gebietLeads = periodLeads.filter((row) => getCellValue(row, "standort") === gebiet);
          if (!gebietLeads.length) return;
          if (metric === "complaints") {
            rows.push({
              label: gebiet,
              value: complaintShareOfAllLeads(gebietLeads, isLeadComplaintStatus) ?? 0,
              kind: "gebiet",
              depth: 0,
              path: gebiet,
            });
            appendComplaintStatusBreakdownRows(rows, gebietLeads, gebiet, 1);
            return;
          }
          const gebietValue =
            metricValueForLeadGroup(gebietLeads, metric, period, "gebiet", gebiet) ?? node?.value ?? 0;
          rows.push({ label: gebiet, value: gebietValue, kind: "gebiet", depth: 0, path: gebiet });
        });
        return rows;
      }

      function getDimensionFoldRows(metric, period, view) {
        const periodLeads = getLeadsInPerformancePeriod(period);
        if (view === "complaint-status") {
          return metric === "complaints" ? getComplaintStatusFoldRows(period) : [];
        }
        if (view === "gebiet") {
          return getGebietDimensionFoldRows(metric, period);
        }
        if (view === "mitarbeiter") {
          const rows = [];
          TENANT_MITARBEITER.forEach((label) => {
            const groupLeads = periodLeads.filter((row) => getCellValue(row, "zustandigkeit") === label);
            if (!groupLeads.length) return;
            if (metric === "complaints") {
              rows.push({
                label,
                value: complaintShareOfAllLeads(groupLeads, isLeadComplaintStatus) ?? 0,
                kind: "mitarbeiter",
                depth: 0,
                path: label,
              });
              appendComplaintStatusBreakdownRows(rows, groupLeads, label, 1);
              return;
            }
            const value = metricValueForLeadGroup(groupLeads, metric, period, "mitarbeiter", label);
            rows.push({ label, value, kind: "mitarbeiter", depth: 0, path: label });
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
                value: complaintShareOfAllLeads(groupLeads, isLeadComplaintStatus) ?? 0,
                kind: "produkt",
                depth: 0,
                path: label,
              });
              appendComplaintStatusBreakdownRows(rows, groupLeads, label, 1);
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

      function formatPerfValue(metric, value) {
        if (value == null || Number.isNaN(value)) return "—";
        if (metric === "investment") return `${Math.round(value)} €`;
        return `${value.toFixed(1).replace(".", ",")}%`;
      }

      function parsePerfSummaryValue(metric, text) {
        if (!text || text === "—") return null;
        if (metric === "investment") {
          const n = parseInt(String(text).replace(/[^\d]/g, ""), 10);
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

      function getGebietKeys(metric, period) {
        return TENANT_GEBIETE.slice();
      }

      function defaultComboFilters() {
        return { gebiet: [], mitarbeiter: [], produkt: [] };
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
        return level === "gebiet-mitarbeiter-produkt" || level === "gebiet-produkt";
      }

      function isComboCompareReady(filters, level) {
        const gebiet = asFilterArray(filters?.gebiet);
        const mitarbeiter = asFilterArray(filters?.mitarbeiter);
        const produkt = asFilterArray(filters?.produkt);
        if (isComboFilterNone(gebiet) || isComboFilterNone(mitarbeiter)) return false;
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

      function getMitarbeiterKeysForCombo(metric, period, gebietSelection) {
        const gebiete = asFilterArray(gebietSelection);
        if (!gebiete.length) return getAllAssignableMitarbeiter(metric, period);
        const names = new Set();
        gebiete.forEach((gebiet) => {
          getMitarbeiterWithLeadsInGebiet(gebiet, period).forEach((name) => names.add(name));
        });
        return Array.from(names).sort((a, b) => a.localeCompare(b, "de"));
      }

      function getProduktKeysForCombo(metric, period, gebietSelection, mitarbeiterSelection) {
        const gebiete = asFilterArray(gebietSelection);
        const mas = asFilterArray(mitarbeiterSelection);
        let leads = getLeadsInPerformancePeriod(period);
        if (gebiete.length) {
          leads = leads.filter((row) => gebiete.includes(getCellValue(row, "standort")));
        }
        if (mas.length) {
          leads = leads.filter((row) => mas.includes(getCellValue(row, "zustandigkeit")));
        }
        if (!leads.length) return getAllTenantProduktKeys(metric, period);
        return getProduktKeysFromLeads(leads);
      }

      function normalizeComboFilters(combo, metric, period) {
        if (!combo.filters) combo.filters = defaultComboFilters();
        if (combo.filters && typeof combo.filters.gebiet === "object" && !Array.isArray(combo.filters.gebiet)) {
          const keys = getGebietKeys(metric, period);
          const active = keys.filter((k) => combo.filters.gebiet[k] !== false);
          combo.filters = {
            gebiet: active,
            mitarbeiter: asFilterArray(combo.filters.mitarbeiter),
            produkt: asFilterArray(combo.filters.produkt),
          };
        }
        combo.filters.gebiet = asFilterArray(combo.filters.gebiet);
        combo.filters.mitarbeiter = asFilterArray(combo.filters.mitarbeiter);
        combo.filters.produkt = asFilterArray(combo.filters.produkt);

        const allowedMa = getMitarbeiterKeysForCombo(metric, period, combo.filters.gebiet);
        if (!isComboFilterNone(combo.filters.mitarbeiter)) {
          combo.filters.mitarbeiter = combo.filters.mitarbeiter.filter((name) => allowedMa.includes(name));
        }

        const allowedProducts = getProduktKeysForCombo(
          metric,
          period,
          combo.filters.gebiet,
          combo.filters.mitarbeiter,
        );
        if (!isComboFilterNone(combo.filters.produkt)) {
          combo.filters.produkt = combo.filters.produkt.filter((name) => allowedProducts.includes(name));
        }
        return combo.filters;
      }

      function getMitarbeiterKeysForGebiet(metric, period, gebiet) {
        return getMitarbeiterWithLeadsInGebiet(gebiet, period);
      }

      /** Employees who actually have leads in this Gebiet (not only home assignment). */
      function getMitarbeiterWithLeadsInGebiet(gebiet, period) {
        const leads = getLeadsInPerformancePeriod(period).filter(
          (row) => getCellValue(row, "standort") === gebiet,
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

      function gebietFiltersFromSelection(selectedGebiet, metric, period) {
        const keys = getGebietKeys(metric, period);
        const list = asFilterArray(selectedGebiet);
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
        if (level === "gebiet-mitarbeiter-produkt") {
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
        if (level === "gebiet-mitarbeiter-produkt") {
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
          gebiet: undefined,
          path: row.label,
        }));
      }

      function getComboPreviewRows(combo, metric, period, options = {}) {
        normalizeComboFilters(combo, metric, period);
        const gebietList = asFilterArray(combo.filters.gebiet);
        const mitarbeiterList = asFilterArray(combo.filters.mitarbeiter);
        const produktList = asFilterArray(combo.filters.produkt);
        const summaryOnly = options.summaryOnly === true;

        if (
          isComboFilterNone(gebietList) ||
          isComboFilterNone(mitarbeiterList) ||
          isComboFilterNone(produktList)
        ) {
          return [];
        }

        const gebietFilters = gebietFiltersFromSelection(gebietList, metric, period);
        let rows = getHierarchyRows(
          metric,
          period,
          combo.level,
          gebietFilters,
          combo.detailLevel,
          mitarbeiterList,
        );
        rows = filterComboRowsByProdukt(rows, produktList, combo.level);
        rows = applyLeanComboRowDisplay(rows, combo);
        if (summaryOnly) rows = rows.filter((r) => r.depth === 0);
        return rows;
      }

      /** Full hierarchy rows (Gebiet → Mitarbeiter → Produkt) for combo results — keeps parent/path context. */
      function getComboHierarchyRows(combo, metric, period) {
        normalizeComboFilters(combo, metric, period);
        const gebietList = asFilterArray(combo.filters.gebiet);
        const mitarbeiterList = asFilterArray(combo.filters.mitarbeiter);
        const produktList = asFilterArray(combo.filters.produkt);

        if (
          isComboFilterNone(gebietList) ||
          isComboFilterNone(mitarbeiterList) ||
          isComboFilterNone(produktList)
        ) {
          return [];
        }

        const gebietFilters = gebietFiltersFromSelection(gebietList, metric, period);
        const rows = getHierarchyRows(
          metric,
          period,
          combo.level,
          gebietFilters,
          combo.detailLevel,
          mitarbeiterList,
        );
        return filterComboRowsByProdukt(rows, produktList, combo.level);
      }

      function comboPreviewTableHeader(combo, metric, period) {
        normalizeComboFilters(combo, metric, period);
        const gebietList = asFilterArray(combo.filters.gebiet);
        const mitarbeiterList = asFilterArray(combo.filters.mitarbeiter);
        const produktList = asFilterArray(combo.filters.produkt);
        if (mitarbeiterList.length && !gebietList.length) return "Mitarbeiter / Produkt";
        if (produktList.length && combo.level === "gebiet-produkt") return "Gebiet / Produkt";
        if (produktList.length && combo.level === "gebiet-mitarbeiter-produkt") {
          return "Gebiet / Mitarbeiter / Produkt";
        }
        return hierarchyTableHeader(combo.level);
      }

      function syncComboLevelForFilters(combo, metric, period) {
        normalizeComboFilters(combo, metric, period);
        const gebietList = asFilterArray(combo.filters.gebiet);
        const mitarbeiterList = asFilterArray(combo.filters.mitarbeiter);
        const produktList = asFilterArray(combo.filters.produkt);
        if (!gebietList.length && !mitarbeiterList.length) {
          combo.detailLevel = "detail";
          return;
        }
        if (produktList.length) {
          combo.level = "gebiet-mitarbeiter-produkt";
          combo.detailLevel = "detail";
          return;
        }
        if (mitarbeiterList.length && !gebietList.length) {
          combo.detailLevel = "detail";
          return;
        }
        if (gebietList.length && mitarbeiterList.length) {
          combo.level = "gebiet-mitarbeiter-produkt";
          combo.detailLevel = "detail";
          return;
        }
        if (gebietList.length) {
          combo.level = "gebiet-mitarbeiter";
        }
      }

      function normalizePerfCombo(combo, metric, period) {
        normalizeComboFilters(combo, metric, period);
        if (combo.level === "gebiet") combo.level = "gebiet-mitarbeiter";
        if (!combo.level) {
          let level = "gebiet-mitarbeiter";
          if (combo.primary === "gebiet" && combo.secondary === "produkt") level = "gebiet-produkt";
          else if (combo.primary === "mitarbeiter" || combo.secondary === "produkt") {
            level = "gebiet-mitarbeiter-produkt";
          }
          combo.level = level;
        }
        if (!PERF_HIERARCHY_LEVELS[combo.level]) combo.level = "gebiet-mitarbeiter";
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
        if (!gebietRow || gebietRow.kind !== "gebiet") return;
        const children = [];
        for (let i = gebietBlockStart + 1; i < rows.length; i += 1) {
          const row = rows[i];
          if (row.kind === "gebiet" && row.depth === 0) break;
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
          if (row.kind === "gebiet" && row.depth === 0) break;
          if (row.kind === "mitarbeiter" && row.depth === 1) break;
          if (row.kind === "produkt" && row.depth === 2 && row.parent === mitarbeiterLabel) {
            children.push(row);
          }
        }
        const avg = averageMetricChildValues(children);
        if (avg != null) maRow.value = avg;
      }

      function getProduktMapForGebiet(metric, period, gebiet, node) {
        if (node?.produkt && Object.keys(node.produkt).length) return node.produkt;
        const nested = getPerfMetricData(metric, period)?.gebiet?.nested?.[gebiet];
        if (nested && Object.keys(nested).length) return { ...nested };
        const leads = getLeadsInPerformancePeriod(period).filter(
          (row) => getCellValue(row, "standort") === gebiet,
        );
        const map = {};
        const products = new Set();
        leads.forEach((row) => {
          const product = getCellValue(row, "bedarf");
          if (product && product !== "-") products.add(product);
        });
        products.forEach((product) => {
          const productLeads = leads.filter((row) => getCellValue(row, "bedarf") === product);
          const value = computeGroupMetricFromLeads(productLeads, metric);
          if (value != null) map[product] = value;
        });
        if (Object.keys(map).length) return map;
        return {};
      }

      function getMitarbeiterMapForGebiet(metric, period, gebiet, node) {
        const leads = getLeadsInPerformancePeriod(period).filter(
          (row) => getCellValue(row, "standort") === gebiet,
        );
        const mitarbeiterNames = getMitarbeiterWithLeadsInGebiet(gebiet, period);
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

      function getHierarchyRows(metric, period, level, gebietFilters, detailLevel, mitarbeiterFilter = []) {
        const tree = getPerfHierarchy(metric, period) || {};
        const rows = [];
        const showMitarbeiter = level === "gebiet-mitarbeiter" || level === "gebiet-mitarbeiter-produkt";
        const showProduktUnderMitarbeiter = level === "gebiet-mitarbeiter-produkt";
        const showProduktUnderGebiet = level === "gebiet-produkt";
        const employeeFilter = asFilterArray(mitarbeiterFilter);

        getGebietKeys(metric, period).forEach((gebiet) => {
          if (gebietFilters[gebiet] === false) return;
          const node = tree[gebiet];
          const gebietLeads = getLeadsInPerformancePeriod(period).filter(
            (row) => getCellValue(row, "standort") === gebiet,
          );
          const mitarbeiterMap = getMitarbeiterMapForGebiet(metric, period, gebiet, node);
          const maPrepared = [];
          const gebietBlockStart = rows.length;

          Object.entries(mitarbeiterMap).forEach(([mitarbeiter, maNode]) => {
            if (employeeFilter.length && !employeeFilter.includes(mitarbeiter)) return;
            const maLeads = gebietLeads.filter(
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

          let gebietValue =
            metricValueForLeadGroup(gebietLeads, metric, period, "gebiet", gebiet) ??
            node?.value ??
            lookupPerfFlatValue(metric, period, "gebiet", gebiet) ??
            null;
          if (metric === "complaints") {
            gebietValue = complaintShareOfAllLeads(gebietLeads, isLeadComplaintStatus);
          } else if (maPrepared.length && metric !== "investment") {
            const fromEmployees = weightedAverageMetricValues(
              maPrepared.map((entry) => ({
                value: entry.maValue,
                weight: entry.maLeads.length,
              })),
            );
            if (fromEmployees != null) gebietValue = fromEmployees;
          }

          rows.push({
            label: gebiet,
            value:
              metric === "investment"
                ? null
                : gebietValue ?? (metric === "investment" ? null : 0),
            kind: "gebiet",
            depth: 0,
            path: gebiet,
          });

          if (metric === "complaints") {
            appendComplaintStatusBreakdownRows(rows, gebietLeads, gebiet, 1, { gebiet });
          }

          if (level === "gebiet") return;

          if (showProduktUnderGebiet) {
            getProduktKeysFromLeads(gebietLeads).forEach((produkt) => {
              const produktLeads = gebietLeads.filter((row) => getCellValue(row, "bedarf") === produkt);
              if (!produktLeads.length) return;
              const produktValue =
                metric === "complaints"
                  ? complaintShareOfAllLeads(produktLeads, isLeadComplaintStatus)
                  : resolveMetricValue(produktLeads, metric, period, "produkt", produkt, null);
              if (metric === "investment" && produktValue == null) return;
              rows.push({
                label: produkt,
                value: produktValue ?? (metric === "investment" ? null : 0),
                kind: "produkt",
                depth: 1,
                parent: gebiet,
                path: `${gebiet} · ${produkt}`,
              });
              if (metric === "complaints") {
                appendComplaintStatusBreakdownRows(rows, produktLeads, produkt, 2, {
                  gebiet,
                  parent: gebiet,
                });
              }
            });
            if (metric === "investment") rollupInvestmentGebietRow(rows, gebietBlockStart);
            return;
          }

          if (!showMitarbeiter) return;

          if (!maPrepared.length) {
            if (metric === "investment") {
              rows[gebietBlockStart].value = computeGroupMetricFromLeads(gebietLeads, metric);
            }
            return;
          }

          maPrepared.forEach(({ mitarbeiter, maNode, maLeads, maValue }) => {
            const maRowIndex = rows.length;
            const maDisplayValue =
              metric === "complaints"
                ? complaintShareOfAllLeads(maLeads, isLeadComplaintStatus)
                : metric === "investment" && showProduktUnderMitarbeiter
                  ? null
                  : maValue ?? (metric === "investment" ? null : 0);
            rows.push({
              label: mitarbeiter,
              value: maDisplayValue,
              kind: "mitarbeiter",
              depth: 1,
              parent: gebiet,
              path: mitarbeiter,
            });

            if (metric === "complaints") {
              appendComplaintStatusBreakdownRows(rows, maLeads, mitarbeiter, 2, {
                gebiet,
                parent: gebiet,
              });
            }

            if (showProduktUnderMitarbeiter) {
              getProduktKeysFromLeads(maLeads).forEach((produkt) => {
                const produktLeads = maLeads.filter((row) => getCellValue(row, "bedarf") === produkt);
                if (!produktLeads.length) return;
                const produktValue =
                  metric === "complaints"
                    ? complaintShareOfAllLeads(produktLeads, isLeadComplaintStatus)
                    : resolveMetricValue(produktLeads, metric, period, "produkt", produkt, null);
                if (metric === "investment" && produktValue == null) return;
                rows.push({
                  label: produkt,
                  value: produktValue ?? (metric === "investment" ? null : 0),
                  kind: "produkt",
                  depth: 2,
                  parent: mitarbeiter,
                  gebiet,
                  path: `${gebiet} · ${mitarbeiter} · ${produkt}`,
                });
                if (metric === "complaints") {
                  appendComplaintStatusBreakdownRows(rows, produktLeads, produkt, 3, {
                    gebiet,
                    parent: mitarbeiter,
                  });
                }
              });
              if (metric === "investment") {
                rollupInvestmentMitarbeiterRow(rows, maRowIndex, mitarbeiter);
              }
            }
          });
          if (metric === "investment") rollupInvestmentGebietRow(rows, gebietBlockStart);
        });

        return rows;
      }

      function hierarchyTableHeader(level) {
        if (level === "gebiet") return "Gebiet";
        if (level === "gebiet-mitarbeiter") return "Gebiet / Mitarbeiter";
        if (level === "gebiet-mitarbeiter-produkt") return "Gebiet / Mitarbeiter / Produkt";
        if (level === "gebiet-produkt") return "Gebiet / Produkt";
        return "Hierarchie";
      }

      function isPerfConsolidatedRow(row, options = {}) {
        if (row.kind === "gebiet") return true;
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
        if (row.kind === "gebiet" || row.kind === "flat" || row.kind === "mitarbeiter" || row.kind === "produkt") {
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
          const min = nums.length ? Math.min(...nums) : 0;
          const span = Math.max(max - min, 1);
          return rows.map((row) => ({
            ...row,
            width: typeof row.value === "number" ? Math.max(8, ((max - row.value) / span) * 100) : 0,
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
        if (view === "gebiet") return "Gebiet";
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
              if (row.kind === "gebiet" || (row.kind === "mitarbeiter" && row.depth === 0)) {
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

      const PERF_KPI_REF_IDS = {
        conversion: "perfKpiConversion",
        complaints: "perfKpiComplaints",
        investment: "perfKpiInvestment",
      };

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
            level: "gebiet-mitarbeiter",
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
          level: root.querySelector(".perf-combo-level")?.value || "gebiet-mitarbeiter",
          name: root.querySelector(".perf-combo-name")?.value?.trim() || "",
          detailLevel: "detail",
          filters: defaultComboFilters(),
        };
        const gebietKeys = getGebietKeys(metric, period);
        draft.filters.gebiet = readMultiFilterFromCard(root, "gebiet", gebietKeys);
        const maKeys = getMitarbeiterKeysForCombo(metric, period, draft.filters.gebiet);
        draft.filters.mitarbeiter = readMultiFilterFromCard(root, "mitarbeiter", maKeys);
        const produktKeys = getProduktKeysForCombo(
          metric,
          period,
          draft.filters.gebiet,
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
            gebiet: [...asFilterArray(combo.filters?.gebiet)],
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
        const gebietKeys = getGebietKeys(metric, period);
        if (!gebietKeys.length) return "<p class=\"stats-perf-empty\">Keine Filter verfügbar.</p>";
        const gebietSel = asFilterArray(filters?.gebiet);
        const maSel = asFilterArray(filters?.mitarbeiter);
        const produktSel = asFilterArray(filters?.produkt);
        const maKeys = getMitarbeiterKeysForCombo(metric, period, gebietSel);
        const produktKeys = getProduktKeysForCombo(metric, period, gebietSel, maSel);
        const produktFilterDisabled = !comboLevelAllowsProduktFilter(level);
        return `<div class="stats-perf-combo-filters">
            ${buildStatsMultiSelectHtml("gebiet", "Gebiet", "Gebiete auswählen", gebietKeys, gebietSel)}
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
        const level = selected[0]?.level || "gebiet-mitarbeiter";
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

      const PERF_DETAIL_DEFAULT_ORDER = ["conversion", "complaints", "investment"];
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
        perfDetailOpenOrder = perfDetailOpenOrder.filter((m) => m !== metric);
        perfDetailOpenOrder.push(metric);
        const segment = panel.querySelector(`.stats-perf-segment[data-perf-metric="${metric}"]`);
        if (!segment) return;
        segment.classList.remove("is-detail-hidden");
        refreshPerformanceSegment(segment);
        applyPerfDetailStackOrder();
        syncPerfDetailUi();
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
        openPerfDetail("conversion");
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
          const exportBtn = event.target.closest(".stats-perf-export-btn");
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
          const gebietCb = event.target.classList.contains("perf-combo-gebiet-cb");
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
        if (metric === "investment") return `${Math.round(value)} €`;
        return `${value.toFixed(1).replace(".", ",")}%`;
      }

      function syncPerformanceSummaryKpis() {
        const period = getPerformancePeriod();
        const leads = getLeadsInPerformancePeriod(period);
        leads.forEach(ensureLeadRowPrice);
        const conversionEl = document.getElementById("perfKpiConversion");
        const complaintsEl = document.getElementById("perfKpiComplaints");
        const investmentEl = document.getElementById("perfKpiInvestment");
        if (conversionEl) {
          conversionEl.textContent = formatPerfSummaryKpi(
            "conversion",
            computeGroupMetricFromLeads(leads, "conversion"),
            leads.length,
          );
        }
        if (complaintsEl) {
          complaintsEl.textContent = formatPerfSummaryKpi(
            "complaints",
            computeGroupMetricFromLeads(leads, "complaints"),
            leads.length,
          );
        }
        if (investmentEl) {
          investmentEl.textContent = formatPerfSummaryKpi(
            "investment",
            computeGroupMetricFromLeads(leads, "investment"),
            leads.length,
          );
        }
        refreshAllPerformanceSegments();
      }

      function initPerformancePeriodTabs() {
        document
          .querySelectorAll("#statsPanelPerformance .stats-perf-period-tab")
          .forEach((tab) => {
            tab.addEventListener("click", () => {
              const period = tab.dataset.perfPeriod;
              if (!period || period === getPerformancePeriod()) return;
              document
                .querySelectorAll("#statsPanelPerformance .stats-perf-period-tab")
                .forEach((item) => {
                  const active = item.dataset.perfPeriod === period;
                  item.classList.toggle("is-active", active);
                  item.setAttribute("aria-selected", active ? "true" : "false");
                });
              syncPerformanceSummaryKpis();
            });
          });
      }