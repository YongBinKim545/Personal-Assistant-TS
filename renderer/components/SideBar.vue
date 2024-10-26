<template>
  <div class="relative text-sm bg-light-surface dark:bg-dark-surface">
    <div class="flex flex-col space-y-2 h-[calc(100%-130px)] w-[350px]">
      <MenuItems class="border-b" />
      <CreateNewChat class="mx-4" />
      <ChatHistory class="mx-2 px-2 py-4" />
      <BackgroundWorks class="mx-4" />
      <SystemInformation class="absolute bottom-0 w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>