<template>
    <div class="relative">
        <input :type="props.type" :value="props.modelValue" @input="inputChange" id="placeHolder"
            class="rounded-t-md border-b py-2 px-3 bg-light-surface-high dark:bg-dark-surface-high focus:outline-none focus:border-primary focus:border-b-2 transition-colors peer"
            autocomplete="off" placeholder=" " />
        <label for="placeHolder"
            class="absolute left-2 top-2 cursor-text transition-all peer-focus:text-xs peer-focus:-top-5 peer-focus:text-primary peer-focus:font-bold peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:font-bold">
            {{props.placeHolder}}
        </label>
    </div>
</template>

<script setup lang="ts">
interface Props {
    type?: string,
    placeHolder?:string,
    modelValue: string | number,
}
const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    placeHolder:'PlaceHolder',
    modelValue: ''
})
const emit = defineEmits(['update:modelValue'])
const inputChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}
</script>