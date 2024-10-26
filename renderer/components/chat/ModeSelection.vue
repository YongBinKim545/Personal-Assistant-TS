<template>
    <div class="relative mt-5">
        <div class="flex flex-col items-end cursor-pointer" @click="emit('toggleMenu')">
            <div class="text-sm font-bold mb-1 mr-1">Mode</div>
            <div class="cc-badge-secondary min-w-[200px]">
                <div class="flex flex-col items-start space-y-2">
                    <div class="font-bold">{{ activeMode?.name }}</div>
                    <p class="line-clamp-2 normal-case text-justify h-9 py-1">{{ activeMode?.description }}</p>
                </div>
            </div>
        </div>
        <Transition name="fade">
            <div v-show="showMenu"
                class="absolute top-28 right-0 max-h-[650px] overflow-auto rounded-md bg-light-surface dark:bg-dark-surface z-20 w-[500px]">
                <div class="m-3">
                    <div v-for="mode in modes" @click="changeMode(mode.id)"
                        class="p-3 m-2 cursor-pointer hover:bg-light-surface-highest hover:dark:bg-dark-surface-high rounded-md">
                        <div class="flex space-x-2" :class="mode.id === activeItems.mode ? 'text-primary' : ''">
                            <component :is="iconComponents[mode.name as keyof typeof iconComponents]" />
                            <span class="font-bold">{{ mode.name }}</span>
                        </div>
                        <div class="mt-2">
                            <p class="text-sm italic text-justify">{{ mode.description }}</p>
                        </div>
                    </div>
                </div>
                <div
                    class="sticky bottom-0 h-16 border-t w-full bg-light-surface dark:bg-dark-surface z-30 flex justify-end p-3">
                    <button @click="emit('toggleMenu')" class="cc-negative-button">
                        <span class="uppercase">close</span>
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
const { modes } = useMode()
const { activeItems, updateActiveItem } = useActiveItems()

defineProps({
    showMenu: {
        type: Boolean,
        default: false
    }
})

const iconComponents = {
    'Chat(Basic)': defineAsyncComponent(() => import('@/components/icons/ChatIcon.vue')),
    'Chat(Web-Enhanced)': defineAsyncComponent(() => import('@/components/icons/WebIcon.vue')),
    'Chat(Advanced)': defineAsyncComponent(() => import('@/components/icons/PencilIcon.vue')),
    'Q&A(Basic)': defineAsyncComponent(() => import('@/components/icons/KnowledgeIcon.vue')),
    'Q&A(Advanced)': defineAsyncComponent(() => import('@/components/icons/SummarizationIcon.vue')),
}

const emit = defineEmits(['toggleMenu'])

const activeMode = computed(() => {
    const activeModeId = activeItems.value.mode
    return modes.value.find((item) => item.id === activeModeId)
})

const changeMode = async (id: number) => {
    const response = await updateActiveItem('mode', id)
    if (response.ok) {
        emit('toggleMenu')
    } else {
        console.log(response.statusText)
    }
}

</script>

<style scoped>
/* 1. declare transition */
.fade-enter-active {
    transition: all 0.3s ease-out;
}

.fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translate(-30px, 0);
}
</style>