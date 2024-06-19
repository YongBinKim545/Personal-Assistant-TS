<template>
    <div class="group relative dropdown tracking-wide">
        <div
            class="bg-light-surface-high dark:bg-dark-surface-high hidden group-hover:block dropdown-menu absolute h-auto w-full z-10 bottom-full p-2 rounded-md">
            <ul class="bottom-0 space-y-1">
                <li class="hover:bg-light-surface-highest hover:dark:bg-dark-surface-highest p-2 rounded-md">Item1
                </li>
                <li class="hover:bg-light-surface-highest hover:dark:bg-dark-surface-highest p-2 rounded-md">Item2
                </li>
                <li class="hover:bg-light-surface-highest hover:dark:bg-dark-surface-highest p-2 rounded-md">Item3
                </li>
                <li class="hover:bg-light-surface-highest hover:dark:bg-dark-surface-highest p-2 rounded-md">Item4
                </li>
                <li class="hover:bg-light-surface-highest hover:dark:bg-dark-surface-highest p-2 rounded-md">Item5
                </li>
            </ul>
        </div>
        <div class="flex justify-between items-center p-2 rounded-md font-bold hover:cursor-pointer">
            <span class="uppercase">background works</span>
            <div class="h-6 w-6 bg-primary text-primary-on rounded-full text-center">
                5
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.transition-all {
    transition: all 0.3s ease-in-out;
}
</style>