const { addBackgroundWork, removeBackgroundWork } = useBackground()

type TaskFunction = (onProgress: (total: number, completed: number) => void) => Promise<Response>

type Task = {
  execute: TaskFunction
  taskInformation: BackgroundWorkT
  resolve?: (response: Response) => void;
  reject?: (error: any) => void;
}
interface ModelInformationT {
  name: string,
  title?: string,
  provider: ProviderT,
  task: string,
  modelFile?: string,
  sourceURL?: string
}

class TaskQueue {
  public tasks: Map<number, Task>
  public taskNameInQueue: string[]
  private nextId: number
  private frontId: number
  private rearId: number
  private isProcessing: boolean

  constructor() {
    this.initialize()
  }

  private initialize(): void {
    this.tasks = reactive(new Map<number, Task>())
    this.taskNameInQueue = []
    this.nextId = 1
    this.frontId = 1
    this.rearId = -1
    this.isProcessing = false
  }

  public addTask(task: TaskFunction, name: string, link: string): Promise<Response> {
    const id = this.nextId++
    const taskInformation: BackgroundWorkT = {
      id: name + Date.now(),
      type: 'Download',
      status: 'Waiting',
      name: name,
      link: link,
      completed: -1,
      total: -1,
      progress: '0 %'
    }
    this.tasks.set(id, {
      execute: task,
      taskInformation: taskInformation
    })
    this.taskNameInQueue.push(name)
    addBackgroundWork(this.tasks.get(id).taskInformation)
    this.rearId = id
    if (!this.isProcessing) {
      this.processQueue()
    }
    return new Promise((resolve, reject) => {
      this.tasks.get(id).resolve = resolve
      this.tasks.get(id).reject = reject
    })
  }

  public removeTask(id: number): boolean {
    if (id <= this.frontId || id > this.rearId) return false
    return this.tasks.delete(id)
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return
    this.isProcessing = true
    try {
      while (this.frontId <= this.rearId) {
        const task = this.tasks.get(this.frontId)
        try {
          const response = await task.execute((total, completed) => {
            if (task.taskInformation.status === 'Waiting') task.taskInformation.status = 'Download'
            // const newCompleted = Math.round(completed / 1024 / 1024 / 1024 * 100) / 100
            if (task.taskInformation.completed < completed) {
              task.taskInformation.total = total
              task.taskInformation.completed = completed
              task.taskInformation.progress = `${Math.round(completed / total * 100)} %`
            }
            if (task.taskInformation.progress === '100 %' && task.taskInformation.status === 'Download') {
              task.taskInformation.status = 'Completing'
            }
          })
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          console.log(`Task ${this.frontId} completed with status: ${response.status}`)
          task.resolve(response)
        } catch (error) {
          task.reject(error)
        } finally {
          const taskId = this.tasks.get(this.frontId).taskInformation.id
          removeBackgroundWork(taskId)
          const thisTaskIndex = this.taskNameInQueue.findIndex((element) => element === task.taskInformation.name)
          this.taskNameInQueue.splice(thisTaskIndex, 1)
          this.tasks.delete(this.frontId)
        }
        this.frontId = this.findNextTaskId()
      }
    } finally {
      this.initialize()
    }
  }

  private findNextTaskId(): number {
    let nextId = this.frontId + 1
    while (nextId <= this.rearId && !this.tasks.has(nextId)) {
      nextId++
    }
    return nextId
  }
}

