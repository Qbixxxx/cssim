# Changelog

Information about updates will appear here.

---

## 🐞 Known Issues

- On the first application startup, the **Render** function may not work.  
👉 Simply run it again.

---

## ⚠️ Potential Limitations

-   The application is designed for **plain CSS** only.  
    Framework-based projects (React, Angular, Vue, etc.) or more advanced HTML structures may cause unexpected behavior.
-   Currently, there is no support for **Safari- or Firefox-exclusive media queries**.  
    (Planned in future releases.)

---

## [1.1.0] - 19.08.2025

- Forced colors has been improved - CSS code is injected into the page to simulate the selected high contrast mode (based on the default filters in Windows 11).

---

## [1.0.1] - 18.08.2025

- Device visualization has been improved.
- Browser selection has been locked on Chromium.

---

## [1.0.0] - 18.08.2025

- Renders CSS files and `<style>` tags.
- Supported media queries : `aspect-ratio`, `color`, `color-gamut`, `color-index`, `device-aspect-ratio`, `device-height`, `device-posture`, `device-width`, `display-mode`, `dynamic-range`, `forced-colors`, `grid`, `height`, `hover`, `inverted-colors`, `monochrome`, `orientation`, `overflow-block`, `overflow-inline`, `pointer`, `prefers-color-scheme`, `prefers-contrast`, `prefers-reduced-motion`, `prefers-reduced-transparency`, `resolution`, `scripting`, `update`, `width`, `-webkit-transform-3d`.
  
  The `any`, `min`, and `max` variants are also included.
- a

