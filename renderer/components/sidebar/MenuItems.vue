<template>
    <div class="relative flex justify-between items-center p-2 w-full h-16">
        <router-link v-for="(menuItem, index) in menuItems" :key="index" :to="{ name: menuItem.component }"
            class="p-2 text-center uppercase hover:bg-light-surface-high hover:dark:bg-dark-surface-high rounded-md"
            activeClass="font-bold">
            <span ref="routerLinks">{{ menuItem.content }}</span>
        </router-link>
        <div class="absolute h-[3px] bottom-2 bg-primary transition-all duration-300" ref="activeitemUnderline">
        </div>
    </div>
</template>

<script setup lang="ts">
const activeitemUnderline = ref<HTMLElement | null>(null)
const routerLinks = ref<HTMLElement[] | null>(null)
const activeLinkIndex = ref(-1)
const route = useRoute()
const menuItems = [
    {
        component: "NewChat",
        content: "대화하기"
    },
    {
        component: "Documents",
        content: "문서관리"
    },
    {
        component: "Models",
        content: "모델관리"
    },
]
const menuSequence = {
    '/chat': 0,
    '/documents': 1,
    '/models': 2
}

watch(() => route.path, async (newPath) => {
    const regex = /^\/([^/]+)/
    const match = newPath.match(regex)
    if (!match) return
    const sequenceNumber = menuSequence[match[0] as '/chat' | '/documents' | '/models'];
    if (activeLinkIndex.value === sequenceNumber) return
    activeLinkIndex.value = sequenceNumber
    const activeLink = routerLinks.value?.[sequenceNumber]
    updateActiveItemUnderline(activeLink)
})

const updateActiveItemUnderline = (target: HTMLElement) => {
    const rect = target.getBoundingClientRect()
    if (activeitemUnderline.value) {
        activeitemUnderline.value.style.left = `${rect.left - 7}px`;
        activeitemUnderline.value.style.width = `${rect.width + 14}px`;
    }
}
onMounted(() => {
    const firstRouterLink = routerLinks.value[0]
    updateActiveItemUnderline(firstRouterLink)
})

</script>

<style scoped></style>