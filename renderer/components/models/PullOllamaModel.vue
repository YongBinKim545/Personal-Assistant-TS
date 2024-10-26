<template>
    <div>
        <div class="flex flex-col space-y-2">
            <span class="border-l-2 border-primary px-2 font-bold">Pull a model from Ollama.com</span>
            <div class="flex space-x-3">
                <input type="text" v-model="modelName" :disabled="isPulling"
                    class="h-10 w-full px-4 rounded-md bg-light-surface-high dark:bg-dark-surface-high focus:outline-none focus:ring-2 focus:ring-primary placeholder-opacity-50"
                    placeholder="Model Name">
                <div v-if="!modelNameValidated" class="group relative flex justify-center">
                    <div
                        class="p-2 bg-light-surface-highest dark:bg-dark-surface-highest hidden group-hover:block absolute -top-[45px] right-0 rounded-md text-center">
                        <span class="whitespace-nowrap">Check for Duplicates</span>
                    </div>
                    <div @click="checkDuplication"
                        class="flex justify-center items-center cursor-pointer h-10 w-10 rounded-md bg-light-surface dark:bg-dark-surface hover:bg-light-surface-high hover:dark:bg-dark-surface-high">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                            stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </div>
                </div>
                <div v-else>
                    <div
                        class="flex justify-center items-center text-primary h-10 w-10 rounded-md bg-light-surface dark:bg-dark-surface">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                            stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="flex space-x-3">
                <div
                    class="flex space-x-10 h-10 w-full px-4 py-2 rounded-md bg-light-surface-high dark:bg-dark-surface-high">
                    <label v-for="(option, index) in options" :key="index" class="cursor-pointer">
                        <input type="radio" :value="option" :checked="selectedOption === option"
                            @change="toggleSelection(option)" />
                        {{ option }}
                    </label>
                </div>
                <div class="group relative flex justify-center">
                    <div
                        class="p-2 bg-light-surface-highest dark:bg-dark-surface-highest hidden group-hover:block absolute -bottom-[45px] right-0 rounded-md text-center">
                        <span class="whitespace-nowrap">{{ modelNameValidated ? 'Create Model' : 'Model Name Validation Required'
                            }}</span>
                    </div>
                    <button @click="() => { if (modelNameValidated) pullModel() }"
                        class="flex justify-center items-center h-10 w-10 rounded-md bg-primary text-primary-on hover:bg-primary-darken"
                        :class="modelNameValidated ? '' : 'opacity-50 cursor-not-allowed'">
                        <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                        <svg v-if="isPulling" class="animate-spin size-6" width="800px" height="800px"
                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.2" fill-rule="evenodd" clip-rule="evenodd"
                                d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                fill="currentColor" />
                            <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
                                fill="currentColor" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="m7.49 12-3.75 3.75m0 0 3.75 3.75m-3.75-3.75h16.5V4.499" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="m-1">
                <span @click="openOllamaModelPage" class="text-sm hover:cursor-pointer opacity-50">Click
                    here to see available models</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { createToast} = useToast()
const { addModelQueue, ollamaModels, isPulling, pullOllamaModel, getModels } = useLanguageModel()
const modelName = ref<string>()
const modelNameValidated = ref<boolean>(false)
const options = [
    'Text Generation', 'Embedding'
]
const selectedOption = ref<string>(options[0])
const toggleSelection = (option: string) => {
    selectedOption.value = option
}
watch(modelName, (newModelName) => {
    if (newModelName.length > 0) modelNameValidated.value = false
})

const openOllamaModelPage = () => {
    window.api.openURL('https://ollama.com/library')
}
const checkDuplication = async () => {
    let newModelName = ''
    if (modelName.value?.length > 0) {
        newModelName = modelName.value.split(' ').join('')
    }
    if (newModelName.length === 0) {
        createToast({
            variant: 'error',
            message: 'Model Name cannot be empty. Please enter a valid name.',
        })
        modelName.value = ''
        return
    }
    const existingModels = ollamaModels.value.map(model => model.name)
    if (addModelQueue.taskNameInQueue.length > 0) {
        existingModels.push(...addModelQueue.taskNameInQueue)
    }
    if (existingModels.includes(newModelName)) {
        modelNameValidated.value = false
        createToast({
            variant: 'error',
            message: 'Duplicate Model Name: The name you entered already exists.',
        })
    } else {
        modelNameValidated.value = true
    }
}

const pullModel = async () => {
    if (modelName.value === undefined || modelName.value === '') {
        createToast({
            variant: 'error',
            message: "The model file must include the sections 'FROM', 'PARAMETER', and 'TEMPLATE'.",
        })
        return
    }
    isPulling.value = true
    const title = modelName.value
    const provider = 'Local' as ProviderT
    const task = selectedOption.value
    const link = '/models/ollama-models'
    try {
        isPulling.value = true
        const modelInformation = {
            name: title,
            title: title,
            provider: provider,
            task: task,
        }
        const response = await addModelQueue.addTask((onProgress) => pullOllamaModel(modelInformation, onProgress), title, link)
        if (response.ok) {
            await getModels()
             createToast({
                variant: 'success',
                message: `Model [${title}] added successfully`,
            })
        } else {
            throw new Error()
        }
    } catch (error) {
        createToast({
            variant: 'error',
            message: `${error}. Check model name or internet connection`,
        })
    } finally {
        isPulling.value = false
        modelName.value = ''

    }
}
</script>

<style scoped></style>