const PRESETMODELS = [
  {
    id: 1,
    task: 'Text Generation',
    title: 'llama3.2:1b',
    detail: 'https://ollama.com/library/llama3.2:1b',
    provider: 'Local' as ProviderT,
    name: 'llama3.2:1b',
    installMethod: 'pull',
    modelfile: '',
    isAvailable: false,
    isPullingQueue: false,
  },
  {
    id: 2,
    task: 'Text Generation',
    title: 'llama-3.2-Korean-Bllossom-3B.Q4_K_M',
    detail: 'https://huggingface.co/QuantFactory/llama-3.2-Korean-Bllossom-3B-GGUF',
    provider: 'Local' as ProviderT,
    name: 'llama-3.2-Korean-Bllossom-3B.Q4_K_M',
    installMethod: 'create',
    sourceURL: 'https://huggingface.co/QuantFactory/llama-3.2-Korean-Bllossom-3B-GGUF/resolve/main/llama-3.2-Korean-Bllossom-3B.Q4_K_M.gguf',
    modelFile: `
TEMPLATE """<|start_header_id|>system<|end_header_id|>

Cutting Knowledge Date: December 2023

{{ if .System }}{{ .System }}
{{- end }}
{{- if .Tools }}When you receive a tool call response, use the output to format an answer to the orginal user question.

You are a helpful assistant with tool calling capabilities.
{{- end }}<|eot_id|>
{{- range $i, $_ := .Messages }}
{{- $last := eq (len (slice $.Messages $i)) 1 }}
{{- if eq .Role "user" }}<|start_header_id|>user<|end_header_id|>
{{- if and $.Tools $last }}

Given the following functions, please respond with a JSON for a function call with its proper arguments that best answers the given prompt.

Respond in the format {"name": function name, "parameters": dictionary of argument name and its value}. Do not use variables.

{{ range $.Tools }}
{{- . }}
{{ end }}
{{ .Content }}<|eot_id|>
{{- else }}

{{ .Content }}<|eot_id|>
{{- end }}{{ if $last }}<|start_header_id|>assistant<|end_header_id|>

{{ end }}
{{- else if eq .Role "assistant" }}<|start_header_id|>assistant<|end_header_id|>
{{- if .ToolCalls }}
{{ range .ToolCalls }}
{"name": "{{ .Function.Name }}", "parameters": {{ .Function.Arguments }}}{{ end }}
{{- else }}

{{ .Content }}
{{- end }}{{ if not $last }}<|eot_id|>{{ end }}
{{- else if eq .Role "tool" }}<|start_header_id|>ipython<|end_header_id|>

{{ .Content }}<|eot_id|>{{ if $last }}<|start_header_id|>assistant<|end_header_id|>

{{ end }}
{{- end }}
{{- end }}"""`,
    isAvailable: false,
    isPullingQueue: false,
  },
  {
    id: 3,
    task: 'Text Generation',
    title: 'EXAONE-3.0-7.8B-Q5_K_M',
    detail: 'https://huggingface.co/bartowski/EXAONE-3.0-7.8B-Instruct-GGUF/blob/main/EXAONE-3.0-7.8B-Instruct-Q5_K_M.gguf',
    provider: 'Local' as ProviderT,
    name: 'EXAONE-3.0-7.8B-Q5_K_M',
    installMethod: 'create',
    sourceURL: 'https://huggingface.co/bartowski/EXAONE-3.0-7.8B-Instruct-GGUF/resolve/main/EXAONE-3.0-7.8B-Instruct-Q5_K_M.gguf',
    modelFile: `
    TEMPLATE """
{{- if .System -}}
\[|system|]{{.System}}\[|endofturn|]
{{- end }}
\[|user|]{{.Prompt}}\n
\[|assistant|]{{.Response}}\[|endofturn|]
"""`,
    isAvailable: false,
    isPullingQueue: false,
  },
  {
    id: 4,
    task: 'Embedding',
    title: 'nomic-embed-text',
    detail: 'https://ollama.com/library/nomic-embed-text',
    provider: 'Local' as ProviderT,
    name: 'nomic-embed-text',
    installMethod: 'pull',
    isAvailable: false,
    isPullingQueue: false,
  }
]

