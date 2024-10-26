
const defaultOption = {
    info: {
        title: 'Notification',
        autoClose: false,
        duration: 7
    },
    success: {
        title: 'Success',
        autoClose: true,
        duration: 5
    },
    error: {
        title: 'Error',
        autoClose: false,
        duration: 7
    }
}
export const useToast = createGlobalState(() => {
    const toasts = ref<ToastT[]>([])
    const createToast = (payload: ToastT) => {
        const toastID = crypto.randomUUID()
        const _options = Object.assign(defaultOption[payload.variant], payload)
        toasts.value.push(
            ...[
                {
                    id: toastID,
                    ..._options
                },
            ]
        )
        const timeout = _options.duration ? _options.duration * 1000 : 5000
        if (_options.autoClose) {
            setTimeout(() => {
                removeToast(toastID)
            }, timeout)
        }
    }
    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter((item) => item.id !== id)
    }
    return {
        toasts,
        createToast,
        removeToast
    }
})