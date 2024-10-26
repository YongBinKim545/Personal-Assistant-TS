<template>
    <Teleport to="body">
        <div class="z-30 absolute left-[350px] w-[calc(100%-350px)]">
            <div v-if="toasts.length"
                class="absolute w-[750px] mx-auto inset-x-0 bottom-32 bg-light-surface-lowest dark:bg-dark-surface-lowest">
                <TransitionGroup name="toast" tag="ul" class="space-y-3">
                    <li v-for="toast in toasts" :key="toast.id" class="bg-opacity-20 rounded-b-md" :class="{
                        'bg-info text-info-darken dark:text-info-lighten': toast.variant === 'info',
                        'bg-error text-error-darken dark:text-error-lighten': toast.variant === 'error',
                        'bg-success text-success-darken dark:text-success-lighten': toast.variant === 'success'
                    }">
                        <div class="w-full h-1.5">
                            <div class="progress-bar" :class="{
                                'bg-info': toast.variant === 'info',
                                'bg-error': toast.variant === 'error',
                                'bg-success': toast.variant === 'success'
                            }" :style="`--toast-duration:${toast.duration}s`">
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="m-2">
                                <svg v-show="toast.variant === 'info'" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                                <svg v-show="toast.variant === 'error'" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                <svg v-show="toast.variant === 'success'" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <div class="w-full m-2 text-center">
                                <span class="uppercase text-sm font-bold">{{
                                    toast.title
                                    }}</span>
                                <p class="line-clamp-1 text-xs">{{ toast.message }}</p>
                            </div>
                            <button @click="removeToast(toast.id)" class="m-2">
                                <span>Close</span>
                            </button>
                        </div>
                    </li>
                </TransitionGroup>
            </div>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
const { toasts, removeToast } = useToast()

</script>
<style scoped>
.toast-move,
.toast-enter-active,
.toast-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: scale(0.01) translate(30px, 0);
}

.toast-leave-active {
    position: absolute;
}

.progress-bar {
    width: 100%;
    height: 100%;
    animation: progress var(--toast-duration) linear forwards;
}

@keyframes progress {
    from {
        width: 0
    }

    to {
        width: 100%;
    }
}
</style>