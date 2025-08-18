
# CSSim

**CSSim** is a desktop application built with [Electron](https://www.electronjs.org/) that allows you to **simulate CSS media queries** without needing to run your project on physical devices.  
It’s a handy tool for front-end developers testing website responsiveness.

---

## ⚙️ Requirements

- [XAMPP](https://www.apachefriends.org/) or a compatible substitute (Apache + PHP + MySQL)  
- [Node.js & npm](https://nodejs.org/)  

---

## 🚀 Installation

1. Copy the `screen_emulator` folder into your `htdocs` directory (or equivalent).  
2. Open a terminal in the project folder.  
3. Install dependencies:
   ```bash
   npm install
  4. Start the application:
     ```bash
     npm install

---

## 📖 Usage

1. Place your website files (HTML, CSS, JS, etc.) into the `project` subfolder.
2. At the bottom of the UI, click the **Render** button:
   -   Press it **every time you change your project files**.
   -   You do **not** need to re-render when adjusting settings in the application.
 
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

## 📌 Project Status

-   The application is designed for **plain CSS** only.  
    Framework-based projects (React, Angular, Vue, etc.) or more advanced HTML structures may cause unexpected behavior.
-   Currently, there is no support for **Safari- or Firefox-exclusive media queries**.  
    (Planned in future releases.)