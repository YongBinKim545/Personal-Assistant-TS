import { parentPort } from 'worker_threads'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const LOADERS = {
  'docx': (filePath: string) => {
    const { DocxLoader } = require('@langchain/community/document_loaders/fs/docx')
    return new DocxLoader(filePath);
  },
  'pptx': (filePath: string) => {
    const { PPTXLoader } = require("@langchain/community/document_loaders/fs/pptx");
    return new PPTXLoader(filePath);
  },
  'pdf': (filePath: string) => {
    const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
    return new PDFLoader(filePath);
  }
}

const loadDocument = async (filePath: string) => {
  const extension = filePath.split('.').pop().toLowerCase() as 'docx' | 'pptx' | 'pdf'
  const loader = LOADERS[extension](filePath)
  try {
    const docs = await loader.load(); //pdf에 text가 없을 떄 예외처리
    // const chunkedDocs = await getChunkedDocs(docs)
    // return chunkedDocs;
    return docs
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error for further handling
  }
}

const getChunkedDocs = async (docs: DocumentT[]) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  return textSplitter.splitDocuments(docs)
}

const documentLoader = async (filePath:FileItemT[]) => {
    const promises = filePath.map(async (item) => {
      return await loadDocument(item.path);
    });
    const documents = await Promise.all(promises);
    const mergedDocuments = documents.reduce((accumulator, currentValue) => {
      return accumulator.concat(currentValue)
    }, [])
    const chunkedDocs = await getChunkedDocs(mergedDocuments)
    return chunkedDocs
  }

parentPort.on('message', async (event) => {
    const chunkedDocument = await documentLoader(event.data)
    parentPort.postMessage({data:chunkedDocument})
    parentPort.close()

})

process.on('exit', (code) => {
    console.log('exit event received on document loader worker:', code)
})