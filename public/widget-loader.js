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
  // STYLE HELPERS
  // =====================================================

  // Sets a single CSS property with !important priority, so the host
  // page's stylesheet (even its own !important rules on `iframe` /
  // `#nimobot-iframe`) cannot shrink, hide, or reposition the widget.
  // A plain `el.style.width = "130px"` loses to an external
  // `iframe { width: auto !important }` rule — setProperty with the
  // "important" priority flag does not.
  function setImportant(el, prop, value) {
    el.style.setProperty(prop, value, "important");
  }

  function applyBoxStyles(styles) {
    Object.keys(styles).forEach(function (prop) {
      setImportant(iframe, prop, styles[prop]);
    });
  }

  function isMobile() {
    return window.innerWidth <= 480;
  }

  function setBubbleBox() {
    applyBoxStyles({
      right: "20px",
      bottom: "20px",
      left: "auto",
      top: "auto",
      width: BUBBLE_SIZE.width,
      height: BUBBLE_SIZE.height,
      "max-width": BUBBLE_SIZE.width,
      "max-height": BUBBLE_SIZE.height,
      "min-width": BUBBLE_SIZE.width,
      "min-height": BUBBLE_SIZE.height,
      "border-radius": "50%",
      "box-shadow": "0 4px 20px rgba(0, 0, 0, 0.15)",
    });
  }

  function setPanelBox() {
    if (isMobile()) {
      applyBoxStyles({
        right: "0",
        bottom: "0",
        left: "auto",
        top: "auto",
        width: MOBILE_PANEL_SIZE.width,
        height: MOBILE_PANEL_SIZE.height,
        "max-width": MOBILE_PANEL_SIZE.width,
        "max-height": MOBILE_PANEL_SIZE.height,
        "min-width": MOBILE_PANEL_SIZE.width,
        "min-height": MOBILE_PANEL_SIZE.height,
        "border-radius": "0",
        "box-shadow": "none",
      });
    } else {
      applyBoxStyles({
        right: "20px",
        bottom: "20px",
        left: "auto",
        top: "auto",
        width: PANEL_SIZE.width,
        height: PANEL_SIZE.height,
        "max-width": PANEL_SIZE.width,
        "max-height": PANEL_SIZE.height,
        "min-width": PANEL_SIZE.width,
        "min-height": PANEL_SIZE.height,
        "border-radius": "16px",
        "box-shadow": "0 20px 60px rgba(0, 0, 0, 0.2)",
      });
    }
  }

  // =====================================================
  // BASE STYLE (applied once, before mount)
  // IMPORTANT: Starts in BUBBLE (minimized) state
  // =====================================================

  applyBoxStyles({
    position: "fixed",
    right: "20px",
    bottom: "20px",
    width: BUBBLE_SIZE.width,
    height: BUBBLE_SIZE.height,
    border: "none",
    background: "transparent",
    "background-color": "transparent",
    overflow: "hidden",
    "z-index": "2147483647",
    display: "block",
    visibility: "visible",
    opacity: "1",
    "border-radius": "50%",
    "box-shadow": "0 4px 20px rgba(0, 0, 0, 0.15)",
    transition:
      "width .35s cubic-bezier(0.4, 0, 0.2, 1), height .35s cubic-bezier(0.4, 0, 0.2, 1), right .35s cubic-bezier(0.4, 0, 0.2, 1), bottom .35s cubic-bezier(0.4, 0, 0.2, 1), border-radius .35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow .35s cubic-bezier(0.4, 0, 0.2, 1)",
  });

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
      setPanelBox();
    }

    if (event.data.type === "CLOSE") {
      setBubbleBox();
    }
  });

  // =====================================================
  // RESIZE
  // =====================================================

  window.addEventListener("resize", function () {
    // Only resize if currently in panel (open) state
    var isPanel = iframe.style.width !== BUBBLE_SIZE.width;
    if (isPanel) {
      setPanelBox();
    }
  });

  // =====================================================
  // APPEND (guard against document.body not existing yet)
  // =====================================================

  function mount() {
    document.body.appendChild(iframe);
    console.log("Nimo Bot Widget Loaded - Minimized by default");
  }

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
