<template>
    <div class="grow p-3 bg-transparent flex flex-col">
        <!-- <div class="font-bold uppercase border-l-4 border-primary my-2 pl-2">dataset details</div>
        <div class="flex justify-start mb-2 ml-3">
            <span class="mr-2">Embedding Model :</span>
            <span class="text-primary font-bold line-clamp-1 uppercase">{{
                datasets[activeDatasetIndex]?.embedding_model || 'None' }}
            </span>
        </div> -->
        <DataTable searchBar delAction editAction
            :headers="[{ headername: 'FileName', datakey: 'name' }, { headername: 'Action', datakey: 'action' }]"
            :contents="datasetDetail" @item-selected="(id: number) => openSelectedItem(id)" @onDelete="deleteItem">
            <template v-slot:itemDetail>
                <div class="text-base font-bold uppercase my-2 pl-2">dataset details</div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">

const { createToast } = useToast()
const { datasetDetail, readDatasetDetail, removeData } = usedatasetDetail()
const { datasets, activeDatasetIndex } = useDatasets()
const toastID = ref('')
const showToast = ref(false)
watch(activeDatasetIndex, (newIndex) => {
    if (newIndex === null) {
        datasetDetail.value = []
    } else {
        readDatasetDetail(datasets.value[newIndex].id)
    }
})
const openSelectedItem = async (id: number) => {
    const selectedItemIndex = datasetDetail.value.findIndex((item) => item.id === id)
    const path = datasetDetail.value[selectedItemIndex].path
    const response = await window.api.openFile(path)
    if (response !== 'success') {
        console.log(response)
    }
}
const deleteItem = async (id:number) => {
    toastID.value = createToast({
        variant: 'success',
        message: await removeData(id),
    })
    showToast.value = true
}
</script>