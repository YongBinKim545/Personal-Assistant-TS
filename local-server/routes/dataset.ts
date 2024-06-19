import express, { Request, Response } from 'express';
import { createData, patchData, deleteData } from '../crud'

const datasetRouter = express.Router()
export default datasetRouter;


datasetRouter.post('/', async (req: Request, res: Response) => {
    try {
        const data = await createData('datasets', req.body.data)
        res.status(201).json({ id: data[0] })
    } catch (error) {
        console.error('Error post data:', error)
        res.status(500).send('Internal Server Error')
    }
})

datasetRouter.patch('/:datasetId', async (req: Request, res: Response) => {
    const query = {
        field: 'id',
        condition: '=',
        value: req.params.datasetId,
    };

    try {
        const updatedDataset = await patchData('datasets', query, req.body);
        if (updatedDataset) {
            res.status(200).json(updatedDataset); // Use 200 for successful update
        } else {
            res.status(400).json({ message: 'Error updating dataset' }); // Handle potential errors
        }
    } catch (error) {
        console.error('Error updating dataset:', error);
        res.status(500).json({ message: 'Internal Server Error' }); // Generic error for client
    }
});

datasetRouter.patch('/active-dataset/:id', async (req: Request, res: Response) => {
    const query = {
        field: 'id',
        condition: '=',
        value: req.params.id,
    };

    try {
        const updatedDataset = await patchData('active_item', query, req.body);
        if (updatedDataset) {
            res.status(200).json(updatedDataset); // Use 200 for successful update
        } else {
            res.status(400).json({ message: 'Error updating active item' }); // Handle potential errors
        }
    } catch (error) {
        console.error('Error updating active item:', error);
        res.status(500).json({ message: 'Internal Server Error' }); // Generic error for client
    }
});

datasetRouter.delete('/:datasetId', async (req: Request, res: Response) => {
    const tableNames = ['datasets', 'dataset_detail']
    const query = [
        {
            field: 'id',
            condition: '=',
            value: req.params.datasetId
        },
        {
            field: 'dataset_id',
            condition: '=',
            value: req.params.datasetId
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