<template>
    <div>
        <div class="flex justify-between items-center mb-2">
            <div>
                <slot name="itemDetail"></slot>
            </div>
            <div class="relative" v-if="props.searchBar">
                <input type="text" :value="searchKeyword" @input="changeKeyword"
                    class="text-sm py-1 px-4 rounded-full bg-light-surface-highest dark:bg-dark-surface-highest placeholder-light-surface-on dark:placeholder-dark-surface-on focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="SEARCH">
                <div class="absolute inset-y-0 right-2 flex items-center">
                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd"></path>
                    </svg>
                </div>
            </div>
        </div>
        <!-- <div class="flex-grow min-h-32 "
            :class="isTransitioning ? 'overflow-hidden' : 'overflow-x-hidden overflow-y-auto'"> -->
        <div class="flex-grow min-h-32 overflow-x-hidden overflow-y-auto">
            <table class="relative w-full">
                <thead v-show="props.showHeader">
                    <tr class="bg-light-surface-high dark:bg-dark-surface-high sticky top-0">
                        <th v-for="(header, index) in props.headers" :key="header.headername" class="p-2"
                            :class="`w-[calc(${header.width})]`">
                            {{ header.headername }}
                        </th>
                    </tr>
                </thead>
                <tbody class="h-2"></tbody>
                <tbody class="divide-y" v-if="props.contents?.length > 0">
                    <!-- <TransitionGroup name="list" @before-enter="beforeEnter" @after-enter="afterEnter"> -->
                    <tr v-for="(content, index) in filteredItems" :key="content.id" :data-index="index"
                        class="border-hidden bg-transparent h-12 hover:bg-light-surface-high hover:dark:bg-dark-surface-high"
                        :class="props.activeItemId === content.id ? 'text-primary' : ''">
                        <td v-for="(header, index) in props.headers" :key="header.headername"
                            :class="`px-3 text-${header.align}`">
                            <div v-if="header.datakey === 'action'"
                                class="text-center flex items-center justify-center">
                                <button v-show="props.editAction" type="button" @click="onEdit(Number(content.id))"
                                    class="hover:bg-primary hover:text-dark-surface-on font-sm rounded-md p-1 text-center">
                                    <svg class="size-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m10.8 17.8-6.4 2.1 2.1-6.4m4.3 4.3L19 9a3 3 0 0 0-4-4l-8.4 8.6m4.3 4.3-4.3-4.3m2.1 2.1L15 9.1m-2.1-2 4.2 4.2" />
                                    </svg>
                                </button>
                                <button v-show="props.delAction" type="button" @click="onDelete(Number(content.id))"
                                    class="hover:bg-primary hover:text-dark-surface-on font-sm rounded-md p-1 text-center">
                                    <svg class="size-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                    </svg>
                                </button>
                                <button v-show="props.addAction" type="button" @click="onAdd(Number(content.id))"
                                    class="hover:bg-primary hover:text-dark-surface-on font-sm rounded-md p-1 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="2" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                            <p v-else @click="itemSelected(Number(content.id))" class="line-clamp-1 py-2 cursor-pointer">
                                {{
                                    content[header.datakey] }}</p>
                        </td>
                    </tr>
                    <!-- </TransitionGroup> -->
                </tbody>
            </table>
            <div v-if="props.contents?.length === 0" class="flex justify-center my-5">
                <div class="flex space-x-3 items-center">
                    <span class="relative flex justify-center items-center h-6 w-6">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                        <!-- <span
                        class="relative rounded-full h-5 w-5 bg-warning text-sm font-bold text-center text-primary-on">!</span> -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor" class="size-6 text-warning">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                    </span>
                    <span>No Data</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    searchBar?: boolean,
    headers: TableHeaderT[],
    showHeader?: boolean
    contents: TableContentT[] | DatasetT[] | undefined,
    activeItemId?: number,
    editAction?: boolean,
    delAction?: boolean,
    addAction?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    showHeader: true
})

const searchKeyword = ref<string>(null)
// const isTransitioning = ref(false)
const changeKeyword = (event: Event) => {
    const input = event.target as HTMLInputElement
    searchKeyword.value = input.value
}
const filteredItems = computed(() => {
    return filterData(searchKeyword.value, props.contents)
})

// const beforeEnter = async (el: HTMLElement) => {
//     isTransitioning.value = true
//     await nextTick()
//     el.style.transitionDelay = `${parseInt(el.dataset.index, 10) * 100}ms`
// }
// const afterEnter = (el: HTMLElement) => {
//     isTransitioning.value = false
//     el.style.transitionDelay = '';
// }

const emit = defineEmits(['itemSelected', 'onEdit', 'onDelete', 'onAdd'])
const itemSelected = (id: number) => {
    emit('itemSelected', id)
}
const onAdd = (id: number) => {
    emit('onAdd', id)
}
const onEdit = (id: number) => {
    emit('onEdit', id)
}
const onDelete = (id: number) => {
    emit('onDelete', id)
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