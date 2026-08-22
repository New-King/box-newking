import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORAGE_KEYS } from '@/constants'
import type { ReceivedFileRecord, SentFileRecord } from '@/types'
import { readStoredRecords, writeStoredRecords } from '@/utils/record-storage'

export const useFileDataStore = defineStore('fileData', () => {
  const receiveData = ref<ReceivedFileRecord[]>(
    readStoredRecords<ReceivedFileRecord>(STORAGE_KEYS.RECEIVE_RECORDS)
  )
  const shareData = ref<SentFileRecord[]>(
    readStoredRecords<SentFileRecord>(STORAGE_KEYS.SEND_RECORDS)
  )

  const persistReceiveData = () => {
    writeStoredRecords(STORAGE_KEYS.RECEIVE_RECORDS, receiveData.value)
  }

  const persistShareData = () => {
    writeStoredRecords(STORAGE_KEYS.SEND_RECORDS, shareData.value)
  }

  const addReceiveData = (record: ReceivedFileRecord) => {
    receiveData.value.push(record)
    persistReceiveData()
  }

  const removeReceiveData = (id: number) => {
    const index = receiveData.value.findIndex((record) => record.id === id)
    if (index !== -1) {
      receiveData.value.splice(index, 1)
      persistReceiveData()
    }
  }

  const deleteReceiveData = (index: number) => {
    if (index >= 0 && index < receiveData.value.length) {
      receiveData.value.splice(index, 1)
      persistReceiveData()
    }
  }

  const clearReceiveData = () => {
    receiveData.value = []
    persistReceiveData()
  }

  const addShareDataRecord = (record: SentFileRecord) => {
    shareData.value.push(record)
    persistShareData()
  }

  const deleteShareData = (index: number) => {
    if (index >= 0 && index < shareData.value.length) {
      shareData.value.splice(index, 1)
      persistShareData()
    }
  }

  const clearShareData = () => {
    shareData.value = []
    persistShareData()
  }

  return {
    receiveData,
    shareData,
    addReceiveData,
    removeReceiveData,
    deleteReceiveData,
    clearReceiveData,
    addShareDataRecord,
    deleteShareData,
    clearShareData
  }
})
