<template>
    <div class="relative grow px-5 py-2">
        <div class="flex justify-between mx-3 my-4">
            <AddLocalDocuments :isShow="showAddDocument" @openAddDocument="showAddDocument = true"
                @closeAddDocument="showAddDocument = false" @addData="onAdd" />
            <AddWebDocuments />
        </div>
        <div class="absolute bottom-2 left-0 right-0 top-20 flex justify-between m-auto max-w-[900px] max-h-[700px]">
            <Datasets />
            <DatasetDetail />
        </div>
    </div>
</template>

<script setup lang="ts">
const { addDatasetDetail, readDatasetDetail } = usedatasetDetail()
const { datasets, activeDatasetIndex, activateDataset } = useDatasets()
const { createToast } = useToast()
const toastID = ref(null)
const showToast = ref(false)
const showAddDocument = ref(false)
const onAdd = async (payload: TableContentT[], id: number) => {
    const embeddingResult = window.api.embedDocument(payload)
    console.log(embeddingResult)
    const response = await addDatasetDetail(payload)
    const index = datasets.value.findIndex((item) => item.id === id)

    // If activeDatasetIndex changes, the readdatasetDetail function in the watch function of DatasetDetail.vue is called. Call the readdatasetDetail function here only if activeDatasetIndex has not changed.
    if (index === activeDatasetIndex.value) {
        readDatasetDetail(id)
    } else {
        activateDataset(index)
    }
    toastID.value = createToast({
        variant: 'success',
        message: 'Files embedded successfuly',
    })
    showToast.value = true
    showAddDocument.value = false
}
</script>