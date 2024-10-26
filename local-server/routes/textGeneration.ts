import express, { Request, Response } from 'express';
import { createLLMChatAgent } from '../agents/llmChat'
import { updateMessageHistory } from "../utils/history";
import { webLoader } from "../utils/webLoader";

const textGenerationRouter = express.Router()
export default textGenerationRouter;

textGenerationRouter.post('/chat', async (req: Request, res: Response) => {
    // const modelName = "llama-3-Korean-Bllossom-8B"
    const abort = new AbortController()
    res.on('close', () => {
        abort.abort()
    })
    const { modelId, modeId, chatTitleId, userInput } = req.body
    let fullData = ''
    try {
        res.setHeader('Content-Type', 'text/plain')
        const graph = await createLLMChatAgent()
        for await (const { event, tags, data } of graph.streamEvents({ modelId, modeId, chatTitleId, userInput, abort }, { version: 'v2' })) {
            if (event === "on_chat_model_stream" && tags.includes("final_node")) {
                fullData += data.chunk.content
                res.write(data.chunk.content)
            }
        }
        res.end()
    } catch (error) {
        if (error.name === 'AbortError') {
            fullData += '\n\n 🔥🔥🔥 ***Answer Generation Aborted*** 🔥🔥🔥'
        }
        if (!res.headersSent) {
            res.status(500).send(`Error: ${error.message}`);
        }
    } finally {
        const _ = await updateMessageHistory(chatTitleId, userInput, fullData)
    }
});

textGenerationRouter.post('/web', async (req: Request, res: Response) => {
    const abort = new AbortController()
    res.on('close', () => {
        abort.abort()
    })
    const { modelId, modeId, chatTitleId, userInput, url } = req.body
    let fullData = ''
    try {
        res.setHeader('Content-Type', 'text/plain')
        const _ = await webLoader(url)
        res.end()
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).send(`Error: ${error.message}`);
        }
    } finally {
    }
});