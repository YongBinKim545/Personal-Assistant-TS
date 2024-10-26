<template>
    <!-- <div v-if="backgroundWorks.length > 0" class="group relative"> -->
    <div class="relative" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
        <Transition name="fade">
            <div v-show="showDetail"
                class="bg-light-surface-high dark:bg-dark-surface-high absolute h-auto w-full z-10 bottom-full p-2 rounded-md">
                <div class="bottom-0 space-y-1">
                    <div v-for="backgroundWork in backgroundWorks"
                        class="hover:bg-light-surface-highest hover:dark:bg-dark-surface-highest p-2 rounded-md">
                        <div v-if="backgroundWork.type === 'Answer'">
                            <router-link :to="backgroundWork?.link" class="flex justify-between items-center">
                                <span>{{ backgroundWork.name }}</span>
                                <div class="text-secondary">
                                    <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                                    <svg class="animate-spin size-6" width="800px" height="800px" viewBox="0 0 24 24"
                                        fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.2" fill-rule="evenodd" clip-rule="evenodd"
                                            d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                            fill="currentColor" />
                                        <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
                                            fill="currentColor" />
                                    </svg>
                                </div>
                            </router-link>
                        </div>
                        <div v-if="backgroundWork.type === 'Download'">
                            <router-link :to="backgroundWork?.link" class="flex justify-between items-center">
                                <p class="line-clamp-1">{{ `${backgroundWork.status} ${backgroundWork.name}` }}</p>
                                <div class="w-[50px] flex justify-end">
                                    <span class="text-primary">{{ backgroundWork.progress }}</span>
                                </div>
                            </router-link>
                        </div>
                        <div v-if="backgroundWork.type === 'Embedding'">
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        <div class="flex justify-between items-center p-2 rounded-md font-bold hover:cursor-pointer">
            <span class="uppercase">background works</span>

            <span class="relative flex justify-center items-center h-6 w-6">
                <div class="absolute h-6 w-6 rounded-full"
                    :class="backgroundWorks.length > 0 ? 'animate-ping bg-secondary opacity-75' : ''"></div>
                <div class="h-6 w-6 bg-secondary text-primary-on rounded-full text-center">
                    {{ backgroundWorks.length }}
                </div>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
const { backgroundWorks } = useBackground()
const showDetail = ref(false)
const mouseEnter = () => {
    if (backgroundWorks.value.length > 0) showDetail.value = true
}
const mouseLeave = () => {
    showDetail.value = false
}
</script>

<style scoped>
/* 1. declare transition */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
}
</style>