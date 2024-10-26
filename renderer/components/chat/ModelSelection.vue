<template>
    <div class="relative mt-5">
        <div class="flex flex-col items-start cursor-pointer" @click="emit('toggleMenu')">
            <div class="text-sm font-bold mb-1 ml-1">Model</div>
            <div class="cc-badge-primary min-w-[200px]">
                <div class="flex flex-col items-start space-y-2">
                    <div class="font-bold">{{ activeModel?.provider }}</div>
                    <p class="line-clamp-1 normal-case h-9 py-1">{{ activeModel?.name }}</p>
                </div>
            </div>
        </div>
        <Transition name="fade">
            <div ref="container" v-show="showMenu" @scroll="setScrollPercentage"
                class="container absolute top-28 max-h-[550px] overflow-auto rounded-md bg-light-surface dark:bg-dark-surface z-20 w-[350px] text-sm">
                <div class="sticky top-0 w-full h-5 bg-light-surface dark:bg-dark-surface z-30">
                    <div ref="scrollIndicator" class="scroll-indicator bg-secondary w-full"></div>
                </div>
                <DataTable searchBar :showHeader="false" class="m-3" :activeItemId="activeItems.model"
                    @itemSelected="changeModel"
                    :headers="[{ headername: 'Provider', datakey: 'provider', width: '40%', align: 'end' }, { headername: 'Model', datakey: 'name', width: '50%', align: 'start' }]"
                    :contents="models.filter(item => item.task === 'Text Generation')">
                </DataTable>
                <div
                    class="sticky bottom-0 h-16 w-full bg-light-surface-low dark:bg-dark-surface border-t z-30 p-3 flex justify-between">
                    <button @click="scrollTop" class="cc-positive-button">
                        <span class="uppercase">Go To Top</span>
                    </button>
                    <button @click="emit('toggleMenu')" class="cc-negative-button">
                        <span class="uppercase">close</span>
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
const { models } = useLanguageModel()
const { activeItems, updateActiveItem } = useActiveItems()
const container = ref<HTMLElement | null>(null)
const scrollIndicator = ref<HTMLElement | null>(null)

defineProps({
    showMenu: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['toggleMenu'])

const scrollTop = () => {
    container.value?.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

const activeModel = computed(() => {
    const activeModelId = activeItems.value.model
    return models.value.find((item) => item.id === activeModelId)
})

const changeModel = async (id: number) => {
    const response = await updateActiveItem('model', id)
    if (response.ok) {
        emit('toggleMenu')
    } else {
        console.log(response.statusText)
    }
}

const setScrollPercentage = () => {
    const scrollTop = container.value.scrollTop;
    const scrollHeight = container.value.scrollHeight;
    const clientHeight = container.value.clientHeight;
    const scrollPosition = Math.min(1, (scrollTop / (scrollHeight - clientHeight)))
    if (scrollIndicator.value) {
        scrollIndicator.value.style.transform = `scaleX(${scrollPosition})`
    }
}

</script>

<style scoped>
.scroll-indicator {
    height: 3px;
    width: 100%;
    margin: 0;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform .5s linear;
}

.container::-webkit-scrollbar {
    display: none;
}

.container {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

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