(function (global) {
  "use strict";

  function initStatsStandortMultiselect(deps) {
    const selectIds = deps.selectIds || [];
    const getOptions = deps.getOptions || (() => []);
    const onChange = deps.onChange || (() => {});

    let state = { selected: [] };
    let mounted = false;
    const wrappers = new Map();

    function getOptionList() {
      return getOptions().filter(Boolean);
    }

    function getSelectedSet() {
      const valid = new Set(getOptionList());
      return new Set(state.selected.filter((name) => valid.has(name)));
    }

    function isFullSelection() {
      const all = getOptionList();
      if (!all.length) return true;
      const selected = getSelectedSet();
      return all.every((name) => selected.has(name));
    }

    function isPartialSelection() {
      const all = getOptionList();
      const selected = getSelectedSet();
      return selected.size > 0 && selected.size < all.length;
    }

    function ensureDefaultSelection() {
      state.selected = [...getOptionList()];
    }

    function getSelection() {
      const all = getOptionList();
      const selected = [...getSelectedSet()];
      const isAll = all.length > 0 && selected.length === all.length;
      return {
        isAll,
        selected: isAll ? [] : selected,
      };
    }

    function isSingleStandortSelected() {
      const selected = [...getSelectedSet()];
      return !isFullSelection() && selected.length === 1;
    }

    function getActiveStandorte() {
      const all = getOptionList();
      if (isFullSelection()) return all;
      return [...getSelectedSet()];
    }

    function isEmptySelection() {
      return getSelectedSet().size === 0;
    }

    function getStandortNameDisplay() {
      return global.StandortNameDisplay;
    }

    function applyStandortOptionLabel(textEl, fullName) {
      const display = getStandortNameDisplay();
      if (display) {
        textEl.className = "multi-select-option-label";
        display.applyStandortNameElementState(textEl, fullName);
        return;
      }
      textEl.className = "multi-select-option-label";
      textEl.textContent = fullName;
    }

    function applyTriggerStandortLabel(labelEl, fullName) {
      const display = getStandortNameDisplay();
      if (display) {
        display.setStandortLabelElement(labelEl, fullName);
        return;
      }
      labelEl.textContent = fullName;
    }

    function formatTriggerLabel() {
      if (isFullSelection()) return "Alle Standorte";
      const selected = [...getSelectedSet()];
      if (!selected.length) return "Kein Standort ausgewählt";
      if (selected.length === 1) return selected[0];
      return `${selected.length} Standorte ausgewählt`;
    }

    function updateTriggers() {
      selectIds.forEach((id) => {
        const wrap = wrappers.get(id);
        const label = wrap?.querySelector(".stats-standort-multiselect-trigger-label");
        if (!label) return;
        if (isFullSelection()) {
          label.textContent = "Alle Standorte";
          label.removeAttribute("title");
          label.classList.remove(getStandortNameDisplay()?.CLASS || "");
          delete label.dataset.standortFullName;
          label.style.display = "";
          label.style.maxWidth = "";
          return;
        }
        const selected = [...getSelectedSet()];
        if (!selected.length) {
          label.textContent = "Kein Standort ausgewählt";
          label.removeAttribute("title");
          label.classList.remove(getStandortNameDisplay()?.CLASS || "");
          delete label.dataset.standortFullName;
          label.style.display = "";
          label.style.maxWidth = "";
          return;
        }
        if (selected.length === 1) {
          applyTriggerStandortLabel(label, selected[0]);
          return;
        }
        label.textContent = `${selected.length} Standorte ausgewählt`;
        label.removeAttribute("title");
        label.classList.remove(getStandortNameDisplay()?.CLASS || "");
        delete label.dataset.standortFullName;
        label.style.display = "";
        label.style.maxWidth = "";
      });
    }

    function syncCheckboxes() {
      const selected = getSelectedSet();
      const full = isFullSelection();
      const partial = isPartialSelection();

      wrappers.forEach((wrap) => {
        const allCb = wrap.querySelector("input[data-stats-standort-all]");
        if (allCb) {
          allCb.indeterminate = partial;
          allCb.checked = full || partial;
        }
        wrap.querySelectorAll("input[data-stats-standort-option]").forEach((cb) => {
          cb.checked = selected.has(cb.value);
        });
      });
    }

    function applySelection(selected, notify = true) {
      const valid = new Set(getOptionList());
      const next = [...new Set((selected || []).filter((name) => valid.has(name)))];
      state.selected = next;
      syncCheckboxes();
      updateTriggers();
      if (notify) onChange();
    }

    function toggleAll() {
      if (isFullSelection()) {
        applySelection([]);
      } else {
        applySelection(getOptionList());
      }
    }

    function toggleStandort(name, checked) {
      const selected = getSelectedSet();
      if (checked) selected.add(name);
      else selected.delete(name);
      applySelection([...selected]);
    }

    function closeAll(exceptId = "") {
      wrappers.forEach((wrap, id) => {
        if (id === exceptId) return;
        wrap.classList.remove("open");
      });
    }

    function populateNativeSelect(selectEl, options) {
      selectEl.replaceChildren();
      const optAll = document.createElement("option");
      optAll.value = "";
      optAll.textContent = "Alle Standorte";
      selectEl.appendChild(optAll);
      options.forEach((name) => {
        const o = document.createElement("option");
        o.value = name;
        o.textContent = name;
        selectEl.appendChild(o);
      });
    }

    function buildOptionRows(menu) {
      menu.querySelectorAll("[data-stats-standort-dynamic]").forEach((node) => node.remove());
      getOptionList().forEach((name) => {
        const row = document.createElement("label");
        row.className = "multi-select-option";
        row.dataset.statsStandortDynamic = "1";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = name;
        cb.dataset.statsStandortOption = "1";
        cb.addEventListener("change", () => toggleStandort(name, cb.checked));
        row.appendChild(cb);
        const text = document.createElement("span");
        applyStandortOptionLabel(text, name);
        row.appendChild(text);
        menu.appendChild(row);
      });
    }

    function mountMultiselect(selectEl) {
      const parent = selectEl.closest(".stat-standort-filter") || selectEl.parentElement;
      parent.querySelector(`.stats-standort-multiselect[data-for="${selectEl.id}"]`)?.remove();

      const wrap = document.createElement("div");
      wrap.className = "stats-standort-multiselect multi-select";
      wrap.dataset.for = selectEl.id;

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "multi-select-trigger stats-standort-multiselect-trigger";
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.innerHTML = '<span class="stats-standort-multiselect-trigger-label"></span>';
      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = !wrap.classList.contains("open");
        closeAll(selectEl.id);
        wrap.classList.toggle("open", willOpen);
      });

      const menu = document.createElement("div");
      menu.className = "multi-select-menu stats-standort-multiselect-menu";
      menu.setAttribute("role", "listbox");

      const allRow = document.createElement("label");
      allRow.className = "multi-select-option stats-standort-multiselect-all";
      const allCb = document.createElement("input");
      allCb.type = "checkbox";
      allCb.dataset.statsStandortAll = "1";
      allCb.addEventListener("click", (event) => {
        event.preventDefault();
        toggleAll();
      });
      allRow.appendChild(allCb);
      const allText = document.createElement("span");
      allText.className = "multi-select-option-label";
      allText.textContent = "Alle Standorte";
      allRow.appendChild(allText);
      menu.appendChild(allRow);

      const divider = document.createElement("div");
      divider.className = "stats-standort-multiselect-divider";
      divider.dataset.statsStandortDynamic = "1";
      menu.appendChild(divider);

      buildOptionRows(menu);

      wrap.appendChild(trigger);
      wrap.appendChild(menu);
      selectEl.classList.add("multi-select-native");
      parent.appendChild(wrap);
      wrappers.set(selectEl.id, wrap);
    }

    function refreshOptions(applyScope = true) {
      const options = getOptionList();
      const valid = new Set(options);
      const wasFull = isFullSelection();
      const wasEmpty = isEmptySelection();
      const filtered = state.selected.filter((name) => valid.has(name));
      if (wasEmpty) {
        state.selected = [];
      } else if (!filtered.length || wasFull) {
        state.selected = [...options];
      } else {
        state.selected = filtered;
      }

      selectIds.forEach((id) => {
        const sel = document.getElementById(id);
        if (!sel) return;
        populateNativeSelect(sel, options);
        if (!wrappers.has(id)) mountMultiselect(sel);
        else {
          const menu = wrappers.get(id)?.querySelector(".stats-standort-multiselect-menu");
          if (menu) buildOptionRows(menu);
        }
      });

      syncCheckboxes();
      updateTriggers();
      if (applyScope) onChange();
    }

    function boot() {
      if (mounted) return;
      mounted = true;
      ensureDefaultSelection();
      selectIds.forEach((id) => {
        const sel = document.getElementById(id);
        if (sel) mountMultiselect(sel);
      });
      document.addEventListener("click", (event) => {
        if (!event.target.closest(".stats-standort-multiselect")) closeAll();
      });
      syncCheckboxes();
      updateTriggers();
    }

    return {
      boot,
      refreshOptions,
      getSelection,
      isSingleStandortSelected,
      getActiveStandorte,
      closeAll,
    };
  }

  global.initStatsStandortMultiselect = initStatsStandortMultiselect;
})(typeof window !== "undefined" ? window : global);
