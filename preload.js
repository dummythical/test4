const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onData: (callback) => ipcRenderer.on('server-data', (event, data) => callback(data)),
  onError: (callback) => ipcRenderer.on('server-error', (event, error) => callback(error)),
});
