<template>
    <div>
        <div @click="emit('openAddDocument')"
            class="flex justify-center p-3 text-sm rounded-md font-bold hover:bg-light-surface-high hover:dark:bg-dark-surface-high hover:cursor-pointer">
            <span class="uppercase">로컬 문서 추가</span>
        </div>
        <Modal :isShow="showModal" title="로컬 문서 추가" footer @close="emit('closeAddDocument')">
            <template v-slot:body>
                <div class="flex space-x-8 w-[800px] h-[300px]">
                    <div class="w-2/5">
                        <SelectItem @selectionChanged="changeDataset" @newItemAdded="isNewDatasetCreated = false"
                            :selectedItem="selectedDataset?.name || null" helpText="문서를 추가할 Dataset을 선택"
                            defaultMessage="Select a Dataset" :options="datasets" :addNew="isNewDatasetCreated">
                            <template v-slot:addNew>
                                <li class="cc-list-item hover:cursor-pointer" @click="addNewDataset"
                                    @mousedown="(e) => e.preventDefault()">
                                    <span>Add New</span>
                                </li>
                            </template>
                        </SelectItem>
                        <SelectItem class="mt-4" helpText="문서 Embedding Model 선택"
                            @selectionChanged="(newModel) => { selectedEmbeddingModel = newModel.name }"
                            :selectedItem="selectedEmbeddingModel || null"
                            defaultMessage="Select an Embedding Model" :options="[{id:1, name:'openai'}, {id:2, name:'gemini'}]" />
                        <FileUploader class="mt-10" @change="addFiles" />
                    </div>
                    <div class="w-3/5 h-full overflow-y-auto overflow-x-hidden">
                        <FilePreview :fileList title="추가할 문서" @onDelete="removeFile">
                        </FilePreview>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <hr>
                <button @click="onSave" class="cc-btn flex justify-center w-[120px]">
                    SAVE
                </button>
            </template>
        </Modal>
        <Toast :isShow="showToast" :toastID="toastID" @close="showToast = false" />
    </div>
</template>

<script setup lang="ts">

const { datasetDetail} = usedatasetDetail()
const { datasets, addDataset, activeDatasetIndex } = useDatasets()
const { fileList, addFiles, removeFile } = useFileUploader()
const { createToast } = useToast()
const showModal = ref(false)
const preventClose = ref(false)
const showToast = ref(false)
const toastID = ref(null)
const isNewDataset = ref(false)
const isNewDatasetCreated = ref(false)
const selectedDataset = ref<TableContentT>(null)
const selectedEmbeddingModel = ref<string>(null)

interface Props {
    isShow: boolean
}
const props = withDefaults(defineProps<Props>(), {
    isShow:false
})
const emit = defineEmits(['addData', 'openAddDocument','closeAddDocument'])

watch(activeDatasetIndex, (newIndex) => {
    if (newIndex === null) {
        datasetDetail.value = []
    }
})
watch(
  () => props.isShow,
  (newIsShow) => {
    if (newIsShow){
        openDialog()
    } else {
        closeDialog()
    }
  }
)
const openDialog = () => {
    if (activeDatasetIndex && datasets.value.length > 0) {
        const { id, name, embedding_model } = datasets.value[activeDatasetIndex.value]
        selectedDataset.value = {
            id: id,
            name: name,
            embedding_model: embedding_model
        }
        selectedEmbeddingModel.value = datasets.value[activeDatasetIndex.value].embedding_model
    }
    showModal.value = true
}
const closeDialog = () => {
    if (preventClose.value) return
    fileList.value = []
    isNewDataset.value = false
    isNewDatasetCreated.value = false
    selectedDataset.value = null
    showModal.value = false
}

const changeDataset = (newSelectedDataset: TableContentT) => {
    selectedDataset.value = newSelectedDataset
    selectedEmbeddingModel.value = newSelectedDataset.embedding_model
    isNewDataset.value = false
}
const addNewDataset = () => {
    const newDataset = {
        name: `New Dataset ${Date.now().toString()}`
    }
    selectedDataset.value = newDataset
    selectedEmbeddingModel.value = null
    isNewDataset.value = true
    isNewDatasetCreated.value = true
}

const inputValidation = () => {
    let message = 'success'
    if (selectedDataset.value === null) {
        message = 'No Dataset Selected'
        return message
    }
    if (selectedEmbeddingModel.value === undefined || selectedEmbeddingModel.value === null) {
        message = 'No Embedding Model Selected'
        return message
    }
    if (fileList.value.length === 0) {
        message = 'No File to be Added'
        return message
    }
    return message
}
const onSave = async () => {
    let validation = inputValidation()
    if (validation !== 'success') {
        toastID.value = createToast({
            variant: 'warning',
            message: validation,
        })
        showToast.value = true
        return
    }
    preventClose.value = true
    if (isNewDataset.value) {
        const payloadDataset = [{
            name: selectedDataset.value.name,
            embedding_model: selectedEmbeddingModel.value
        }]
        selectedDataset.value.id = await addDataset(payloadDataset)
    }
    const payloadData = fileList.value.map((element) => (
        { name: element.name, path: element.path, dataset_id: selectedDataset.value.id }
    ))
    preventClose.value = false
    emit('addData', payloadData, selectedDataset.value.id)
//     await addDatasetDetail(payloadData)
//     const index = datasets.value.findIndex((item) => item.id === selectedDataset.value.id )
    
//   // If activeDatasetIndex changes, the readdatasetDetail function in the watch function of DatasetDetail.vue is called. Call the readdatasetDetail function here only if activeDatasetIndex has not changed.
//     if (index === activeDatasetIndex.value) {
//         readDatasetDetail(selectedDataset.value.id)
//     } else {
//         activateDataset(index)
//     }

//     toastID.value = createToast({
//         variant: 'success',
//         message: 'Files embedded successfuly',
//     })
//     closeDialog()
//     showToast.value = true
}
</script>