export const useDataset = createGlobalState(
  () => {
    //state
    const datasets = ref<DatasetT[]>([])
    const activeDatasetIndex = ref<number>(0)
    //actions

    const readDatasets = async () => {
      try {
        const response = await fetchData('local-server/dataset')
        datasets.value = await response.json()
        if (datasets.value.length > 0) {
          datasets.value.forEach(dataset => {
            dataset.contents = []
          })
          activeDatasetIndex.value = 0
        }

      } catch (error) {
        console.error('Error fetching data from dataset', error)
      }
    }
    const addDataset = async (payload: DatasetT[]): Promise<{ id: number, index: number }> => {
      try {
        const response = await fetchData('local-server/dataset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: payload })
        })
        if (response.ok) {
          const datasetId = await response.json()
          const newDataset = Object.assign({ id: datasetId.id, contents: [] }, payload[0])
          datasets.value.push(newDataset)
          return { id: datasetId.id, index: datasets.value.length - 1 }
        } else {
          console.error('Error addting data:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching data from /', error)
      }
    }
    const updateDataset = async (payload: DatasetT) => {
      const newData = { name: payload.name }
      const response = await fetchData(`local-server/dataset/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      })
      return response
    }
    const removeDataset = async (id: number) => {
      let message = ''
      const response = await fetchData(`local-server/dataset/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        const datasetLength = datasets.value.length
        const currentActiveIndex = activeDatasetIndex.value
        const indexToDelete = datasets.value.findIndex((item) => item.id === id)
        message = `Dataset [${datasets.value[indexToDelete].name}] deleted`
        datasets.value.splice(indexToDelete, 1)

        if (datasetLength < 3) {
          activeDatasetIndex.value = 0
        } else if (currentActiveIndex > indexToDelete) {
          activeDatasetIndex.value -= 1
        }
      }
      return message
    }
    const readDatasetDetail = async (datasetIndex: number) => {
      try {
        const datasetId = datasets.value[datasetIndex].id
        const response = await fetchData(`local-server/dataset-detail/${datasetId}`)
        const newdatasetDetail = await response.json()
        datasets.value[datasetIndex].contents = newdatasetDetail
        console.log('reset datasetDetail')
      } catch (error) {
        console.error('Error fetching data from /', error)
      }
    }
    const addDatasetDetail = async (payload: FileItemT[]) => {
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
    const removeDatasetDetail = async (id: number) => {
      let message = ''
      console.log('removeData-Not Implemented', id)
      return message
    }

    return {
      datasets,
      activeDatasetIndex,
      readDatasets,
      addDataset,
      updateDataset,
      removeDataset,
      readDatasetDetail,
      addDatasetDetail,
      removeDatasetDetail
    }
  }
)