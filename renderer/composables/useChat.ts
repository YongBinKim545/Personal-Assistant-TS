const { addBackgroundWork, updateBackgroundWorkStatus, removeBackgroundWork } = useBackground()
const { createToast } = useToast()

export const useChat = createGlobalState(
  () => {
    //state
    const chats = ref<ChatTitleT[]>([])
    const activeChatTitleIndex = ref(-1)
    const chatContents = ref<ChatContentT[]>([])
    //actions
    const initActiveChatTitleIndex = () => {
      activeChatTitleIndex.value = -1
    }
    const readChatTitles = async () => {
      try {
        const response = await fetchData('local-server/chat/title')
        chats.value = await response.json()
        chats.value.forEach(chat => {
          chat.isGenerating = false
          chat.isThinking = false
          chat.inputDisabled = false
        })
      } catch (error) {
        console.error('Error fetching data from chat/title', error)
      }
    }
    const addChatTitle = async (payload: ChatTitleT) => {
      try {
        const response = await fetchData('local-server/chat/title', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: payload })
        })
        if (response.ok) {
          const newChatTitleId = await response.json()
          const newChatTitle = Object.assign({ id: newChatTitleId.id, isGenerating: false, isThinking: false, inputDisabled: false, contents: [] }, payload)
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
    const updateChatTitle = async (id: number, newTitle: string) => {
      const newData = { title: newTitle }
      const response = await fetchData(`local-server/chat/title/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      })
      return response
    }
    const removeChatTitle = async (id: number, indexToDelete: number) => {
      let message = ''
      const response = await fetchData(`local-server/chat/title/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        message = `Title : ${chats.value[indexToDelete].title}`
        chats.value.splice(indexToDelete, 1)
      }
      return message
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

    const sendUserInput = async (threadId: string, userInput: string) => {
      const chat = chats.value.find((item) => item.thread_id === threadId)
      let chatMessageIndex = 0
      try {
        const newWork: BackgroundWorkT = {
          id: threadId,
          type: 'Answer',
          name: 'User Input Queued',
          link: `/chat/${threadId}`,
        }
        addBackgroundWork(newWork)
        chat.isThinking = chat.isGenerating = chat.inputDisabled = true
        chat.abortControl = new AbortController();
        chat.contents.push({ role: 'YOU', content: userInput }, { role: 'AI', content: '' });
        chatMessageIndex = chat.contents.length - 1
        const requestPayload = {
          userInput: userInput,
          chatTitleId: chat.id,
          modelId: chat.model_id,
          modeId: chat.mode_id
        }
        const modeName = 'chat'
        const response = await fetchData(`local-server/text-generation/${modeName}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
          signal: chat.abortControl.signal
        })
        if (!response.ok) {
          const errorMessage = await response.text()
          throw new Error(errorMessage)
        }
        const stream = response.body!.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value: chunk } = await stream.read()
          if (done) break
          if (chat.abortControl?.signal.aborted) {
            throw new Error('Stream aborted')
          }
          const decodedChunk = decoder.decode(chunk, { stream: true })
          chat.contents[chatMessageIndex].content += decodedChunk
          if (chat.isThinking) {
            chat.isThinking = false
            updateBackgroundWorkStatus(threadId, 'Generating Answer')
          }
        }
        createToast({
          variant: 'success',
          title: 'Answer Generated Successfully',
          message: `User's Input : ${userInput}`,
        })
      } catch (error) {
        let errorTitle = 'Failed to Generate Answer'
        if (error.name === 'AbortError' || error.message === 'Stream aborted') {
          errorTitle = 'Request was aborted'
          chat.contents[chatMessageIndex].content += '\n\n 🔥🔥🔥 ***Answer Generation Aborted*** 🔥🔥🔥'
        }
        createToast({
          variant: 'error',
          title: errorTitle,
          message: error,
        })
      } finally {
        chat.isThinking = chat.isGenerating = chat.inputDisabled = false;
        chat.abortControl = undefined
        removeBackgroundWork(threadId)
      }
    }
    return {
      chats,
      activeChatTitleIndex,
      chatContents,
      initActiveChatTitleIndex,
      readChatTitles,
      addChatTitle,
      updateChatTitle,
      removeChatTitle,
      readChatContent,
      sendUserInput
    }
  }
)