export const useLanguageModel = createGlobalState(
  () => {
    //state
    const models = ref<ModelDataT[]>([])
    const ollamaModels = ref<ModelDataT[]>([])
    const isOllamaExisting = ref(false)
    const checkingOllamaInstallation = ref(true)
    const connectionInformation = ref<ConnectionInformationT[]>([])
    const addModelQueue = new TaskQueue()
    const presetModels = ref(PRESETMODELS)
    const isPulling = ref<boolean>(false)
    const isCreating = ref<boolean>(false)
    //actions
    const getConnectionInformation = async (): Promise<Response> => {
      try {
        const response = await fetchData('local-server/connection')
        if (response.ok) {
          const data = await response.json()
          connectionInformation.value = data
        } else {
          throw new Error('Fail to get connection Information from Local Server')
        }
        return new Response(null, { status: 200, statusText: 'OK' })
      } catch (error) {
        return new Response(null, { status: 500, statusText: `Error Get Connection Information: ${error}` })
      }
    }
    const updateConnectionInformation = async (provider: string, value: string) => {
      try {
        const response = await fetchData(`local-server/connection/${provider}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: value }),
        })
        if (response.ok) {
          const information = connectionInformation.value.find(item => item.provider === provider)
          information.value = value
        } else {
          throw new Error('Fail to get connection Information from Local Server')
        }
        return new Response(null, { status: 200, statusText: 'OK' })
      } catch (error) {
        return new Response(null, { status: 500, statusText: `Error Get Connection Information: ${error}` })
      }
    }
    const checkOllamaInstallation = async () => {
      checkingOllamaInstallation.value = true
      try {
        // const response = await window.api.getOllamaModels()
        // const lines: string[] = response.trim().split('\n').slice(1)
        // isOllamaExisting.value = true
        // ollamaModels.value = lines.map((line: string) => line.split(/\s+/)[0]);
        isOllamaExisting.value = await window.api.checkOllamaInstallation()
        return new Response(null, { status: 200, statusText: 'OK' })
      } catch (error) {
        isOllamaExisting.value = false
        return new Response(null, { status: 500, statusText: `Error to check ollama installation: ${error}` })
      } finally {
        checkingOllamaInstallation.value = false
      }
    }
    const getModels = async () => {
      const response = await fetchData('local-server/model')
      if (response.ok) {
        const data: ModelDataT[] = await response.json()
        models.value = data
        ollamaModels.value = data.filter(item => item.provider === 'Local')
      }
    }
    const getPresetModels = () => {
      presetModels.value.forEach((item) => {
        const ollamaModelIndex = ollamaModels.value.findIndex((model) => model.name === item.title)
        if (ollamaModelIndex >= 0) {
          item.isAvailable = true
        } else {
          item.isAvailable = false
        }
        const modelInQueueIndex = addModelQueue.taskNameInQueue.findIndex((model) => model === item.title)
        if (modelInQueueIndex >= 0) {
          item.isPullingQueue = true
        } else {
          item.isPullingQueue = false
        }
      })
    }
    const pullOllamaModel = async (modelInformation: ModelInformationT, onProgress: (total: number, completed: number) => void): Promise<Response> => {
      try {
        const { name, title, task, provider } = modelInformation
        const ollamaConnection = connectionInformation.value.find(element => element.provider === 'Local')
        const url = ollamaConnection.value + '/api/pull'
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name }),
        })
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            if (!(title === name)) {
              const createUrl = ollamaConnection.value + '/api/copy'
              const response = await fetch(createUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ source: name, destination: title }),
              })
              if (response.ok) {
                const deleteUrl = ollamaConnection.value + '/api/delete'
                const deleteResponse = await fetch(deleteUrl, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ name: name }),
                })
                if (!deleteResponse.ok) throw new Error()
              }
            }
            const data: ModelDataT[] = [
              {
                provider: provider,
                name: title,
                task: task
              }
            ]
            const localResponse = await fetchData('local-server/model', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: data })
            })
            if (!localResponse.ok) {
              throw new Error(`Error saving model data: ${localResponse.statusText}`)
            }
            break
          }
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.trim() !== '') {
              try {
                const data = JSON.parse(line)
                if (data?.total > 0) {
                  if (data?.completed > 0) {
                    onProgress(data.total, data.completed)
                  } else {
                    onProgress(data.total, 0)
                  }
                }
                // Check for error in the response
                if (data.error) {
                  throw new Error(data.error)
                }
              } catch (parseError) {
                throw new Error(parseError)
              }
            }
          }
        }
        return new Response(null, { status: 200, statusText: 'OK' })
      } catch (error) {
        return new Response(null, { status: 500, statusText: error.message })
      }
    }

    const createOllamaPresetModel = async (modelInformation: ModelInformationT, onProgress: (total: number, completed: number) => void): Promise<Response> => {
      const downloadProgress = (total: number, completed: number) => {
        onProgress(total, completed)
      }
      const removeListener = window.api.onDownloadProgress(downloadProgress)
      try {
        if (connectionInformation.value.length === 0) await getConnectionInformation()
        //'https://huggingface.co/MLP-KTLim/llama-3-Korean-Bllossom-8B-gguf-Q4_K_M/resolve/main/llama-3-Korean-Bllossom-8B-Q4_K_M.gguf'
        // 'https://news.samsung.com/medialibrary/download/56731/large'

        const { sourceURL, modelFile, name, task, provider } = modelInformation
        const targetPath = connectionInformation.value.find(item => item.provider === 'data_file_path').value
        const modelPath = await window.api.downloadFileFromUrl(sourceURL, targetPath)
        if (modelPath.includes('Error to Download GGUF')) throw new Error()
        const MODELFILE = `FROM ${modelPath} ${modelFile}`
        const ollamaConnection = connectionInformation.value.find(element => element.provider === 'Local')
        const url = ollamaConnection.value + '/api/create'
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name, modelfile: MODELFILE }),
        })
        if (!response.ok) throw new Error()
        const reader = response.body.getReader()
        while (true) {
          const { done } = await reader.read()
          if (done) {
            const data: ModelDataT[] = [
              {
                provider: provider,
                name: name,
                task: task
              }
            ]
            const response = await fetchData('local-server/model', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: data })
            })
            if (!response.ok) throw new Error()
            break
          }
        }
        return new Response(null, { status: 200, statusText: 'OK' })
      } catch (error) {
        return new Response(null, { status: 500, statusText: `Error Creating Model: ${error}` })
      } finally {
        removeListener()
      }
    }
    const createOllamaModel = async (modelName: string) => {

    }
    const deleteOllamaModel = async (id: number, modelName: string) => {
      const ollamaConnection = connectionInformation.value.find(element => element.provider === 'Local')
      const url = ollamaConnection.value + '/api/delete'
      const response1 = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName }),
      })
      if (response1.ok) {
        const response2 = await fetchData(`local-server/model/${id}`, {
          method: 'DELETE',
        })
        if (response2.ok) await getModels()
      }
    }
    return {
      models,
      ollamaModels,
      isOllamaExisting,
      checkingOllamaInstallation,
      connectionInformation,
      addModelQueue,
      presetModels,
      isPulling,
      isCreating,
      getConnectionInformation,
      updateConnectionInformation,
      checkOllamaInstallation,
      getModels,
      getPresetModels,
      pullOllamaModel,
      createOllamaPresetModel,
      createOllamaModel,
      deleteOllamaModel
    }
  }
)