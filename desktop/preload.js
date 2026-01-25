// Preload script for Electron
// This script runs before the renderer process is loaded
// and has access to both Node.js and browser APIs

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any IPC methods you might need in the future
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  platform: process.platform
});

// Log when preload script is executed
console.log('Preload script loaded');
