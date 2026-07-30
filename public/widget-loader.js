(function () {
  // =====================================================
  // PREVENT MULTIPLE LOADS
  // =====================================================

  if (window.__supportBotLoaded) return;
  window.__supportBotLoaded = true;

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

  var BUBBLE_SIZE = {
    width: "92px",
    height: "92px",
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

  iframe.title = "SupportBot";

  iframe.id = "supportbot-iframe";

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

    if (event.data.source !== "supportbot-widget") return;

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
  // APPEND
  // =====================================================

  document.body.appendChild(iframe);

  console.log("SupportBot Widget Loaded");
})();
