<template>
    <div class="w-full px-5 py-2">
        <router-view v-slot="{ Component }">
            <transition mode="out-in" name="fade">
                <!-- props activeChatTitmeIndex is to update component via route changing, transition between ChatContents will be fired -->
                <component :is="Component" :key="$route.fullPath" />
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

/* .slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.3s ease-out, opacity 0.1s ease-out;
}

.slide-left-enter-from {
    transform: translateX(-30%);
    opacity: 0;
}

.slide-left-leave-to {
    transform: translateX(30%);
    opacity: 0;
} */
</style>