import express, { Request, Response } from 'express';
import { readData, createData } from '../crud'

const datasetDetailRouter = express.Router()
export default datasetDetailRouter;

datasetDetailRouter.get('/:datasetId', async (req: Request, res: Response) => {
    const query = {
        field: 'dataset_id',
        condition: '=',
        value: req.params.datasetId
    }
    try {
        const data = await readData('dataset_detail', query)
        res.status(200).json(data)
    } catch (error) {
        console.error('Error fetching data:', error)
        res.status(500).send('Internal Server Error')
    }
});

datasetDetailRouter.post('/', async (req: Request, res: Response) => {
    try {
        const data = await createData('dataset_detail', req.body.data)
        res.status(201).json(data)
    } catch (error) {
        console.error('Error post data:', error)
        res.status(500).send('Internal Server Error')
    }
});