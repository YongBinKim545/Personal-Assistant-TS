export const useActiveItems = createGlobalState(
  () => {
    //state
    const activeItems = ref<ActiveItemT>({})
    //actions
    const readActiveItems = async () => {
      try {
        const response = await fetchData('local-server/active-item')
        const data = await response.json()
        data.forEach((item: ActiveItemT) => {
          activeItems.value[item.name] = item.active_item_id
        })
      } catch (error) {
        console.error('Error fetching data from active-item', error)
      }
    }
    const updateActiveItem = async (itemName: string, id:number) => {
      try {
        const response = await fetchData(`local-server/active-item/${itemName}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active_item_id: id }),
        })
        if (response.ok) {
          activeItems.value[itemName] = id
        } else {
          throw new Error('Fail to update Active Item from Local Server')
        }
        return new Response(null, { status: 200, statusText: 'OK' })
      } catch (error) {
        return new Response(null, { status: 500, statusText: `Error to Update Active Item: ${error}` })
      }
    }
    return {
      activeItems,
      readActiveItems,
      updateActiveItem
    }
  }
)
