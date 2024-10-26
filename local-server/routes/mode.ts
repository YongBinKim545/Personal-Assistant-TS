import express, { Request, Response } from 'express';
import { readAllData, patchData } from '../crud'

const modeRouter = express.Router()
export default modeRouter;

modeRouter.get('/', async (req: Request, res: Response) => {
    try {
        const data = await readAllData(['chat_mode'])
        res.status(200).json(data.chat_mode)
    } catch (error) {
        console.error('Error fetching data:', error)
        res.status(500).send('Internal Server Error')
    }
});

modeRouter.patch('/:itemName', async (req: Request, res: Response) => {
    const query = {
        field: 'name',
        condition: '=',
        value: req.params.itemName,
    };

    try {
        const updateActiveItem = await patchData('chat_mode', query, req.body);
        if (updateActiveItem) {
            res.status(200).json(updateActiveItem); // Use 200 for successful update
        } else {
            res.status(400).json({ message: 'Error updating Connection Table' }); // Handle potential errors
        }
    } catch (error) {
        console.error('Error updating dataset:', error);
        res.status(500).json({ message: 'Internal Server Error' }); // Generic error for client
    }
});