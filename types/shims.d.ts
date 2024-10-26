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
    interface DatasetT {
        id?: number,
        name: string,
        embedding_model?: string,
        contents?: DatasetContentT[]
    }
    interface DatasetContentT {
        id?: number,
        dataset_id: number,
        name: string,
        path: string,
    }
    interface TableHeaderT {
        headername: string,
        datakey: string,
        width?: string,
        align?: 'start' | 'center' | 'end'
    }
    interface TableContentT extends DatasetT {
        [key: string]: key extends ("id" | "dataset_id") ? number : string
    }
    interface ChatTitleT {
        id?: number
        thread_id: string,
        dataset_id?: number
        mode_id?: number,
        model_id?: number,
        url_id?: number,
        title: string,
        url?:string[],
        isGenerating?: boolean,
        isThinking?: boolean,
        inputDisabled?: boolean,
        abortControl?: AbortController,
        contents?: ChatContentT[]
    }
    interface ChatContentT {
        id?: number
        titile_id?: number,
        role: 'YOU' | 'AI',
        content: string,
    }
    interface ChatRequestT {
        id?: number
        userInput?: string,
        threadId: string,
        chatTitleId: number,
        modelId: number,
        modeId: number,
        datasetId?: number,
        url?: string[],
    }
    interface ChatStatusT {
        title_code: string,
        status: 'inProgress' | 'done'
    }
    interface ToastT {
        id?: string,
        title?: string,
        autoClose?: boolean,
        duration?: number
        variant: 'success' | 'info' | 'error',
        message: string,
    }
    interface BackgroundWorkT {
        id: string,
        type: 'Answer' | 'Download' | 'Embedding',
        name: string,
        link?: string,
        status?: 'Waiting' | 'Preparing' | 'Download' | 'Completing',
        completed?: number,
        total?: number,
        progress?: string
    }
    type ProviderT = 'Local' | 'OpenAI' | 'Google' | 'Anthropic'
    interface ConnectionInformationT {
        id?: number,
        provider: ProviderT | 'data_file_path',
        value: string
    }
    // interface ConnectionInformationT {
    //     id?:number,
    //     ollama_base_url:string,
    //     openai_api_key:string | null,
    //     gemini_api_key:string | null,
    //     claude_api_key:string | null
    // }
    interface ModelDataT {
        id?: number,
        provider: ProviderT,
        name: string,
        task?: string
    }
    interface ActiveItemT {
        [key: string]: number | null
    }
    interface ModeT {
        id?: number,
        name: string,
        category:string,
        description: string,
        prompt: string | null,
        temperature: number | null,
        max_tokens: number | null,
        top_probability: number | null,
        frequency_penalty: number | null,
        presence_penalty: number | null,
    }
}