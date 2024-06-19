import express, { Request, Response } from 'express';
import { readAllData } from '../crud'

const rootRouter = express.Router()
export default rootRouter;

rootRouter.get('/', async (req: Request, res: Response) => {
  try {
    const tableNames = ['user_config', 'datasets', 'active_item', 'chat_titles']
    const data = await readAllData(tableNames)
    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
});