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

  iframe.setAttribute("frameborder", "0");

  iframe.setAttribute("scrolling", "no");

  // =====================================================
  // STYLE HELPERS
  // =====================================================

  function setImportant(el, prop, value) {
    el.style.setProperty(prop, value, "important");
  }

  function applyBoxStyles(styles) {
    Object.keys(styles).forEach(function (prop) {
      setImportant(iframe, prop, styles[prop]);
    });
  }

  // =====================================================
  // DEVICE CHECK
  // =====================================================

  function isMobile() {
    return window.innerWidth <= 480;
  }

  // =====================================================
  // MINIMIZED / BUBBLE STATE
  // =====================================================

  function setBubbleBox() {
    applyBoxStyles({
      position: "fixed",

      right: "20px",
      bottom: "20px",
      left: "auto",
      top: "auto",

      width: BUBBLE_SIZE.width,
      height: BUBBLE_SIZE.height,

      "min-width": BUBBLE_SIZE.width,
      "min-height": BUBBLE_SIZE.height,

      "max-width": BUBBLE_SIZE.width,
      "max-height": BUBBLE_SIZE.height,

      border: "none",

      background: "transparent",
      "background-color": "transparent",

      overflow: "hidden",

      "z-index": "2147483647",

      display: "block",
      visibility: "visible",
      opacity: "1",

      "border-radius": "50%",

      "box-shadow": "none",

      transition:
        "width .35s cubic-bezier(0.4, 0, 0.2, 1), " +
        "height .35s cubic-bezier(0.4, 0, 0.2, 1), " +
        "right .35s cubic-bezier(0.4, 0, 0.2, 1), " +
        "bottom .35s cubic-bezier(0.4, 0, 0.2, 1), " +
        "border-radius .35s cubic-bezier(0.4, 0, 0.2, 1)",
    });
  }

  // =====================================================
  // OPEN PANEL STATE - Fully Responsive across all screens
  // =====================================================

  function setPanelBox() {
    if (isMobile()) {
      applyBoxStyles({
        position: "fixed",

        right: "0",
        bottom: "0",
        left: "0",
        top: "0",

        width: MOBILE_PANEL_SIZE.width,
        height: MOBILE_PANEL_SIZE.height,

        "min-width": MOBILE_PANEL_SIZE.width,
        "min-height": MOBILE_PANEL_SIZE.height,

        "max-width": MOBILE_PANEL_SIZE.width,
        "max-height": MOBILE_PANEL_SIZE.height,

        border: "none",

        background: "transparent",
        "background-color": "transparent",

        overflow: "hidden",

        "z-index": "2147483647",

        display: "block",
        visibility: "visible",
        opacity: "1",

        "border-radius": "0",

        "box-shadow": "none",

        transition:
          "width .35s cubic-bezier(0.4, 0, 0.2, 1), " +
          "height .35s cubic-bezier(0.4, 0, 0.2, 1), " +
          "right .35s cubic-bezier(0.4, 0, 0.2, 1), " +
          "bottom .35s cubic-bezier(0.4, 0, 0.2, 1), " +
          "border-radius .35s cubic-bezier(0.4, 0, 0.2, 1)",
      });
    } else {
      applyBoxStyles({
        position: "fixed",

        right: "20px",
        bottom: "20px",
        left: "auto",
        top: "auto",

        width: PANEL_SIZE.width,
        height: PANEL_SIZE.height,

        "min-width": "280px",
        "min-height": "380px",

        "max-width": "calc(100vw - 32px)",
        "max-height": "calc(100vh - 32px)",

        border: "none",

        background: "transparent",
        "background-color": "transparent",

        overflow: "hidden",

        "z-index": "2147483647",

        display: "block",
        visibility: "visible",
        opacity: "1",

        "border-radius": "16px",

        "box-shadow": "none",

        transition:
          "width .35s cubic-bezier(0.4, 0, 0.2, 1), " +
          "height .35s cubic-bezier(0.4, 0, 0.2, 1), " +
          "right .35s cubic-bezier(0.4, 0, 0.2, 1), " +
          "bottom .35s cubic-bezier(0.4, 0, 0.2, 1), " +
          "border-radius .35s cubic-bezier(0.4, 0, 0.2, 1)",
      });
    }
  }

  // =====================================================
  // INITIAL IFRAME STYLE
  // =====================================================
  // Starts minimized by default.

  setBubbleBox();

  // =====================================================
  // OPEN / CLOSE MESSAGE HANDLER
  // =====================================================

  window.addEventListener("message", function (event) {
    // Only accept messages from our widget application.
    if (event.origin !== widgetOrigin) return;

    if (!event.data) return;

    // Only accept messages from Nimo Bot.
    if (event.data.source !== "nimobot-widget") return;

    // ===================================================
    // OPEN
    // ===================================================

    if (event.data.type === "OPEN") {
      setPanelBox();
    }

    // ===================================================
    // CLOSE
    // ===================================================

    if (event.data.type === "CLOSE") {
      setBubbleBox();
    }
  });

  // =====================================================
  // RESIZE HANDLER
  // =====================================================

  window.addEventListener("resize", function () {
    // If iframe is currently larger than bubble,
    // assume the chatbot is open.

    var isPanel = iframe.style.width !== BUBBLE_SIZE.width;

    if (isPanel) {
      setPanelBox();
    }
  });

  // =====================================================
  // MOUNT IFRAME
  // =====================================================

  function mount() {
    // Prevent duplicate iframe insertion.
    if (document.getElementById("nimobot-iframe")) {
      return;
    }

    document.body.appendChild(iframe);

    console.log("Nimo Bot Widget Loaded - Minimized by default");
  }

  // =====================================================
  // WAIT FOR BODY
  // =====================================================

  if (document.body) {
    mount();
  } else {
    document.addEventListener("DOMContentLoaded", mount);
  }
})();
