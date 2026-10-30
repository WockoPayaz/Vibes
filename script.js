/* The interaction code. All personal content and artwork settings live in config.js. */
(() => {
  "use strict";

  const config = window.ROOM_CONFIG;
  const scene = document.querySelector("#room-scene");
  const dialog = document.querySelector("#room-dialog");
  const content = document.querySelector("#dialog-content");
  const labelsToggle = document.querySelector("#labels-toggle");
  let lastTrigger = null;

  const items = {
    bookshelf: { label: "bookshelf", render: renderBookshelf },
    cats: { label: "my cats", render: renderCats },
    monitor: { label: "monitor", render: renderMonitor },
    bed: { label: "my blanket", render: renderBed },
    pc: { label: "my pc", render: renderPC },
    board: { label: "to-do board", render: renderBoard },
    window: { label: "outside", render: renderWindow }
  };

  // Use textContent, never HTML strings, for all editable text.
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Accept normal web/local paths, but not executable URLs such as javascript:.
  function safeURL(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value, document.baseURI);
      const allowed = ["https:", "http:"];
      if (location.protocol === "file:") allowed.push("file:");
      return allowed.includes(url.protocol) ? value : "";
    } catch {
      return "";
    }
  }

  function addLink(parent, text, url, className) {
    const href = safeURL(url);
    if (!href) return;
    const link = element("a", className, text);
    link.href = href;
    if (href.startsWith("#")) {
      link.addEventListener("click", () => dialog.close());
    } else {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    parent.append(link);
  }

  function makeHeading(kicker, title, description) {
    content.append(element("p", "dialog-kicker", kicker));
    const heading = element("h2", "", title);
    heading.id = "dialog-title";
    const paragraph = element("p", "dialog-description", description);
    paragraph.id = "dialog-description";
    content.append(heading, paragraph);
  }

  function setLabels(show) {
    scene.classList.toggle("show-labels", show);
    labelsToggle.setAttribute("aria-pressed", String(show));
    document.querySelector("#labels-toggle-text").textContent = show ? "hide labels" : "show labels";
  }

  function buildRoom() {
    document.title = config.site.title;
    document.querySelector("#site-name").textContent = config.site.name;
    document.querySelector("#intro-text").textContent = config.site.intro;
    const art = config.artwork;
    const width = Number(art.width) > 0 ? Number(art.width) : 1920;
    const height = Number(art.height) > 0 ? Number(art.height) : 1080;
    scene.style.aspectRatio = `${width} / ${height}`;
    const background = document.querySelector("#room-background");
    background.width = width;
    background.height = height;
    const backgroundPath = safeURL(art.background);
    background.hidden = !backgroundPath;
    if (backgroundPath) background.src = backgroundPath;
    background.addEventListener("error", () => { background.hidden = true; });
    scene.classList.toggle("flat-art", art.mode === "flat");
    scene.classList.toggle("debug-hotspots", Boolean(art.debugHotspots));
    setLabels(Boolean(art.showLabels));

    Object.entries(art.objects).forEach(([id, object]) => {
      const interactive = Boolean(items[id]);
      const node = element(interactive ? "button" : "div", "room-object");
      node.id = `object-${id}`;
      node.style.left = `${object.x}%`;
      node.style.top = `${object.y}%`;
      node.style.width = `${object.w}%`;
      node.style.height = `${object.h}%`;
      node.style.zIndex = object.z;
      if (interactive) {
        node.type = "button";
        node.dataset.item = id;
        node.setAttribute("aria-label", `Open ${items[id].label}`);
        node.setAttribute("aria-haspopup", "dialog");
        node.setAttribute("aria-controls", "room-dialog");
      } else {
        node.classList.add("room-decoration");
        node.setAttribute("aria-hidden", "true");
      }
      const imagePath = safeURL(object.image);
      if (art.mode !== "flat" && imagePath) {
        const image = element("img");
        image.src = imagePath;
        image.alt = "";
        image.draggable = false;
        image.addEventListener("error", () => {
          image.hidden = true;
          node.classList.add("missing-art");
        });
        node.append(image);
      }
      if (interactive) node.append(element("span", "object-tag", items[id].label));
      scene.append(node);
    });

    const shortcuts = document.querySelector("#shortcut-buttons");
    Object.entries(items).forEach(([id, item], index) => {
      const button = element("button", "shortcut");
      button.type = "button";
      button.dataset.item = id;
      button.setAttribute("aria-haspopup", "dialog");
      button.setAttribute("aria-controls", "room-dialog");
      const number = element("span", "shortcut-number", String(index + 1).padStart(2, "0"));
      number.setAttribute("aria-hidden", "true");
      button.append(number, element("span", "", item.label));
      shortcuts.append(button);
    });
  }

  function openItem(id, trigger) {
    if (!items[id]) return;
    lastTrigger = trigger;
    content.replaceChildren();
    dialog.dataset.view = id;
    document.querySelector("#dialog-path").textContent = `room://${id}`;
    items[id].render();
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add("modal-open");
    // Keep mobile keyboards from hiding the browser popup before a deliberate tap.
    document.querySelector("#dialog-close").focus({ preventScroll: true });
  }

  function renderBookshelf() {
    makeHeading("the bookshelf", config.bookshelf.title, "A confession:");
    const note = element("div", "bookshelf-note");
    note.append(element("p", "", config.bookshelf.message));
    content.append(note);
  }

  // A simple inline icon, reused for empty or missing photo files.
  function photoPlaceholder(message) {
    const placeholder = element("div", "photo-placeholder");
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 48 48");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.5");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M8 13h9l3-5h9l3 5h8v26H8z M17 25a7 7 0 1 0 14 0a7 7 0 1 0-14 0 M35 18h2");
    svg.append(path);
    placeholder.append(svg, element("span", "", message));
    return placeholder;
  }

  function photoCard(photo = {}) {
    const figure = element("figure", "photo-card");
    const media = element("div", "photo-media");
    const src = safeURL(photo.src);
    if (src) {
      const img = element("img");
      img.alt = photo.alt || photo.caption || "Room photo";
      img.addEventListener("error", () => media.replaceChildren(photoPlaceholder("This photo couldn’t load.")), { once: true });
      img.src = src;
      media.append(img);
    } else {
      media.append(photoPlaceholder("photo coming soon"));
    }
    figure.append(media);
    if (photo.caption) figure.append(element("figcaption", "", photo.caption));
    return figure;
  }

  function photoGallery(photos) {
    if (!Array.isArray(photos) || photos.length === 0) {
      content.append(element("p", "empty-state", "No photos here just yet. Check back soon."));
      return;
    }
    const grid = element("div", `photo-grid${photos.length === 1 ? " single-photo" : ""}`);
    photos.forEach(photo => grid.append(photoCard(photo)));
    content.append(grid);
  }

  function renderCats() {
    makeHeading("meet the roommates", config.cats.title, config.cats.description);
    photoGallery(config.cats.photos);
  }

  function renderWindow() {
    makeHeading("through the window", config.window.title, config.window.description);
    photoGallery(config.window.photos);
  }

  function renderBed() {
    makeHeading("do not disturb", config.bed.title, config.bed.description);
    photoGallery([config.bed.photo]);
  }

  function renderPC() {
    makeHeading("the pc", config.pc.title, config.pc.description);
    const layout = element("div", "specs-layout");
    const picture = element("img", "pc-doodle");
    picture.src = safeURL(config.artwork.objects.pc.image) || "assets/room/pc.svg";
    picture.alt = "";
    picture.addEventListener("error", () => { picture.hidden = true; }, { once: true });
    const list = element("dl", "specs-list");
    config.pc.specs.forEach(spec => {
      const row = element("div", "spec-row");
      row.append(element("dt", "", spec.label), element("dd", "", spec.value));
      list.append(row);
    });
    if (!config.pc.specs.length) list.append(element("p", "empty-state", "Specs coming soon."));
    layout.append(picture, list);
    content.append(layout);
  }

  function renderBoard() {
    makeHeading("pinned for later", config.board.title, config.board.description);
    const columns = element("div", "board-columns");
    const sections = [
      { name: "Hack Club workshops", entries: config.board.workshops },
      { name: "YSWS programs", entries: config.board.ysws }
    ];
    sections.forEach(section => {
      const column = element("section", "board-column");
      column.append(element("h3", "", section.name));
      if (!section.entries.length) {
        column.append(element("p", "empty-state", "Nothing pinned yet. Something good will go here."));
      } else {
        const list = element("ul", "board-list");
        section.entries.forEach(entry => {
          const card = element("li", "board-entry");
          card.append(element("h4", "", entry.title));
          if (entry.description) card.append(element("p", "", entry.description));
          if (entry.status) card.append(element("span", "entry-status", entry.status));
          addLink(card, "more details ↗", entry.url, "");
          list.append(card);
        });
        column.append(list);
      }
      columns.append(column);
    });
    content.append(columns);
  }

  function renderMonitor() {
    const browser = config.monitor;
    makeHeading("the monitor", browser.browserName, "A browser with a one-track mind.");
    const form = element("form", "search-form");
    form.setAttribute("role", "search");
    const label = element("label", "sr-only", "Search the very small internet");
    label.htmlFor = "room-search";
    const input = element("input");
    input.id = "room-search";
    input.type = "search";
    input.placeholder = browser.searchPlaceholder;
    input.autocomplete = "off";
    input.maxLength = 200;
    input.required = true;
    const submit = element("button", "search-submit", "↗");
    submit.type = "submit";
    submit.setAttribute("aria-label", "Search");
    form.append(label, input, submit);
    const status = element("p", "search-status", "One result. Every single time.");
    status.setAttribute("role", "status");
    const result = element("section", "search-result");
    result.setAttribute("aria-label", "Search result");
    result.hidden = true;
    const data = browser.result;
    result.append(
      element("p", "result-url", data.displayUrl),
      element("h3", "", data.title),
      element("p", "result-description", data.description)
    );
    addLink(result, data.linkLabel || "take a look ↗", data.url, "result-link");
    if (safeURL(data.image)) {
      const photo = element("div", "result-photo");
      photo.append(photoCard({ src: data.image, alt: data.imageAlt }));
      result.append(photo);
    }
    input.addEventListener("input", () => input.setCustomValidity(""));
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!input.value.trim()) {
        input.setCustomValidity("Type something to search.");
        input.reportValidity();
        return;
      }
      input.setCustomValidity("");
      result.hidden = false;
      status.textContent = "1 result found. Yep, this one again.";
    });
    content.append(form, status, result);
  }

  buildRoom();
  // Event delegation lets the scene and shortcut buttons share one handler.
  document.addEventListener("click", event => {
    const trigger = event.target.closest("button[data-item]");
    if (trigger) openItem(trigger.dataset.item, trigger);
  });
  labelsToggle.addEventListener("click", () => setLabels(labelsToggle.getAttribute("aria-pressed") !== "true"));
  document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());

  // Only a click wholly on the backdrop closes it; dragging out of content does not.
  let startedOnBackdrop = false;
  function outsideDialog(event) {
    const rect = dialog.getBoundingClientRect();
    return event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  }
  dialog.addEventListener("pointerdown", event => { startedOnBackdrop = outsideDialog(event); });
  dialog.addEventListener("click", event => {
    if (startedOnBackdrop && outsideDialog(event)) dialog.close();
    startedOnBackdrop = false;
  });
  // Escape is handled by the native dialog and reaches this same cleanup handler.
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (lastTrigger && lastTrigger.isConnected) lastTrigger.focus({ preventScroll: true });
  });
})();
