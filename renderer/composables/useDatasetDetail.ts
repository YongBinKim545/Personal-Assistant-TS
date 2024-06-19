

export const usedatasetDetail = createGlobalState(
    () => {
        //state
        const datasetDetail = ref<TableContentT[]>([])
        //actions
        const readDatasetDetail = async (dataset_id: number) => {
            // const newdatasetDetail = await window.api.readdatasetDetail(dataset_id)
            try {
                const response = await fetchData(`local-server/dataset-detail/${dataset_id}`)
                const newdatasetDetail = await response.json()
                datasetDetail.value = newdatasetDetail
                console.log('reset datasetDetail')
            } catch (error) {
                console.error('Error fetching data from /', error)
            }
        }
        const addDatasetDetail = async (payload: TableContentT[]) => {
            // await window.api.createdatasetDetail(payload)
            try {
                const response = await fetchData('local-server/dataset-detail', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: payload })
                })
                return response
            } catch (error) {
                console.error('Error fetching data from /', error)
            }
        }
        const removeData = async (id: number) => {
            let message = ''
            console.log('removeData-Not Implemented', id)
            return message
        }
        return {
            datasetDetail,
            readDatasetDetail,
            addDatasetDetail,
            removeData
        }
    }
)