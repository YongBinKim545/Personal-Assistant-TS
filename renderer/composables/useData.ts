

export const useAPIKeys = createGlobalState(
  () => {
    //state
    const apiKeys = ref<TableContentT[]>([])
    //actions
    const initAPIKeys = (newAPIKeys: TableContentT[]) => {
      apiKeys.value = newAPIKeys
    }
    return {
      apiKeys,
      initAPIKeys
    }
  }
)
