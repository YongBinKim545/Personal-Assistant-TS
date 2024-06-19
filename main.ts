import { app, BrowserWindow } from 'electron';
import path from 'path';
import './main/ipcMain';
import { initializeDatabase } from './database/setup'
import { startServer } from './local-server/server'
process.env.OLLAMA_URL = 'http://localhost:11434';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 850,
    minWidth: 1200,
    minHeight: 850,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegrationInWorker: true
    },
    icon: path.join(__dirname, "./assets/icons/alpaca-chat-logo.png"),
  });
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    // console.log(process.env.APPDATA)
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    // console.log(MAIN_WINDOW_VITE_NAME)
    mainWindow.webContents.openDevTools();
    // mainWindow.setMenu(null)
    // mainWindow.resizable = false
  }
  mainWindow.on('close', async () => {
    console.log('close')
  });
};

app.on('ready', async () => {
  try {
    await initializeDatabase(MAIN_WINDOW_DATABASE_PATH)
    await startServer();
  } catch (err) {
    console.error('Error setting up local server and database:', err)
  }
  createWindow()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
