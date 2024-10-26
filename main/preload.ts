// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, webUtils } from 'electron';

const readFileInformation = (file: File) => {
  const path = webUtils.getPathForFile(file)
  const name = file.name
  return { path: path, name: name }
}

const API = {
  getFileInformation: async (files: File[]) => {
    const fileItems = await Promise.all(files.map(readFileInformation))
    return fileItems
  },
  openFile: (path: string) => ipcRenderer.invoke("openFile", path),
  getSystemMetric: () => ipcRenderer.invoke('getSystemMetric'),
  windowControl: (payload: TableContentT) => ipcRenderer.invoke('windowControl', payload),
  onWindowUnmaximize: (callback: () => void) => ipcRenderer.on('unmaximized', callback),
  onWindowMaximize: (callback: () => void) => ipcRenderer.on('maximized', callback),
  getWindowState: () => ipcRenderer.invoke('getWindowState'),
  openURL: (url: string) => ipcRenderer.invoke('openURL', url),
  checkOllamaInstallation: () => ipcRenderer.invoke('checkOllamaInstallation'),
  downloadFileFromUrl: (url: string, targetPath: string) => ipcRenderer.invoke('downloadFileFromUrl', url, targetPath),
  onDownloadProgress: (callback: (total: number, completed: number) => void) => {
    const listener = (_: Electron.IpcRendererEvent, total: number, completed: number) => callback(total, completed)
    ipcRenderer.on('onDownloadProgress', listener)
    return () => {
      ipcRenderer.removeListener('onDownloadProgress', listener)
    }
  },
  createModelfile: (contents: string) => ipcRenderer.invoke('createModelfile', contents),
  deleteFileFromPath: (filePath: string) => ipcRenderer.invoke('deleteFileFromPath', filePath),
  openFolderDialog: () => ipcRenderer.invoke('openFolderDialog'),
}

contextBridge.exposeInMainWorld('api', API)