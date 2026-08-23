import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ROUTES } from '@/constants'
import { useAlertStore } from '@/stores/alertStore'
import { useFileDataStore } from '@/stores/fileData'
import type { ReceivedFileRecord, SentFileRecord } from '@/types'
import { copyToClipboard } from '@/utils/clipboard'
import { getErrorMessage } from '@/utils/common'
import { renderMarkdownPreview } from '@/utils/content-preview'
import { downloadReceivedRecord } from '@/utils/download-action'
import { createSentRecordActions } from '@/utils/sent-record-actions'

export type HistoryRecordsTab = 'retrieve' | 'send'

const visible = ref(false)
const activeTab = ref<HistoryRecordsTab>('retrieve')
const selectedSentRecord = ref<SentFileRecord | null>(null)
const selectedRetrieveRecord = ref<ReceivedFileRecord | null>(null)
const showContentPreview = ref(false)
const renderedContent = ref('')

export function useHistoryRecordsDrawer() {
  const route = useRoute()
  const { t } = useI18n()
  const alertStore = useAlertStore()
  const fileStore = useFileDataStore()
  const { receiveData: retrieveRecords, shareData: sendRecords } = storeToRefs(fileStore)

  const notify = (message: string, type: 'success' | 'error') => {
    alertStore.showAlert(message, type)
  }

  const sentRecordActions = createSentRecordActions(notify)

  const defaultTab = computed<HistoryRecordsTab>(() =>
    route.path === ROUTES.SEND ? 'send' : 'retrieve'
  )

  const drawerTitle = computed(() =>
    activeTab.value === 'send' ? t('send.sendRecords') : t('retrieve.recordsDrawer')
  )

  const open = (tab?: HistoryRecordsTab) => {
    activeTab.value = tab ?? defaultTab.value
    visible.value = true
  }

  const close = () => {
    visible.value = false
  }

  const toggle = () => {
    if (visible.value) {
      close()
      return
    }
    open()
  }

  const setActiveTab = (tab: HistoryRecordsTab) => {
    activeTab.value = tab
  }

  const viewSentDetails = (record: SentFileRecord) => {
    selectedSentRecord.value = record
  }

  const closeSentDetails = () => {
    selectedSentRecord.value = null
  }

  const deleteSentRecord = (id: number) => {
    const index = fileStore.shareData.findIndex((record) => record.id === id)
    if (index !== -1) {
      fileStore.deleteShareData(index)
    }
  }

  const viewRetrieveDetails = (record: ReceivedFileRecord) => {
    selectedRetrieveRecord.value = record
  }

  const closeRetrieveDetails = () => {
    selectedRetrieveRecord.value = null
  }

  const deleteRetrieveRecord = (id: number) => {
    const index = fileStore.receiveData.findIndex((record) => record.id === id)
    if (index !== -1) {
      fileStore.deleteReceiveData(index)
    }
  }

  const downloadRetrieveRecord = async (record: ReceivedFileRecord) => {
    try {
      await downloadReceivedRecord(record)
    } catch (err: unknown) {
      alertStore.showAlert(getErrorMessage(err, t('common.downloadFailed')), 'error')
    }
  }

  const openContentPreview = () => {
    showContentPreview.value = true
  }

  const closeContentPreview = () => {
    showContentPreview.value = false
  }

  const copyRetrieveContent = async () => {
    if (!selectedRetrieveRecord.value?.content) return
    await copyToClipboard(selectedRetrieveRecord.value.content, {
      successMsg: t('fileRecord.contentCopied'),
      errorMsg: t('fileRecord.copyFailed'),
      notify
    })
  }

  watch(
    () => selectedRetrieveRecord.value?.content,
    async (content) => {
      if (content) {
        renderedContent.value = await renderMarkdownPreview(content)
      } else {
        renderedContent.value = ''
      }
    },
    { immediate: true }
  )

  watch(
    () => route.path,
    () => {
      if (!visible.value) {
        activeTab.value = defaultTab.value
      }
    }
  )

  return {
    visible,
    activeTab,
    defaultTab,
    drawerTitle,
    retrieveRecords,
    sendRecords,
    selectedSentRecord,
    selectedRetrieveRecord,
    showContentPreview,
    renderedContent,
    open,
    close,
    toggle,
    setActiveTab,
    viewSentDetails,
    closeSentDetails,
    deleteSentRecord,
    copySentRecordCode: sentRecordActions.copyCode,
    copySentRecordLink: sentRecordActions.copyLink,
    copySentRecordCurlCommand: sentRecordActions.copyCurlCommand,
    copySentRecordWgetCommand: sentRecordActions.copyWgetCommand,
    getSentQRCodeValue: sentRecordActions.getQRCodeValue,
    viewRetrieveDetails,
    closeRetrieveDetails,
    deleteRetrieveRecord,
    downloadRetrieveRecord,
    openContentPreview,
    closeContentPreview,
    copyRetrieveContent
  }
}
