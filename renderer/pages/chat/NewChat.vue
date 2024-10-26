<template>
    <div class="relative h-full">
        <div class="flex justify-between">
            <div class="min-w-[40%]">
                <ModelSelection :showMenu="showModelMenu" @toggleMenu="toggleModelMenu" />
            </div>
            <div class="max-w-[40%]">
                <ModeSelection :showMenu="showModeMenu" @toggleMenu="toggleModeMenu" />
            </div>
        </div>
        <div
            class="absolute inset-0 m-auto w-[75%] h-[calc(100%-200px)] flex flex-col justify-center items-center">
            <div class="w-[75%] min-w-[600px]">
                <InputForm type="text" placeHolder="Enter URL" v-model="url"/>
            </div>
            
            <div class="w-[75%] min-w-[600px]">
                <ChatInput @submit="submit" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { initActiveChatTitleIndex, addChatTitle, sendUserInput } = useChat()
const { activeItems, readActiveItems } = useActiveItems()
const { createToast } = useToast()
const router = useRouter()
const showModelMenu = ref(false)
const showModeMenu = ref(false)
const url = ref<string>()

const toggleModelMenu = () => {
    if (showModeMenu.value) showModeMenu.value = false
    showModelMenu.value = !showModelMenu.value
}
const toggleModeMenu = () => {
    if (showModelMenu.value) showModelMenu.value = false
    showModeMenu.value = !showModeMenu.value
}
const submit = async (input: string) => {
    if (input.length === 0) return
    if (activeItems.value.model === null) return
    const threadId = `c${Date.now()}`
    try {
        const response = await addChatTitle({
            thread_id: threadId,
            title: input,
            model_id: activeItems.value.model,
            mode_id: activeItems.value.mode,
            dataset_id: 0
        })
        if (typeof response !== 'number' || response <= 0) {
            throw new Error('Invalid response from addChatTitle')
        }
        router.push({ name: 'ChatContent', params: { threadId } })
        const _ = await sendUserInput(threadId, input)
    } catch (error) {
        createToast({
            variant: 'error',
            title: 'Failed to Send User Input',
            message: error,
        })
        return
    }
}

onMounted(async () => {
    initActiveChatTitleIndex()
    if (activeItems.value?.model) return
    await readActiveItems()
})
</script>
<style scoped></style>