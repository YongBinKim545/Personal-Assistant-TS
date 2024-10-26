<template>
    <div class="space-y-7">
        <div ref="target"></div>
        <div class="relative flex flex-col space-y-2">
            <span class="border-l-2 border-primary px-2 font-bold">Data File Path</span>
            <div class="flex space-x-5">
                <div class="flex items-center h-10 w-full px-4 rounded-md bg-light-surface dark:bg-dark-surface">
                    <span>{{ dataFilePath }}</span>
                </div>
                <div @click="setDataFilePath"
                    class="flex justify-center items-center h-10 w-10 rounded-md bg-light-surface dark:bg-dark-surface hover:bg-light-surface-high hover:dark:bg-dark-surface-high">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                    </svg>
                </div>
            </div>
        </div>
        <div v-for="(connection, index) in connections" :key="index" class="flex flex-col">
            <div class="flex space-x-5">
                <div class="relative flex justify-between border-l-2 border-primary px-2 my-2 w-full">
                    <span class=" font-bold">{{ connection.title }}</span>
                    <span v-show="connection?.url.length > 0" @click="openURL(connection.url)"
                        class="absolute -bottom-1 right-2 text-sm hover:cursor-pointer opacity-50">Click Here to Get API key</span>
                </div>
                <div class="w-10"></div>
            </div>
            <div ref="actionButtons" class="flex space-x-5">
                <div class="w-full">
                    <input :ref="el => { if (el) inputRefs[index] = el as HTMLInputElement }"
                        v-if="index === activeElementIndex" type="text" v-model="connection.value"
                        class="h-10 w-full px-4 rounded-md bg-light-surface-high dark:bg-dark-surface-high focus:outline-none focus:ring-2 focus:ring-primary">
                    <div v-else class="flex items-center h-10 px-4 rounded-md bg-light-surface dark:bg-dark-surface">
                        <span v-if="connection.value === null">No Data</span>
                        <span v-else>{{ connection.value }}</span>
                    </div>
                </div>
                <div>
                    <button v-if="index === activeElementIndex" @click="saveChange(index)"
                        class="flex justify-center items-center h-10 w-10 rounded-md bg-light-surface dark:bg-dark-surface hover:bg-light-surface-high hover:dark:bg-dark-surface-high">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
                        </svg>
                    </button>
                    <button v-else @click="editContent(index)"
                        class="flex justify-center items-center h-10 w-10 rounded-md bg-light-surface dark:bg-dark-surface hover:bg-light-surface-high hover:dark:bg-dark-surface-high">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { connectionInformation, getConnectionInformation, updateConnectionInformation } = useLanguageModel()
const inputRefs = ref<{ [key: number]: HTMLInputElement }>({})
const target = ref<HTMLElement>()
const actionButtons = ref<HTMLElement[]>([])
const dataFilePath = ref('')
const activeElementIndex = ref(-1)

onClickOutside(target, () => {
    if (activeElementIndex.value === -1) return
    closeWithoutSave(activeElementIndex.value)
}, {
    ignore: actionButtons.value
})
const editContent = (index: number) => {
    if (activeElementIndex.value > -1) {
        closeWithoutSave(activeElementIndex.value)
    }
    activeElementIndex.value = index
    nextTick(() => {
        const input = inputRefs.value[index]
        if (input) {
            input.focus()
        }
    })
}
const setDataFilePath = async () => {
    try {
        const result = await window.api.openFolderDialog()
        if (!result.canceled) {
            const newFolderPath = result.filePaths[0]
            const response = await updateConnectionInformation('data_file_path', newFolderPath)
            if (response.ok) {
                dataFilePath.value = newFolderPath
            }
        }
    } catch (error) {
        console.error('Error changing data file path:', error);
    }
}
const saveChange = async (index: number) => {
    const { provider, value } = connections.value[index]
    const response = await updateConnectionInformation(provider, value)
    if (response.ok) {
        activeElementIndex.value = -1
    }
}

const closeWithoutSave = (index: number) => {
    const information = connectionInformation.value.find(item => item.provider === connections.value[index].provider)
    connections.value[index].value = information.value
    activeElementIndex.value = -1
}
const openURL = (url: string) => {
    window.api.openURL(url)
}
const connections = ref([
    {
        provider: 'Local',
        title: 'Local(Ollama) Base URL',
        value: '',
        url: ''
    },
    {
        provider: 'OpenAI',
        title: 'OpenAI(ChatGPT)',
        value: '',
        url: 'https://platform.openai.com/api-keys'
    },
    {
        provider: 'Google',
        title: 'Google(Gemini)',
        value: '',
        url: 'https://ai.google.dev/gemini-api/docs/api-key'
    },
    {
        provider: 'Anthropic',
        title: 'Anthropic(Claude)',
        value: '',
        url: 'https://console.anthropic.com/settings/keys'
    },
])
onMounted(async () => {
    if (connectionInformation.value.length === 0) {
        const response = await getConnectionInformation()
        if (!response.ok) return
    }
    dataFilePath.value = connectionInformation.value.find(item => item.provider === 'data_file_path').value
    connections.value.forEach((connection) => {
        const information = connectionInformation.value.find(item => item.provider === connection.provider)
        connection.value = information.value
    })
})
</script>

<style scoped></style>