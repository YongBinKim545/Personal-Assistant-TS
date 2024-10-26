import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { BaseChatModel } from "@langchain/core/language_models/chat_models"
import { StringOutputParser } from "@langchain/core/output_parsers"
import {
    START,
    END,
    Annotation,
    StateGraph
} from "@langchain/langgraph";
import { initializeChatModel } from "../utils/models";
import { getMessageHistory } from "../utils/history";

const StateAnnotation = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
        default: () => []
    }),
    userInput: Annotation<string>,
    chatTitleId: Annotation<number>,
    modelId: Annotation<number>,
    modeId: Annotation<number>,
    llm: Annotation<BaseChatModel | undefined>,
    systemPrompt: Annotation<SystemMessage>,
    abort: Annotation<AbortController>
})

export const createLLMChatAgent = async () => {
    //messages set as length:5, start on humanmessage, including userInput as humanmessage
    const initializeMessageHistoryWithSystemPrompt = async (state: typeof StateAnnotation.State) => {
        const { modelId, modeId, chatTitleId } = state
        const { llm, systemPrompt } = await initializeChatModel(modelId, modeId)
        const messageHistory = await getMessageHistory(chatTitleId)
        return { llm, systemPrompt, messages: messageHistory }
    }
    const generateAnswer = async (state: typeof StateAnnotation.State) => {
        const model = state.llm.withConfig({ tags: ["final_node"] }).bind({ signal: state.abort.signal })
        const prompt = ChatPromptTemplate.fromMessages([
            state.systemPrompt,
            ...state.messages,
            new MessagesPlaceholder("input"),
        ])
        const input = new HumanMessage(state.userInput)
        const parser = new StringOutputParser()
        const chain = prompt.pipe(model).pipe(parser)
        const response = await chain.invoke({
            input
        })
        return { messages: [input, response] }
    }
    const workflow = new StateGraph(StateAnnotation)
        // Define the node and edge
        .addNode("initialize", initializeMessageHistoryWithSystemPrompt)
        .addNode("model", generateAnswer)
        .addEdge(START, "initialize")
        .addEdge("initialize", "model")
        .addEdge("model", END)

    const app = workflow.compile()
    return app
}