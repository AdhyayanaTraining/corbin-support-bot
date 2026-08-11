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
  // OPEN PANEL STATE
  // =====================================================

  function setPanelBox() {
    if (isMobile()) {
      applyBoxStyles({
        position: "fixed",

        right: "0",
        bottom: "0",
        left: "auto",
        top: "auto",

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

        "min-width": PANEL_SIZE.width,
        "min-height": PANEL_SIZE.height,

        "max-width": PANEL_SIZE.width,
        "max-height": PANEL_SIZE.height,

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
// (function () {
//   // =====================================================
//   // PREVENT MULTIPLE LOADS
//   // =====================================================

//   if (window.__nimoBotLoaded) return;
//   window.__nimoBotLoaded = true;

//   var script = document.currentScript;

//   // =====================================================
//   // WIDGET ORIGIN
//   // =====================================================

//   var widgetOrigin =
//     (script && script.getAttribute("data-origin")) ||
//     "https://supportbot.corbinprojects.co.in";

//   // =====================================================
//   // CONFIGURATION
//   // =====================================================

//   // NOTE: must match .cw-launcher's width/height in style.css exactly,
//   // otherwise the bot gets clipped by the iframe's fixed box.
//   var BUBBLE_SIZE = {
//     width: "130px",
//     height: "130px",
//   };

//   var PANEL_SIZE = {
//     width: "420px",
//     height: "700px",
//   };

//   var MOBILE_PANEL_SIZE = {
//     width: "100vw",
//     height: "100vh",
//   };

//   // =====================================================
//   // CREATE IFRAME
//   // =====================================================

//   var iframe = document.createElement("iframe");

//   iframe.src = widgetOrigin + "/embed";

//   iframe.title = "Nimo Bot";

//   iframe.id = "nimobot-iframe";

//   iframe.allow = "clipboard-write";

//   iframe.setAttribute("allowtransparency", "true");

//   // =====================================================
//   // STYLE HELPERS
//   // =====================================================

//   // Sets a single CSS property with !important priority, so the host
//   // page's stylesheet (even its own !important rules on `iframe` /
//   // `#nimobot-iframe`) cannot shrink, hide, or reposition the widget.
//   // A plain `el.style.width = "130px"` loses to an external
//   // `iframe { width: auto !important }` rule — setProperty with the
//   // "important" priority flag does not.
//   function setImportant(el, prop, value) {
//     el.style.setProperty(prop, value, "important");
//   }

//   function applyBoxStyles(styles) {
//     Object.keys(styles).forEach(function (prop) {
//       setImportant(iframe, prop, styles[prop]);
//     });
//   }

//   function isMobile() {
//     return window.innerWidth <= 480;
//   }

//   function setBubbleBox() {
//     applyBoxStyles({
//       right: "20px",
//       bottom: "20px",
//       left: "auto",
//       top: "auto",
//       width: BUBBLE_SIZE.width,
//       height: BUBBLE_SIZE.height,
//       "max-width": BUBBLE_SIZE.width,
//       "max-height": BUBBLE_SIZE.height,
//       "min-width": BUBBLE_SIZE.width,
//       "min-height": BUBBLE_SIZE.height,
//     });
//   }

//   function setPanelBox() {
//     if (isMobile()) {
//       applyBoxStyles({
//         right: "0",
//         bottom: "0",
//         left: "auto",
//         top: "auto",
//         width: MOBILE_PANEL_SIZE.width,
//         height: MOBILE_PANEL_SIZE.height,
//         "max-width": MOBILE_PANEL_SIZE.width,
//         "max-height": MOBILE_PANEL_SIZE.height,
//         "min-width": MOBILE_PANEL_SIZE.width,
//         "min-height": MOBILE_PANEL_SIZE.height,
//       });
//     } else {
//       applyBoxStyles({
//         right: "20px",
//         bottom: "20px",
//         left: "auto",
//         top: "auto",
//         width: PANEL_SIZE.width,
//         height: PANEL_SIZE.height,
//         "max-width": PANEL_SIZE.width,
//         "max-height": PANEL_SIZE.height,
//         "min-width": PANEL_SIZE.width,
//         "min-height": PANEL_SIZE.height,
//       });
//     }
//   }

//   // =====================================================
//   // BASE STYLE (applied once, before mount)
//   // =====================================================

//   applyBoxStyles({
//     position: "fixed",
//     right: "20px",
//     bottom: "20px",
//     width: BUBBLE_SIZE.width,
//     height: BUBBLE_SIZE.height,
//     border: "none",
//     background: "transparent",
//     "background-color": "transparent",
//     overflow: "hidden",
//     "z-index": "2147483647",
//     display: "block",
//     visibility: "visible",
//     opacity: "1",
//     transition:
//       "width .25s ease,height .25s ease,right .25s ease,bottom .25s ease",
//   });

//   // =====================================================
//   // OPEN / CLOSE
//   // =====================================================

//   window.addEventListener("message", function (event) {
//     if (event.origin !== widgetOrigin) return;

//     if (!event.data) return;

//     // NOTE: must match the `source` string posted from ChatWidget.tsx
//     // (window.parent.postMessage({ source: "nimobot-widget", ... }))
//     if (event.data.source !== "nimobot-widget") return;

//     if (event.data.type === "OPEN") {
//       setPanelBox();
//     }

//     if (event.data.type === "CLOSE") {
//       setBubbleBox();
//     }
//   });

//   // =====================================================
//   // RESIZE
//   // =====================================================

//   window.addEventListener("resize", function () {
//     if (iframe.style.width === BUBBLE_SIZE.width) return;
//     setPanelBox();
//   });

//   // =====================================================
//   // APPEND (guard against document.body not existing yet)
//   // =====================================================

//   function mount() {
//     document.body.appendChild(iframe);
//     console.log("Nimo Bot Widget Loaded");
//   }

//   if (document.body) {
//     mount();
//   } else {
//     document.addEventListener("DOMContentLoaded", mount);
//   }
// })();
