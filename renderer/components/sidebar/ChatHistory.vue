<template>
    <div class="grow relative">
        <div class="p-2 font-bold uppercase">library</div>
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
            <li v-for="(chat, index) in itemsToShow" :key="index"
                class="flex justify-between items-center px-2 rounded-md hover:bg-light-surface-high hover:dark:bg-dark-surface-high">
                <router-link :to="{ name: 'ChatContent', params: { threadId: chat.thread_id } }"
                    exactActiveClass="text-primary" class="hover:cursor-pointer">
                    <p class="line-clamp-1 my-2 w-[260px] text-base">{{ chat.title }}</p>
                </router-link>
                <div class="relative" @mouseleave="showMenu[chat.id] = false">
                    <div class="p-2 rounded-full hover:bg-secondary hover:text-primary-on hover:cursor-pointer"
                        @click="showMenu[chat.id] = true">
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
                    <Transition name="bounce">
                        <div v-show="showMenu[chat.id]"
                            class="flex space-x-5 absolute -top-11 h-auto z-20 py-10 px-20 rounded-md">
                            <div class="group relative flex justify-center">
                                <div
                                    class="p-2 bg-light-surface-highest dark:bg-dark-surface-highest hidden group-hover:block absolute -bottom-10 rounded-md">
                                    <span class="uppercase">download</span>
                                </div>
                                <div @click="downloadChat(index)"
                                    class="p-2 rounded-full bg-light-surface-high dark:bg-dark-surface-high hover:bg-secondary hover:text-primary-on hover:dark:bg-primary hover:dark:text-primary-on">
                                    <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="group relative flex justify-center">
                                <div
                                    class="p-2 bg-light-surface-highest dark:bg-dark-surface-highest hidden group-hover:block absolute -bottom-10 rounded-md">
                                    <span class="uppercase">edit</span>
                                </div>
                                <div @click="editItem(index)"
                                    class="p-2 rounded-full bg-light-surface-high dark:bg-dark-surface-high hover:bg-secondary hover:text-primary-on hover:dark:bg-primary hover:dark:text-primary-on">
                                    <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </div>
                            </div>
                            <div class="group relative flex justify-center">
                                <div
                                    class="p-2 bg-light-surface-highest dark:bg-dark-surface-highest hidden group-hover:block absolute -bottom-10 rounded-md">
                                    <span class="uppercase">delete</span>
                                </div>
                                <div @click="deleteItem(chat.id)"
                                    class="p-2 rounded-full bg-light-surface-high dark:bg-dark-surface-high hover:bg-warning hover:text-primary-on hover:dark:bg-warning hover:dark:text-primary-on">
                                    <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </li>
        </ul>
        <div v-if="numberOfPages > 0" class="flex justify-center absolute bottom-2 w-full">
            <Pagination :currentPage="currentPage" :totalPage="numberOfPages" @moveNext="currentPage++"
                @movePrevious="currentPage--" />
        </div>
        <Modal :isShow="showModal" title="edit chat title" @close="showModal = false">
            <template v-slot:body>
                <textarea
                    class="bg-light-surface-high dark:bg-dark-surface-high w-[400px] rounded-md resize-none text-sm p-2 m-2 focus:outline-none"
                    v-model="newChatTitle">
                    </textarea>
                <div class="flex justify-end my-1 space-x-2">
                    <button @click="newChatTitle = ''" class="cc-negative-button">
                        <span class="uppercase">clear</span>
                    </button>
                    <button @click="updateItem" class="cc-positive-button">
                        <span class="uppercase">save</span>
                    </button>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
const { activeChatTitleIndex, chats, updateChatTitle, removeChatTitle } = useChat()
const { createToast } = useToast()
const { height } = useWindowSize()
const router = useRouter()
const searchKeyword = ref<string>()
const itemsPerPage = ref(0)
const currentPage = ref(1)
const showMenu = ref<{ [key: number]: boolean | undefined }>({})
const showModal = ref(false)
const chatIndexToEdit = ref(-1)
const newChatTitle = ref('')

watch(height, (newHeight) => {
    const matchedIndex = ITEMS_PER_PAGE.findIndex((item) => item.windowHeight <= newHeight)
    itemsPerPage.value = ITEMS_PER_PAGE[matchedIndex].itemsPerPage
    currentPage.value = Math.max(1, Math.ceil(activeChatTitleIndex.value / itemsPerPage.value))
})

