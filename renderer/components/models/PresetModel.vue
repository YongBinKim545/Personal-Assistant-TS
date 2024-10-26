<template>
    <div>
        <div class="flex flex-col space-y-2">
            <span class="border-l-2 border-primary px-2 font-bold">Preset Models</span>
            <div class="flex flex-col space-y-2">
                <div class="bg-light-surface dark:bg-dark-surface rounded-md">
                    <div
                        class="w-[calc(100%-50px)] flex space-x-2 justify-between items-center text-center font-bold h-10">
                        <span class="p-2 w-7/12">Model Name</span>
                        <span class="p-2 w-5/12">Task</span>
                    </div>
                </div>
                <div class="flex space-x-3" v-for="(presetModel, index) in presetModels" :key="index">
                    <div class="w-full flex justify-between items-center text-center h-10">
                        <div class="w-7/12 flex justify-center">
                            <div class="group relative flex">
                                <div
                                    class="p-2 bg-light-surface-highest dark:bg-dark-surface-highest hidden group-hover:block absolute -right-24 top-1 rounded-md z-50 text-xs">
                                    <span>Click for Details</span>
                                </div>
                                <span @click="openModelDetailPage(presetModel.id)" class="p-2 hover:cursor-pointer">{{
                                    presetModel.title
                                }}</span>
                            </div>
                        </div>
                        <span class="p-2 w-5/12">{{
                            presetModel.task }}</span>
                    </div>
                    <div v-show="!presetModel.isAvailable && !presetModel.isPullingQueue">
                        <div @click="createNewModel(presetModel.id)"
                            class="flex justify-center items-center h-[40px] w-[40px] cursor-pointer rounded-md bg-light-surface dark:bg-dark-surface hover:bg-light-surface-high hover:dark:bg-dark-surface-high">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>

                        </div>
                    </div>
                    <div v-show="presetModel.isAvailable">
                        <div
                            class="flex justify-center items-center h-10 w-10 rounded-md text-success bg-light-surface-high dark:bg-dark-surface-high">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                                stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        </div>
                    </div>
                    <div v-show="!presetModel.isAvailable && presetModel.isPullingQueue">
                        <div
                            class="flex justify-center items-center h-10 w-10 rounded-md text-success bg-light-surface-high dark:bg-dark-surface-high">
                            <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                            <svg class="animate-spin size-6" width="800px" height="800px" viewBox="0 0 24 24"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.2" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                    fill="currentColor" />
                                <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
                                    fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr class="my-2" />
    </div>
</template>

<script setup lang="ts">
const { createToast } = useToast()
const { addModelQueue, pullOllamaModel, createOllamaPresetModel, presetModels, getModels, getPresetModels } = useLanguageModel()

const openModelDetailPage = (id: number) => {
    const selectedItem = presetModels.value.find(model => model.id === id)
    const url = selectedItem.detail
    window.api.openURL(url)
}

const createNewModel = async (id: number) => {
    const selectedItem = presetModels.value.find(model => model.id === id)
    selectedItem.isPullingQueue = true
    const { name, title, provider, task, installMethod } = selectedItem
    const link = '/models/preset-models'
    let response
    try {
        if (installMethod === 'pull') {
            const modelInformation = {
                name: name,
                title: title,
                provider: provider,
                task: task,
            }
            response = await addModelQueue.addTask((onProgress) => pullOllamaModel(modelInformation, onProgress), title, link)
        } else {
            const modelInformation = {
                name: name,
                provider: provider,
                task: task,
                modelFile: selectedItem.modelFile as string,
                sourceURL: selectedItem.sourceURL as string
            }
            response = await addModelQueue.addTask((onProgress) => createOllamaPresetModel(modelInformation, onProgress), title, link)
        }
        if (response.ok) {
            await getModels()
            getPresetModels()
            createToast({
                variant: 'success',
                message: `Model [${name}] added successfully`,
            })
        }
    } catch (error) {
        createToast({
            variant: 'error',
            message: `${error}. Check Internet connection`,
        })
    } finally {
        selectedItem.isPullingQueue = false
    }

}
onMounted(() => {
    getPresetModels()
})
</script>

<style scoped></style>