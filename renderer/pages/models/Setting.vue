<template>
    <div class="flex flex-col space-y-7 px-1">
        <div class="flex justify-between">
            <div class="relative w-[50%]">
                <SelectItem :options="options" :selectedItem="modes[activeModeIndex].name" textSize="base"
                    @selectionChanged="changeActiveMode"
                    class="bg-light-surface-high dark:bg-dark-surface-high rounded-md" />
                <span class="absolute -top-5 left-1 text-xs opacity-50">Select a mode to edit</span>
            </div>
            <div v-show="showActionButtons" class="flex space-x-3">
                <button @click="onReset" class="cc-negative-button">
                    RESET
                </button>
                <button @click="onSave" class="cc-positive-button">
                    SAVE
                </button>
            </div>
        </div>
        <div>
            <div class="mb-2">
                <span class="border-l-2 border-primary px-2 font-bold">Description</span>
            </div>
            <textarea ref="descriptionTextarea"
                class="resize-none w-full max-h-[330px] px-3 py-2 rounded-md bg-light-surface-high dark:bg-dark-surface-high focus:outline-none focus:ring-2 focus:ring-primary placeholder-opacity-50"
                :value="modeModel.description" @input="(event) => inputChange('description', event)"></textarea>
        </div>
        <div>
            <div class="mb-2">
                <span class="border-l-2 border-primary px-2 font-bold">Prompt</span>
            </div>
            <textarea ref="promptTextarea"
                class="resize-none w-full max-h-[330px] px-3 py-2 rounded-md bg-light-surface-high dark:bg-dark-surface-high focus:outline-none focus:ring-2 focus:ring-primary placeholder-opacity-50"
                :value="modeModel.prompt" @input="(event) => inputChange('prompt', event)"></textarea>
        </div>
        <div>
            <div class="mb-2">
                <span class="border-l-2 border-primary px-2 font-bold">Parameters</span>
            </div>
            <div class="flex flex-wrap justify-between">
                <div class="relative flex m-2 w-[45%]">
                    <span class="absolute -top-2 left-20 text-xs opacity-70">Max Tokens</span>
                    <div
                        class="w-24 px-2 py-1 w-16 h-8 mr-2 text-right rounded-md bg-light-surface-high dark:bg-dark-surface-high">
                        {{
                            modeModel.max_tokens }}</div>
                    <input :value="modeModel.max_tokens" @input="(event) => inputChange('max_tokens', event)"
                        type="range" step="256" min="256" max="10240" class="w-full">
                </div>
                <div class="relative flex m-2 w-[45%]">
                    <span class="absolute -top-2 left-20 text-xs opacity-70">Temperature</span>
                    <div
                        class="w-24 px-2 py-1 w-16 h-8 mr-2 text-right rounded-md bg-light-surface-high dark:bg-dark-surface-high">
                        {{
                            modeModel.temperature }}</div>
                    <input :value="modeModel.temperature" @input="(event) => inputChange('temperature', event)"
                        type="range" step="0.05" min="0" max="1" class="w-full">
                </div>
                <div class="relative flex m-2 w-[45%]">
                    <span class="absolute -top-2 left-20 text-xs opacity-70">Top P</span>
                    <div
                        class="w-24 px-2 py-1 w-16 h-8 mr-2 text-right rounded-md bg-light-surface-high dark:bg-dark-surface-high">
                        {{
                            modeModel.top_probability }}</div>
                    <input :value="modeModel.top_probability" @input="(event) => inputChange('top_probability', event)"
                        type="range" step="0.05" min="0" max="1" class="w-full">
                </div>
                <div class="relative flex m-2 w-[45%]">
                    <span class="absolute -top-2 left-20 text-xs opacity-70">Top K</span>
                    <div
                        class="w-24 px-2 py-1 w-16 h-8 mr-2 text-right rounded-md bg-light-surface-high dark:bg-dark-surface-high">
                        3</div>
                    <input :value="modeModel.top_probability" @input="(event) => inputChange('top_probability', event)"
                        type="range" step="0.05" min="0" max="1" class="w-full">
                </div>
                <div class="relative flex m-2 w-[45%]">
                    <span class="absolute -top-2 left-20 text-xs opacity-70">Frequency Penalty</span>
                    <div
                        class="w-24 px-2 py-1 w-16 h-8 mr-2 text-right rounded-md bg-light-surface-high dark:bg-dark-surface-high">
                        {{
                            modeModel.frequency_penalty }}</div>
                    <input :value="modeModel.frequency_penalty"
                        @input="(event) => inputChange('frequency_penalty', event)" type="range" step="0.05" min="0"
                        max="1" class="w-full">
                </div>
                <div class="relative flex m-2 w-[45%]">
                    <span class="absolute -top-2 left-20 text-xs opacity-70">Presence Penalty</span>
                    <div
                        class="w-24 px-2 py-1 w-16 h-8 mr-2 text-right rounded-md bg-light-surface-high dark:bg-dark-surface-high">
                        {{
                            modeModel.presence_penalty }}</div>
                    <input :value="modeModel.presence_penalty"
                        @input="(event) => inputChange('presence_penalty', event)" type="range" step="0.05" min="0"
                        max="1" class="w-full">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { modes, readModes, updateMode } = useMode()
