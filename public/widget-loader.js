(function () {
  // =====================================================
  // PREVENT MULTIPLE LOADS
  // =====================================================

  if (window.__nimoBotLoaded) return;
  window.__nimoBotLoaded = true;

  var script = document.currentScript;

  // =====================================================
  // WIDGET ORIGIN
  // =====================================================

  var widgetOrigin =
    (script && script.getAttribute("data-origin")) ||
    "https://supportbot.corbinprojects.co.in";

  // =====================================================
  // CONFIGURATION
  // =====================================================

  // NOTE: must match .cw-launcher's width/height in style.css exactly,
  // otherwise the bot gets clipped by the iframe's fixed box.
  var BUBBLE_SIZE = {
    width: "130px",
    height: "130px",
  };

  var PANEL_SIZE = {
    width: "420px",
    height: "700px",
  };

  var MOBILE_PANEL_SIZE = {
    width: "100vw",
    height: "100vh",
  };

  // =====================================================
  // CREATE IFRAME
  // =====================================================

  var iframe = document.createElement("iframe");

  iframe.src = widgetOrigin + "/embed";

  iframe.title = "Nimo Bot";

  iframe.id = "nimobot-iframe";

  iframe.allow = "clipboard-write";

  iframe.setAttribute("allowtransparency", "true");

  // =====================================================
  // STYLE
  // =====================================================

  iframe.style.position = "fixed";
  iframe.style.right = "20px";
  iframe.style.bottom = "20px";

  iframe.style.width = BUBBLE_SIZE.width;
  iframe.style.height = BUBBLE_SIZE.height;

  iframe.style.border = "none";
  iframe.style.background = "transparent";
  iframe.style.backgroundColor = "transparent";
  iframe.style.overflow = "hidden";

  iframe.style.zIndex = "2147483647";

  iframe.style.transition =
    "width .25s ease,height .25s ease,right .25s ease,bottom .25s ease";

  // =====================================================
  // MOBILE
  // =====================================================

  function isMobile() {
    return window.innerWidth <= 480;
  }

  // =====================================================
  // OPEN / CLOSE
  // =====================================================

  window.addEventListener("message", function (event) {
    if (event.origin !== widgetOrigin) return;

    if (!event.data) return;

    // NOTE: must match the `source` string posted from ChatWidget.tsx
    // (window.parent.postMessage({ source: "nimobot-widget", ... }))
    if (event.data.source !== "nimobot-widget") return;

    if (event.data.type === "OPEN") {
      if (isMobile()) {
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = MOBILE_PANEL_SIZE.width;
        iframe.style.height = MOBILE_PANEL_SIZE.height;
      } else {
        iframe.style.right = "20px";
        iframe.style.bottom = "20px";
        iframe.style.width = PANEL_SIZE.width;
        iframe.style.height = PANEL_SIZE.height;
      }
    }

    if (event.data.type === "CLOSE") {
      iframe.style.right = "20px";
      iframe.style.bottom = "20px";
      iframe.style.width = BUBBLE_SIZE.width;
      iframe.style.height = BUBBLE_SIZE.height;
    }
  });

  // =====================================================
  // RESIZE
  // =====================================================

  window.addEventListener("resize", function () {
    if (iframe.style.width === BUBBLE_SIZE.width) return;

    if (isMobile()) {
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = MOBILE_PANEL_SIZE.width;
      iframe.style.height = MOBILE_PANEL_SIZE.height;
    } else {
      iframe.style.right = "20px";
      iframe.style.bottom = "20px";
      iframe.style.width = PANEL_SIZE.width;
      iframe.style.height = PANEL_SIZE.height;
    }
  });

  // =====================================================
  // APPEND (guard against document.body not existing yet)
  // =====================================================

  function mount() {
    document.body.appendChild(iframe);
    console.log("Nimo Bot Widget Loaded");
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener("DOMContentLoaded", mount);
  }
})();
