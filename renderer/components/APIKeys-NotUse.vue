<template>
    <div class="grow mr-2 mt-2 p-4 pt-2 rounded-xl bg-light-surface-lowest dark:bg-dark-surface-lowest flex flex-col h-2/5">
        <div class="p-2 m-2 font-bold">
            <span>API KEYS</span>
        </div>
        <hr class="h-px">
        <DataTable @onEdit="editAPIKey" editAction :headers="[{headername:'Name', datakey:'name'},{headername:'apikey', datakey:'api_key'},{headername:'Action', datakey:'action'}]"
            :contents="apiKeys">
        </DataTable>
        <Modal :isShow="showModal" title="edit api key" @close="closeDialog">
            <template v-slot:body>
                <div class="flex space-x-2 items-center">
                    <span class="uppercase font-bold">{{ apiKeys[indexToEdit].name }}</span>
                    <input v-model="newAPIKey"
                        :placeholder="(newAPIKey === undefined || newAPIKey === '') ? 'ENTER API KEY' : ''" type="text"
                        class="cc-input text-sm w-[300px]">
                    <button class="cc-btn flex justify-center w-[80px]" @click="onSave">
                        SAVE
                    </button>
                </div>
                <!-- <Alert :isShow="showAlert" alertMessage="Invalid API KEY!!" @close="showAlert = false" class="mt-3" /> -->
            </template>
        </Modal>
        <Toast :isShow="showToast" :toastID="toastID" @close="closeToast"/>
    </div>
</template>

<script setup lang="ts">

const { apiKeys } = useAPIKeys()
const { createToast,removeToast } = useToast()
const showModal = ref(false)
const showToast = ref(false)
const toastID = ref(null)
const indexToEdit = ref(0)
const newAPIKey = ref(null)
const editAPIKey = (id: number) => {
    const itemIndex = apiKeys.value.findIndex((item)=>item.id === id)
    indexToEdit.value = itemIndex
    showModal.value = true
    newAPIKey.value = apiKeys.value[itemIndex].api_key
}
const onSave = async () => {
    if (newAPIKey.value === undefined || newAPIKey.value === null || newAPIKey.value === '') {
        toastID.value = createToast({
            variant:'warning',
            message:'No API Key to Save',
        })
        showToast.value = true
        return
    }
    const payload = {
        id: apiKeys.value[indexToEdit.value].id,
        data: {
            api_key: newAPIKey.value
        }
    }
    // const response = await window.api.updateAPIKey(payload)
    const response = 1
    if (response) {
        apiKeys.value[indexToEdit.value].api_key = newAPIKey.value
        toastID.value = createToast({
            variant:'success',
            message:'API Key Added Successfully',
        })
        closeDialog()
        showToast.value = true
    }
}
const closeDialog = () => {
    showModal.value = false
}
const closeToast = (id:string)=>{
    removeToast(id)
    showToast.value = false
}
</script>