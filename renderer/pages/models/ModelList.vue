<template>
    <div>
        <div class="flex space-x-2 mx-2 h-14">
            <button v-for="provider in providers" @click="activeProvider = provider"
                :class="[activeProvider === provider ? 'cc-active-tab-button' : 'cc-default-tab-button']">
                <span class="uppercase">{{ provider }}</span>
                <br>
                <span>{{ representiveModel[provider as keyof typeof representiveModel] }}</span>
        </button>
        </div>
        <DataTable delAction
            :headers="[{ headername: 'Model Name', datakey: 'name', width: '50%', align: 'center' }, { headername: 'Task', datakey: 'task', width: '40%', align: 'center' }, { headername: 'Action', datakey: 'action', width: '10%', align: 'center' }]"
            :contents="models.filter(item => item.provider === activeProvider)" @onDelete=deleteItem>
        </DataTable>
        <hr class="my-2"/>
        <div v-if="activeProvider !== 'Local'" class="flex justify-between my-2 items-end">
            <span @click="openURL(modelUrl[activeProvider as keyof typeof modelUrl])"
                class="text-sm hover:cursor-pointer opacity-50">Click here to see available models</span>
            <button @click="addModel"
                class="cc-positive-button">
                Add Model
            </button>
        </div>
        <Modal :isShow="showModal" title="add model" footer @close="closeDialog">
        </Modal>
    </div>
</template>

<script setup lang="ts">
const { models, ollamaModels, deleteOllamaModel } = useLanguageModel()
const activeProvider = ref('Local')
const showModal = ref(false)
const providers = [
    'Local',
    'OpenAI',
    'Google',
    'Anthropic'
]
const representiveModel = {
    Local: '(Ollama)',
    OpenAI: '(ChatGPT)',
    Google: '(Gemini)',
    Anthropic: '(Claude)'
}
const modelUrl = {
    OpenAI: 'https://platform.openai.com/docs/models',
    Google: 'https://ai.google.dev/gemini-api/docs/models/gemini',
    Anthropic: 'https://docs.anthropic.com/en/docs/about-claude/models'
}
const closeDialog = () => {
    showModal.value = false
}
const openURL = (url: string) => {
    window.api.openURL(url)
}
const addModel = () => {
    showModal.value = true
}
const deleteItem = async (id: number) => {
    const model = ollamaModels.value.find((item) => item.id === id)
    const response = await deleteOllamaModel(id, model.name)
}
</script>

<style scoped></style>