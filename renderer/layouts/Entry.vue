<template>
    <div class="w-full h-dvh flex flex-col">
        <AppBar />
        <div
            class="flex justify-between grow bg-light-surface-lowest dark:bg-dark-surface-lowest text-light-surface-on dark:text-dark-surface-on h-[calc(100%-100px)]">
            <router-view />
        </div>
    </div>
</template>
<script setup lang="ts">
</script>