<template>
    <div class="w-[250px]">
        <SelectItem @selectionChanged="(newModel) => { selectedMode = newModel.name }" :options="options"
            :selectedItem="selectedMode || null" textAlign="start" defaultMessage="모드 선택" />
            <div class="text-xs mt-2 text-light-surface-on-muted dark:text-dark-surface-on-muted">기본값으로 설정</div>
    </div>
</template>

<script setup lang="ts">
const selectedMode = ref('')
const options = [
    {
        name: 'LLM 채팅'
    },
    {
        name: '문서 기반 채팅'
    },
    {
        name: '검색 기반 채팅'
    },
    {
        name:'Email 작성'
    }
]

</script>

<style scoped></style>