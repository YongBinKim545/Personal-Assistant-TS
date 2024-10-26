import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import './main/ipcMain';
import { initializeDatabase } from './local-server/database/setup'
import { startServer } from './local-server/server'

const myDataPath = `${process.env.APPDATA}/${app.name}/data` || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
process.env.MY_DATA_PATH = myDataPath

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 850,
    minWidth: 1500,
    minHeight: 850,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, "./assets/icons/alpaca-chat-logo.png"),
  });
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    mainWindow.webContents.openDevTools();
    // mainWindow.setMenu(null)
  }
  ipcMain.handle('getWindowState', () => {
    return mainWindow.isMaximized();
  });
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('unmaximized')
  })
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('maximized')
  })
  mainWindow.on('close', async () => {
    console.log('close')
  });
};

app.on('ready', async () => {
  try {
    const DB_PATH = path.join(process.env.MY_DATA_PATH, 'database.sqlite')
    await initializeDatabase(DB_PATH)
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
