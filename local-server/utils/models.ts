import { readData } from '../crud'
import { ChatOllama } from "@langchain/ollama"
import { ChatOpenAI } from "@langchain/openai"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatAnthropic } from "@langchain/anthropic"
import { SystemMessage } from "@langchain/core/messages";

interface LLMParameterT {
    modelName?: string,
    temperature: number,
    max_tokens: number,
}
const LLMS = {
    'Local': (modelConfig: LLMParameterT) => {
        const { modelName, temperature } = modelConfig
        return new ChatOllama({
            model: modelName,
            temperature: temperature,
        })
    },
    'OpenAI': (modelConfig: LLMParameterT) => {
        const { modelName, temperature } = modelConfig
        return new ChatOpenAI({
            model: modelName,
            temperature: temperature,
        })
    },
    'Google': (modelConfig: LLMParameterT) => {
        const { modelName, temperature } = modelConfig
        return new ChatGoogleGenerativeAI({
            model: modelName,
            temperature: temperature,
        })
    },
    'Anthropic': (modelConfig: LLMParameterT) => {
        const { modelName, temperature } = modelConfig
        return new ChatAnthropic({
            model: modelName,
            temperature: temperature,
        })
    },
}

export const initializeChatModel = async (modelId: number, modeId: number) => {
    const modelQuery = {
        field: 'id',
        condition: '=',
        value: modelId
    }
    const modeQuery = {
        field: 'id',
        condition: '=',
        value: modeId
    }

    const [languageModel, chatMode] = await Promise.all([
        readData('models', modelQuery),
        readData('chat_mode', modeQuery),
    ]);
    const { name: modelName, provider } = languageModel[0]
    const { prompt, temperature, max_tokens } = chatMode[0]
    const llmParameters: LLMParameterT = {
        modelName: modelName,
        temperature: temperature as number,
        max_tokens: max_tokens as number
    }
    const systemPrompt = new SystemMessage(prompt as string)
    //initialize language model
    const llm = LLMS[provider as keyof typeof LLMS](llmParameters)
    return { llm: llm, systemPrompt }
}