import { Worker } from 'worker_threads'
import path from 'path'

const stopWorker = (worker: Worker) => {
    worker.terminate()
    worker = undefined
    console.log('worker stopped')
}

export const runDocumentLoader = async (payload: TableContentT[]): Promise<DocumentT[]> => {
    try {
        let worker = new Worker(path.resolve(__dirname, 'documentLoader.js'))
        return new Promise((resolve, reject) => {
            worker.on('message', (event) => {
                resolve(event.data)
            });
            worker.on('exit', (event) => {
                stopWorker(worker)
            })
            worker.on('error', (error) => {
                console.error('Worker error:', error)
                stopWorker(worker)
            });
            worker.postMessage({ data: payload })
        })
    } catch (error) {
        console.error('Error running worker:', error)
        return Promise.reject(error)
    }
}