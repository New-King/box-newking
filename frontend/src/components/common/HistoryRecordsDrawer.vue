<template>
  <SideDrawer :visible="visible" @close="close">
    <template #header>
      <div class="flex min-w-0 items-center gap-2 sm:gap-3">
        <span
          class="rounded-lg p-1.5 sm:rounded-xl sm:p-2"
          :class="isDarkMode ? 'bg-white/10 text-zinc-100' : 'bg-zinc-100 text-zinc-900'"
        >
          <HistoryIcon class="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </span>
        <div
          class="grid min-w-0 flex-1 grid-cols-2 rounded-xl border p-1"
          :class="isDarkMode ? 'border-zinc-700 bg-[#2c2c2e]' : 'border-slate-200/80 bg-slate-100/80'"
        >
          <button
            type="button"
            class="truncate rounded-lg px-2 py-1.5 text-xs font-semibold transition-all duration-300 sm:px-3 sm:text-sm"
            :class="tabClass('retrieve')"
            @click="setActiveTab('retrieve')"
          >
            {{ t('retrieve.recordsDrawer') }}
          </button>
          <button
            type="button"
            class="truncate rounded-lg px-2 py-1.5 text-xs font-semibold transition-all duration-300 sm:px-3 sm:text-sm"
            :class="tabClass('send')"
            @click="setActiveTab('send')"
          >
            {{ t('send.sendRecords') }}
          </button>
        </div>
      </div>
    </template>

    <SentRecordList
      v-if="activeTab === 'send'"
      :records="sendRecords"
      @copy-link="copySentRecordLink"
      @view-details="viewSentDetails"
      @delete-record="deleteSentRecord"
    />
    <FileRecordList
      v-else
      :records="retrieveRecords"
      @view-details="viewRetrieveDetails"
      @download-record="downloadRetrieveRecord"
      @delete-record="deleteRetrieveRecord"
    />
  </SideDrawer>

  <SentRecordDetailModal
    :record="selectedSentRecord"
    :get-q-r-code-value="getSentQRCodeValue"
    @close="closeSentDetails"
    @copy-code="copySentRecordCode"
    @copy-link="copySentRecordLink"
    @copy-curl="copySentRecordCurlCommand"
    @copy-wget="copySentRecordWgetCommand"
  />

  <FileDetailModal
    :visible="!!selectedRetrieveRecord"
    :record="selectedRetrieveRecord"
    @close="closeRetrieveDetails"
    @preview-content="openContentPreview"
  />

  <ContentPreviewModal
    :visible="showContentPreview"
    :rendered-content="renderedContent"
    @close="closeContentPreview"
    @copy-content="copyRetrieveContent"
  />
</template>

<script setup lang="ts">
import { HistoryIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import SideDrawer from '@/components/common/SideDrawer.vue'
import SentRecordList from '@/components/common/SentRecordList.vue'
import FileRecordList from '@/components/common/FileRecordList.vue'
import SentRecordDetailModal from '@/components/common/SentRecordDetailModal.vue'
import FileDetailModal from '@/components/common/FileDetailModal.vue'
import ContentPreviewModal from '@/components/common/ContentPreviewModal.vue'
import { useHistoryRecordsDrawer, useInjectedDarkMode } from '@/composables'
import type { HistoryRecordsTab } from '@/composables/useHistoryRecordsDrawer'

const { t } = useI18n()
const isDarkMode = useInjectedDarkMode()
const {
  visible,
  activeTab,
  retrieveRecords,
  sendRecords,
  selectedSentRecord,
  selectedRetrieveRecord,
  showContentPreview,
  renderedContent,
  close,
  setActiveTab,
  viewSentDetails,
  closeSentDetails,
  deleteSentRecord,
  copySentRecordCode,
  copySentRecordLink,
  copySentRecordCurlCommand,
  copySentRecordWgetCommand,
  getSentQRCodeValue,
  viewRetrieveDetails,
  closeRetrieveDetails,
  deleteRetrieveRecord,
  downloadRetrieveRecord,
  openContentPreview,
  closeContentPreview,
  copyRetrieveContent
} = useHistoryRecordsDrawer()

const tabClass = (tab: HistoryRecordsTab) => {
  const isActive = activeTab.value === tab
  if (isActive) {
    return isDarkMode.value
      ? 'bg-zinc-200 text-zinc-950 shadow-[0_8px_22px_-12px_rgba(255,255,255,0.45)]'
      : 'bg-white text-zinc-950 shadow-sm'
  }
  return isDarkMode.value ? 'text-zinc-500 hover:text-zinc-100' : 'text-slate-500 hover:text-zinc-950'
}
</script>
