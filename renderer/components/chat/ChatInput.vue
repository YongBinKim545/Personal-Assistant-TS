<template>
    <div class="flex justify-between items-center p-2 my-2 bg-light-surface-high dark:bg-dark-surface-high w-full"
        :class="[focused ? 'outline-none ring-2 ring-primary' : '', isMultiLine ? 'rounded-lg' : 'rounded-full']">
        <textarea ref="textarea"
            class="bg-transparent resize-none text-sm px-3 py-2 w-11/12 max-h-[330px] placeholder-light-surface-on dark:placeholder-dark-surface-on focus:outline-none"
            v-model="input" :placeholder="inputDisabled ? 'Generating Answer' : 'Ask Anything...'"
            :disabled="inputDisabled"></textarea>
        <button v-if="!inputDisabled" @click="submit()"
            class="relative flex items-center justify-center w-8 h-8 mr-1 disabled:pointer-events-none"
            :class="[input?.length > 0 ? 'cursor-pointer bg-primary text-primary-on hover:bg-primary-darken' : 'cursor-default', isMultiLine ? 'rounded-md' : 'rounded-full']"
            :disabled="input?.length === 0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
        </button>
        <button v-else @click="stop()"
            class="relative flex items-center justify-center w-20 h-8 mr-1 cursor-pointer bg-warning text-primary-on rounded-full border-2 border-warning p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                <path fill-rule="evenodd"
                    d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z"
                    clip-rule="evenodd" />
            </svg>
            <span class="font-bold uppercase text-xs">stop</span>
        </button>
    </div>
</template>

<script setup lang="ts">
const { textarea, input } = useTextareaAutosize()
const { focused } = useFocus(textarea)
const { height } = useElementSize(textarea)
const isMultiLine = ref(false)
const emit = defineEmits(['submit', 'stop'])
defineProps({
    inputDisabled: {
        type: Boolean,
        default: false
    }
})

let initialInputContainerHeight = 20000

watch(height, (newHeight) => {
    if (newHeight === 0) return
    initialInputContainerHeight = Math.min(initialInputContainerHeight, newHeight)
    if (initialInputContainerHeight < newHeight) {
        isMultiLine.value = true
    } else {
        isMultiLine.value = false
    }
})
const submit = () => {
    if (input.value?.length === 0 || input.value === undefined) return
    const userMessage = input.value
    emit('submit', userMessage)
    input.value = ''
}
const stop = () => {
    emit('stop')
}
</script>

<style scoped>
textarea {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

textarea::-webkit-scrollbar {
    display: none;
}
</style>