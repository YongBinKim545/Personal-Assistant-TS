<template>
  <div class="w-full h-dvh flex flex-col">
    <AppBar />
    <div
      class="flex justify-between grow bg-light-surface-lowest dark:bg-dark-surface-lowest text-light-surface-on dark:text-dark-surface-on h-[calc(100%-100px)]">
      <SideBar />
      <router-view v-slot="{ Component }">
        <transition mode="out-in" name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
const { initDatasets, initActiveDatasetIndex } = useDatasets()

onMounted(() => {
  (async () => {
    try {
      const response = await fetchData('local-server')
      const data = await response.json()
      await Promise.all([
        initDatasets(data.datasets),
        // initAPIKeys(data.api_keys),
        initActiveDatasetIndex(data.active_item[0].dataset_id)
      ])
    } catch (error) {
      console.error('Error fetching data from /', error)
    }
  })();
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>