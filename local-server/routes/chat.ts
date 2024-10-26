import express, { Request, Response } from 'express';
import { readAllData, createData, readData, patchData, deleteData } from '../crud'

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

chatRouter.patch('/title/:titleId', async (req: Request, res: Response) => {
    const tableNames = ['chat_titles']
    const query =
    {
        field: 'id',
        condition: '=',
        value: req.params.titleId
    }
    try {
        const updatedChatTitle = await patchData('chat_titles', query, req.body)
        if (updatedChatTitle) {
            res.status(200).json(updatedChatTitle); // Use 200 for successful update
        } else {
            res.status(400).json({ message: 'Error updating chat title' }); // Handle potential errors
        }
    } catch (error){
        console.error('Error updating chat title:', error);
        res.status(500).json({ message: 'Internal Server Error' }); // Generic error for client
    }
})

chatRouter.delete('/title/:titleId', async (req: Request, res: Response) => {
    const tableNames = ['chat_titles', 'chat_contents']
    const query = [
        {
            field: 'id',
            condition: '=',
            value: req.params.titleId
        },
        {
            field: 'title_id',
            condition: '=',
            value: req.params.titleId
        }
    ]
    try {
        const deletedCount = await deleteData(tableNames, query)
        if (deletedCount > 0) {
            res.status(200).json({ message: 'Dataset deleted successfully' }); // Use 200 for successful delete
        } else {
            res.status(404).json({ message: 'Dataset not found' }); // Use 404 for not found
        }
    } catch (error) {
        console.error('Error post data:', error)
        res.status(500).send('Internal Server Error')
    }
})