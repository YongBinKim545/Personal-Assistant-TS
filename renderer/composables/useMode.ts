export const useMode = createGlobalState(
    () => {
      //state
      const modes = ref<ModeT[]>([])
      //actions
      const readModes = async () => {
        try {
          const response = await fetchData('local-server/mode')
          const data = await response.json()
          modes.value = data
        } catch (error) {
          console.error('Error fetching data from active-item', error)
        }
      }
      const updateMode = async (newMode:ModeT) => {
        try {
          const response = await fetchData(`local-server/mode/${newMode.name}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMode),
          })
          if (response.ok) {
            // activeItems.value[itemName] = id
          } else {
            throw new Error('Fail to update Active Item from Local Server')
          }
          return new Response(null, { status: 200, statusText: 'OK' })
        } catch (error) {
          return new Response(null, { status: 500, statusText: `Error to Update Active Item: ${error}` })
        }
      }
      return {
        modes,
        readModes,
        updateMode
      }
    }
  )