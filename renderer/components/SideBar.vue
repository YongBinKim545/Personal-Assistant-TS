<template>
  <div class="w-[350px] relative text-sm bg-light-surface dark:bg-dark-surface">
    <div class="flex flex-col space-y-2 h-[calc(100%-130px)]">
      <MenuItems />
      <hr class="mx-2 px-2 border-light-border dark:border-dark-border" />
      <CreateNewChat class="mx-4" />
      <ChatHistory class="mx-2 px-2 py-4" />
      <BackgroundWorks class="mx-4" />
      <SystemInformation class="absolute bottom-0 w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { readChatTitles } = useChat()
const activeComponent = ref<string>('CreateNewChat')
activeComponent.value = 'CreateNewChat'
onMounted(() => {
  (async () => {
    try {
      await readChatTitles()
    } catch (error) {
      console.error('Error fetching data from /', error)
    }
  })();
})


</script>