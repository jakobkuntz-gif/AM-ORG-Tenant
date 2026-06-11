(function (global) {
  "use strict";

  // Shared period/comparison engine for the statistics panels (Übersicht +
  // Performance). One panel = one instance created via StatsPeriodControls.create.
  // Owns: preset/custom period state, resolved date ranges, the custom Von/Bis
  // controls, the Vergleichen toggle (previous/custom comparison range) and the
  // deterministic range-seeded scale factor used to derive comparison values.

  function hashSeed(label) {
    let hash = 0;
    const text = String(label || "");
    for (let i = 0; i < text.length; i += 1) {
      hash = (hash * 31 + text.charCodeAt(i)) % 9973;
    }
    return hash;
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }
  function today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  function isoToDate(iso) {
    const [y, m, d] = String(iso).split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }
  function dateToIso(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }
  function formatDe(d) {
    return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
  }
  function addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }
  function daysBetween(a, b) {
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  }

  function create(config) {
    const cfg = config || {};
    const ids = cfg.ids || {};
    const periodToMaxDays = cfg.periodToMaxDays || (() => null);
    const onChange = typeof cfg.onChange === "function" ? cfg.onChange : () => {};

    // Custom range + comparison state. Reset on every panel open (no persistence).
    const state = {
      customStart: null, // ISO yyyy-mm-dd
      customEnd: null,
      compare: false,
      compareMode: "previous", // "previous" | "custom"
      compStart: null,
      compEnd: null,
    };

    const el = (key) => (ids[key] ? document.getElementById(ids[key]) : null);

    function getPeriod() {
      const active = document.querySelector(
        `${cfg.panelSelector} ${cfg.tabSelector}.is-active, ${cfg.panelSelector} ${cfg.tabSelector}[aria-selected='true']`,
      );
      return active?.dataset?.[cfg.periodDatasetKey] || "gesamt";
    }

    // Resolves the active period (preset or custom) to a concrete date range.
    function getResolvedRange() {
      const period = getPeriod();
      const now = today();
      if (period === "custom" && state.customStart && state.customEnd) {
        return {
          start: isoToDate(state.customStart),
          end: isoToDate(state.customEnd),
          isGesamt: false,
        };
      }
      if (period === "gesamt") {
        return { start: isoToDate(cfg.dataStartIso || "2026-01-01"), end: now, isGesamt: true };
      }
      const maxDays = periodToMaxDays(period) || 0;
      return { start: addDays(now, -maxDays), end: now, isGesamt: false };
    }

    function formatRangeLabel(range) {
      if (!range) return "";
      if (range.isGesamt) return `seit ${formatDe(range.start)}`;
      return `${formatDe(range.start)} – ${formatDe(range.end)}`;
    }

    // Comparison range: explicit custom pair, or the equal-length period
    // immediately before the selected range.
    function getResolvedCompareRange() {
      if (state.compareMode === "custom" && state.compStart && state.compEnd) {
        return {
          start: isoToDate(state.compStart),
          end: isoToDate(state.compEnd),
          isGesamt: false,
          custom: true,
        };
      }
      const cur = getResolvedRange();
      const lenDays = Math.max(0, daysBetween(cur.start, cur.end));
      const end = addDays(cur.start, -1);
      const start = addDays(end, -lenDays);
      return { start, end, isGesamt: false, custom: false };
    }

    // Deterministic scale factor (~0.82–1.18) seeded by range + key, so each
    // range/comparison shows plausible, stable, range-specific numbers.
    function scaleFactor(range, key) {
      if (!range || range.isGesamt) return 1;
      const lenDays = Math.max(1, daysBetween(range.start, range.end));
      const seed = hashSeed(`${dateToIso(range.start)}|${lenDays}|${key}`);
      return 0.82 + ((seed % 361) / 1000);
    }

    function setPeriodTab(period) {
      document.querySelectorAll(`${cfg.panelSelector} ${cfg.tabSelector}`).forEach((tab) => {
        const active = tab.dataset[cfg.periodDatasetKey] === period;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
    }

    function updateCustomVisibility() {
      const panel = el("customRange");
      if (panel) panel.hidden = getPeriod() !== "custom";
    }

    function updateCompareRangeLine() {
      const lineEl = el("compareRangeValue");
      if (!lineEl) return;
      if (!state.compare) {
        lineEl.textContent = "";
        return;
      }
      const comp = getResolvedCompareRange();
      const suffix = comp.custom ? "(benutzerdefiniert)" : "(vorheriger Zeitraum)";
      lineEl.textContent = `vs. ${formatRangeLabel(comp)} ${suffix}`;
    }

    function updateRangeLine() {
      const lineEl = el("rangeValue");
      if (lineEl) lineEl.textContent = formatRangeLabel(getResolvedRange());
      updateCompareRangeLine();
    }

    function clearError(key) {
      const err = el(key);
      if (err) {
        err.hidden = true;
        err.textContent = "";
      }
    }

    function initTabs() {
      document.querySelectorAll(`${cfg.panelSelector} ${cfg.tabSelector}`).forEach((tab) => {
        if (tab.dataset.periodCtlBound) return;
        tab.dataset.periodCtlBound = "1";
        tab.addEventListener("click", () => {
          const period = tab.dataset[cfg.periodDatasetKey];
          if (!period || period === getPeriod()) return;
          setPeriodTab(period);
          if (period === "custom") {
            if (!state.customStart || !state.customEnd) {
              const now = today();
              state.customStart = dateToIso(addDays(now, -30));
              state.customEnd = dateToIso(now);
            }
            const vonEl = el("customVon");
            const bisEl = el("customBis");
            if (vonEl) vonEl.value = state.customStart;
            if (bisEl) bisEl.value = state.customEnd;
            clearError("customError");
          }
          updateCustomVisibility();
          onChange();
        });
      });
    }

    function applyRangePair(vonKey, bisKey, errKey, commit) {
      const vonEl = el(vonKey);
      const bisEl = el(bisKey);
      const err = el(errKey);
      if (!vonEl || !bisEl) return;
      const von = vonEl.value;
      const bis = bisEl.value;
      const showError = (msg) => {
        if (err) {
          err.textContent = msg;
          err.hidden = false;
        }
      };
      if (!von || !bis) return showError("Bitte Von- und Bis-Datum wählen.");
      if (von > bis) return showError("Das Von-Datum darf nicht nach dem Bis-Datum liegen.");
      clearError(errKey);
      commit(von, bis);
      onChange();
    }

    function initControls() {
      const applyBtn = el("customApply");
      if (applyBtn && !applyBtn.dataset.bound) {
        applyBtn.dataset.bound = "1";
        applyBtn.addEventListener("click", () =>
          applyRangePair("customVon", "customBis", "customError", (von, bis) => {
            state.customStart = von;
            state.customEnd = bis;
          }),
        );
      }
      const toggle = el("compareToggle");
      if (toggle && !toggle.dataset.bound) {
        toggle.dataset.bound = "1";
        toggle.addEventListener("change", () => {
          state.compare = toggle.checked;
          const opts = el("compareOptions");
          if (opts) opts.hidden = !toggle.checked;
          onChange();
        });
      }
      document
        .querySelectorAll(`${cfg.panelSelector} input[name="${ids.compareModeName}"]`)
        .forEach((radio) => {
          if (radio.dataset.bound) return;
          radio.dataset.bound = "1";
          radio.addEventListener("change", () => {
            if (!radio.checked) return;
            state.compareMode = radio.value;
            const customWrap = el("compareCustom");
            if (customWrap) customWrap.hidden = radio.value !== "custom";
            if (radio.value === "custom") {
              if (!state.compStart || !state.compEnd) {
                const prev = getResolvedCompareRange();
                state.compStart = dateToIso(prev.start);
                state.compEnd = dateToIso(prev.end);
              }
              const vonEl = el("compareVon");
              const bisEl = el("compareBis");
              if (vonEl) vonEl.value = state.compStart;
              if (bisEl) bisEl.value = state.compEnd;
            }
            onChange();
          });
        });
      const compApply = el("compareApply");
      if (compApply && !compApply.dataset.bound) {
        compApply.dataset.bound = "1";
        compApply.addEventListener("click", () =>
          applyRangePair("compareVon", "compareBis", "compareError", (von, bis) => {
            state.compStart = von;
            state.compEnd = bis;
          }),
        );
      }
    }

    function reset() {
      state.customStart = null;
      state.customEnd = null;
      state.compare = false;
      state.compareMode = "previous";
      state.compStart = null;
      state.compEnd = null;
      setPeriodTab("gesamt");
      const toggle = el("compareToggle");
      if (toggle) toggle.checked = false;
      const opts = el("compareOptions");
      if (opts) opts.hidden = true;
      const compCustom = el("compareCustom");
      if (compCustom) compCustom.hidden = true;
      document
        .querySelectorAll(`${cfg.panelSelector} input[name="${ids.compareModeName}"]`)
        .forEach((radio) => {
          radio.checked = radio.value === "previous";
        });
      clearError("customError");
      clearError("compareError");
      updateCustomVisibility();
      onChange();
    }

    return {
      state,
      getPeriod,
      setPeriodTab,
      getResolvedRange,
      getResolvedCompareRange,
      formatRangeLabel,
      getRangeLabel: () => formatRangeLabel(getResolvedRange()),
      isCompareOn: () => state.compare,
      scaleFactor,
      updateRangeLine,
      initTabs,
      initControls,
      reset,
    };
  }

  global.StatsPeriodControls = { create, hashSeed };
})(typeof window !== "undefined" ? window : global);
