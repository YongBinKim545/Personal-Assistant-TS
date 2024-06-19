// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

const API = {
  // saveTextFile: (text: string) => ipcRenderer.invoke("saveTextFile", text),
  openFile: (path: string) => ipcRenderer.invoke("openFile", path),
  getSystemMetric: () => ipcRenderer.invoke('getSystemMetric'),
  windowControl: (payload: TableContentT) => ipcRenderer.invoke('windowControl', payload),
  embedDocument: (payload: TableContentT[]) => ipcRenderer.invoke('embedDocument', payload)
  // updateAPIKey: (payload: PayloadT) => ipcRenderer.invoke('updateAPIKey', payload),
  // initDatabase: () => ipcRenderer.invoke('initDatabase'),
  // updateActiveItemId: (payload: PayloadT) => ipcRenderer.invoke('updateActiveItemId', payload),
  // createDataset: (payload: PayloadT[]) => ipcRenderer.invoke('createDataset', payload),
  // updateDataset: (payload: PayloadT) => ipcRenderer.invoke('updateDataset', payload),
  // deleteDataset: (id: number) => ipcRenderer.invoke('deleteDataset', id),
  // createdatasetDetail: (payload: PayloadT[]) => ipcRenderer.invoke('createdatasetDetail', payload),
  // readdatasetDetail: (dataset_id: number) => ipcRenderer.invoke('readdatasetDetail', dataset_id)
}

contextBridge.exposeInMainWorld('api', API)