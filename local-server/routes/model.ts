import express, { Request, Response } from 'express';
import { readAllData, createData, deleteData } from '../crud'

const modelRouter = express.Router()
export default modelRouter;

modelRouter.get('/', async (req: Request, res: Response) => {
    try {
        const data = await readAllData(['models'])
        res.status(200).json(data.models)
    } catch (error) {
        console.error('Error fetching data:', error)
        res.status(500).send('Internal Server Error')
    }
})

modelRouter.post('/', async (req: Request, res: Response) => {
    try {
        const data = await createData('models', req.body.data)
        res.status(201).json({ id: data[0] })
    } catch (error) {
        console.error('Error post data:', error)
        res.status(500).send('Internal Server Error')
    }
})

modelRouter.delete('/:modelId', async (req: Request, res: Response) => {
    const tableNames = ['models']
    const query = [
        {
            field: 'id',
            condition: '=',
            value: req.params.modelId
        },
    ]
    try {
        const deletedCount = await deleteData(tableNames, query)
        if (deletedCount > 0) {
            res.status(200).json({ message: 'Model deleted successfully' }); // Use 200 for successful delete
        } else {
            res.status(404).json({ message: 'Model not found' }); // Use 404 for not found
        }
    } catch (error) {
        console.error('Error post data:', error)
        res.status(500).send('Internal Server Error')
    }
})