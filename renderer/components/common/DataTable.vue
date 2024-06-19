<template>
    <div class="flex justify-between items-center mb-2 text-sm">
        <div>
            <slot name="itemDetail"></slot>
        </div>
        <div class="relative" v-if="props.searchBar">
            <input type="text" :value="searchKeyword" @input="changeKeyword"
                class="py-1 px-4 rounded-full bg-light-surface-highest dark:bg-dark-surface-highest placeholder-light-surface-on dark:placeholder-dark-surface-on focus:outline-none focus:ring-2 focus:ring-primary"
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
    <div class="flex-grow overflow-auto">
        <table class="relative w-full text-sm">
            <thead>
                <tr class="bg-light-surface-high dark:bg-dark-surface-high sticky top-0">
                    <th v-for="(header, index) in props.headers" :key="header.headername" class="p-2"
                        :class="index === 1 ? 'w-[30px]' : ''">
                        {{ header.headername }}
                    </th>
                </tr>
            </thead>
            <div class="my-1"></div>
            <tbody class="divide-y" v-if="props.contents.length > 0">
                <TransitionGroup @before-enter="beforeEnter" @after-enter="afterEnter" @enter-cancelled="afterEnter">
                    <tr v-for="(content, index) in filteredItems" :key="content.id" :data-index="index"
                        class="border-hidden bg-transparent hover:bg-light-surface-high hover:dark:bg-dark-surface-high"
                        :class="activeItemId === content.id ? 'text-primary font-bold' : ''">
                        <td v-for="(header, index) in props.headers" :key="header.headername"
                            class="px-3 py-1 text-start">
                            <div v-if="header.datakey === 'action'"
                                class="text-center flex items-center justify-center">
                                <button v-if="editAction" type="button" @click="onEdit(Number(content.id))"
                                    class="hover:bg-primary hover:text-dark-surface-on font-sm rounded-full p-1 text-center">
                                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m10.8 17.8-6.4 2.1 2.1-6.4m4.3 4.3L19 9a3 3 0 0 0-4-4l-8.4 8.6m4.3 4.3-4.3-4.3m2.1 2.1L15 9.1m-2.1-2 4.2 4.2" />
                                    </svg>
                                </button>
                                <button v-if="delAction" type="button" @click="onDelete(Number(content.id))"
                                    class="hover:bg-primary hover:text-dark-surface-on font-sm rounded-full p-1 text-center">
                                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                    </svg>
                                </button>
                            </div>
                            <p v-else @click="itemSelected(Number(content.id))" class="line-clamp-1 cursor-pointer">{{
                                content[header.datakey] }}</p>
                        </td>
                    </tr>
                </TransitionGroup>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
interface Props {
    searchBar?: boolean,
    headers: TableHeaderT[],
    contents: TableContentT[],
    activeItemId?: number,
    editAction?: boolean,
    delAction?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    searchBar: false,
    activeItemId: null,
    editAction: false,
    delAction: false
})
const searchKeyword = ref(null)
const changeKeyword = (event:Event) => {
    const input = event.target as HTMLInputElement
    searchKeyword.value = input.value
}
const filteredItems = computed(() => {
    return filterData(searchKeyword.value, props.contents)
})

const beforeEnter = async (el: HTMLElement) => {
    await nextTick()
    el.style.transitionDelay = `${parseInt(el.dataset.index, 10) * 100}ms`
}
const afterEnter = (el: HTMLElement) => {
    el.style.transitionDelay = '';
}

const emit = defineEmits(['itemSelected', 'onEdit', 'onDelete'])
const itemSelected = (id: number) => {
    emit('itemSelected', id)
}
const onEdit = (id: number) => {
    emit('onEdit', id)
}
const onDelete = (id: number) => {
    emit('onDelete', id)
}

</script>

<style scoped>
.v-enter-active,
.v-leave-active,
.v-move {
    transition: opacity .5s, transform 1s;
}

.v-leave-active {
    position: absolute;
}

.v-enter {
    opacity: 0;
    transform: translateX(-50px);
}

.v-leave-to {
    opacity: 0;
    transform: translateX(50px);
}
</style>