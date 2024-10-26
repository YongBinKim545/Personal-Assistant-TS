<template>
    <div class="relative flex flex-col space-y-2">
        <span class="border-l-2 border-primary px-2 font-bold">Ollama Installation</span>
        <div v-if="!isOllamaExisting" class="flex justify-between">
            <div class="flex space-x-3 items-center">
                <div class="relative flex justify-center items-center h-6 w-6">
                    <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="size-6 text-warning">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                </div>
                <span class="text-sm">Ollama is not installed</span>
            </div>
            <div class="flex space-x-2">
                <button @click="downloadOllama"
                    class="p-2 rounded-full bg-light-surface dark:bg-dark-surface hover:bg-light-surface-highest hover:dark:bg-dark-surface-highest cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                    </svg>
                </button>
                <button @click="checkOllamaInstallation"
                    class="p-2 rounded-full bg-light-surface dark:bg-dark-surface hover:bg-light-surface-highest hover:dark:bg-dark-surface-highest cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
            </div>
        </div>
        <div v-else class="absolute -top-2 right-0">
            <div
                class="flex justify-center items-center h-10 w-10 rounded-md text-success bg-light-surface-high dark:bg-dark-surface-high">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                    stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </div>
        </div>
        <div v-if="isOllamaExisting && ollamaModels?.length === 0" class="flex space-x-3 items-center">
            <div class="relative flex justify-center items-center h-6 w-6">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="size-6 text-warning">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
            </div>
            <span class="text-sm">There are no available models</span>
            <span @click="$router.push({ name: 'PresetModels' })"
                class="text-sm border-b opacity-50 cursor-pointer">Click
                here to add models</span>
        </div>
    </div>
</template>

<script setup lang="ts">
const { isOllamaExisting, ollamaModels, checkOllamaInstallation } = useLanguageModel()
const downloadOllama = () => {
    window.api.openURL('https://ollama.com/download')
}

onMounted(async() => {
    if (!isOllamaExisting) {
        await checkOllamaInstallation()
    }
})
</script>

<style scoped></style>