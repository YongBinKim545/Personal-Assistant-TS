<template>
    <div class="max-w-[600px] w-full">
        <div ref="inputContainer"
            class="flex justify-between items-center p-1 my-2 bg-light-surface-high dark:bg-dark-surface-high max-w-[600px] w-full"
            :class="[focused ? 'outline-none ring-2 ring-primary' : '', isMultiLine ? 'rounded-lg' : 'rounded-full']">
            <textarea ref="textarea"
                class="bg-transparent resize-none text-sm px-3 py-2 w-11/12 placeholder-light-surface-on dark:placeholder-dark-surface-on focus:outline-none"
                v-model="input" placeholder="질문하기"></textarea>
            <button @click="submit()"
                class="flex items-center justify-center w-8 h-8 m-1 rounded-full disabled:pointer-events-none"
                :class="input?.length > 0 ? 'cursor-pointer bg-primary text-primary-on hover:bg-primary-darken' : ''"
                :disabled="input?.length === 0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
            </button>
        </div>
        <div @click="inProgress ? isAborted = true : ''"
            class="text-xs text-light-surface-on-muted dark:text-dark-surface-on-muted text-center">abort
        </div>
        <Toast :isShow="showToast" :toastID="toastID" @close="showToast = false" />
    </div>
</template>

<script setup lang="ts">

const { createToast } = useToast()
const showToast = ref(false)
const toastID = ref(null)
const inProgress = ref(false)
const isAborted = ref(false)
const { chats, activeChatTitleIndex, addChatTitle, sendUserInput } = useChat()
const { textarea, input } = useTextareaAutosize()
const { focused } = useFocus(textarea)
const route = useRoute()
const router = useRouter()
const inputContainer = ref<HTMLElement | null>(null)
const { height } = useElementSize(inputContainer)
const isMultiLine = ref(false)
let initialInputContainerHeight = 0
watch(height, (newHeight, oldHeight) => {
    if (oldHeight === 0) return
    if (initialInputContainerHeight === 0) initialInputContainerHeight = oldHeight
    if (newHeight > initialInputContainerHeight) {
        isMultiLine.value = true
    } else {
        isMultiLine.value = false
    }
})
let abortController = new AbortController();
const stopGenerating = async () => {
    abortController.abort()
    abortController = new AbortController();
    isAborted.value = false
}
const submit = async () => {
    if (input.value?.length === 0 || input.value === undefined) return
    if (route.path === '/chat') activeChatTitleIndex.value = -1
    const chatInput = input.value
    const titleCode = `c${Date.now()}`
    input.value = ''
    // in case of new chat, create chat title
    if (activeChatTitleIndex.value === -1) {
        try {
            const response = await addChatTitle({
                mode: '',
                model: '',
                code: titleCode,
                title: chatInput,
                dataset_id: 0
            })
            activeChatTitleIndex.value = chats.value.length - 1
            if (typeof response !== 'number' || response <= 0) {
                throw new Error('Invalid response from addChatTitle: not a positive number');
            }
        } catch (error) {
            console.error('Error adding chat title:', error.message);
            return
        }
    }
    try {
        router.push({ name: 'ChatContent', params: { titleCode: titleCode } })
        const chatTitleIndex = activeChatTitleIndex.value
        chats.value[chatTitleIndex].isThinking = true
        chats.value[chatTitleIndex].isGenerating = true
        chats.value[chatTitleIndex].contents.push({
            role: 'YOU',
            content: chatInput
        })
        chats.value[chatTitleIndex].contents.push({
            role: 'AI',
            content: ''
        })
        const chatMessageIndex = chats.value[chatTitleIndex].contents.length - 1
        const response = await sendUserInput(chatInput, chats.value[chatTitleIndex].id, abortController.signal)
        const stream = response.body!.getReader()
        const decoder = new TextDecoder();
        while (true) {
            const { done, value: chunk } = await stream.read()
            const decodedChunk = decoder.decode(chunk, { stream: true });
            chats.value[chatTitleIndex].contents[chatMessageIndex].content += decodedChunk
            if (chats.value[chatTitleIndex].isThinking) chats.value[chatTitleIndex].isThinking = false
            if (done) break
            if (isAborted.value) {
                await stopGenerating()
                break
            }
        }
        toastID.value = createToast({
            variant: 'success',
            message: '답변이 완료되었습니다.',
        })

    } catch (e) {
        toastID.value = createToast({
            variant: 'info',
            message: '답변 생성이 중지 되었습니다.',
        })
        console.log(e)
    } finally {
        showToast.value = true
        chats.value[activeChatTitleIndex.value].isGenerating = false
    }

}
</script>

<style scoped>
textarea {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

textarea::-webkit-scrollbar {
    display: none;
}
</style>