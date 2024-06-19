<template>
    <div class="grow p-3 bg-transparent flex flex-col">

        <!-- <div class="flex justify-start mb-2 ml-3">
            <span class="mr-2">Active Dataset :</span>
            <span class="text-primary font-bold line-clamp-1">{{ datasets[activeDatasetIndex]?.name || 'None'
                }}</span>
        </div> -->
        <DataTable searchBar delAction editAction
            :headers="[{ headername: 'Datasets', datakey: 'name' }, { headername: 'Action', datakey: 'action' }]"
            :contents="datasets" :activeItemId="activeItemId" @item-selected="(id: number) => changeActiveItem(id)"
            @onDelete="deleteItem" @onEdit="editItem">
            <template v-slot:itemDetail>
                <div class="text-base font-bold uppercase my-2 pl-2">Datasets</div>
            </template>
        </DataTable>
        <Modal :isShow="showModal" title="edit dataset name" @close="closeDialog">
            <template v-slot:body>
                <div class="flex space-x-2 items-center">
                    <input v-model="newDatasetName" type="text"
                        class="w-[300px] text-sm py-2 px-4 rounded-md bg-transparent border border-light-border dark:border-dark-border focus:border-none focus:outline-none focus:ring-2 focus:ring-primary">
                    <button class="cc-btn border border-primary flex justify-center w-[80px]" @click="onSave">
                        SAVE
                    </button>
                </div>
                <!-- <Alert :isShow="showAlert" alertMessage="Invalid API KEY!!" @close="showAlert = false" class="mt-3" /> -->
            </template>
        </Modal>
        <Toast :isShow="showToast" :toastID="toastID" @close="showToast = false" />
    </div>
</template>

<script setup lang="ts">

const { datasets, activeDatasetIndex, updateDataset, removeDataset, activateDataset } = useDatasets()
const { createToast } = useToast()
const showModal = ref(false)
const showToast = ref(false)
const newDatasetName = ref(null)
const toastID = ref('')
const indexToEdit = ref(0)

const activeItemId = computed(() => {
    return datasets.value[activeDatasetIndex.value]?.id || 0
})
const changeActiveItem = async (id: number) => {
    const index = datasets.value.findIndex((item) => item.id === id)
    if (index === activeDatasetIndex.value) return
    activateDataset(index)
}
const closeDialog = () => {
    showModal.value = false
}
const uniqueValidation = () => {
    const isDuplicate = datasets.value.some((item) => item.name === newDatasetName.value)
    return isDuplicate ? 'Dataset name already exists' : 'success'
}

const editItem = async (id: number) => {
    const itemIndex = datasets.value.findIndex((item) => item.id === id)
    indexToEdit.value = itemIndex
    showModal.value = true
    newDatasetName.value = datasets.value[itemIndex].name
}

const deleteItem = async (id: number) => {
    toastID.value = createToast({
        variant: 'success',
        message: await removeDataset(id),
    })
    showToast.value = true
}
const onSave = async () => {
    if (newDatasetName.value === undefined || newDatasetName.value === null || newDatasetName.value === '') {
        toastID.value = createToast({
            variant: 'warning',
            message: 'No Dataset Name',
        })
        showToast.value = true
        return
    }
    const validationMessage = uniqueValidation()
    if (validationMessage !== 'success') {
        toastID.value = createToast({
            variant: 'warning',
            message: validationMessage,
        })
        showToast.value = true
        return
    }
    const payload = {
        id: datasets.value[indexToEdit.value].id,
        name: newDatasetName.value
    }
    const response = await updateDataset(payload)
    if (response.ok) {
        datasets.value[indexToEdit.value].name = payload.name
        toastID.value = createToast({
            variant: 'success',
            message: 'Dataset Name Updated Successfully',
        })
        closeDialog()
        showToast.value = true
    }
}
</script>