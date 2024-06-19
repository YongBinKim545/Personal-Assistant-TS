<template>
    <div class="w-[250px] text-right">
        <SelectItem @selectionChanged="(newModel) => { selectedModel = newModel.name }" :options="options"
            :selectedItem="selectedModel || null" textAlign="end" defaultMessage="모델 선택" />
        <div class="text-xs mt-2 text-light-surface-on-muted dark:text-dark-surface-on-muted">기본값으로 설정</div>
    </div>
</template>

<script setup lang="ts">
const selectedModel = ref('')
const options = [
    {
        name: 'Gemini'
    },
    {
        name: 'OpenAI'
    },
    {
        name: 'llama3'
    }
]
</script>

<style scoped></style>