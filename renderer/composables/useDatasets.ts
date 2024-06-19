
export const useDatasets = createGlobalState(
    () => {
        //state
        const datasets = ref<TableContentT[]>([])
        const activeDatasetIndex = ref<number>(null)
        const getNewActiveDatasetIndex = (index: number) => {
            if (activeDatasetIndex.value === null || activeDatasetIndex.value === undefined) return -1
            if (datasets.value.length === 1) return null
            if (activeDatasetIndex.value < index) return activeDatasetIndex.value
            if (index === 0) {
                return 0
            } else {
                return index - 1
            }
        }
        //actions
        const initDatasets = (newDatasets: TableContentT[]) => {
            datasets.value = newDatasets
        }
        const initActiveDatasetIndex = (id: number) => {
            if (datasets.value.length > 0) {
                const activeIndex = datasets.value.findIndex((item) => item.id === id);
                if (activeIndex >= 0) {
                    activeDatasetIndex.value = activeIndex
                } else {
                    activateDataset(0)
                }
            }
        }
        const addDataset = async (payload: TableContentT[]) => {
            try {
                const response = await fetchData('local-server/dataset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: payload })
                })
                if (response.ok) {
                    const datasetId = await response.json()
                    const newDataset = Object.assign({ id: datasetId.id }, payload[0])
                    datasets.value.push(newDataset)
                    return datasetId.id
                } else {
                    console.error('Error addting data:', response.statusText)
                }
            } catch (error) {
                console.error('Error fetching data from /', error)
            }
        }
        const updateDataset = async (payload: TableContentT) => {
            const newData = { name: payload.name }
            const response = await fetchData(`local-server/dataset/${payload.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData),
            })
            return response
        }

        // const updateDataset = async (indexToEdit: number, payload: DatasetT) => {
        //     const payloadAPI = { id: payload.id, data: { name: payload.name } }
        //     const response = await window.api.updateDataset(payloadAPI)
        //     if (response) datasets.value[indexToEdit].name = payload.name
        // }
        const removeDataset = async (id: number) => {
            let message = ''
            const response = await fetchData(`local-server/dataset/${id}`, {
                method: 'DELETE',
            })
            // const response = await window.api.deleteDataset(id)
            if (response.ok) {
                const index = datasets.value.findIndex((item) => item.id === id)
                const newActiveDatasetIndex = getNewActiveDatasetIndex(index)
                message = `Dataset [${datasets.value[index].name}] deleted`
                datasets.value.splice(index, 1)
                if (newActiveDatasetIndex !== -1) {
                    activateDataset(newActiveDatasetIndex)
                }
            }
            return message
        }
        const activateDataset = async (index: number | null) => {
            if (index === null) {
                activeDatasetIndex.value = null
                return
            }
            const payload = {
                dataset_id: datasets.value[index].id
            }
            const response = await fetchData(`local-server/dataset/active-dataset/1`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            // const response = await window.api.updateActiveItemId(payload)
            if (response) activeDatasetIndex.value = index
        }

        return {
            datasets,
            activeDatasetIndex,
            initDatasets,
            initActiveDatasetIndex,
            addDataset,
            updateDataset,
            removeDataset,
            activateDataset,
        }
    }
)