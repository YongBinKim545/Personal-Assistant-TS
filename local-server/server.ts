import express from 'express';
import cors from 'cors'
import activeItemRouter from './routes/activeItem'
import datasetRouter from './routes/dataset'
import datasetDetailRouter from './routes/datasetDetail'
import chatRouter from './routes/chat'
import textGenerationRouter from './routes/textGeneration'
import connectionRouter from './routes/connection'
import modelRouter from './routes/model'
import modeRouter from './routes/mode'


const app = express()
app.use(cors({
  origin: MAIN_WINDOW_VITE_DEV_SERVER_URL // Only allow requests from this origin
}))
app.use(express.json())
app.use('/active-item', activeItemRouter)
app.use('/dataset', datasetRouter)
app.use('/dataset-detail', datasetDetailRouter)
app.use('/chat', chatRouter)
app.use('/text-generation', textGenerationRouter)
app.use('/connection', connectionRouter)
app.use('/model', modelRouter)
app.use('/mode', modeRouter)

export const startServer = async (): Promise<void> => {
  const PORT = 3132;
  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.log('Express server listening on port', PORT);
      resolve(); // Resolve without arguments
    });
  });
};