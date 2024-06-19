export const useChat = createGlobalState(
  () => {
    //state
    const chats = ref<ChatT[]>([])
    const activeChatTitleIndex = ref(-1)
    const chatContents = ref<ChatContentT[]>([])
    //actions
    const readChatTitles = async () => {
      try {
        const response = await fetchData('local-server/chat/title')
        chats.value = await response.json()
        chats.value.forEach(chat=>{
          chat.isGenerating = false
          chat.isThinking = false
        })
      } catch (error) {
        console.error('Error fetching data from chat/title', error)
      }
    }
    const addChatTitle = async (payload: ChatT) => {
      try {
        const response = await fetchData('local-server/chat/title', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: payload })
        })
        if (response.ok) {
          const newChatTitleId = await response.json()
          const newChatTitle = Object.assign({ id: newChatTitleId.id, isGenerating:false, isThinking:false, contents:[] }, payload)
          chats.value.push(newChatTitle)
          const titleIndex = chats.value.length - 1
          chats.value[titleIndex].contents = []
          return newChatTitleId.id
        } else {
          console.error('Error addting chat title:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching data from /', error)
      }
    }
    const readChatContent = async (titleId: number) => {
      try {
        const response = await fetchData(`local-server/chat/content/${titleId}`)
        chatContents.value = await response.json()
        const chatIndex = chats.value.findIndex((item) => item.id === titleId)
        chats.value[chatIndex]['contents'] = chatContents.value
      } catch (error) {
        console.error('Error fetching data from chat/title', error)
      }
    }
    const sendUserInput = async (message: string, chatTitleId: number, abortSignal: AbortSignal) => {
      try {
        const response = await fetchData('local-server/chat', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: message, chatTitleId: chatTitleId }),
          signal: abortSignal
        })
        return response
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request Aborted')
        }
        console.error('Error fetching data from /', error)
      }
    }
    return {
      chats,
      activeChatTitleIndex,
      chatContents,
      readChatTitles,
      addChatTitle,
      readChatContent,
      sendUserInput
    }
  }
)