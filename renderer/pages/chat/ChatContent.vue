<template>
  <div class="h-full flex space-x-10 mx-10">
    <div class="min-w-[600px] flex flex-col items-center my-5">
      <div ref="chatContainer" @scroll="setScrollPercentage"
        class="relative chat-container w-full overflow-auto overflow-x-visible h-[calc(100%-80px)]">
        <div class="sticky top-0 pb-3 h-[10px] w-full bg-light-surface-lowest dark:bg-dark-surface-lowest z-10">
          <div ref="scrollIndicator" class="scroll-indicator bg-secondary"></div>
        </div>
        <div v-for="message in chat?.contents" :key="message.id" class="mb-5 flex flex-col space-y-2">
          <div class="flex space-x-2 font-bold">
            <div v-if="message.role === 'YOU'" class="flex justify-start cc-badge-primary w-full">
              <span>user</span>
            </div>
            <div v-else class="flex justify-start space-x-2 cc-badge-secondary w-full">
              <span>{{ languageModel?.provider }}</span>
              <span>-</span>
              <span>{{ languageModel?.name }}</span>
            </div>
          </div>
          <MarkdownViewer :source="message.content"
            class="marker:font-bold marker:text-light-surface-on dark:marker:text-dark-surface-on" />
        </div>
        <div v-if="chat?.isThinking">
          <div class="rounded-md w-full pt-5 pb-10">
            <div class="flex space-x-4">
              <div class="flex flex-col items-center">
                <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                <svg class="animate-spin size-9" width="800px" height="800px" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.2" fill-rule="evenodd" clip-rule="evenodd"
                    d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="currentColor" />
                  <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor" />
                </svg>
                <div class="animate-pulse">
                  THINKING
                </div>
              </div>
              <div class="animate-pulse flex-1 space-y-6 py-1">
                <div class="h-2 bg-light-surface-highest dark:bg-dark-surface-highest rounded"></div>
                <div class="space-y-3">
                  <div class="grid grid-cols-12 gap-4">
                    <div class="h-2 bg-light-surface-highest dark:bg-dark-surface-highest rounded col-span-3"></div>
                    <div class="h-2 bg-light-surface-highest dark:bg-dark-surface-highest rounded col-span-5"></div>
                    <div class="h-2 bg-light-surface-highest dark:bg-dark-surface-highest rounded col-span-4"></div>
                  </div>
                  <div class="grid grid-cols-12 gap-4">
                    <div class="h-2 bg-light-surface-highest dark:bg-dark-surface-highest rounded col-span-5"></div>
                    <div class="h-2 bg-light-surface-highest dark:bg-dark-surface-highest rounded col-span-7"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full">
        <ChatInput @submit="submitUserInput" @stop="stopGenerating" :inputDisabled="chat?.inputDisabled" />
      </div>
    </div>
    <div class="w-[350px] my-5 flex flex-col space-y-5">
      <div class="p-3 rounded-lg bg-light-surface-low dark:bg-dark-surface">
        <div class="space-y-2">
          <span class="text-sm">Mode</span>
          <div class="flex justify-center space-x-2 cc-badge-secondary">
            <span class="font-bold">{{ chatMode?.name }}</span>
            <span>-</span>
            <p class="line-clamp-1 normal-case">{{ chatMode?.description }}</p>
          </div>
        </div>
      </div>
      <div class="p-3 rounded-lg bg-light-surface-low dark:bg-dark-surface">
        <span class="text-sm">References</span>
        <div>aaa</div>
        <div>bbb</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { models, getModels } = useLanguageModel()
const { modes, readModes } = useMode()
const { activeChatTitleIndex, chats, readChatTitles, readChatContent, sendUserInput } = useChat()
const route = useRoute()
const chatContainer = ref<HTMLElement | null>(null)
const scrollIndicator = ref<HTMLElement | null>(null)
const languageModel = ref<ModelDataT>()
const chatMode = ref<ModeT>()
const chat = ref<ChatTitleT>()
let threadId = ''

const setScrollPercentage = () => {
  const scrollTop = chatContainer.value.scrollTop;
  const scrollHeight = chatContainer.value.scrollHeight;
  const clientHeight = chatContainer.value.clientHeight;
  const scrollPosition = Math.min(1, (scrollTop / (scrollHeight - clientHeight)))
  if (scrollIndicator.value) {
    scrollIndicator.value.style.transform = `scaleX(${scrollPosition})`
  }
}
const stopGenerating = () => {
  chat.value.abortControl.abort()
}
const submitUserInput = async (userInput: string) => {
  await sendUserInput(threadId, userInput)
}

onUpdated(() => {
  if (chatContainer.value && chat.value?.isGenerating) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight - 10
  }
})
const setModel = async (modelId: number) => {
  if (models.value.length === 0) {
    await getModels()
  }
  languageModel.value = models.value.find((item) => item.id === modelId)
}
const setMode = async (modeId: number) => {
  if (modes.value.length === 0) {
    await readModes()
  }
  chatMode.value = modes.value.find((item) => item.id === modeId)
}

onMounted(async () => {
  if (chats.value.length === 0) {
    await readChatTitles()
  }
  threadId = Array.isArray(route.params.threadId) ? route.params.threadId[0] : route.params.threadId
  activeChatTitleIndex.value = chats.value.findIndex((item) => item.thread_id === threadId)
  chat.value = chats.value[activeChatTitleIndex.value]
  const { model_id, mode_id } = chat.value
  await Promise.all([
    setModel(model_id),
    setMode(mode_id)
  ])
  if (chat.value?.isGenerating || chat.value?.isThinking) return
  if (chat.value?.contents === undefined || chat.value?.contents.length === 0) {
    await readChatContent(chat.value.id)
  }
})
</script>

<style scoped>
.scroll-indicator {
  height: 3px;
  width: 100%;
  margin: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .5s linear;
}

.chat-container::-webkit-scrollbar {
  display: none;
}

.chat-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>