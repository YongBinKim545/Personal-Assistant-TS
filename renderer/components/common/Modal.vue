<template>
    <Teleport to="body">
        <div class="z-10">
            <Transition name="fade">
                <div v-if="isShow"
                    class="fixed inset-0 top-10 w-full h-screen opacity-80 bg-light-surface-highest dark:bg-dark-surface-highest">
                </div>
            </Transition>
            <Transition name="bounce">
                <div v-if="isShow" @click.self="() => preventClose()"
                    class="fixed inset-0 w-full h-screen flex items-center justify-center bg-transparent">
                    <div ref="modalContainer"
                        class="rounded-xl bg-light-surface-lowest dark:bg-dark-surface-lowest text-light-surface-on dark:text-dark-surface-on"
                        role="dialog">
                        <div
                            class="px-4 py-2 flex justify-between items-center bg-primary rounded-t-lg text-lg font-bold text-primary-on">
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
                        <div v-if="footer" class="mx-5 my-2 pt-3 pb-1 flex justify-end items-center border-t border-light-border dark:border-dark-border">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

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
const modalContainer = ref(null)

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
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.bounce-enter-active {
    animation: bounce-in 0.5s;
}

.bounce-leave-active {
    animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.25);
    }

    100% {
        transform: scale(1);
    }
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