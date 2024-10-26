export const useFileUploader = createGlobalState(() => {
  const fileList = ref<FileItemT[]>([])

  const addFiles = async (files: FileList) => {
    if (!files) return
    const selectedFiles = Array.from(files)
    try {
      const fileItems = await window.api.getFileInformation(selectedFiles)
      fileList.value.push(...fileItems)
    } catch (error) {
      console.error('Error reading files:', error)
    }
  }

  const removeFile = (index: number) => {
    if (index >= 0 && index < fileList.value.length) {
      fileList.value.splice(index, 1)
    } else {
      console.error('Invalid index:', index)
    }
  }
  return {
    fileList,
    addFiles,
    removeFile
  }
})