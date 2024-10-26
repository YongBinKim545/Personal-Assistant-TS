<template>
    <div>
        <div v-show="props.title !== null" class="font-bold text-light-surface-on dark:text-dark-surface-on">{{
            props.title }}</div>
        <div @dragover.prevent.stop="dragging = true" @dragleave.prevent.stop="dragging = false" @drop.prevent="onDrop"
            class="flex items-center justify-center w-full text-sm">
            <label for="file-uploader"
                class="w-full cursor-pointer border-2 border-dashed rounded-md"
                :class="dragging ? 'border-primary bg-light-surface-highest dark:bg-dark-surface-highest': ''">
                <div class="p-5 h-[120px] flex justify-center items-center text-md" id="drop_zone">
                    <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2" />
                    </svg>
                    <span>&nbsp Drag & Drop or Click Here</span>
                </div>
                <input id="file-uploader" type="file" class="hidden" @change="onChange" />
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title?: string
}
const props = defineProps<Props>()
const emit = defineEmits(['change'])
const dragging = ref(false)
const onDrop = async(e: DragEvent) => {
    const files = e.dataTransfer.files
    emit('change', files)
    dragging.value = false
}
const onChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    emit('change', files)
}
</script>

<style scoped></style>