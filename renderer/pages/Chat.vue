<template>
    <div class="relative grow px-5 py-2">
        <div class="flex justify-between m-3">
            <ModeSelection />
            <ModelSelection />
        </div>
        <router-view />
        <UserInput class="absolute mx-auto left-0 right-0 bottom-5" />
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { chats, activeChatTitleIndex, readChatContent } = useChat()
watch(() => route.params.titleCode, async (newTitleCode) => {
    const index = chats.value.findIndex((item) => item.code === newTitleCode)
    if (index < 0) return
    activeChatTitleIndex.value = index
    if (chats.value[index].contents === undefined || chats.value[index].contents?.length === 0) {
        await readChatContent(chats.value[index].id)
    }
})
</script>