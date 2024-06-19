<template>
  <div ref="chatContainer" @scroll="setScrollPercentage"
    class="relative chat-container px-3 mx-auto max-w-[600px] w-full overflow-auto h-[calc(100%-170px)]">
    <div
      class="sticky top-0 py-3 my-1 h-[10px] z-10 mx-auto max-w-[600px] w-full bg-light-surface-lowest dark:bg-dark-surface-lowest">
      <div ref="scrollIndicator" class="scroll-indicator bg-secondary"></div>
    </div>
    <div v-for="message in chats[activeChatTitleIndex]?.contents" :key="message.id"
      class="mb-5 flex flex-col space-y-2">
      <div class="flex space-x-2 font-bold">
        <div class="h-6 w-6 rounded-full text-primary-on flex items-center justify-center rounded-full"
          :class="message.role === 'YOU' ? 'bg-primary' : 'bg-secondary'">
          <span class="text-sm">{{ ICON_TEXT[message.role] }}</span>
        </div>
        <div>
          {{ message.role }}
        </div>
      </div>
      <MarkdownViewer :source="message.content"
        class="marker:font-bold marker:text-light-surface-on dark:marker:text-dark-surface-on" />
    </div>
    <div v-if="chats[activeChatTitleIndex]?.isThinking" class="flex items-center space-x-2">
      <div class="uppercase">thinking</div>
      <div class="dot1 bg-primary rounded-full h-4 w-4"></div>
      <div class="dot2 bg-primary rounded-full h-4 w-4"></div>
      <div class="dot3 bg-primary rounded-full h-4 w-4"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { chats, activeChatTitleIndex } = useChat()
const route = useRoute()
const ICON_TEXT = {
  'YOU': 'Q',
  'AI': 'A'
}
const chatContainer = ref<HTMLElement | null>(null)
const scrollIndicator = ref<HTMLElement | null>(null)

const setScrollPercentage = () => {
  const scrollTop = chatContainer.value.scrollTop;
  const scrollHeight = chatContainer.value.scrollHeight;
  const clientHeight = chatContainer.value.clientHeight;
  const scrollPosition = Math.min(1, (scrollTop / (scrollHeight - clientHeight)))
  if (scrollIndicator.value) {
    scrollIndicator.value.style.transform = `scaleX(${scrollPosition})`
  }
}
watch(() => route.path, () => {
  if(!chats.value[activeChatTitleIndex.value]?.isGenerating) scrollIndicator.value.style.transform = `scaleX(${0})`
})
onUpdated(() => {
  if (chatContainer.value && chats.value[activeChatTitleIndex.value]?.isGenerating) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight - 10
  }
})
onMounted(() => {
  // const snippets = document.getElementsByTagName('pre')
  // if (snippets.length === 0) return
  // const code = snippets[0].getElementsByTagName('code')[0].innerText
  // console.log(code)
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

.dot1,
.dot2,
.dot3 {
  animation: loading 1.5s infinite ease-in-out both;
}

.dot2 {
  animation-delay: 0.2s;
}

.dot3 {
  animation-delay: 0.4s;
}

@keyframes loading {
  0% {
    transform: scale(0.3);
  }

  50% {
    transform: scale(1.0);
  }

  100% {
    transform: scale(0.3);
  }
}
</style>