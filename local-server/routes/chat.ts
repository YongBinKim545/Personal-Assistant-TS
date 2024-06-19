import express, { Request, Response } from 'express';
import { readAllData, createData, readData, patchData, deleteData } from '../crud'
// import { pipeline } from "node:stream/promises";
import { Ollama } from "@langchain/community/llms/ollama";

const chatRouter = express.Router()
export default chatRouter;

chatRouter.get('/content/:titleId', async (req: Request, res: Response) => {
    const query = {
        field: 'title_id',
        condition: '=',
        value: req.params.titleId
    }
    try {
        const data = await readData('chat_contents', query)
        res.status(200).json(data)
    } catch (error) {
        console.error('Error fetching data:', error)
        res.status(500).send('Internal Server Error')
    }
});

chatRouter.post('/', async (req: Request, res: Response) => {
    const abortController = new AbortController();
    const chatInput: string = req.body.message
    const chatTitleId:number = req.body.chatTitleId
    let chatContent: any = {
        role: 'YOU',
        content: chatInput,
        title_id: chatTitleId
    }
    try {
        const response = await createData('chat_contents', chatContent)
        if (typeof response[0] !== 'number' || response[0] <= 0) {
            throw new Error('Invalid response from addChatContents: not a positive number');
        }
    } catch (error) {
        console.error('Error post data:', error)
        res.status(500).send('Internal Server Error')
    }

    try {
        const llm = new Ollama({
            baseUrl: "http://localhost:11434",
            model: "llama3",
        });
        const model = llm.bind({ signal: abortController.signal })
        const stream = await model.stream(chatInput)
        const reader = stream.getReader()
        let fullData = ''
        while (true) {
            const { value, done } = await reader.read()
            if (done) {
                res.end()
                chatContent = {
                    role: 'AI',
                    content: fullData,
                    title_id: chatTitleId
                }
                try {
                    const response = await createData('chat_contents', chatContent)
                    if (typeof response[0] !== 'number' || response[0] <= 0) {
                        throw new Error('Invalid response from addChatContents: not a positive number');
                    }
                } catch (error) {
                    console.error('Error post data:', error)
                } finally {
                    break
                }
            }
            fullData += value
            res.write(value)
        }
        // await pipeline(stream, res).catch((err) => {
        //     console.error('Error sending response:');
        // })
        res.on('close', () => {
            abortController.abort();
        })
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
});


chatRouter.get('/title', async (req: Request, res: Response) => {
    try {
        const data = await readAllData(['chat_titles'])
        res.status(200).json(data.chat_titles)
    } catch (error) {
        console.error('Error fetching data:', error)
        res.status(500).send('Internal Server Error')
    }
});

chatRouter.post('/title', async (req: Request, res: Response) => {
    try {
        const data = await createData('chat_titles', req.body.data)
        res.status(201).json({ id: data[0] })
    } catch (error) {
        console.error('Error post data:', error)
        res.status(500).send('Internal Server Error')
    }
})