<template>
    <div class="relative flex justify-between p-2 mt-5 w-full">
        <router-link v-for="(menuItem, index) in menuItems" :key="index" :to="{ name: menuItem.component }"
            class="flex items-center cc-default-tab-button w-[100px] h-12 p-0" activeClass="cc-active-tab-button p-0">
            <div ref="routerLinks" class="uppercase w-full text-center">{{ menuItem.content }}</div>
        </router-link>
        <div class="absolute h-[3px] bottom-2 bg-primary transition-all duration-500" ref="activeitemUnderline">
        </div>
    </div>
</template>

<script setup lang="ts">
const activeitemUnderline = ref<HTMLElement | null>(null)
const routerLinks = ref<HTMLElement[] | null>(null)
const route = useRoute()
const menuItems = [
    {
        component: "NewChat",
        content: "chat"
    },
    {
        component: "Documents",
        content: "document"
    },
    {
        component: "Setting",
        content: "models"
    },
]
const menuSequence = {
    '/chat': 0,
    '/documents': 1,
    '/models': 2
}

const getActiveLink = (path: string) => {
    const regex = /^\/([^/]+)/
    const match = path.match(regex)
    if (!match) return
    const sequenceNumber = menuSequence[match[0] as keyof typeof menuSequence]
    const activeLink = routerLinks.value?.[sequenceNumber]
    return activeLink
}

watch(() => route.path, (newPath) => {
    const activeLink = getActiveLink(newPath)
    if (activeLink === undefined) return
    updateActiveItemUnderline(activeLink)
})

const updateActiveItemUnderline = (target: HTMLElement) => {
    const rect = target.getBoundingClientRect()
    if (activeitemUnderline.value) {
        activeitemUnderline.value.style.left = `${rect.left - 1}px`;
        activeitemUnderline.value.style.width = `${rect.width + 2}px`;
    }
}
onMounted(() => {
    const activeLink = getActiveLink(route.path)
    updateActiveItemUnderline(activeLink)
})

</script>

<style scoped></style>