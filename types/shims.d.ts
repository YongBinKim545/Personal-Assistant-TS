import { API } from '../main/preload';

export { }

declare global {
    interface Window { api: API }
    interface FileItemT {
        dataset_id?: number
        name: string
        path: string
    }
    interface DocumentT {
        pageContent: string,
        metadata: Object[]
    }
    interface QueryT {
        field: string,
        condition: string,
        value: string | number
    }
    interface TableHeaderT {
        headername: string,
        datakey: string
    }
    interface TableContentT {
        id?: number
        dataset_id?: number
        name?: string
        embedding_model?: string
        [key: string]: key extends ("id" | "dataset_id") ? number : string
    }
    interface ChatT {
        id?:number
        code:string,
        dataset_id?: number
        mode?: string,
        model?: string,
        title: string,
        isGenerating?:boolean
        isThinking?:boolean
        contents?:ChatContentT[]
    }
    interface ChatTitleT {
        id?: number,
        dataset_id?: number
        mode?: string,
        model?: string,
        content: string,
    }
    interface ChatContentT {
        id?: number
        titile_id?: number,
        role: 'YOU' | 'AI',
        content: string,
    }
    interface ChatStatusT {
        title_code:string,
        status:'inProgress' | 'done'
    }
    interface ToastT {
        id?: string,
        title?: string,
        autoClose?: boolean,
        color?: string,
        duration?: number
        variant: 'success' | 'info' | 'warning',
        message: string,
    }
}