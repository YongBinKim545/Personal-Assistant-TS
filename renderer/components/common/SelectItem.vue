<template>
    <div class="relative">
        <div ref="target"></div>
        <button @click="!props.disabled ? showMenu = !showMenu : null" type="button"
            class="flex w-full rounded-md outline-none py-2 px-3 items-center"
            :class="[props.textAlign ? `justify-${props.textAlign}` : 'justify-between', props.disabled ? 'cursor-not-allowed' : '']">
            <div class="mr-3" :class="`text-${props.textSize}`">
                <span v-if="!props.selectedItem" class="text-light-surface-on-muted dark:text-dark-surface-on-muted">{{
                    props.defaultMessage
                    }}</span>
                <span v-else :class="`font-bold text-${textSize}`">{{ props.selectedItem }}</span>
            </div>
            <svg ref="btnIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1"
                stroke="currentColor" class="w-5 h-5 custom-rotate">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
        </button>
        <div v-show="props.hr">
            <hr />
        </div>
        <Transition name="fade">
            <ul v-show="showMenu"
                class="absolute top-12 overflow-auto rounded-md bg-light-surface dark:bg-dark-surface z-20 p-2 w-full"
                :class="`text-${props.textSize}`">
                <li v-if="props.addNewItemOption"
                    class="flex justify-between p-2 rounded-md font-bold hover:bg-light-surface-high hover:dark:bg-dark-surface-high hover:cursor-pointer"
                    @click="addNewItem">
                    <span>Add New</span>
                </li>
                <li v-for="(option, index) in props.options" :key="index"
                    class="flex justify-between p-2 rounded-md hover:bg-light-surface-high hover:dark:bg-dark-surface-high hover:cursor-pointer"
                    :class="props.selectedItem === option ? 'text-primary' : ''" @mousedown="(e) => e.preventDefault()"
                    @click="selectionChange(option)">
                    <span>{{ option }}</span>
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
const target = ref(null)

onClickOutside(target, () => {
    showMenu.value = false
})

const props = defineProps({
    options: {
        type: Array as PropType<string[]>,
        default: [],
        required: false
    },
    selectedItem: {
        type: String,
        default: 'Select an Item',
        required: false
    },
    addNewItemOption: {
        type: Boolean,
        default: false,
        required: false
    },
    disabled: {
        type: Boolean,
        default: false,
        required: false
    },
    defaultMessage: {
        type: String,
        default: 'Select an Item',
        required: false
    },
    textAlign: {
        type: String as PropType<'start' | 'end' | 'between'>,
        default: 'between',
        required: false
    },
    textSize: {
        type: String as PropType<'2xl' | 'xl' | 'lg' | 'base' | 'sm' | 'xs'>,
        default: 'sm',
        required: false
    },
    hr: {
        type: Boolean,
        default: false,
        required: false
    }
});



const emit = defineEmits(['selectionChanged', 'addNewItem'])
const btnIcon = ref<HTMLElement>()
const showMenu = ref(false)


watch(showMenu, () => {
    btnIcon.value.classList.toggle('down')
})

const addNewItem = () => {
    const newItem = `New Item ${Date.now().toString()}`
    emit('selectionChanged', newItem)
    showMenu.value = false
}

const selectionChange = (item: string) => {
    emit('selectionChanged', item)
    showMenu.value = false
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