<template>
    <div class="flex flex-col mx-10 w-full items-center space-y-10">
        <div class="relative flex space-x-3 p-2 mt-5 w-full max-w-[1200px] border-b">
            <router-link v-for="(menuItem, index) in menuItems" :key="index" :to="{ name: menuItem.component }"
                class="flex items-center cc-default-tab-button w-[150px] h-12 p-0"
                exactActiveClass="cc-active-tab-button p-0">
                <div ref="routerLinks" class="uppercase w-full text-center">{{ menuItem.content }}</div>
            </router-link>
        </div>
        <div class="w-full h-full max-w-[1200px]">
            <router-view v-slot="{ Component }">
                <transition name="slide-left" mode="out-in">
                    <component :is="Component" :key="$route.fullPath" class="w-full h-[600px] px-3" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<script setup lang="ts">

const menuItems = [
    { component: "Setting", content: "Configuration" },
    { component: "ModelConnection", content: "Connection" },
    { component: "PresetModels", content: "Preset Models" },
    { component: "OllamaModels", content: "Ollama Models" },
    { component: "ModelList", content: "Model List" },
]
</script>
<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.3s ease-out, opacity 0.1s ease-out;
}

.slide-left-enter-from {
    transform: translateX(-50px);
    opacity: 0;
}

.slide-left-leave-to {
    transform: translateX(200px);
    opacity: 0;
}
</style>