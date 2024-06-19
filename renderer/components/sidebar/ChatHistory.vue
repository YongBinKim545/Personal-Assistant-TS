<template>
    <div class="grow relative">
        <div class="p-2 font-bold uppercase">대화 기록</div>
        <div class="relative my-2">
            <input type="text" :value="searchKeyword" @input="changeKeyword"
                class="py-2 px-4 rounded-full w-full bg-light-surface-highest dark:bg-dark-surface-highest placeholder-light-surface-on dark:placeholder-dark-surface-on focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="SEARCH">
            <div class="absolute inset-y-0 right-3 flex items-center">
                <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"></path>
                </svg>
            </div>
        </div>
        <ul class="flex flex-col space-y-2">
            <router-link :to="{ name: 'ChatContent', params: { titleCode: chat.code} }" v-for="chat in itemsToShow"
                :key="chat.id"
                class="flex justify-between items-center px-2 rounded-md hover:bg-light-surface-high hover:dark:bg-dark-surface-high hover:cursor-pointer"
                exactActiveClass="text-primary">
                <p class="line-clamp-1 my-2 w-[260px] text-base">{{ chat.title }}</p>
                <div class="p-1 rounded-full hover:bg-primary hover:text-primary-on" @click="">
                    <svg class="w-4 h-4" fill="currentColor" height="200px" width="200px" version="1.1" id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 32.055 32.055" xml:space="preserve">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <g>
                                <path
                                    d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967 C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967 s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967 c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z">
                                </path>
                            </g>
                        </g>
                    </svg>
                </div>
            </router-link>
        </ul>
        <div v-if="numberOfPages > 0" class="flex justify-center absolute bottom-2 w-full">
            <Pagination :currentPage="currentPage" :totalPage="numberOfPages" @moveNext="currentPage++"
                @movePrevious="currentPage--" />
        </div>
    </div>
</template>

<script setup lang="ts">
const { chats } = useChat()
const { height } = useWindowSize()
const ITEMS_PER_PAGE = [
    {
        windowHeight: 1000,
        itemsPerPage: 10,
    },
    {
        windowHeight: 950,
        itemsPerPage: 9,
    },
    {
        windowHeight: 900,
        itemsPerPage: 8,
    },
    {
        windowHeight: 850,
        itemsPerPage: 7,
    },
]
const searchKeyword = ref(null)
const itemsPerPage = ref(0)
const currentPage = ref(1)
watch(height, (newHeight) => {
    const matchedIndex = ITEMS_PER_PAGE.findIndex((item) => item.windowHeight <= newHeight)
    itemsPerPage.value = ITEMS_PER_PAGE[matchedIndex].itemsPerPage
})

const changeKeyword = (event: Event) => {
    const input = event.target as HTMLInputElement
    searchKeyword.value = input.value
}
const filteredItems = computed(() => {
    return filterData(searchKeyword.value, chats.value)
})
const itemsToShow = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    const endIndex = startIndex + itemsPerPage.value
    return filteredItems.value.slice(startIndex, endIndex)
})
const numberOfPages = computed(() => {
    return Math.ceil(filteredItems.value.length / itemsPerPage.value)
})
onMounted(() => {
    const matchedIndex = ITEMS_PER_PAGE.findIndex((item) => item.windowHeight <= height.value)
    itemsPerPage.value = ITEMS_PER_PAGE[matchedIndex].itemsPerPage
})
</script>

<style lang="scss" scoped></style>