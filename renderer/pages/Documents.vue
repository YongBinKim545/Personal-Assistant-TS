<template>
    <div class="flex flex-col mx-10 w-full items-center">
        <div class="flex w-full max-w-[1200px] mt-8 mb-3">
            <AddLocalDocuments />
        </div>
        <div class="flex space-x-5 w-full max-w-[1200px] h-full border-t">
            <Datasets class="w-[55%]"/>
            <DatasetDetail class="w-[45%]"/>
        </div>
    </div>
</template>
<script setup lang="ts">
</script>