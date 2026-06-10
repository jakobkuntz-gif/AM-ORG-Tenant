(function (global) {
  "use strict";

  const MAX_LENGTH = 30;
  const MAX_WIDTH = "300px";
  const CLASS = "standort-name-truncate";

  function truncateStandortName(name, maxLen = MAX_LENGTH) {
    const text = String(name || "").trim();
    if (text.length <= maxLen) return text;
    return `${text.slice(0, maxLen)}...`;
  }

  function isStandortNameTruncated(name, maxLen = MAX_LENGTH) {
    return String(name || "").trim().length > maxLen;
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(text) {
    return escapeHtml(text);
  }

  function applyStandortNameElementState(el, fullName) {
    const full = String(fullName || "").trim();
    if (!el) return;
    el.classList.add(CLASS);
    el.dataset.standortFullName = full;
    el.style.display = "inline-block";
    el.style.maxWidth = MAX_WIDTH;
    el.textContent = full;
    if (isStandortNameTruncated(full)) el.title = full;
    else el.removeAttribute("title");
  }

  function createStandortNameElement(fullName, options = {}) {
    const span = document.createElement("span");
    if (options.className) {
      options.className.split(/\s+/).filter(Boolean).forEach((cls) => span.classList.add(cls));
    }
    applyStandortNameElementState(span, fullName);
    return span;
  }

  function standortNameHtml(fullName) {
    const full = String(fullName || "").trim();
    if (!full) return "";
    const title = isStandortNameTruncated(full) ? ` title="${escapeAttr(full)}"` : "";
    return `<span class="${CLASS}" data-standort-full-name="${escapeAttr(full)}"${title}>${escapeHtml(full)}</span>`;
  }

  function standortOptionHtml(fullName, extraAttrs = "", options = {}) {
    const full = String(fullName || "").trim();
    if (!full) return "";
    const display = options.truncate === false ? full : truncateStandortName(full);
    const title = display !== full ? ` title="${escapeAttr(full)}"` : "";
    return `<option value="${escapeAttr(full)}"${title}${extraAttrs ? ` ${extraAttrs}` : ""}>${escapeHtml(display)}</option>`;
  }

  function getStandortFullName(node) {
    if (!node) return "";
    if (node.dataset?.standortFullName) return node.dataset.standortFullName.trim();
    const nested = node.querySelector?.(`.${CLASS}[data-standort-full-name]`);
    if (nested?.dataset?.standortFullName) return nested.dataset.standortFullName.trim();
    const cell = node.closest?.("[data-standort-full-name]");
    if (cell?.dataset?.standortFullName) return cell.dataset.standortFullName.trim();
    return String(node.textContent || "").trim();
  }

  function setStandortCellDisplay(cell, fullName) {
    if (!cell) return;
    const full = String(fullName || "").trim();
    cell.dataset.standortFullName = full;
    cell.textContent = "";
    if (!full) return;
    cell.appendChild(createStandortNameElement(full));
  }

  function wrapStandortNameCell(cell) {
    if (!cell || cell.querySelector(`.${CLASS}`)) return;
    const full = getStandortFullName(cell);
    if (!full) return;
    setStandortCellDisplay(cell, full);
  }

  function decorateStandortNameCells(root = document) {
    const scope = root instanceof Element || root instanceof Document ? root : document;
    scope.querySelectorAll(".locations-row__name").forEach(wrapStandortNameCell);
    scope.querySelectorAll('td[data-col="standort"]').forEach((cell) => {
      if (cell.closest("thead")) return;
      wrapStandortNameCell(cell);
    });
    scope.querySelectorAll(".stats-ov-table tbody td:first-child").forEach(wrapStandortNameCell);
    scope.querySelectorAll(".standort-name-truncate").forEach((el) => {
      if (el.dataset.standortFullName) applyStandortNameElementState(el, el.dataset.standortFullName);
    });
  }

  function setStandortLabelElement(el, fullName) {
    if (!el) return;
    const full = String(fullName || "").trim();
    if (!full || !isStandortNameTruncated(full)) {
      el.textContent = full;
      el.removeAttribute("title");
      el.classList.remove(CLASS);
      delete el.dataset.standortFullName;
      el.style.display = "";
      el.style.maxWidth = "";
      return;
    }
    el.textContent = "";
    el.classList.remove(CLASS);
    delete el.dataset.standortFullName;
    el.style.display = "";
    el.style.maxWidth = "";
    el.appendChild(createStandortNameElement(full));
  }

  global.StandortNameDisplay = {
    MAX_LENGTH,
    MAX_WIDTH,
    CLASS,
    truncateStandortName,
    isStandortNameTruncated,
    createStandortNameElement,
    standortNameHtml,
    standortOptionHtml,
    getStandortFullName,
    setStandortCellDisplay,
    wrapStandortNameCell,
    decorateStandortNameCells,
    setStandortLabelElement,
    applyStandortNameElementState,
  };
})(typeof window !== "undefined" ? window : global);
