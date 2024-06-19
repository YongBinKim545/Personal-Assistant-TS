import { parentPort } from 'worker_threads'

parentPort.on('message', (event) => {
    const MaxCount = 1000000000
    const progressUnit = MaxCount * 0.1
    for (let i = 0; i < MaxCount; i++) {
        if (i % progressUnit === 0) {
            parentPort.postMessage({ type: 'progress', data: `${i*10 / progressUnit}%` })
        }
        if (i === MaxCount - 1) {
            parentPort.postMessage({ type: 'done', data: i })
        }
    }
    parentPort.close()
})

process.on('exit', (code) => {
    console.log('exit event received on document loader worker:', code)
})