<template>
    <div class="my-3 bg-transparent flex flex-col">
        <DataTable searchBar delAction
            :headers="[{ headername: 'File Name', datakey: 'name', width: '90%', align: 'start' }, { headername: 'Action', datakey: 'action', width: '10%', align: 'center' }]"
            :contents="datasets[activeDatasetIndex]?.contents ?? []" @item-selected="(id: number) => openSelectedItem(id)"
            @onDelete="deleteItem">
            <template v-slot:itemDetail>
                <div class="text-base font-bold uppercase my-2 pl-2">files</div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">

const { createToast } = useToast()
const { datasets, activeDatasetIndex, readDatasetDetail, removeDatasetDetail } = useDataset()
watch(activeDatasetIndex, (newIndex) => {
    if (newIndex === undefined) return
    if (datasets.value[newIndex]?.contents.length === 0) {
        readDatasetDetail(newIndex)
    }
})
const openSelectedItem = async (id: number) => {
    const datasetContents = datasets.value[activeDatasetIndex.value].contents
    const selectedItemIndex = datasetContents.findIndex((item) => item.id === id)
    const path = datasetContents[selectedItemIndex].path
    const response = await window.api.openFile(path)
    if (response !== 'success') {
        console.log(response)
    }
}
const deleteItem = async (id: number) => {
    console.log(datasets.value[0].contents)
    createToast({
        variant: 'success',
        message: await removeDatasetDetail(id),
    })
}
</script>