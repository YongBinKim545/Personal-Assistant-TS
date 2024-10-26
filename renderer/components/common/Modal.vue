<template>
    <Teleport to="body">
        <div class="z-20">
            <Transition name="fade1">
                <div v-if="isShow"
                    class="fixed inset-0 top-10 w-full h-screen opacity-70 bg-light-surface-lowest dark:bg-dark-surface-highest">
                </div>
            </Transition>
            <Transition name="bounce">
                <div v-if="isShow" @click.self="() => preventClose()"
                    class="absolute left-[350px] m-auto inset-0 flex items-center justify-center bg-transparent">
                    <div ref="modalContainer"
                        class="rounded-md bg-light-surface-lowest shadow-lg dark:bg-dark-surface-low text-light-surface-on dark:text-dark-surface-on"
                        role="dialog">
                        <div
                            class="px-4 py-1 flex justify-between items-center bg-primary rounded-t-md text-md font-bold text-primary-on">
                            <span class="uppercase">{{ props.title }}</span>
                            <button @click="close"
                                class="cursor-pointer w-8 h-8 flex justify-center items-center rounded-md hover:bg-primary-darken">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                    stroke="currentColor" class="w-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="h-3/4 m-2 p-3">
                            <slot name="body"></slot>
                        </div>
                        <div v-if="footer" class="mx-5 mt-2 mb-4 pt-2 flex justify-end items-center border-t">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>

interface Props {
    isShow: boolean,
    title?: string,
    footer?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    isShow: false,
    title: 'Modal Title',
    footer: false,
})
const emit = defineEmits(['close'])
const modalContainer = ref<HTMLElement>()

const close = () => {
    emit('close');
}
const preventClose = () => {
    if (!modalContainer.value) return;
    modalContainer.value.classList.add('vibrate');
    setTimeout(() => {
        modalContainer.value?.classList.remove('vibrate');
    }, 200);
}
defineExpose({
    preventClose
});

</script>
<style scoped>
.fade1-enter-active,
.fade1-leave-active {
    transition: all 0.3s ease;
}

.fade1-enter-from,
.fade1-leave-to {
    opacity: 0;
}

.bounce-enter-active,
.bounce-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.bounce-enter-from,
.bounce-leave-to {
    opacity: 0;
    transform: scale(0.01) translate(30px, 0);
}

.vibrate {
    animation: vibrate 0.1s ease-in-out infinite;
}

@keyframes vibrate {
    0% {
        transform: rotate(1deg);
    }

    50% {
        transform: rotate(-1deg);
    }

    100% {
        transform: rotate(1deg);
    }
}
</style>