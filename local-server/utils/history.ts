import { readData, createData } from '../crud'
import { BaseMessage, HumanMessage, AIMessage, trimMessages } from "@langchain/core/messages";


export const getMessageHistory = async (chatTitleId: number) => {
    const query = {
        field: 'title_id',
        condition: '=',
        value: chatTitleId
    }
    const history = await readData('chat_contents', query)
    const messages: BaseMessage[] = []
    if (history.length === 0) return messages
    history.forEach(item => {
        if (item.role === 'YOU') {
            messages.push(new HumanMessage(item.content as string))
        } else if (item.role === 'AI') {
            messages.push(new AIMessage(item.content as string))
        }
    })
    const trimmer = trimMessages({
        maxTokens: 6, // it is not tokens, but length of messages
        strategy: "last",
        tokenCounter: (msgs) => msgs.length,
        includeSystem: true,
        allowPartial: false,
        startOn: "human",
    })
    const trimmedMessage = await trimmer.invoke(messages)
    return trimmedMessage
}

export const updateMessageHistory = async (chatTitleId: number, userInput:string, modelResponse:string) => {
    const chatContent: any[] = [
        {
            role: 'YOU',
            content: userInput,
            title_id: chatTitleId
        },
        {
            role: 'AI',
            content: modelResponse,
            title_id: chatTitleId
        }
    ]
    const saveChatResponse = await createData('chat_contents', chatContent)
    if (typeof saveChatResponse[0] !== 'number' || saveChatResponse[0] <= 0) {
        throw new Error('Invalid response from addChatContents: not a positive number');
    }
}