
const defaultOption = {
    info:{
        title:'info',
        autoClose:false,
        color:'#2196F3',
        duration:7
    },
    success:{
        title:'success',
        autoClose:true,
        color:'#4CAF50',
        duration:5
    },
    warning:{
        title:'warning',
        autoClose:false,
        color:'#ff355b',
        duration:7
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
        return toastID
    }
    const getToast = (id: string): ToastT => {
        const index = toasts.value.findIndex((item) => item.id === id)
        if (index !== -1) return toasts.value[index]
    }
    const removeToast = (id: string) => {
        const index = toasts.value.findIndex((item) => item.id === id)
        if (index !== -1) toasts.value.splice(index, 1)
    }
    return {
        toasts,
        createToast,
        getToast,
        removeToast
    }
})