<template>
  <div
    class="flex justify-between grow bg-light-surface-lowest dark:bg-dark-surface-lowest text-light-surface-on dark:text-dark-surface-on h-[calc(100%-100px)] rounded-b-md overflow-hidden">
    <SideBar />
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="fade" appear>
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.fade-enter-active {
  transition: all 0.5s ease;
}

.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>