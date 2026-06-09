(function (global) {
  "use strict";

  function initStatsOverviewModule(deps) {
    const getStandorte = deps.getStandorte;
    const getStandortSelection = deps.getStandortSelection || (() => ({ isAll: true, selected: [] }));
    const isSingleStandortSelected = deps.isSingleStandortSelected || (() => false);
    const getActiveStandorteFromDeps = deps.getActiveStandorte;
    const scaleByPeriod = deps.scaleByPeriod || ((total) => total);

    const OV_STATUS_LABELS = [
      "Neu",
      "In Bearbeitung",
      "Gewonnen",
      "Geschlossen",
      "Reklamation",
    ];
    const getStatusCountsFromLeads =
      deps.getStatusCountsFromLeads ||
      (() => ({
        total: 0,
        rows: OV_STATUS_LABELS.map((label) => ({ label, count: 0, pct: 0 })),
      }));
    const getStatusMatrixByStandort = deps.getStatusMatrixByStandort || (() => []);
    const getOverviewSummaryKpis =
      deps.getOverviewSummaryKpis ||
      (() => ({
        usersPerStandort: 0,
        requests: 0,
        activeStandorte: 0,
        pausedStandorte: 0,
      }));
    const getOverviewRequestData =
      deps.getOverviewRequestData ||
      ((period) => ({
        total: getOverviewSummaryKpis(period).requests,
        status: getStatusCountsFromLeads(period),
        statusMatrix: getStatusMatrixByStandort(period),
        standortTotals: [],
        bedarfsartMatrix: [],
        gebietRows: [],
        standortGebietGroups: [],
      }));
    const OV_BEDARFSARTEN = [
      "Pflegedienst",
      "Vollstationäre Pflege",
      "Kurzzeitpflege",
      "Betreutes Wohnen",
    ];
    const formatOverviewSummaryKpi =
      deps.formatOverviewSummaryKpi || ((_key, value) => String(value ?? 0));

    function overviewData(period) {
      return getOverviewRequestData(period || getOverviewPeriod());
    }

    let ovDetailOpen = null;
    let ovPeriodTabsInit = false;

    function getOverviewPeriod() {
      const active = document.querySelector(
        "#statsPanelOverview .stats-overview-period-tab.is-active, #statsPanelOverview .stats-overview-period-tab[aria-selected='true']",
      );
      return active?.dataset?.overviewPeriod || "gesamt";
    }

    function getAllStandorteWeighted() {
      const all = getStandorte().filter(Boolean);
      return all.length ? all : ["Hesena Management Domizil an der Jade", "Hesena Management Domizil am Ostplatz", "Hesena Management Domizil an der Werre", "Hesena Management Domizil an der Eise"];
    }

    function getActiveStandorte() {
      if (getActiveStandorteFromDeps) return getActiveStandorteFromDeps().filter(Boolean);
      const all = getAllStandorteWeighted();
      const { isAll, selected } = getStandortSelection();
      if (isAll) return all;
      return selected.length ? selected.filter((n) => all.includes(n)) : all;
    }

    function standortTotals(period) {
      return overviewData(period).standortTotals || [];
    }

    function bedarfsartMatrixForStandorte(period) {
      return overviewData(period).bedarfsartMatrix || [];
    }

    function gebietTotalsForScope(period) {
      return overviewData(period).gebietRows || [];
    }

    function standortGebietAccordionGroups(period) {
      return overviewData(period).standortGebietGroups || [];
    }

    function formatCountPct(count, total) {
      const pct = total ? Math.round((count / total) * 100) : 0;
      return `${count.toLocaleString("de-DE")} <span class="stats-ov-cell-pct">(${pct}%)</span>`;
    }

    function formatAvg(value) {
      return value.toLocaleString("de-DE", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
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

    function sparklineSeries(summary) {
      const drift = summary * 0.08;
      return Array.from({ length: 12 }, (_, i) => summary + Math.sin(i * 0.9) * drift - (11 - i) * (drift / 14));
    }

    function ensureSparkline(card) {
      const host = card.querySelector(".stats-ov-kpi-body") || card;
      let svg = host.querySelector(".stats-perf-kpi-sparkline");
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
        host.insertBefore(svg, host.firstChild);
      }
      return svg;
    }

    function updateSparkline(card, summary) {
      const svg = ensureSparkline(card);
      const path = svg.querySelector(".stats-perf-kpi-sparkline-line");
      const series = sparklineSeries(summary);
      path.setAttribute("d", buildSparklinePath(series, 100, 100));
      svg.setAttribute("viewBox", "0 0 100 100");
    }

    function renderStatusRows(container, rows, total) {
      if (!container) return;
      container.innerHTML = rows
        .map((row) => {
          const pct = Math.max(0, Math.min(100, Number(row.pct) || 0));
          return `
        <div class="stats-ov-status-row" style="--stats-ov-status-pct: ${pct}%">
          <span class="stats-ov-status-row-fill" aria-hidden="true"></span>
          <span class="stats-ov-status-label">${row.label}</span>
          <span class="stats-ov-status-value">${row.count.toLocaleString("de-DE")}</span>
          <span class="stats-ov-status-pct">(${pct}%)</span>
        </div>`;
        })
        .join("");
      container.dataset.total = String(total);
    }

    function formatStandortDisplayLabel(label) {
      if (typeof global.StandortNameDisplay !== "undefined") {
        return global.StandortNameDisplay.standortNameHtml(label);
      }
      return label;
    }

    function renderMatrixTable(mount, rowLabel, columns, matrixRows) {
      if (!mount) return;
      const colTotals = columns.map((col) =>
        matrixRows.reduce((sum, row) => sum + (row.cells[col] || 0), 0),
      );
      const head = `<tr><th scope="col">${rowLabel}</th>${columns
        .map((col) => `<th scope="col" class="num">${col}</th>`)
        .join("")}</tr>`;
      const body = matrixRows
        .map((row) => {
          const cells = columns
            .map(
              (col) =>
                `<td class="num">${formatCountPct(row.cells[col] || 0, row.total)}</td>`,
            )
            .join("");
          return `<tr><td>${formatStandortDisplayLabel(row.label)}</td>${cells}</tr>`;
        })
        .join("");
      mount.innerHTML = `<table class="standort-settings-table stats-perf-table stats-ov-table"><thead>${head}</thead><tbody>${body}</tbody></table>`;
    }

    function accordionBarPct(value, basis) {
      const safeValue = Math.max(0, Number(value) || 0);
      const safeBasis = Math.max(0, Number(basis) || 0);
      if (!safeBasis) return 0;
      return Math.max(0, Math.min(100, Math.round((safeValue / safeBasis) * 100)));
    }

    function renderAccordionBreakdown(mount, groups, idPrefix, scopeTotal, options = {}) {
      if (!mount) return;
      const prefix = idPrefix || "stats-ov-acc";
      const scaleMode = options.barScale === "max" ? "max" : "total";
      const totalAll = Math.max(0, Number(scopeTotal) || 0);
      const fallbackTotal = groups.reduce((sum, group) => sum + (group.total || 0), 0);
      const scopeBasis = totalAll || fallbackTotal;
      const parentMax =
        scaleMode === "max"
          ? Math.max(0, ...groups.map((group) => group.total || 0))
          : scopeBasis;
      mount.innerHTML = `<div class="stats-ov-accordion">${groups
        .map((group, index) => {
          const panelId = `${prefix}-panel-${index}`;
          const groupTotal = group.total || 0;
          const parentPct = accordionBarPct(groupTotal, parentMax);
          const childMax =
            scaleMode === "max"
              ? Math.max(0, ...group.children.map((child) => child.count || 0))
              : groupTotal;
          const childrenHtml = group.children
            .map((child) => {
              const childPct = accordionBarPct(child.count, childMax);
              return `
          <div class="stats-ov-accordion-subrow">
            <span class="stats-ov-accordion-track" style="--stats-ov-acc-pct: ${childPct}%">
              <span class="stats-ov-accordion-row-fill stats-ov-accordion-row-fill--child" aria-hidden="true"></span>
              <span class="stats-ov-accordion-sublabel">${formatStandortDisplayLabel(child.label)}</span>
            </span>
            <span class="stats-ov-accordion-subvalue">${formatCountPct(child.count, groupTotal)}</span>
          </div>`;
            })
            .join("");
          return `
        <div class="stats-ov-accordion-item">
          <button
            type="button"
            class="stats-ov-accordion-trigger"
            aria-expanded="false"
            aria-controls="${panelId}"
          >
            <span class="stats-ov-accordion-track" style="--stats-ov-acc-pct: ${parentPct}%">
              <span class="stats-ov-accordion-row-fill stats-ov-accordion-row-fill--parent" aria-hidden="true"></span>
              <span class="stats-ov-accordion-label"><strong>${formatStandortDisplayLabel(group.label)}</strong></span>
            </span>
            <span class="stats-ov-accordion-meta">
              <span class="stats-ov-accordion-total">${groupTotal.toLocaleString("de-DE")}</span>
              <i class="fa-solid fa-chevron-down stats-ov-accordion-chevron" aria-hidden="true"></i>
            </span>
          </button>
          <div id="${panelId}" class="stats-ov-accordion-panel" hidden>${childrenHtml}</div>
        </div>`;
        })
        .join("")}</div>`;
    }

    function bedarfsartAccordionGroups(period) {
      return bedarfsartMatrixForStandorte(period).map((row) => ({
        label: row.label,
        total: row.total,
        children: OV_BEDARFSARTEN.filter((col) => row.cells[col] != null && row.cells[col] > 0).map(
          (col) => ({
            label: col,
            count: row.cells[col],
          }),
        ),
      }));
    }

    function renderStandortGebietAccordion(mount, period) {
      renderAccordionBreakdown(
        mount,
        standortGebietAccordionGroups(period),
        "stats-ov-standort",
        overviewData(period).total,
        { barScale: "max" },
      );
    }

    function renderBedarfsartAccordion(mount, period) {
      renderAccordionBreakdown(
        mount,
        bedarfsartAccordionGroups(period),
        "stats-ov-bedarf",
        overviewData(period).total,
        { barScale: "max" },
      );
    }

    function renderFlatBarBreakdown(mount, rows, shareTotal, options = {}) {
      if (!mount) return;
      const scaleMode = options.barScale === "max" ? "max" : "total";
      const fillClass = options.fillClass || "stats-ov-accordion-row-fill--parent";
      const shareBasis = Math.max(0, Number(shareTotal) || 0);
      const rowMax =
        scaleMode === "max"
          ? Math.max(0, ...rows.map((row) => row.count || 0))
          : shareBasis;
      mount.innerHTML = `<div class="stats-ov-accordion stats-ov-flat-bars">${rows
        .map((row) => {
          const barPct = accordionBarPct(row.count, rowMax);
          return `
        <div class="stats-ov-flat-bar-row">
          <span class="stats-ov-accordion-track" style="--stats-ov-acc-pct: ${barPct}%">
            <span class="stats-ov-accordion-row-fill ${fillClass}" aria-hidden="true"></span>
            <span class="stats-ov-accordion-label">${formatStandortDisplayLabel(row.label)}</span>
          </span>
          <span class="stats-ov-accordion-subvalue">${formatCountPct(row.count, shareBasis)}</span>
        </div>`;
        })
        .join("")}</div>`;
    }

    function renderGebietBreakdown(mount, rows, total) {
      renderFlatBarBreakdown(mount, rows, total, {
        barScale: "max",
        fillClass: "stats-ov-accordion-row-fill--parent",
      });
    }

    function renderStatusDetailTable(mount, period) {
      const matrix = overviewData(period).statusMatrix || [];
      renderMatrixTable(mount, "Standort", OV_STATUS_LABELS, matrix);
    }

    function syncCardVisibility() {
      const bedarfsartCard = document.getElementById("ovCardBedarfsart");
      const gebietCard = document.getElementById("ovCardGebiet");
      const bedarfsartSegment = document.querySelector(
        '#statsPanelOverview .stats-ov-segment[data-ov-metric="bedarfsart"]',
      );
      const gebietSegment = document.querySelector(
        '#statsPanelOverview .stats-ov-segment[data-ov-metric="gebiet"]',
      );
      const single = isSingleStandortSelected();
      if (bedarfsartCard) bedarfsartCard.hidden = single;
      if (gebietCard) gebietCard.hidden = !single;
      if (bedarfsartSegment) bedarfsartSegment.hidden = single;
      if (gebietSegment) gebietSegment.hidden = !single;
      if (single && ovDetailOpen === "bedarfsart") {
        closeDetail("bedarfsart");
      } else if (!single && ovDetailOpen === "gebiet") {
        closeDetail("gebiet");
      }
    }

    function clearSummarySparklines(panel) {
      panel
        .querySelectorAll(".stats-ov-summary-kpi-card .stats-perf-kpi-sparkline")
        .forEach((el) => el.remove());
    }

    function clearOverviewCardSparklines(panel) {
      panel
        .querySelectorAll(".stats-ov-kpi-card .stats-perf-kpi-sparkline")
        .forEach((el) => el.remove());
    }

    function syncSummaryKpiRow(panel, period) {
      clearSummarySparklines(panel);
      const summary = getOverviewSummaryKpis(period);
      const usersEl = document.getElementById("ovSummaryUsersPerStandort");
      const requestsEl = document.getElementById("ovSummaryRequests");
      const activeEl = document.getElementById("ovSummaryActiveStandorte");
      const pausedEl = document.getElementById("ovSummaryPausedStandorte");
      if (usersEl) {
        usersEl.textContent = formatOverviewSummaryKpi(
          "usersPerStandort",
          summary.usersPerStandort,
        );
      }
      if (requestsEl) {
        requestsEl.textContent = formatOverviewSummaryKpi("requests", summary.requests);
      }
      if (activeEl) {
        activeEl.textContent = formatOverviewSummaryKpi(
          "activeStandorte",
          summary.activeStandorte,
        );
      }
      if (pausedEl) {
        pausedEl.textContent = formatOverviewSummaryKpi(
          "pausedStandorte",
          summary.pausedStandorte,
        );
      }
    }

    function syncOverviewKpis() {
      const panel = document.getElementById("statsPanelOverview");
      if (!panel) return;
      const period = getOverviewPeriod();
      syncSummaryKpiRow(panel, period);
      const data = overviewData(period);
      const total = data.total;
      const statusPayload = data.status;
      const statuses = statusPayload.rows;
      const statusTotal = statusPayload.total;
      const standorte = getActiveStandorte();
      const avgStandort = standorte.length ? total / standorte.length : 0;
      const avgBedarfsart = OV_BEDARFSARTEN.length ? total / OV_BEDARFSARTEN.length : 0;
      const gebietRows = data.gebietRows || [];
      const avgGebiet = gebietRows.length ? total / gebietRows.length : 0;

      renderStatusRows(document.getElementById("ovKpiStatusRows"), statuses, statusTotal);

      const standortEl = document.getElementById("ovKpiStandort");
      if (standortEl) standortEl.textContent = formatAvg(avgStandort);

      const bedarfsartEl = document.getElementById("ovKpiBedarfsart");
      if (bedarfsartEl) bedarfsartEl.textContent = formatAvg(avgBedarfsart);

      const gebietEl = document.getElementById("ovKpiGebiet");
      if (gebietEl) gebietEl.textContent = formatAvg(avgGebiet);

      clearOverviewCardSparklines(panel);

      syncCardVisibility();

      if (ovDetailOpen) refreshDetail(ovDetailOpen);
    }

    function refreshDetail(metric) {
      const panel = document.getElementById("statsPanelOverview");
      const segment = panel?.querySelector(`.stats-ov-segment[data-ov-metric="${metric}"]`);
      const mount = segment?.querySelector("[data-ov-detail-table]");
      if (!segment || !mount) return;
      ensureOvDetailExportButton(segment);
      const period = getOverviewPeriod();
      if (metric === "status") {
        renderStatusDetailTable(mount, period);
        return;
      }
      if (metric === "standort") {
        renderStandortGebietAccordion(mount, period);
        return;
      }
      if (metric === "bedarfsart") {
        renderBedarfsartAccordion(mount, period);
        return;
      }
      if (metric === "gebiet") {
        const rows = gebietTotalsForScope(period);
        renderGebietBreakdown(mount, rows, overviewData(period).total);
      }
      if (typeof global.StandortNameDisplay !== "undefined") {
        global.StandortNameDisplay.decorateStandortNameCells(mount);
      }
    }

    const OV_PERIOD_TAB_LABELS = {
      gesamt: "Gesamt",
      day: "1T",
      "7d": "7T",
      "30d": "30T",
      "60d": "60T",
    };

    function getOverviewPeriodLabel() {
      return OV_PERIOD_TAB_LABELS[getOverviewPeriod()] || "Gesamt";
    }

    function getOverviewExportMetrics() {
      const metrics = ["status", "standort"];
      if (isSingleStandortSelected()) metrics.push("gebiet");
      else metrics.push("bedarfsart");
      return metrics;
    }

    function ovMetricDisplayTitle(metric) {
      const fromCard = document
        .querySelector(
          `#statsPanelOverview .stats-ov-kpi-card[data-ov-metric="${metric}"] .stats-perf-kpi-title`,
        )
        ?.textContent?.trim();
      return fromCard || metric;
    }

    function formatCountPctPlain(count, total) {
      const pct = total ? Math.round((count / total) * 100) : 0;
      return `${count} (${pct}%)`;
    }

    function escapeCsvField(value) {
      const text = String(value ?? "");
      if (/[;"\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
      return text;
    }

    function ovWorkbookSheetName(metric, usedNames) {
      let name = ovMetricDisplayTitle(metric)
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

    function ovExportMetricHasData(metric, period) {
      const data = overviewData(period);
      if (metric === "status") return data.total > 0;
      if (metric === "standort") return (data.standortGebietGroups || []).length > 0;
      if (metric === "bedarfsart") return (data.bedarfsartMatrix || []).length > 0;
      if (metric === "gebiet") return (data.gebietRows || []).length > 0;
      return false;
    }

    const OV_DETAIL_EXPORT_METRICS = ["status", "standort", "bedarfsart"];

    function buildOvDetailExportSheetAoA(metric, period) {
      const title = ovMetricDisplayTitle(metric);
      const periodLabel = getOverviewPeriodLabel();
      const data = overviewData(period);
      const meta = [
        ["Bericht", title],
        ["Zeitraum", periodLabel],
      ];

      if (metric === "status") {
        const matrix = data.statusMatrix || [];
        return [
          ...meta,
          ["Aufschlüsselung", "Standort × Status"],
          [],
          ["Standort", ...OV_STATUS_LABELS],
          ...matrix.map((row) => [
            row.label,
            ...OV_STATUS_LABELS.map((col) => row.cells[col] ?? 0),
          ]),
        ];
      }

      if (metric === "standort") {
        const groups = standortGebietAccordionGroups(period);
        return [
          ...meta,
          ["Aufschlüsselung", "Standort → Gebiet"],
          [],
          ["Standort", "Gebiet", "Anfragen", "Anteil %"],
          ...groups.flatMap((group) =>
            group.children.map((child) => [
              group.label,
              child.label,
              child.count,
              group.total ? Math.round((child.count / group.total) * 100) : 0,
            ]),
          ),
        ];
      }

      if (metric === "bedarfsart") {
        const groups = bedarfsartAccordionGroups(period);
        return [
          ...meta,
          ["Aufschlüsselung", "Standort → Bedarfsart"],
          [],
          ["Standort", "Bedarfsart", "Anfragen", "Anteil %"],
          ...groups.flatMap((group) =>
            group.children.map((child) => [
              group.label,
              child.label,
              child.count,
              group.total ? Math.round((child.count / group.total) * 100) : 0,
            ]),
          ),
        ];
      }

      return meta;
    }

    function buildOvDetailExportCsv(metric, period) {
      const sheet = buildOvDetailExportSheetAoA(metric, period);
      return `\uFEFF${sheet.map((row) => row.map(escapeCsvField).join(";")).join("\r\n")}`;
    }

    function ovDetailExportFilename(metric, period, extension = "csv") {
      const title = ovMetricDisplayTitle(metric);
      const periodLabel = getOverviewPeriodLabel();
      const slug = `${title}-${periodLabel}`
        .toLowerCase()
        .replace(/ä/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/ü/g, "ue")
        .replace(/ß/g, "ss")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return `uebersicht-detail-${slug || metric}.${extension}`;
    }

    function exportOverviewDetailSegment(metric) {
      const period = getOverviewPeriod();
      if (!ovExportMetricHasData(metric, period)) {
        window.alert("Keine Daten für den gewählten Zeitraum zum Exportieren.");
        return;
      }
      if (typeof XLSX !== "undefined" && XLSX.utils?.book_new && XLSX.write) {
        const wb = XLSX.utils.book_new();
        const usedNames = new Set();
        const ws = XLSX.utils.aoa_to_sheet(buildOvDetailExportSheetAoA(metric, period));
        XLSX.utils.book_append_sheet(wb, ws, ovWorkbookSheetName(metric, usedNames));
        const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        downloadBinaryFile(
          ovDetailExportFilename(metric, period, "xlsx"),
          buffer,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        return;
      }
      const csv = buildOvDetailExportCsv(metric, period);
      downloadTextFile(
        ovDetailExportFilename(metric, period, "csv"),
        csv,
        "text/csv;charset=utf-8",
      );
    }

    function ensureOvDetailExportButton(segment) {
      if (!segment || segment.querySelector(".stats-ov-detail-export-anchor")) return;
      const metric = segment.dataset.ovMetric;
      if (!OV_DETAIL_EXPORT_METRICS.includes(metric)) return;
      const anchor = document.createElement("div");
      anchor.className = "stats-ov-detail-export-anchor";
      anchor.innerHTML = `<div class="stats-perf-viz-toggle stats-perf-export-toggle" role="group" aria-label="Export">
          <button type="button" class="stats-perf-viz-btn stats-perf-export-btn stats-ov-detail-export-btn is-active" title="Aufschlüsselung als Excel exportieren" aria-label="Aufschlüsselung als Excel exportieren">
            <i class="fa-solid fa-download" aria-hidden="true"></i>
          </button>
        </div>`;
      segment.appendChild(anchor);
      anchor.querySelector(".stats-ov-detail-export-btn")?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        exportOverviewDetailSegment(metric);
      });
    }

    function ensureOvDetailExportButtons() {
      const panel = document.getElementById("statsPanelOverview");
      if (!panel) return;
      OV_DETAIL_EXPORT_METRICS.forEach((metric) => {
        const segment = panel.querySelector(`.stats-ov-segment[data-ov-metric="${metric}"]`);
        ensureOvDetailExportButton(segment);
      });
    }

    function buildOvSegmentSheetAoA(metric, period) {
      const title = ovMetricDisplayTitle(metric);
      const periodLabel = getOverviewPeriodLabel();
      const data = overviewData(period);
      const meta = [
        ["Bericht", title],
        ["Zeitraum", periodLabel],
      ];

      if (metric === "status") {
        const statusPayload = data.status;
        const matrix = data.statusMatrix || [];
        return [
          ...meta,
          ["Aufschlüsselung", "Status (Übersicht) + Standort × Status (Detail)"],
          [],
          ["Status", "Anfragen", "Anteil %"],
          ...statusPayload.rows.map((row) => [row.label, row.count, row.pct]),
          [],
          ["Standort", ...OV_STATUS_LABELS],
          ...matrix.map((row) => [
            row.label,
            ...OV_STATUS_LABELS.map((col) => row.cells[col] ?? 0),
          ]),
        ];
      }

      if (metric === "standort") {
        const groups = standortGebietAccordionGroups(period);
        return [
          ...meta,
          ["Aufschlüsselung", "Standort → Gebiet"],
          [],
          ["Standort", "Gebiet", "Anfragen", "Anteil %"],
          ...groups.flatMap((group) =>
            group.children.map((child) => [
              group.label,
              child.label,
              child.count,
              group.total ? Math.round((child.count / group.total) * 100) : 0,
            ]),
          ),
        ];
      }

      if (metric === "bedarfsart") {
        const matrix = bedarfsartMatrixForStandorte(period);
        return [
          ...meta,
          ["Aufschlüsselung", "Standort × Bedarfsart"],
          [],
          ["Standort", ...OV_BEDARFSARTEN],
          ...matrix.map((row) => [
            row.label,
            ...OV_BEDARFSARTEN.map((col) =>
              row.cells[col] == null ? "–" : formatCountPctPlain(row.cells[col], row.total),
            ),
          ]),
        ];
      }

      if (metric === "gebiet") {
        const rows = data.gebietRows || [];
        const total = data.total;
        return [
          ...meta,
          ["Aufschlüsselung", "Gebiet"],
          [],
          ["Gebiet", "Anfragen", "Anteil %"],
          ...rows.map((row) => [row.label, row.count, total ? Math.round((row.count / total) * 100) : 0]),
        ];
      }

      return meta;
    }

    function buildOvSegmentCsv(metric, period) {
      const sheet = buildOvSegmentSheetAoA(metric, period);
      return `\uFEFF${sheet.map((row) => row.map(escapeCsvField).join(";")).join("\r\n")}`;
    }

    function ovConsolidatedExportFilename(period, extension = "csv") {
      const periodLabel = getOverviewPeriodLabel();
      const slug = periodLabel
        .toLowerCase()
        .replace(/ä/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/ü/g, "ue")
        .replace(/ß/g, "ss")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return `uebersicht-kpis-${slug || period}.${extension}`;
    }

    function buildOvConsolidatedCsv(period, metrics) {
      const blocks = metrics.map((metric) => {
        const title = ovMetricDisplayTitle(metric);
        const segmentCsv = buildOvSegmentCsv(metric, period).replace(/^\uFEFF/, "");
        return `=== ${title} ===\r\n${segmentCsv}`;
      });
      return `\uFEFF${blocks.join("\r\n\r\n")}`;
    }

    function buildOvConsolidatedWorkbook(period, metrics) {
      const wb = XLSX.utils.book_new();
      const usedNames = new Set();
      metrics.forEach((metric) => {
        const ws = XLSX.utils.aoa_to_sheet(buildOvSegmentSheetAoA(metric, period));
        XLSX.utils.book_append_sheet(wb, ws, ovWorkbookSheetName(metric, usedNames));
      });
      return wb;
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

    function exportOverviewConsolidatedCsv() {
      const period = getOverviewPeriod();
      const metricsWithData = getOverviewExportMetrics().filter((metric) =>
        ovExportMetricHasData(metric, period),
      );
      if (!metricsWithData.length) {
        window.alert("Keine Daten für den gewählten Zeitraum zum Exportieren.");
        return;
      }
      if (typeof XLSX !== "undefined" && XLSX.utils?.book_new && XLSX.write) {
        const wb = buildOvConsolidatedWorkbook(period, metricsWithData);
        const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        downloadBinaryFile(
          ovConsolidatedExportFilename(period, "xlsx"),
          buffer,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        return;
      }
      const csv = buildOvConsolidatedCsv(period, metricsWithData);
      downloadTextFile(ovConsolidatedExportFilename(period, "csv"), csv, "text/csv;charset=utf-8");
    }

    function ensureConsolidatedExportButton() {
      const panel = document.getElementById("statsPanelOverview");
      const card = panel?.querySelector(".stats-card-overview");
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
          <button type="button" class="stats-perf-viz-btn stats-perf-export-btn stats-perf-consolidated-export-btn is-active" title="Alle Übersicht-KPIs als Excel exportieren (je KPI ein Tabellenblatt)" aria-label="Alle Übersicht-KPIs als Excel exportieren (je KPI ein Tabellenblatt)">
            <i class="fa-solid fa-download" aria-hidden="true"></i>
          </button>
        </div>`;
      card.appendChild(anchor);
      anchor
        .querySelector(".stats-perf-consolidated-export-btn")
        ?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          exportOverviewConsolidatedCsv();
        });
    }

    function syncDetailUi() {
      const panel = document.getElementById("statsPanelOverview");
      if (!panel) return;
      const consolidated = !ovDetailOpen;
      const ovCard = panel.querySelector(".stats-card-overview");
      const exportAnchor = panel.querySelector(".stats-perf-consolidated-export-anchor");
      ovCard?.classList.toggle("is-ov-consolidated-view", consolidated);
      if (exportAnchor) exportAnchor.hidden = !consolidated;
      panel.querySelectorAll(".stats-ov-kpi-card").forEach((card) => {
        const metric = card.dataset.ovMetric;
        const open = ovDetailOpen === metric;
        card.classList.toggle("is-detail-open", open);
        const btn = card.querySelector(".stats-ov-detail-btn");
        if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      panel.querySelectorAll(".stats-ov-segment").forEach((segment) => {
        const metric = segment.dataset.ovMetric;
        if (segment.hidden) return;
        segment.classList.toggle("is-detail-hidden", ovDetailOpen !== metric);
      });
    }

    function openDetail(metric) {
      if (!metric) return;
      ovDetailOpen = metric;
      refreshDetail(metric);
      syncDetailUi();
      const segment = document.querySelector(
        `#statsPanelOverview .stats-ov-segment[data-ov-metric="${metric}"]`,
      );
      segment?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function closeDetail(metric) {
      if (metric && ovDetailOpen !== metric) return;
      ovDetailOpen = null;
      syncDetailUi();
    }

    function initPeriodTabs() {
      if (ovPeriodTabsInit) return;
      const tabs = document.querySelectorAll("#statsPanelOverview .stats-overview-period-tab");
      if (!tabs.length) return;
      ovPeriodTabsInit = true;
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const period = tab.dataset.overviewPeriod;
          if (!period || period === getOverviewPeriod()) return;
          tabs.forEach((item) => {
            const active = item.dataset.overviewPeriod === period;
            item.classList.toggle("is-active", active);
            item.setAttribute("aria-selected", active ? "true" : "false");
          });
          syncOverviewKpis();
        });
      });
    }

    function initSegments() {
      const panel = document.getElementById("statsPanelOverview");
      if (!panel) return;
      panel.addEventListener("click", (event) => {
        const closeBtn = event.target.closest(".stats-perf-detail-close");
        if (closeBtn) {
          const segment = closeBtn.closest(".stats-ov-segment");
          closeDetail(segment?.dataset.ovMetric);
          return;
        }
        const accordionTrigger = event.target.closest(".stats-ov-accordion-trigger");
        if (accordionTrigger) {
          const item = accordionTrigger.closest(".stats-ov-accordion-item");
          const panel = item?.querySelector(".stats-ov-accordion-panel");
          if (!item || !panel) return;
          const expanded = accordionTrigger.getAttribute("aria-expanded") === "true";
          accordionTrigger.setAttribute("aria-expanded", expanded ? "false" : "true");
          item.classList.toggle("is-expanded", !expanded);
          panel.hidden = expanded;
          return;
        }
        const openBtn = event.target.closest(".stats-ov-detail-btn");
        if (openBtn) {
          const metric = openBtn.dataset.ovMetric;
          if (ovDetailOpen === metric) closeDetail(metric);
          else openDetail(metric);
        }
      });
    }

    function boot() {
      initPeriodTabs();
      initSegments();
      ensureConsolidatedExportButton();
      ensureOvDetailExportButtons();
      syncDetailUi();
      syncOverviewKpis();
    }

    return {
      boot,
      syncOverviewKpis,
      refreshOverviewLists: syncOverviewKpis,
    };
  }

  global.initStatsOverviewModule = initStatsOverviewModule;
})(typeof window !== "undefined" ? window : global);
