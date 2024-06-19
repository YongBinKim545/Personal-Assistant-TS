<template>
    <Teleport to="body">
        <div class="z-20">
            <transition name="fade">
                <div v-if="option.variant !== 'warning'" class="fixed inset-0 w-full h-screen bg-secondary opacity-20"></div>
            </transition>
            <transition name="bounce">
                <div v-if="isShow" class="fixed inset-0 w-full h-screen flex items-end justify-center bg-transparent"
                    @click.self="close" role="dialog">
                    <div class="relative bg-light-surface-lowest bottom-20 px-3">
                        <button @click="close"
                            class="cursor-pointer p-1 m-1 absolute top-1 right-0 rounded-full hover:shadow-md">
                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div class="flex justify-start items-center min-w-52 max-w-80 mt-4 mb-1">
                            <div class="icon-area" :style="`--toast-color:${option.color}`">
                                <svg v-show="option.variant === 'info'" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                                <svg v-show="option.variant === 'warning'" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                    class="w-8 h-8">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                <svg v-show="option.variant === 'success'" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                    class="w-8 h-8">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <div class="pl-2 py-1 my-1 border-l-2">
                                <span class="uppercase text-sm font-bold block">{{
                                    option.title
                                    }}</span>
                                <p class="line-clamp-1 text-xs block">{{ option.message }}</p>
                            </div>
                        </div>
                        <div class="progress-bar-container" :style="`--toast-bg:${option.color}`">
                            <div v-if="option.autoClose" class="progress-bar"
                                :style="`--toast-duration:${option.duration}s`">
                            </div>
                        </div>

                    </div>
                </div>
            </transition>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
import { watch, ref } from "vue";
import { useToast } from '../../composables/useToast'

const { getToast } = useToast()
const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
        required: true
    },
    toastID: {
        type: [String, null],
        required: true
    },
});
const option = ref<ToastT>(
    {
        id: 'default',
        variant: 'warning',
        title: 'No Title',
        message: 'Message was not provided',
        autoClose: false,
        color:'FFFFFF',
        duration: 5
    }
)
const emit = defineEmits(['close'])

let timerID: any = null
watch(() => props.isShow,
    (newisShow) => {
        if (newisShow) {
            option.value = Object.assign({}, getToast(props.toastID))
            if (option.value.autoClose) {
                timerID = setTimeout(close, option.value.duration * 1000)
            }
        } else {
            option.value.variant = 'warning'
        }
    },
)
const close = () => {
    clearTimeout(timerID)
    emit('close', props.toastID);
}
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
        transform: scale(0) translate(0, 30px);
    }

    50% {
        transform: scale(1.25) translate(0, -30px);
    }

    100% {
        transform: scale(1);
    }
}

.icon-area {
    padding-right: 6px;
    color:var(--toast-color)
}
.progress-bar-container {
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:6px;
    background: var(--toast-bg);
}
.progress-bar {
    width: 100%;
    height: 100%;
    right:0;
    background: white;
    animation: progress var(--toast-duration) linear forwards;
}

@keyframes progress {
    from {
        width: 0
    }

    to {
        width: 100;
    }
}
</style>