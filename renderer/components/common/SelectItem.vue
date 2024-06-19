<template>
    <div class="relative">
        <label id="listbox-label" class="my-1 block font-bold">{{
            props.title }}
        </label>
        <button ref="selection" @mousedown="(e) => e.preventDefault()" @click="focused = !focused" type="button"
            class="flex w-full rounded-md bg-transparent outline-none mx-1"
            :class="props.textAlign ? `justify-${textAlign}` : 'justify-between'" aria-haspopup="listbox"
            aria-expanded="true" aria-labelledby="listbox-label">
            <div class="flex items-center mr-3">
                <span v-if="selectedItem === null">{{ props.defaultMessage }}</span>
                <span v-else>{{ selectedItem }}</span>
            </div>
            <svg ref="btnIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1"
                stroke="currentColor" class="w-5 h-5 custom-rotate">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
        </button>
        <div v-show="props.helpText" class="text-xs mt-2 text-light-surface-on-muted dark:text-dark-surface-on-muted">
            <hr class="border-light-border dark:border-dark-border mb-1" />
            <span>{{ props.helpText }}</span>
        </div>
        <Transition name="fade">
            <ul v-show="focused"
                class="absolute overflow-auto rounded-b-md bg-light-surface dark:bg-dark-surface z-20 mt-1 p-2 max-h-56 w-full text-sm">
                <slot name="addNew"></slot>
                <li v-for="(option, index) in props.options" :key="index" class="cc-list-item hover:cursor-pointer"
                    :class="selectedItem === option.name ? 'text-primary' : ''" @mousedown="(e) => e.preventDefault()"
                    @click="selectionChange(option)">
                    <!-- @mousedown ~~~ is to prevent blur event of the button tag-->
                    <span>{{ option.name }}</span>
                    <div>
                        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd"
                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </li>
            </ul>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFocus } from '@vueuse/core';

interface Props {
    title?: string,
    options?: TableContentT[],
    defaultMessage?: string,
    selectedItem: string | null,
    addNew?: boolean
    textAlign?: 'start' | 'end' | 'between'
    helpText?: string
}
const emit = defineEmits(['isFocused', 'selectionChanged', 'newItemAdded'])
const props = defineProps<Props>()
const selection = ref(null)
const btnIcon = ref(null)
const { focused } = useFocus(selection)
watch(focused, (focused) => {
    btnIcon.value.classList.toggle('down')
    emit('isFocused', focused)
})
watch(() => props.addNew, (addNew) => {
    if (addNew) {
        selection.value.blur()
        emit('newItemAdded')
    }
})
const selectionChange = (item: TableContentT) => {
    emit('selectionChanged', item)
    selection.value.blur()
}
</script>

<style scoped>
.custom-rotate {
    -moz-transition: all .2s linear;
    -webkit-transition: all .2s linear;
    transition: all .2s linear;
}

.custom-rotate.down {
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
}

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