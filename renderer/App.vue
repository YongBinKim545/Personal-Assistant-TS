<template>
  <div class="w-full h-dvh flex flex-col rounded-md overflow-hidden">
    <AppBar />
    <router-view />
    <Toast />
  </div>
</template>

<script setup lang="ts">
const { getConnectionInformation, getModels, checkOllamaInstallation } = useLanguageModel()
const { readChatTitles } = useChat()
const { readActiveItems } = useActiveItems()
const { readModes } = useMode()

onMounted(async () => {
  const response = await getConnectionInformation()
  if (response.ok) {
    await Promise.all([
      checkOllamaInstallation(),
      getModels(),
      readChatTitles(),
      readActiveItems(),
      readModes()
    ])
  }
})
</script>