import express from 'express';
import cors from 'cors'
import rootRouter from './routes/root'
import datasetRouter from './routes/dataset'
import datasetDetailRouter from './routes/datasetDetail'
import chatRouter from './routes/chat'

const app = express()
app.use(cors({
    origin: MAIN_WINDOW_VITE_DEV_SERVER_URL // Only allow requests from this origin
}))
app.use(express.json())
app.use('/', rootRouter)
app.use('/dataset',datasetRouter)
app.use('/dataset-detail',datasetDetailRouter)
app.use('/chat',chatRouter)

export const startServer = async ():Promise<void> => {
  const PORT = 3132;
  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.log('Express server listening on port', PORT);
      resolve(); // Resolve without arguments
    });
  });
};