let options: string[] = []
const defaultMode: ModeT = {
    name: 'name',
    category:'chat',
    description: 'description',
    prompt: 'prompt',
    temperature: 0,
    max_tokens: 4096,
    top_probability: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
}
const defaultChangeStatus: { [key in keyof ModeT]: boolean } = {
    name: false,
    category:false,
    description: false,
    prompt: false,
    temperature: false,
    max_tokens: false,
    top_probability: false,
    frequency_penalty: false,
    presence_penalty: false,
}
const valueChangeStatus = ref(defaultChangeStatus)
const showActionButtons = ref<boolean>(false)
const activeModeIndex = ref(0)
const modeModel = ref<ModeT>(defaultMode)
const descriptionTextarea = ref<HTMLTextAreaElement>()
const promptTextarea = ref<HTMLTextAreaElement>()
const { textarea: descriptionArea } = useTextareaAutosize({ element: descriptionTextarea, input: modeModel.value.description, watch: () => modeModel.value.description })
const { textarea: promptArea } = useTextareaAutosize({ element: promptTextarea, input: modeModel.value.prompt, watch: () => modeModel.value.prompt })

const inputChange = (key: keyof ModeT, event: Event) => {
    const target = event.target as HTMLTextAreaElement | HTMLInputElement
    if (key === 'description' || key === 'prompt' || key === 'name' || key === 'category') {
        modeModel.value[key] = target.value
    } else {
        modeModel.value[key] = Number(target.value)
    }
    valueChangeStatus.value[key] = !(target.value === modes.value[activeModeIndex.value][key])
    console.log(target.value === modes.value[activeModeIndex.value][key])
    showActionButtons.value = Object.values(valueChangeStatus.value).some(value => value === true)
}

const changeActiveMode = (selectedMode: string) => {
    const newModeIndex = modes.value.findIndex((item) => item.name === selectedMode)
    activeModeIndex.value = newModeIndex
    onReset()
}

const onSave = async () => {
    const response = await updateMode(modeModel.value)
    if (response.ok) {
        await readModes()
        onReset()
    }
}

const onReset = () => {
    const { cloned } = useCloned(modes.value[activeModeIndex.value])
    modeModel.value = cloned.value
    valueChangeStatus.value = defaultChangeStatus
    showActionButtons.value = false
}
onMounted(async () => {
    if (modes.value.length === 0) {
        await readModes()
    }
    onReset()
    options = modes.value.map((item) => item.name)
})
</script>

<style scoped></style>