import { ipcMain, shell, BrowserWindow } from 'electron'
import os from 'os';
import * as fs from 'fs/promises';
import { runDocumentLoader } from '../worker/workerManager'
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

const windowControlActions = {
    min: (mainWindow: BrowserWindow) => mainWindow?.minimize(),
    restore: (mainWindow: BrowserWindow) => mainWindow?.unmaximize(),
    max: (mainWindow: BrowserWindow) => mainWindow?.maximize(),
    close: (mainWindow: BrowserWindow) => mainWindow?.close(),
};

ipcMain.handle('windowControl', (event, winStatus: 'min' | 'max' | 'restore' | 'close') => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    try {
        windowControlActions[winStatus](mainWindow)
        return 'success'
    } catch (error) {
        console.log("Error encountered while controlling window:", error);
    }
})

ipcMain.handle('openFile', async (event, filePath: string) => {
    try {
        await fs.access(filePath, fs.constants.F_OK);
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
    // console.log(await app.getGPUInfo('basic'))
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

ipcMain.handle('embedDocument', async (event, payload) => {
    const chunkedDocument = await runDocumentLoader(payload)
    const embeddings = new OllamaEmbeddings({
        model: "nomic-embed-text", // default value
        baseUrl: process.env.OLLAMA_URL, // default value
        requestOptions: {
          useMMap: true,
          numThread: 8,
        },
      });
      let temp = []
      temp.push(chunkedDocument[0]['pageContent'])
    const documentEmbeddings = await embeddings.embedDocuments(temp);
    console.log(documentEmbeddings)
    return 'success'
})


// ipcMain.handle('embedDocument', async (event, payload) => {
//     try {
//         let worker = new Worker(path.resolve(__dirname, 'documentLoader.js'))
//         worker.on('message', async (event) => {
//             const { type, data } = event
//             console.log(type, data)
//             if (type === 'done') {
//                 console.log('done')
//             }
//         })
//         worker.on('exit', (event) => {
//             console.log('worker terminate will be excuted', event)
//             worker.terminate()
//             worker = undefined
//         })
//         worker.on('error', (error) => {
//             console.error('Worker error:', error);
//         });
//         console.log('worker started')
//         worker.postMessage('message from worker manager')
//     } catch (error) {
//         console.error('Error post data:', error)
//     }
//     return 'success'
// })

// ipcMain.handle('updateAPIKey', async (event, payload) => {
//     try {
//         const response = await db.connection('api_keys').where('id', '=', payload.id).update(
//             payload.data
//         )
//         return response
//     } catch (err) {
//         console.error('Error creating response:', err)
//         throw err
//     }
// })

// const getInitialData = async () => {
//     const promises = [
//         db.connection('api_keys'),
//         db.connection('datasets'),
//         db.connection('active_item'),
//         db.connection('chat_titles'),
//     ];
//     const [apiKeys, datasets, activeItem, chatTitles] = await Promise.all(promises);
//     return {
//         api_keys: apiKeys,
//         datasets: datasets,
//         activeItem: activeItem[0],
//         chatTitles: chatTitles,
//     };
// };

// ipcMain.handle('initDatabase', async (event) => {
//     try {
//         return await getInitialData()
//     } catch (err) {
//         console.error('Error creating response:', err)
//         throw err
//     }
// })

// ipcMain.handle('createDataset', async (event, payload) => { //payload:Array
//     try {
//         const response = await db.connection('datasets').insert(payload);
//         return response
//     } catch (err) {
//         console.error('Error creating response:', err)
//         throw err
//     }
// })

// ipcMain.handle('updateDataset', async (event, payload) => { //payload:object
//     try {
//         const response = await db.connection('datasets').where('id', '=', payload.id).update(
//             payload.data
//         )
//         return response
//     } catch (err) {
//         console.error('Error creating response:', err)
//         throw err
//     }
// })

// ipcMain.handle('deleteDataset', async (event, id) => {
//     try {
//         const response = await Promise.all([
//             db.connection('dataset_detail').where('dataset_id', '=', id).delete(),
//             db.connection('datasets').where('id', '=', id).delete()
//         ])
//         return response[1]
//     } catch (err) {
//         console.error('Error creating response:', err)
//         throw err
//     }
// })

// ipcMain.handle('createdatasetDetail', async (event, payload) => { //payload: Array
//     try {
//         const promises = payload.map(async (item: { name: string, path: string, dataset_id: number }) => {
//             return await loadDocument(item.path);
//         });
//         const docs = await Promise.all(promises);
//         const documents = docs.reduce((accumulator, currentValue) => {
//             return accumulator.concat(currentValue)
//         }, [])
//         const chunkedDocs = await getChunkedDocs(documents)
//         console.log(chunkedDocs)
//         const response = await db.connection('dataset_detail').insert(payload);
//         return response
//     } catch (err) {
//         console.error('Error creating response:', err)
//         throw err
//     }
// })

// ipcMain.handle('updateActiveItemId', async (event, payload) => { //payload:object
//     try {
//         const response = await db.connection('active_item').where('id', '=', payload.id).update(
//             payload.data
//         )
//         return response
//     } catch (err) {
//         console.error('Error creating response:', err)
//         throw err
//     }
// })

// ipcMain.handle('readdatasetDetail', async (event, dataset_id) => {
//     try {
//         const response = await db.connection('dataset_detail').where('dataset_id', '=', dataset_id)
//         return response
//     } catch (err) {
//         console.error('Error creating response:', err)
//         throw err
//     }
// })

