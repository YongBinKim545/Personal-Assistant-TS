<template>
    <div>
        <div @click="openDialog"
            class="cc-positive-button w-[150px]">
            <span class="uppercase">add local files</span>
        </div>
        <Modal :isShow="showModal" title="add local files" footer @close="closeDialog">
            <template v-slot:body>
                <div class="flex space-x-8 w-[700px] h-[300px]">
                    <div class="w-[300px] flex flex-col space-y-10">
                        <SelectItem addNewItemOption @selectionChanged="changeDataset" defaultMessage="Select a Dataset"
                            hr :options="datasetOptions" :selectedItem="selectedDataset.name" class="mt-2">
                        </SelectItem>

                        <SelectItem :disabled="!allowEmbeddingModelChange" hr
                            @selectionChanged="(newModel) => { selectedDataset.embedding_model = newModel }"
                            :defaultMessage="embeddingModelDefaultMessage" :options="embeddingModelOptions"
                            :selectedItem="selectedDataset.embedding_model" />
                        <FileUploader @change="addFiles" />
                    </div>
                    <div class="w-[400px] rounded-md">
                        <div class="flex space-x-2 text-base ml-5 mt-3">
                            <button @click="showExistingData = false"
                                :class="[!showExistingData ? 'cc-active-tab-button' : 'cc-default-tab-button']">
                                NEW</button>
                            <button @click="() => { if (existingFileList.length > 0) showExistingData = true }"
                                :class="[showExistingData ? 'cc-active-tab-button' : 'cc-default-tab-button', existingFileList.length > 0 ? '' : 'hover:cursor-not-allowed']">
                                EXISTING</button>
                        </div>
                        <div class="overflow-y-auto overflow-x-hidden h-[265px] p-2 border-t">
                            <transition name="slide-left" mode="out-in">
                                <FilePreview v-if="showExistingData" :fileList="existingFileList" />
                                <FilePreview v-else :fileList="fileList" @onDelete="removeFile" action />
                            </transition>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <button @click="onSave" class="cc-positive-button">
                    SAVE
                </button>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">

const { datasets, activeDatasetIndex, addDataset, readDatasetDetail, addDatasetDetail } = useDataset()
const { fileList, addFiles, removeFile } = useFileUploader()
const { createToast } = useToast()
const showModal = ref(false)
const showExistingData = ref(false)
const selectedDataset = ref<DatasetT>()
const embeddingModelOptions = ref<string[]>([])
const allowEmbeddingModelChange = ref(false)
const embeddingModelDefaultMessage = ref<string>()
const embeddingModels = [{ id: 1, name: 'openai' }, { id: 2, name: 'gemini' }] // to be loaded by DB

let datasetIndexToUpdate = -1
const datasetOptions = computed(() => {
    return datasets.value.map(({ name }) => name)
})
const existingFileList = computed(() => {
    if (selectedDataset.value.id === undefined) {
        return []
    } else {
        return selectedDataset.value.contents
    }
})
const openDialog = () => {
    fileList.value = []
    selectedDataset.value = { name: undefined }
    embeddingModelOptions.value = []
    allowEmbeddingModelChange.value = false
    embeddingModelDefaultMessage.value = 'Select an Embedding Model'
    showModal.value = true
}
const closeDialog = () => {
    showModal.value = false
}
const changeDataset = (newSelectedDataset: string) => {
    const datasetObject = datasets.value.find(element => element.name === newSelectedDataset)
    if (datasetObject === undefined) {
        selectedDataset.value = { id: undefined, name: newSelectedDataset, embedding_model: undefined }
        embeddingModelOptions.value = embeddingModels.map(({ name }) => name)
        allowEmbeddingModelChange.value = true
        embeddingModelDefaultMessage.value = 'Select an Embedding Model'
        showExistingData.value = false
    } else {
        selectedDataset.value = datasetObject
        allowEmbeddingModelChange.value = false
        embeddingModelDefaultMessage.value = datasetObject.embedding_model
        if (datasetObject.contents.length === 0) {
            datasetIndexToUpdate = datasets.value.findIndex(element => element.name === datasetObject.name)
            readDatasetDetail(datasetIndexToUpdate)
        }
    }
}

const inputValidation = () => {
    let message = 'success'
    if (selectedDataset.value['name'] === undefined) {
        message = 'Select or Create a New Dataset'
        return message
    }
    if (selectedDataset.value.embedding_model === undefined) {
        message = 'Select an Embedding Model'
        return message
    }
    if (fileList.value.length === 0) {
        message = 'No File to be Added'
        return message
    }
    return message
}
const onSave = async () => {
    const validation = inputValidation()
    if (validation !== 'success') {
        createToast({
            variant: 'info',
            message: validation,
        })
        return
    }
    let activeId = selectedDataset.value.id
    if (activeId === undefined) {
        const newDataset = [{
            name: selectedDataset.value.name,
            embedding_model: selectedDataset.value.embedding_model
        }]
        const response = await addDataset(newDataset)
        activeId = response.id
        datasetIndexToUpdate = response.index
    }
    const newFiles: FileItemT[] = fileList.value.map((element) => (
        { name: element.name, path: element.path, dataset_id: activeId }
    ))
    const response = await addDatasetDetail(newFiles)
    if (response.ok) {
        if (activeDatasetIndex.value === datasetIndexToUpdate) {
            readDatasetDetail(datasetIndexToUpdate)
        } else {
            activeDatasetIndex.value = datasetIndexToUpdate // activeDatasetIndex change will fire readDatasetDetail Function
        }
        closeDialog()
        createToast({
            variant: 'success',
            message: 'File(s) embedded successfuly',
        })
    }
}
</script>
<style scoped>
/* .fade-move,
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from {
    opacity: 0;
    transform: scale(0) translate(-300px, 0px);
}

.fade-leave-to {
    opacity: 0;
    transform: scale(0) translate(300px, 0px);
}

.fade-leave-active {
    position: absolute;
} */

.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.3s ease-out, opacity 0.1s ease-out;
}

.slide-left-enter-from {
    transform: translateX(-30%);
    opacity: 0;
}

.slide-left-leave-to {
    transform: translateX(30%);
    opacity: 0;
}
</style>