const { contextBridge, ipcRenderer } = require('electron');
const widthArg = process.argv.find(arg => arg.startsWith('--width='));
const width = widthArg ? parseInt(widthArg.split('=')[1]) : 1280;
const heightArg = process.argv.find(arg => arg.startsWith('--height='));
const height = heightArg ? parseInt(heightArg.split('=')[1]) : 720;
const bendArg = process.argv.find(arg => arg.startsWith('--bend='));
const bend = bendArg ? parseInt(bendArg.split('=')[1]) : 0;
const modArg = process.argv.find(arg => arg.startsWith('--mod='));
const mod = modArg ? parseInt(modArg.split('=')[1]) : 0;
contextBridge.exposeInMainWorld('appAPI', {
    getWidth: () => width,
    getHeight: () => height,
    getBend: () => bend,
    getMod: () => mod,
    openNewWindow: (width, height, bend, mod) => ipcRenderer.invoke('open-bend-window', { width, height, bend, mod }),
    exitApp: () => ipcRenderer.send('app-quit'),
    closeWindow: () => ipcRenderer.send('close-current-window'),
    copyProjectFiles: () => ipcRenderer.invoke('copy-project-files'),
    analyzeMediaQueries: () => ipcRenderer.invoke('analyze-media-queries'),
    transformCSS: () => ipcRenderer.invoke('transform-css'),
    saveJson: data => ipcRenderer.invoke('save-json', data),
    closeNewWin1: () => ipcRenderer.send('close-newWin1'),
    appendScriptToHTML: () => ipcRenderer.invoke('append-script-to-html'),
    setVariable: (key, value) => ipcRenderer.invoke('set-css-variable', key, value),
    addVariable: (key, value) => ipcRenderer.invoke('add-css-variable', key, value),
    getAllVariables: () => ipcRenderer.invoke('get-css-variables')
});
