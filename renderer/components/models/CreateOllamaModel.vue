<template>
    <div>
        <div class="flex flex-col space-y-2">
            <span class="border-l-2 border-primary px-2 font-bold">Create a Model from a Modelfile</span>
            <div class="flex space-x-3">
                <input type="text" v-model="modelName"
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
            <div class="flex space-x-3 items-center">
                <textarea ref="textarea"
                    class="resize-none w-full min-h-[180px] max-h-[330px] px-4 py-2 rounded-md bg-light-surface-high dark:bg-dark-surface-high focus:outline-none focus:ring-2 focus:ring-primary placeholder-opacity-50"
                    v-model="input" placeholder="Write a modelfile"></textarea>
                <div class="flex flex-col space-y-5">
                    <div class="group relative flex justify-center">
                        <div
                            class="p-2 bg-light-surface-highest dark:bg-dark-surface-highest hidden group-hover:block absolute right-[52px] rounded-md text-center">
                            <span class="whitespace-nowrap">Load Modelfile</span>
                        </div>
                        <label for="modelfile-selector">
                            <div
                                class="flex justify-center items-center h-10 w-10 rounded-md bg-light-surface dark:bg-dark-surface hover:bg-light-surface-high hover:dark:bg-dark-surface-high">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                </svg>
                            </div>
                            <input id="modelfile-selector" type="file" class="hidden" @change="loadModelfile" />
                        </label>
                    </div>
                    <div class="group relative flex justify-center">
                        <div
                            class="p-2 bg-light-surface-highest dark:bg-dark-surface-highest hidden group-hover:block absolute right-[52px] rounded-md text-center">
                            <span class="whitespace-nowrap">Clear Contents</span>
                        </div>
                        <div @click="clearModelfile"
                            class="flex justify-center items-center h-10 w-10 rounded-md bg-light-surface dark:bg-dark-surface hover:bg-light-surface-high hover:dark:bg-dark-surface-high">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </div>
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
                    <button @click="() => { if (modelNameValidated) createOllamaModel() }"
                        class="flex justify-center items-center h-10 w-10 rounded-md bg-primary text-primary-on hover:bg-primary-darken"
                        :class="modelNameValidated ? '' : 'opacity-50 cursor-not-allowed'">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="m7.49 12-3.75 3.75m0 0 3.75 3.75m-3.75-3.75h16.5V4.499" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="m-1 flex flex-col space-y-2">
                <span @click="openURL('https://huggingface.co/models')"
                    class="text-sm hover:cursor-pointer opacity-50">Click Here to
                    Find GGUF Files</span>
                <span @click="openURL('https://github.com/ollama/ollama/blob/main/docs/modelfile.md')"
                    class="text-sm hover:cursor-pointer opacity-50">Click Here to Learn about Modelfile</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { createToast, removeToast } = useToast()
const { addModelQueue, ollamaModels } = useLanguageModel()
const { textarea, input } = useTextareaAutosize()
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

const openURL = (url: string) => {
    window.api.openURL(url)
}

const createOllamaModel = async () => {
    if (!modelNameValidated.value) return
    const modelfileValidation = /FROM\s+.+/i.test(input.value) && /PARAMETER\s+.+/i.test(input.value) && /TEMPLATE\s+.+/i.test(input.value)
    if (!modelfileValidation) {
        createToast({
            variant: 'error',
            message: "The model file must include the sections 'FROM', 'PARAMETER', and 'TEMPLATE'.",
        })
        return
    }
    const modelFileName = await window.api.createModelfile(input.value)
    if (modelFileName.includes('Modelfile Creating')) {
        createToast({
            variant: 'error',
            message: `${modelFileName}. Try Again.`,
        })
        return
    }
    const deleteTemporaryFile = await window.api.deleteFileFromPath(modelFileName)
    if (deleteTemporaryFile.includes('Failed to delete file:')) {
        createToast({
            variant: 'error',
            message: deleteTemporaryFile,
        })
        return
    }
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
const clearModelfile = () => {
    input.value = ''
}
const loadModelfile = (event: Event) => {
    const target = event.target as HTMLInputElement
    // const filePath = target.files?.[0]?.path
    const file = target.files?.[0]
    target.value = ''
    if (file) {
        if (file.name.includes('.') && !file.name.includes('.txt')) {
            createToast({
                variant: 'error',
                message: 'The file is not in the Ollama modelfile format.',
            })
            return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
            const contents = e.target?.result
            if (typeof contents === 'string') {
                const isOllamaModelfile = /PARAMETER\s+.+/i.test(contents) && /TEMPLATE\s+.+/i.test(contents);
                if (isOllamaModelfile) {
                    input.value = contents
                } else {
                    createToast({
                        variant: 'error',
                        message: 'The file is not in the Ollama modelfile format.',
                    })
                }
            }
        }
        reader.onerror = (e) => {
            createToast({
                variant: 'error',
                message: `Error reading file ${e}`,
            })
        }
        reader.readAsText(file)
    }
}
</script>

<style scoped></style>