watch(activeChatTitleIndex, (newActiveChatTitleIndex) => {
    if (newActiveChatTitleIndex < 0) return
    const activeItem = newActiveChatTitleIndex + 1
    currentPage.value = Math.max(1, Math.ceil(activeItem / itemsPerPage.value))
})

const changeKeyword = (event: Event) => {
    const input = event.target as HTMLInputElement
    searchKeyword.value = input.value
    currentPage.value = 1
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
const downloadChat = (index: number) => {
    window.alert(`${index} To be implemented`)
}
const routingAction = (chatTitleLength: number, activeIndex: number, indexToDelete: number) => {
    if (activeIndex === -1) return
    if (chatTitleLength === 1) {
        router.push({ name: 'NewChat' })
        return
    }
    if (activeIndex === 0 && indexToDelete === 0) {
        const threadId = chats.value[1].thread_id
        router.push({ name: 'ChatContent', params: { threadId } })
        return
    }
    if (activeIndex === indexToDelete) {
        const threadId = chats.value[activeIndex - 1].thread_id
        router.push({ name: 'ChatContent', params: { threadId } })
        return
    }
}

const deleteItem = async (chatId: number) => {
    const chatTitleLength = chats.value.length
    const currentActiveIndex = activeChatTitleIndex.value
    const indexToDelete = chats.value.findIndex((item) => item.id === chatId)
    routingAction(chatTitleLength, currentActiveIndex, indexToDelete)
    createToast({
        variant: 'success',
        title: 'Chat Deleted Successfully',
        message: await removeChatTitle(chatId, indexToDelete),
    })
    // Edge case: When deleting the first chat (index 0) while it's active
    // 1. routingAction sets the route to the second chat (index 1)
    // 2. removeChatTitle shifts all chat indices down
    // 3. We need to manually set activeChatTitleIndex to 0 to match the new state
    // This ensures the active chat remains at the top of the list after deletion
    if (currentActiveIndex === 0 && indexToDelete === 0) {
        activeChatTitleIndex.value = 0
    }
    // Edge case: When deleting a chat with an index smaller than the currently active index
    // Example: Deleting chat at index 3 while active chat is at index 4
    // 1. No routingAction is needed as the active chat doesn't change
    // 2. After removeChatTitle, we decrement the active index to reflect the new state
    // This ensures the active chat index remains correct after deletion of a previous chat
    if (currentActiveIndex > indexToDelete) {
        activeChatTitleIndex.value -= 1
    }
    if (currentPage.value > Math.ceil(filteredItems.value.length / itemsPerPage.value)) {
        currentPage.value = Math.max(currentPage.value - 1, 1)
    }
}
const editItem = (index: number) => {
    showMenu.value[chats.value[index].id] = false
    showModal.value = true;
    chatIndexToEdit.value = index
    newChatTitle.value = chats.value[index].title
}
const updateItem = async () => {
    if (!newChatTitle.value?.trim()) {
        createToast({
            variant: 'error',
            message: 'Empty Title Not Allowed',
        })
        return
    }
    const newTitle = newChatTitle.value.trim()
    if (newTitle === chats.value[chatIndexToEdit.value].title) {
        createToast({
            variant: 'info',
            title: 'Title Unchanged',
            message: `Title : ${newTitle}`,
        })
        return
    }
    const response = await updateChatTitle(chats.value[chatIndexToEdit.value].id, newTitle)
    if (response.ok) {
        chats.value[chatIndexToEdit.value].title = newTitle
        createToast({
            variant: 'success',
            title: 'Title Changed Successfully',
            message: `New Title : ${newTitle}`,
        })
        showModal.value = false
    }
}
onMounted(() => {
    const matchedIndex = ITEMS_PER_PAGE.findIndex((item) => item.windowHeight <= height.value)
    itemsPerPage.value = ITEMS_PER_PAGE[matchedIndex].itemsPerPage
})
const ITEMS_PER_PAGE = [
    { windowHeight: 1000, itemsPerPage: 10 },
    { windowHeight: 950, itemsPerPage: 9 },
    { windowHeight: 900, itemsPerPage: 8 },
    { windowHeight: 850, itemsPerPage: 7 },
    { windowHeight: 800, itemsPerPage: 6 },
    { windowHeight: 750, itemsPerPage: 5 },
    { windowHeight: 0, itemsPerPage: 4 }
]
</script>

<style scoped>
.bounce-enter-active {
    animation: bounce-in 0.3s;
}

.bounce-leave-active {
    animation: bounce-in 0.2s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}
</style>