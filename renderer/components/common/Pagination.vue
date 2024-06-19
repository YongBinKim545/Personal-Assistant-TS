<template>
    <div class="flex items-center gap-8">
        <button
            class="p-1 rounded-full hover:bg-primary hover:text-primary-on disabled:pointer-events-none disabled:text-light-surface-on-muted dark:disabled:text-dark-surface-on-muted"
            :disabled="props.currentPage === 1" @click="emit('movePrevious')" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </button>
        <p>
            <strong>{{ props.currentPage }}</strong> &nbsp of &nbsp
            <strong>{{ props.totalPage }}</strong>
        </p>
        <button
            class="p-1 rounded-full hover:bg-primary hover:text-primary-on disabled:pointer-events-none disabled:text-light-surface-on-muted dark:disabled:text-dark-surface-on-muted"
            :disabled="props.currentPage === props.totalPage" @click="emit('moveNext')" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    currentPage: number,
    totalPage: number
}>()
const emit = defineEmits(['movePrevious', 'moveNext'])
</script>