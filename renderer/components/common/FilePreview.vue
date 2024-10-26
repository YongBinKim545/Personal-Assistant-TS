<template>
    <div class="relative">
        <div v-if="props.title" class="font-bold sticky top-0">
            <span>{{ props.title }}</span>
            <hr class="my-3" />
        </div>
        <div v-if="props.fileList.length === 0" class="flex items-center justify-center h-[200px]">
            <span class="text-lg font-bold">No Data</span>
        </div>
        <!-- <TransitionGroup v-else name="list"> -->
            <li v-for="(list, index) in props.fileList" :key="index"
                class="flex justify-between text-sm p-2 rounded-md font-bold hover:bg-light-surface-high hover:dark:bg-dark-surface-high hover:cursor-pointer">
                <p class="line-clamp-1">{{ list.name }}</p>
                <button v-if="props.action" type="button" @click="onDelete(index)"
                    class="hover:bg-primary hover:text-dark-surface-on font-sm rounded-full p-1 text-center">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                    </svg>
                </button>
            </li>
        <!-- </TransitionGroup> -->
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['onDelete'])
interface Props {
    fileList: FileItemT[],
    title?: string,
    action?:boolean
}
const props = defineProps<Props>()
const onDelete = (index: number) => {
    emit('onDelete', index)
}
</script>

<style scoped>
/* .list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.list-enter, .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.list-leave-active {
    position: absolute;
} */
</style>