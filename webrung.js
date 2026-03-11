(function () {
  "use strict";

  var script = document.currentScript;
  if (!script || !script.src) return;
  var ringUrl = script.src.substring(0, script.src.lastIndexOf("/"));

  function safeColor(val) {
    if (!val) return null;
    return /^[a-zA-Z0-9#(),.\s%]+$/.test(val) ? val : null;
  }

  function isSafeUrl(url) {
    try {
      var p = new URL(url);
      return p.protocol === "https:" || p.protocol === "http:";
    } catch (e) {
      return false;
    }
  }

  var theme = script.getAttribute("data-theme") || "light";
  var customBg = safeColor(script.getAttribute("data-bg"));
  var customText = safeColor(script.getAttribute("data-text"));
  var customAccent = safeColor(script.getAttribute("data-accent"));

  var DISMISSED_KEY = "webrung-dismissed";

  if (sessionStorage.getItem(DISMISSED_KEY)) {
    return;
  }

  var themes = {
    light: { bg: "#f8f8f8", text: "#333", accent: "#0066cc", border: "#ddd" },
    dark: { bg: "#1a1a2e", text: "#e0e0e0", accent: "#4fc3f7", border: "#333" },
  };

  var colors = themes[theme] || themes.light;
  if (customBg) colors.bg = customBg;
  if (customText) colors.text = customText;
  if (customAccent) colors.accent = customAccent;

  var bar = document.createElement("div");
  bar.id = "webrung-bar";

  var shadow = bar.attachShadow({ mode: "closed" });

  var style = document.createElement("style");
  style.textContent =
    ":host {" +
    "  all: initial;" +
    "  position: fixed;" +
    "  bottom: 0;" +
    "  left: 0;" +
    "  right: 0;" +
    "  z-index: 2147483647;" +
    "  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" +
    "}" +
    ".bar {" +
    "  display: flex;" +
    "  align-items: center;" +
    "  justify-content: center;" +
    "  gap: 12px;" +
    "  padding: 8px 16px;" +
    "  background: " + colors.bg + ";" +
    "  color: " + colors.text + ";" +
    "  border-top: 1px solid " + (colors.border || colors.text) + ";" +
    "  font-size: 14px;" +
    "  line-height: 1.4;" +
    "}" +
    ".bar a {" +
    "  color: " + colors.accent + ";" +
    "  text-decoration: none;" +
    "}" +
    ".bar a:hover {" +
    "  text-decoration: underline;" +
    "}" +
    ".separator {" +
    "  opacity: 0.4;" +
    "}" +
    ".close {" +
    "  position: absolute;" +
    "  right: 12px;" +
    "  background: none;" +
    "  border: none;" +
    "  color: " + colors.text + ";" +
    "  cursor: pointer;" +
    "  font-size: 18px;" +
    "  line-height: 1;" +
    "  padding: 4px 8px;" +
    "  opacity: 0.6;" +
    "}" +
    ".close:hover {" +
    "  opacity: 1;" +
    "}";

  var container = document.createElement("div");
  container.className = "bar";

  var ringLink = document.createElement("span");
  ringLink.id = "webrung-info";
  ringLink.textContent = "Loading webrung\u2026";

  var separator = document.createElement("span");
  separator.className = "separator";
  separator.textContent = "\u2022";

  var randomLink = document.createElement("a");
  randomLink.id = "webrung-random";
  randomLink.href = "#";
  randomLink.textContent = "Visit a random site \u2192";

  var closeBtn = document.createElement("button");
  closeBtn.className = "close";
  closeBtn.setAttribute("aria-label", "Dismiss webrung bar");
  closeBtn.textContent = "\u00d7";
  closeBtn.addEventListener("click", function () {
    bar.remove();
    sessionStorage.setItem(DISMISSED_KEY, "1");
  });

  container.appendChild(ringLink);
  container.appendChild(separator);
  container.appendChild(randomLink);
  container.appendChild(closeBtn);

  shadow.appendChild(style);
  shadow.appendChild(container);

  function init() {
    document.body.appendChild(bar);
    loadSites();
  }

  function loadSites() {
    fetch(ringUrl + "/sites.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load sites.json");
      return res.json();
    })
    .then(function (data) {
      var ring = data.ring;
      var sites = data.sites;

      ringLink.innerHTML = "";
      ringLink.appendChild(document.createTextNode("This site is part of "));
      var a = document.createElement("a");
      a.href = isSafeUrl(ring.url) ? ring.url : ringUrl;
      a.textContent = ring.name;
      ringLink.appendChild(a);

      var currentHost = window.location.hostname;
      var otherSites = sites.filter(function (s) {
        try {
          return new URL(s.url).hostname !== currentHost;
        } catch (e) {
          return true;
        }
      });

      if (otherSites.length === 0) otherSites = sites;

      randomLink.addEventListener("click", function (e) {
        e.preventDefault();
        var pick = otherSites[Math.floor(Math.random() * otherSites.length)];
        if (isSafeUrl(pick.url)) window.location.href = pick.url;
      });
    })
    .catch(function () {
      ringLink.innerHTML = "";
      ringLink.appendChild(document.createTextNode("This site is part of a "));
      var a = document.createElement("a");
      a.href = ringUrl;
      a.textContent = "webrung";
      ringLink.appendChild(a);

      separator.style.display = "none";
      randomLink.style.display = "none";
    });
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
