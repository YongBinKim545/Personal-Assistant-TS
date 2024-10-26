<template>
    <div class="my-3 bg-transparent flex flex-col">
        <DataTable searchBar delAction editAction
            :headers="[{ headername: 'Dataset Name', datakey: 'name', width:'50%', align:'start' }, { headername: 'Embedding', datakey: 'embedding_model', width:'40%', align:'center' }, { headername: 'Action', datakey: 'action', width:'10%',align:'center' }]"
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
                        class="w-[300px] text-sm py-2 px-4 rounded-md bg-transparent border focus:border-none focus:outline-none focus:ring-2 focus:ring-primary">
                    <button
                        class="p-2 text-sm rounded-md font-bold bg-primary text-primary-on cursor-pointer hover:bg-primary-darken border border-primary w-[80px]"
                        @click="onSave">
                        SAVE
                    </button>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">

const { activeDatasetIndex, datasets, readDatasets, updateDataset, removeDataset } = useDataset()
const { createToast} = useToast()
const showModal = ref(false)
const newDatasetName = ref<string>()
const indexToEdit = ref(0)

const activeItemId = computed(() => {
    return datasets.value[activeDatasetIndex.value]?.id || 0
})
const changeActiveItem = async (id: number) => {
    const index = datasets.value.findIndex((item) => item.id === id)
    activeDatasetIndex.value = index
    // activateDataset(index)
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
    createToast({
        variant: 'success',
        message: await removeDataset(id),
    })
}
const onSave = async () => {
    if (newDatasetName.value === undefined || newDatasetName.value === null || newDatasetName.value === '') {
        createToast({
            variant: 'error',
            message: 'No Dataset Name',
        })
        return
    }
    const validationMessage = uniqueValidation()
    if (validationMessage !== 'success') {
        createToast({
            variant: 'error',
            message: validationMessage,
        })
        return
    }
    const payload = {
        id: datasets.value[indexToEdit.value].id,
        name: newDatasetName.value
    }
    const response = await updateDataset(payload)
    if (response.ok) {
        datasets.value[indexToEdit.value].name = payload.name
        createToast({
            variant: 'success',
            message: 'Dataset Name Updated Successfully',
        })
        closeDialog()
    }
}
onMounted(async ()=>{
    if (datasets.value.length === 0) {
        await readDatasets()
    }
})
</script>