<template>
    <div class="relative">
        <div class="font-bold sticky top-0">
            <span>{{ props.title }}</span>
            <hr class="border-light-border dark:border-dark-border my-3"/>
        </div>
        <TransitionGroup name="fade" tag="ul">
            <li v-for="(list, index) in props.fileList" :key="list.path" class="cc-list-item">
                <p class="line-clamp-1">{{ list.name }}</p>
                <button type="button" @click="onDelete(index)"
                    class="hover:bg-primary hover:text-dark-surface-on font-sm rounded-full p-1 text-center">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                    </svg>
                </button>
            </li>
        </TransitionGroup>
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['onDelete'])
interface Props {
    fileList: FileItemT[] | null,
    title: string | null
}
const props = withDefaults(defineProps<Props>(), {
    fileList: null,
    title: 'title'
});
const onDelete = (index: number) => {
    emit('onDelete', index)
}
</script>

<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scaleY(0.2) translate(30px, 30px);
}

.fade-leave-active {
    position: absolute;
}
</style>