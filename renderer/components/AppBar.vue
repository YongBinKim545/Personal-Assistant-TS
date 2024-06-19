<template>
    <nav class="w-full flex justify-between items-center h-10 bg-primary text-primary-on">
        <div class="flex grow justify-start items-center drag-region">
            <!-- <svg class="cursor-pointer" width="20" height="20" viewBox="0 0 100 100" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M0 20C0 8.9543 8.95431 0 20 0H50V50H0V20Z" :fill="logoPrimary" />
                <path d="M50 15H80C91.0457 15 100 23.9543 100 35V50H50V15Z" :fill="logoSecondary" />
                <path d="M50 50H100V80C100 91.0457 91.0457 100 80 100H50V50Z" :fill="logoPrimary" />
                <path d="M0 50H50V85H20C8.9543 85 0 76.0457 0 65V50Z" :fill="logoSecondary" />
                <path
                    d="M85.2308 77.3846V74.0192C85.2308 72.8717 84.7749 71.7711 83.9634 70.9596C83.152 70.1482 82.0514 69.6923 80.9038 69.6923H78.9808C78.5982 69.6923 78.2314 69.5404 77.9609 69.2699C77.6904 68.9994 77.5385 68.6325 77.5385 68.25V66.3269C77.5385 65.1794 77.0826 64.0788 76.2711 63.2673C75.4597 62.4559 74.3591 62 73.2115 62H70.8077M79.4615 77.3846H71.7692M73.6923 62H67.4423C66.6462 62 66 62.6462 66 63.4423V85.5577C66 86.3538 66.6462 87 67.4423 87H83.7885C84.5846 87 85.2308 86.3538 85.2308 85.5577V73.5385C85.2308 70.4783 84.0151 67.5434 81.8512 65.3795C79.6874 63.2157 76.7525 62 73.6923 62Z"
                    stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <path
                    d="M22.8125 23.9564C22.8125 24.1005 22.7576 24.2388 22.66 24.3407C22.5623 24.4426 22.4298 24.4999 22.2917 24.4999C22.1535 24.4999 22.0211 24.4426 21.9234 24.3407C21.8257 24.2388 21.7708 24.1005 21.7708 23.9564C21.7708 23.8123 21.8257 23.674 21.9234 23.5721C22.0211 23.4702 22.1535 23.4129 22.2917 23.4129C22.4298 23.4129 22.5623 23.4702 22.66 23.5721C22.7576 23.674 22.8125 23.8123 22.8125 23.9564ZM22.8125 23.9564H22.2917M28.0208 23.9564C28.0208 24.1005 27.966 24.2388 27.8683 24.3407C27.7706 24.4426 27.6381 24.4999 27.5 24.4999C27.3619 24.4999 27.2294 24.4426 27.1317 24.3407C27.034 24.2388 26.9792 24.1005 26.9792 23.9564C26.9792 23.8123 27.034 23.674 27.1317 23.5721C27.2294 23.4702 27.3619 23.4129 27.5 23.4129C27.6381 23.4129 27.7706 23.4702 27.8683 23.5721C27.966 23.674 28.0208 23.8123 28.0208 23.9564ZM28.0208 23.9564H27.5M33.2292 23.9564C33.2292 24.1005 33.1743 24.2388 33.0766 24.3407C32.9789 24.4426 32.8465 24.4999 32.7083 24.4999C32.5702 24.4999 32.4377 24.4426 32.34 24.3407C32.2424 24.2388 32.1875 24.1005 32.1875 23.9564C32.1875 23.8123 32.2424 23.674 32.34 23.5721C32.4377 23.4702 32.5702 23.4129 32.7083 23.4129C32.8465 23.4129 32.9789 23.4702 33.0766 23.5721C33.1743 23.674 33.2292 23.8123 33.2292 23.9564ZM33.2292 23.9564H32.7083M40 23.9564C40 30.5592 34.4028 35.9128 27.5 35.9128C26.3016 35.9143 25.1084 35.7501 23.9514 35.4244C22.3205 36.6213 20.331 37.1651 18.3472 36.9563C18.1267 36.9341 17.907 36.9026 17.6889 36.8621C18.3734 36.0202 18.8409 35.0102 19.0472 33.9273C19.1722 33.265 18.8625 32.6215 18.3986 32.1505C16.2917 30.0114 15 27.1288 15 23.9564C15 17.3536 20.5972 12 27.5 12C34.4028 12 40 17.3536 40 23.9564Z"
                    stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg> -->
            <div>
                <span class="font-bold px-3 py-2">Personal GPT</span>
            </div>
            <!-- <div class="ml-3 relative h-[50px] w-[120px]">
                <div class="absolute top-1.5 left-0 flex items-start">
                    <span class="font-bold text-primary text-xl">CHAT</span>
                    <span class="text-xs ml-1">with</span>
                </div>
                <div class="absolute bottom-1.5 left-6">
                    <span class="text-xs mr-1">your</span>
                    <span class="font-bold text-primary text-xl">DOCs</span>
                </div>
            </div> -->
        </div>
        <div class="flex justify-between items-center">
            <div @click="toggleDark(false)" v-show="isDark"
                class="py-2 px-3 hover:cursor-pointer hover:bg-dark-surface" draggable="false">
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                        d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.3 5A1 1 0 0 0 5 6.2l1.4 1.5a1 1 0 0 0 1.5-1.5L6.3 5Zm12.8 1.3A1 1 0 0 0 17.7 5l-1.5 1.4a1 1 0 0 0 1.5 1.5L19 6.3ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.8 17.7a1 1 0 1 0-1.5-1.5L5 17.7A1 1 0 1 0 6.3 19l1.5-1.4Zm9.9-1.5a1 1 0 0 0-1.5 1.5l1.5 1.4a1 1 0 0 0 1.4-1.4l-1.4-1.5ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
                        clip-rule="evenodd" />
                </svg>
            </div>
            <div @click="toggleDark(true)" v-show="!isDark"
                class="py-2 px-3 hover:cursor-pointer hover:bg-dark-surface" draggable="false">
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                        d="M11.7 2a10 10 0 1 0 9.8 13.3 1 1 0 0 0-1-1.3H20a8 8 0 0 1-7.6-10.6l.1-.4a1 1 0 0 0-.8-1Z"
                        clip-rule="evenodd" />
                </svg>
            </div>
            <div @click="windowControl('min')" class="px-3 py-3 hover:cursor-pointer hover:bg-dark-surface"
                draggable="false">
                <svg class="w-4 h-4" width="35" height="3" viewBox="0 0 35 3" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <line y1="1.5" x2="35" y2="1.5" stroke="currentColor" stroke-width="3" />
                </svg>
            </div>
            <div v-show="!isMaxWindow" @click="windowControl('max')"
                class="px-3 py-3 hover:cursor-pointer hover:bg-dark-surface" draggable="false">
                <svg class="w-4 h-4" width="35" height="35" viewBox="0 0 35 35" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="1.5" width="32" height="32" stroke="currentColor" stroke-width="3" />
                </svg>
            </div>
            <div v-show="isMaxWindow" @click="windowControl('restore')"
                class="px-3 py-3 hover:cursor-pointer hover:bg-secondary" draggable="false">
                <svg class="w-4 h-4" width="35" height="35" viewBox="0 0 35 35" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="11.5" width="22" height="22" stroke="currentColor" stroke-width="3" />
                    <path d="M8 2V11.5H23.5V23H33V2H8Z" stroke="currentColor" stroke-width="3" />
                </svg>
            </div>
            <div @click="windowControl('close')" class="px-3 py-3 hover:cursor-pointer hover:bg-warning"
                draggable="false">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="100" height="100"
                    viewBox="0 0 50 50">
                    <path
                        d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z">
                    </path>
                </svg>
            </div>
        </div>
        <!-- <Toast :isShow="showToast" :toastID="toastID" @close="closeToast" /> -->
    </nav>
</template>

<script setup lang="ts">

const isDark = useDark({
    selector: 'body'
})
const isMaxWindow = ref(false)
const toggleDark = useToggle(isDark)
const windowControl = async (action: 'min' | 'max' | 'restore' | 'close') => {
    const response = await window.api.windowControl(action)
    if (response === 'success') {
        if (action === 'max') {
            isMaxWindow.value = true
        }
        if (action === 'restore') {
            isMaxWindow.value = false
        }
    }
}

// const { createToast, removeToast } = useToast()
// const showToast = ref(false)
// const toastID = ref(null)
// const logoPrimary = "#26A69A"
// const logoSecondary = "#1565C0"
// const showHelp = () => {
//     toastID.value = createToast({
//         variant: 'info',
//         message: 'This is to use GPT with private data',
//     })
//     showToast.value = true
// }

// const closeToast = (id: string) => {
//     removeToast(id)
//     showToast.value = false
// }
</script>

<style scoped>
.drag-region {
    -webkit-app-region: drag;
}
</style>