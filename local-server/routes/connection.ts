import express, { Request, Response } from 'express';
import { readAllData, patchData } from '../crud'

const connectionRouter = express.Router()
export default connectionRouter;

connectionRouter.get('/', async (req: Request, res: Response) => {
    try {
        const data = await readAllData(['connection'])
        res.status(200).json(data.connection)
    } catch (error) {
        console.error('Error fetching data:', error)
        res.status(500).send('Internal Server Error')
    }
});

connectionRouter.patch('/:provider', async (req: Request, res: Response) => {
    const query = {
        field: 'provider',
        condition: '=',
        value: req.params.provider,
    };

    try {
        const updateConnection = await patchData('connection', query, req.body);
        if (updateConnection) {
            res.status(200).json(updateConnection); // Use 200 for successful update
        } else {
            res.status(400).json({ message: 'Error updating Connection Table' }); // Handle potential errors
        }
    } catch (error) {
        console.error('Error updating dataset:', error);
        res.status(500).json({ message: 'Internal Server Error' }); // Generic error for client
    }
});
