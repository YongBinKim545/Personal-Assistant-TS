import { ipcMain, shell, BrowserWindow, dialog } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import os from 'os'
import path from 'path'
import * as fsPromise from 'fs/promises'
import * as fs from 'fs'
import fetch from 'node-fetch'
import { finished } from 'stream/promises';

const windowControlActions = {
    min: (mainWindow: BrowserWindow) => mainWindow?.minimize(),
    unmaximize: (mainWindow: BrowserWindow) => mainWindow?.unmaximize(),
    max: (mainWindow: BrowserWindow) => mainWindow?.maximize(),
    close: (mainWindow: BrowserWindow) => mainWindow?.close(),
};


ipcMain.handle('windowControl', (event, winStatus: 'min' | 'max' | 'unmaximize' | 'close') => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    try {
        windowControlActions[winStatus](mainWindow)
    } catch (error) {
        console.log("Error encountered while controlling window:", error);
    }
})

ipcMain.handle('openFile', async (event, filePath: string) => {
    try {
        await fsPromise.access(filePath, fsPromise.constants.F_OK);
        await shell.openPath(filePath);
        return 'success';
    } catch (error) {
        console.error('Error opening file:', error);
        // Return a specific error message based on the error type
        if (error.code === 'ENOENT') {
            return 'file_not_found'; // File not found
        } else {
            return 'access_error'; // Generic access error
        }
    }
});

ipcMain.handle('getSystemMetric', async (event) => {
    const cpuInformation = os.cpus()
    const totalCPUTimes = cpuInformation.reduce((acc, cpuInfo) => {
        const { user, nice, sys, idle, irq } = cpuInfo.times;
        return acc + user + nice + sys + idle + irq;
    }, 0);
    const totalCPUIdleTimes = cpuInformation.reduce((acc, cpuInfo) => {
        return acc + cpuInfo.times.idle;
    }, 0);
    const { total, free } = process.getSystemMemoryInfo()
    const allocated = total - free
    return {
        totalCPUTimes: totalCPUTimes,
        totalCPUIdleTimes: totalCPUIdleTimes,
        memoryTotal: Math.round(total / 1024 / 102.4) / 10,
        memoryUsage: Math.round(allocated / 1024 / 102.4) / 10
    }
})

ipcMain.handle('openURL', (event, url) => {
    shell.openExternal(url)
})

const execPromise = promisify(exec);

ipcMain.handle('checkOllamaInstallation', async (event) => {
    try {
        const { stdout, stderr } = await execPromise('ollama list'); // Destructure output
        if (stderr) {
            throw new Error(stderr);
        }
        return true
    } catch (error) {
        return false
    }
})

ipcMain.handle('downloadFileFromUrl', async (event, url, targetPath) => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return;
    const fileName = path.basename(url);
    const savePath = path.join(targetPath, fileName);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch the file');
        }
        const totalSize = parseInt(response.headers.get('content-length') || '0', 10);
        if (fs.existsSync(savePath)) {
            const stats = fs.statSync(savePath)
            const existingFileSize = stats.size
            if (existingFileSize === totalSize) {
                event.sender.send('onDownloadProgress', totalSize, totalSize);
                return savePath;
            } else {
                fs.unlinkSync(savePath)
            }
        }
        let downloadedSize = 0;
        const fileStream = fs.createWriteStream(savePath);
        response.body.on('data', (chunk) => {
            downloadedSize += chunk.length;
            event.sender.send('onDownloadProgress', totalSize, downloadedSize);
        });
        response.body.pipe(fileStream);
        await finished(fileStream);
        return savePath;
    } catch (error) {
        return `Error to Download File: ${error.message}`;
    }
});

ipcMain.handle('createModelfile', async (event, contents) => {
    const dirPath = process.env.MY_DATA_PATH
    const filePath = `${dirPath}/Modelfile${Date.now()}`
    try {
        // throw new Error('Test Error')
        await fsPromise.mkdir(dirPath, { recursive: true })
        await fsPromise.writeFile(filePath, contents, 'utf-8')
        return filePath
    } catch (error) {
        return `Modelfile Creating ${error}`
    }
})

ipcMain.handle('deleteFileFromPath', async (event, filePath) => {
    try {
        throw new Error('Test Error')
        await fsPromise.unlink(filePath)
        return 'success'
    } catch (error) {
        return `Failed to delete file: ${filePath}. It might have been deleted manually. Error: ${error.message}`
    }
})

ipcMain.handle('openFolderDialog', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    return result
})

