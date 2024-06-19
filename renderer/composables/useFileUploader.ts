const readFile = async (file: File) => {
    const reader = new FileReader();
    const result = await new Promise<FileItemT>((resolve, reject) => {
      reader.readAsDataURL(file);
      reader.onload = () => resolve({
        name: file.name,
        path: file.path,
      });
      reader.onerror = reject;
    });
    return result;
  }
  
  
  export const useFileUploader = createGlobalState(() => {
    const fileList = ref<FileItemT[]>([])
  
    const addFiles = async (files: File[] | null) => {
      const selectedFiles = Array.from(files)
      try {
        await Promise.all(selectedFiles.map(async (file: File) => {
          const fileItem = await readFile(file)
          fileList.value.push(fileItem)
        }))
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