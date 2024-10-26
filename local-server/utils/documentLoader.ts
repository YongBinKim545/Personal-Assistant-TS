import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx"
import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { Document } from 'langchain/document' // Add this import


const LOADERS = {
    'docx': (filePath: string) => new DocxLoader(filePath),
    'pptx': (filePath: string) => new PPTXLoader(filePath),
    'pdf': (filePath: string) => new PDFLoader(filePath)
}

const loadDocument = async (filePath: string): Promise<Document[]> => {
    const extension = filePath.split('.').pop().toLowerCase() as 'docx' | 'pptx' | 'pdf'
    const loader = LOADERS[extension](filePath)
    try {
        const docs = await loader.load();
        return docs
    } catch (error) {
        throw new Error(String(error));
    }
}

const getChunkedDocs = async (docs: Document[]): Promise<Document[]> => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    })
    return await textSplitter.splitDocuments(docs)
}

export const documentLoader = async (filePath: FileItemT[]): Promise<Document[]> => {
    const promises = filePath.map(async (item) => {
        return await loadDocument(item.path)
    })
    const documents = await Promise.all(promises);
    const mergedDocuments = documents.reduce((accumulator, currentValue) => {
        return accumulator.concat(currentValue)
    }, [])
    const chunkedDocs = await getChunkedDocs(mergedDocuments)
    return chunkedDocs
}