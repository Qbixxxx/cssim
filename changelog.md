
# Changelog

Information about updates will appear here.

---

## 🐞 Known Issues

- The comments in the scripts are rough and partly not in English.
- The algorithm that calculates the available viewport IDs sometimes gives wrong IDs.

  👉 Ignore it, or use free mode. 
- On the first application startup, the **Render** function may not work.

  👉 Simply run app again. 

---

## ⚠️ Potential Limitations

-   The application is designed for **plain CSS** only.  
    Framework-based projects (React, Angular, Vue, etc.) or more advanced HTML structures may cause unexpected behavior.
-   Currently, there is no support for **Safari- or Firefox-exclusive media queries**.  
    (Planned in future releases.)
- Grid mode does not simulate terminals correctly. However, the media query itself will be activated.
- This emulator only modifies CSS—there is currently no JS hooks.
- **Potential** differences between simulated high-contrast and real behavior.

---

## [1.1.1] - 21.08.2025

- media-query.js has been improved to avoid conflicts with the user's page. The code has also been shortened.
- Fixed bugs related to some env().

---

## [1.1.0] - 20.08.2025

- Forced colors has been improved - CSS code is injected into the page to simulate the selected high contrast mode (based on the default filters in Windows 11 - Aquatic, Desert, Dusk and Night sky).
- Missing support for spanning has been added.

---

## [1.0.1] - 19.08.2025

- Device visualization has been improved.
- Browser selection has been locked on Chromium.

---

## [1.0.0] - 18.08.2025

- Renders CSS files and `<style>` tags.
- Supported media queries : `aspect-ratio`, `color`, `color-gamut`, `color-index`, `device-aspect-ratio`, `device-height`, `device-posture`, `device-width`, `display-mode`, `dynamic-range`, `forced-colors`, `grid`, `height`, `hover`, `inverted-colors`, `monochrome`, `orientation`, `overflow-block`, `overflow-inline`, `pointer`, `prefers-color-scheme`, `prefers-contrast`, `prefers-reduced-motion`, `prefers-reduced-transparency`, `resolution`, `scripting`, `update`, `width`, `-webkit-transform-3d`.
  
  The `any`, `min`, and `max` variants are also included.
- Monochrome mode activates a color filter that helps with UI design. You can choose from white, green, amber, and blue colors. In addition, you can choose 1, 2, or 4 bits, and thanks to the “filter only” mode, you can also simulate devices that do not send the appropriate information to the browser despite being monochrome, such as Kindle.
- The filter also works with inverted colors (can be combined with monochrome).
