<template>
    <nav class="w-full flex justify-between items-center h-10 bg-primary text-primary-on rounded-t-md">
        <router-link :to="{ name: 'Index' }" class="mx-2">
            <img src="../../assets/logo.png" alt="App Logo" class="object-cover w-8 h-8">
        </router-link>
        <div class="flex grow justify-start items-center drag-region">
            <span class="font-bold">P-Assistant</span>
        </div>
        <div class="flex justify-between items-center">
            <div @click="toggleDark(false)" v-show="isDark" class="py-2 px-3 hover:cursor-pointer hover:bg-dark-surface"
                draggable="false">
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                        d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.3 5A1 1 0 0 0 5 6.2l1.4 1.5a1 1 0 0 0 1.5-1.5L6.3 5Zm12.8 1.3A1 1 0 0 0 17.7 5l-1.5 1.4a1 1 0 0 0 1.5 1.5L19 6.3ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.8 17.7a1 1 0 1 0-1.5-1.5L5 17.7A1 1 0 1 0 6.3 19l1.5-1.4Zm9.9-1.5a1 1 0 0 0-1.5 1.5l1.5 1.4a1 1 0 0 0 1.4-1.4l-1.4-1.5ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
                        clip-rule="evenodd" />
                </svg>
            </div>
            <div @click="toggleDark(true)" v-show="!isDark" class="py-2 px-3 hover:cursor-pointer hover:bg-dark-surface"
                draggable="false">
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                        d="M11.7 2a10 10 0 1 0 9.8 13.3 1 1 0 0 0-1-1.3H20a8 8 0 0 1-7.6-10.6l.1-.4a1 1 0 0 0-.8-1Z"
                        clip-rule="evenodd" />
                </svg>
            </div>
            <div @click="windowControl('min')" class="px-3 py-3 hover:cursor-pointer hover:bg-dark-surface"
                draggable="false">
                <svg class="w-4 h-4" width="35" height="3" viewBox="0 0 35 3" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <line y1="1.5" x2="35" y2="1.5" stroke="currentColor" stroke-width="3" />
                </svg>
            </div>
            <div v-show="!isMaxWindow" @click="windowControl('max')"
                class="px-3 py-3 hover:cursor-pointer hover:bg-dark-surface" draggable="false">
                <svg class="w-4 h-4" width="35" height="35" viewBox="0 0 35 35" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="1.5" width="32" height="32" stroke="currentColor" stroke-width="3" />
                </svg>
            </div>
            <div v-show="isMaxWindow" @click="windowControl('unmaximize')"
                class="px-3 py-3 hover:cursor-pointer hover:bg-dark-surface" draggable="false">
                <svg class="w-4 h-4" width="35" height="35" viewBox="0 0 35 35" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="11.5" width="22" height="22" stroke="currentColor" stroke-width="3" />
                    <path d="M8 2V11.5H23.5V23H33V2H8Z" stroke="currentColor" stroke-width="3" />
                </svg>
            </div>
            <div @click="windowControl('close')" class="px-3 py-3 hover:cursor-pointer hover:bg-warning"
                draggable="false">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="100" height="100"
                    viewBox="0 0 50 50">
                    <path
                        d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z">
                    </path>
                </svg>
            </div>
        </div>
        <!-- <Toast :isShow="showToast" :toastID="toastID" @close="closeToast" /> -->
    </nav>
</template>

<script setup lang="ts">

const isDark = useDark({
    selector: 'body'
})
const isMaxWindow = ref(false)
const toggleDark = useToggle(isDark)
const windowControl = async (action: 'min' | 'max' | 'unmaximize' | 'close') => {
    window.api.windowControl(action)
}
const handleUnmaximize = () => {
    isMaxWindow.value = false
}
const handleMaximize = () => {
    isMaxWindow.value = true
}

onMounted(async () => {
    isMaxWindow.value = await window.api.getWindowState()
    window.api.onWindowUnmaximize(handleUnmaximize)
    window.api.onWindowMaximize(handleMaximize)
})
</script>

<style scoped>
.drag-region {
    -webkit-app-region: drag;
}
</style>