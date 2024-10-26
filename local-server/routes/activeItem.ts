import express, { Request, Response } from 'express';
import { readAllData, patchData } from '../crud'

const activeItemRouter = express.Router()
export default activeItemRouter;

activeItemRouter.get('/', async (req: Request, res: Response) => {
    try {
        const data = await readAllData(['active_item'])
        res.status(200).json(data.active_item)
    } catch (error) {
        console.error('Error fetching data:', error)
        res.status(500).send('Internal Server Error')
    }
});

activeItemRouter.patch('/:itemName', async (req: Request, res: Response) => {
    const query = {
        field: 'name',
        condition: '=',
        value: req.params.itemName,
    };

    try {
        const updateActiveItem = await patchData('active_item', query, req.body);
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