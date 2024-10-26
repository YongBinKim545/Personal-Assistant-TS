export const useBackground = createGlobalState(
  () => {
    //state
    const backgroundWorks = ref<BackgroundWorkT[]>([])
    //action
    const addBackgroundWork = (newWork: BackgroundWorkT) => {
      backgroundWorks.value.push(newWork)
    }
    const updateBackgroundWorkStatus = (id:string, newStatus:string) => {
      const backgroundWorkIndex = backgroundWorks.value.findIndex((item) => item.id === id)
      backgroundWorks.value[backgroundWorkIndex].name = newStatus
    }
    const removeBackgroundWork = (id: string) => {
      const backgroundWorkIndex = backgroundWorks.value.findIndex((item) => item.id === id)
      if (backgroundWorkIndex > -1) backgroundWorks.value.splice(backgroundWorkIndex, 1)
    }
    return {
      backgroundWorks,
      addBackgroundWork,
      updateBackgroundWorkStatus,
      removeBackgroundWork
    }
  }
)