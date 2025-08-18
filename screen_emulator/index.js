const { app, BrowserWindow, ipcMain, screen, session } = require('electron');
const path = require('path');
const fs = require('fs');

const { copyProjectToRender, analyzeMediaQueries, transformAllCSS, appendScriptToAllHTMLFilesInRender } = require('./render');

let newWin1 = null;
let originalWidth = null;
let originalHeight = null;
let watchInterval = null;
function watchOrientationChange(filePath) {
    let prevOrientation = null;
    let width = originalWidth;
    let height = originalHeight;

    watchInterval = setInterval(() => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err || !newWin1) return;

            try {
                const config = JSON.parse(data);
                const currentOrientation = config.orientation_window;

                if (prevOrientation === null) {
                    prevOrientation = currentOrientation;
                    centerWindow(width, height);
                    return;
                }

                if (currentOrientation !== prevOrientation) {
                    // Obrót tylko jeśli zmieniła się orientacja
                    if ((prevOrientation === 'portrait' && currentOrientation === 'landscape') || (prevOrientation === 'landscape' && currentOrientation === 'portrait')) {
                        const temp = width;
                        width = height;
                        height = temp;
                    }
                    prevOrientation = currentOrientation;
                    centerWindow(width, height);
                }
            } catch (e) {
                clearInterval(watchInterval);
            }
        });
    }, 100);
}

function centerWindow(width, height) {
    if (!newWin1) return;
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
    const x = Math.floor((screenWidth - width) / 2);
    const y = Math.floor((screenHeight - height) / 2);
    newWin1.setBounds({ x, y, width, height });
}

// 🧠 Obsługa IPC
ipcMain.on('app-quit', () => app.quit());

ipcMain.on('close-current-window', event => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.close();
});

ipcMain.on('close-newWin1', () => {
    if (newWin1 && !newWin1.isDestroyed()) {
        newWin1.close();
    }
});

ipcMain.handle('copy-project-files', async () => {
    try {
        return copyProjectToRender();
    } catch (err) {
        console.error('Failed to copy project:', err);
        return false;
    }
});

ipcMain.handle('analyze-media-queries', async () => {
    try {
        await analyzeMediaQueries();
        return true;
    } catch (err) {
        console.error('Failed to analyze media queries:', err);
        return false;
    }
});

ipcMain.handle('transform-css', async () => {
    try {
        await transformAllCSS();
        return true;
    } catch (err) {
        console.error('Failed to transform CSS:', err);
        return false;
    }
});

ipcMain.handle('append-script-to-html', async () => {
    try {
        await appendScriptToAllHTMLFilesInRender();
        return true;
    } catch (e) {
        console.error('Błąd dopisywania skryptu:', e);
        return false;
    }
});

const jsonPath = path.join(__dirname, 'emulator/panel.json');
ipcMain.handle('save-json', async (_event, updates) => {
    try {
        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        const json = JSON.parse(fileContent);
        const updated = { ...json, ...updates };
        fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('Failed to save data in JSON file:', err);
        return false;
    }
});

const cssFilePath = path.join(__dirname, 'emulator', 'environment-variables.css');

let cssVariables = {
    '--emulator-safe-area-inset-left': '0',
    '--emulator-safe-area-inset-right': '0',
    '--emulator-safe-area-inset-top': '0',
    '--emulator-safe-area-inset-bottom': '0',
    '--emulator-titlebar-area-width': '0',
    '--emulator-titlebar-area-height': '0',
    '--emulator-titlebar-area-x': '0',
    '--emulator-titlebar-area-y': '0'
};

// Funkcja nadpisująca plik CSS kompletnym zestawem zmiennych
function saveVariablesToFile(vars) {
    const lines = [':root {'];
    for (const [key, value] of Object.entries(vars)) {
        lines.push(`  ${key}: ${value};`);
    }
    lines.push('}');
    const cssContent = lines.join('\n');
    try {
        fs.writeFileSync(cssFilePath, cssContent, 'utf8');
        console.log(`Zapisano zmienne CSS do ${cssFilePath}`);
    } catch (err) {
        console.error('Błąd zapisu pliku CSS:', err);
    }
}

// IPC - ustawia pojedynczą zmienną i od razu zapisuje do pliku
ipcMain.handle('set-css-variable', (event, key, value) => {
    if (value === null) {
        delete cssVariables[key];
    } else {
        cssVariables[key] = value;
    }
    saveVariablesToFile(cssVariables);
    return true;
});

// IPC - dodaje nową zmienną i zapisuje do pliku (praktycznie to samo co set)
ipcMain.handle('add-css-variable', (event, key, value) => {
    cssVariables[key] = value;
    saveVariablesToFile(cssVariables);
    return true;
});

// IPC - zwraca wszystkie zmienne
ipcMain.handle('get-css-variables', () => {
    return cssVariables;
});

app.whenReady().then(() => {
    session.defaultSession.clearCache();
    const mainWindow = new BrowserWindow({
        width: 600,
        height: 350,
        frame: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: false
        }
    });
    mainWindow.loadFile('emulator/index.html');
    ipcMain.handle('open-bend-window', async (event, options) => {
        session.defaultSession.clearCache();
        const { width, height, bend, mod } = options;
        newWin1 = new BrowserWindow({
            width,
            height,
            frame: false,
            resizable: false,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,
                nodeIntegration: false,
                additionalArguments: [`--bend=${bend}`, `--width=${width}`, `--height=${height}`, `--mod=${mod}`]
            }
        });
        newWin1.loadFile('emulator/screen.html');
        originalWidth = newWin1.getBounds().width;
        originalHeight = newWin1.getBounds().height;
        watchOrientationChange(jsonPath);
    });
});
