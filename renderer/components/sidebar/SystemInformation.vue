<template>
    <div class="p-4 bg-light-surface-high dark:bg-dark-surface-high">
        <div class="text-base font-bold uppercase mb-2">시스템 정보</div>
        <div class="text-xs flex justify-between mb-4">
            <div class="space-y-2">
                <div>{{ `CPU: ${systemMetric.cpuUsage}%` }}</div>
                <div class="bar bg-light-surface-lowest dark:bg-dark-surface-lowest">
                    <div ref="cpuBarElement" class="bg-primary bar-inner"></div>
                </div>
            </div>
            <div class="space-y-2">
                <div>{{ `RAM:${systemMetric.memoryUsage}/${systemMetric.memoryTotal}GB` }}</div>
                <div class="bar bg-light-surface-lowest dark:bg-dark-surface-lowest">
                    <div ref="memoryBarElement" class="bg-primary bar-inner"></div>
                </div>
            </div>
            <div class="space-y-2">
                <div>GPU: -- % </div>
                <div class="bar bg-light-surface-lowest dark:bg-dark-surface-lowest">
                    <div ref="gpuBarElement" class="bg-primary bar-inner"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const cpuBarElement = ref(null)
const memoryBarElement = ref(null)
const systemMetric = ref({
    cpuUsage: 0,
    memoryTotal: 0,
    memoryUsage: 0
})
let oldCPUTimes = 0
let oldCPUIdleTimes = 0
let timerId: any
const getSystemMetric = async () => {
    const { totalCPUTimes, totalCPUIdleTimes, memoryTotal, memoryUsage } = await window.api.getSystemMetric();
    const totalCPUTimeDelta = totalCPUTimes - oldCPUTimes
    const totalCPUIdleTimeDelta = totalCPUIdleTimes - oldCPUIdleTimes
    const cpuUsage = Math.round((totalCPUTimeDelta - totalCPUIdleTimeDelta) / totalCPUTimeDelta * 100)
    oldCPUTimes = totalCPUTimes
    oldCPUIdleTimes = totalCPUIdleTimes
    systemMetric.value = Object.assign({ cpuUsage: cpuUsage, memoryTotal: memoryTotal, memoryUsage: memoryUsage })
    const memoryBarWidth = Math.round(memoryUsage / memoryTotal * 10) / 10
    const cpuBarWidth = cpuUsage / 100
    if (memoryBarElement.value) {
        memoryBarElement.value.style.transform = `scaleX(${memoryBarWidth})`
    }
    if (cpuBarElement.value) {
        cpuBarElement.value.style.transform = `scaleX(${cpuBarWidth})`
    }
}
onMounted(() => {
    timerId = setInterval(getSystemMetric, 2000)
})
onUnmounted(() => {
    clearInterval(timerId)
})
</script>

<style scoped>
.bar {
    width: 90px;
    height: 10px;
    border-radius: 70px;
    overflow: hidden;
}

.bar-inner {
    height: 100%;
    width: 100%;
    margin: 0;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 1s linear;
}
</style>