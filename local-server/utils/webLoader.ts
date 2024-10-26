import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from 'langchain/document'


const loadDocument = async (url: string): Promise<Document[]> => {
    const loader = new CheerioWebBaseLoader(url)
    const docs = await loader.load()
    console.log(docs)
    return docs
}

const getChunkedDocs = async (docs: Document[]): Promise<Document[]> => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    })
    return await textSplitter.splitDocuments(docs)
}

export const webLoader = async (url: string[]): Promise<Document[]> => {
    const promises = url.map(async (item) => {
        return await loadDocument(item)
    })
    const documents = await Promise.all(promises);
    const mergedDocuments = documents.reduce((accumulator, currentValue) => {
        return accumulator.concat(currentValue)
    }, [])
    const chunkedDocs = await getChunkedDocs(mergedDocuments)
    return chunkedDocs
}