<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 font-sans transition-colors duration-700 sm:p-8"
    :class="isDarkMode ? 'bg-[#242426] text-[#e0e0e0]' : 'bg-[#f5f5f7] text-zinc-900'"
    @paste.prevent="handlePaste"
  >
    <div class="relative z-10 w-full max-w-md">
      <div
        class="relative overflow-hidden rounded-[2rem] border backdrop-blur-3xl transition-all duration-500 sm:rounded-[2.5rem]"
        :class="
          isDarkMode
            ? 'border-white/10 bg-[#343436] shadow-[0_24px_80px_-32px_rgba(255,255,255,0.18)]'
            : 'border-white/70 bg-white/80 shadow-[0_24px_70px_-28px_rgba(24,24,27,0.18)]'
        "
      >
        <div
          class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        ></div>

        <div class="px-5 pb-7 pt-8 sm:px-8 sm:pb-10 sm:pt-12">
          <PageHeader
            :title="headerTitle"
            mode="send"
            @title-click="toRetrieve"
          />
          <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
            <div class="relative">
              <button
                type="button"
                class="absolute right-2.5 top-2.5 z-20 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 sm:right-3 sm:top-3 sm:h-12 sm:w-12"
                :class="
                  isDarkMode
                    ? 'border-zinc-600/80 bg-[#343436]/95 text-zinc-300 backdrop-blur-sm hover:border-zinc-500 hover:text-zinc-100'
                    : 'border-slate-200/80 bg-white/95 text-slate-600 backdrop-blur-sm hover:border-slate-300 hover:text-zinc-900'
                "
                :aria-label="toggleTypeLabel"
                :title="toggleTypeLabel"
                @click.stop="toggleSendType"
              >
                <MorphIcon
                  :icon="toggleIcon"
                  spring="snappy"
                  class="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]"
                  :stroke-width="2"
                />
              </button>

              <transition name="fade" mode="out-in">
                <div v-if="sendType === 'file'" key="file">
                  <FileUploadArea
                    class="payload-panel"
                    :selected-file="selectedFile"
                    :selected-files="selectedFiles"
                    :progress="uploadProgress"
                    :uploaded-bytes="uploadedBytes"
                    :total-bytes="totalBytes"
                    :upload-speed="uploadSpeed"
                    :upload-status="isSubmitting ? 'uploading' : 'idle'"
                    :description="uploadDescription"
                    :accepted-types="acceptedTypes"
                    @file-selected="handleFileSelected"
                    @files-selected="handleFilesSelected"
                    @file-drop="handleFileDrop"
                  />
                </div>
                <div v-else key="text">
                  <TextInputArea
                    v-model="textContent"
                    class="payload-panel"
                    :placeholder="t('send.uploadArea.textInput')"
                  />
                </div>
              </transition>
            </div>
            <ExpirationSelector
              v-model:expiration-method="expirationMethod"
              v-model:expiration-value="expirationValue"
              :options="expirationOptions"
            />
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold tracking-wide transition-all duration-300 sm:rounded-2xl sm:py-4 sm:text-base"
              :class="
                isSubmitting
                  ? isDarkMode
                    ? 'cursor-not-allowed border border-zinc-700/30 bg-zinc-800/50 text-zinc-500'
                    : 'cursor-not-allowed border border-slate-200/50 bg-slate-100 text-slate-400'
                  : isDarkMode
                    ? 'bg-zinc-200 text-zinc-950 shadow-[0_10px_28px_-12px_rgba(255,255,255,0.45)] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_34px_-14px_rgba(255,255,255,0.5)]'
                    : 'bg-zinc-800 text-white shadow-[0_10px_28px_-12px_rgba(24,24,27,0.35)] hover:-translate-y-0.5 hover:bg-zinc-900 hover:shadow-[0_16px_34px_-14px_rgba(24,24,27,0.42)]'
              "
            >
              <LoaderCircleIcon v-if="isSubmitting" class="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
              <SendIcon v-else class="h-4 w-4 sm:h-5 sm:w-5" />
              {{ isSubmitting ? t('send.submitting') : t('send.submit') }}
            </button>
          </form>
        </div>

        <PageFooter
          link-direction="retrieve"
          :link-text="t('send.needRetrieveFile')"
          link-to="/"
        />
      </div>
    </div>

    <SentRecordDetailModal
      :record="selectedRecord"
      :get-q-r-code-value="getQRCodeValue"
      @close="closeDetails"
      @copy-code="copySentRecordCode"
      @copy-link="copySentRecordLink"
      @copy-curl="copySentRecordCurlCommand"
      @copy-wget="copySentRecordWgetCommand"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { File, Type } from 'lucide'
import { MorphIcon } from 'morphicons/vue'
import { LoaderCircleIcon, SendIcon } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import PageFooter from '@/components/common/PageFooter.vue'
import FileUploadArea from '@/components/common/FileUploadArea.vue'
import ExpirationSelector from '@/components/common/ExpirationSelector.vue'
import TextInputArea from '@/components/common/TextInputArea.vue'
import SentRecordDetailModal from '@/components/common/SentRecordDetailModal.vue'
import { useInjectedDarkMode, useSendFlow } from '@/composables'

const isDarkMode = useInjectedDarkMode()
const { t } = useI18n()
const router = useRouter()
const {
  sendType,
  selectedFile,
  selectedFiles,
  textContent,
  expirationMethod,
  expirationValue,
  uploadProgress,
  uploadedBytes,
  totalBytes,
  uploadSpeed,
  acceptedTypes,
  selectedRecord,
  isSubmitting,
  uploadDescription,
  expirationOptions,
  closeDetails,
  copySentRecordCode,
  copySentRecordLink,
  copySentRecordCurlCommand,
  copySentRecordWgetCommand,
  getQRCodeValue,
  handleFileDrop,
  handleFileSelected,
  handleFilesSelected,
  handlePaste,
  handleSubmit
} = useSendFlow()

const toRetrieve = () => {
  router.push('/')
}

const toggleTypeLabel = computed(() =>
  sendType.value === 'file' ? t('send.sendText') : t('nav.sendFile')
)

// 始终显示「切换目标」图标，避免 hover + click 同时触发时 morph 来回跳
const toggleIcon = computed(() => (sendType.value === 'file' ? Type : File))

const headerTitle = computed(() =>
  sendType.value === 'file' ? t('nav.sendFile') : t('send.sendText')
)

const toggleSendType = () => {
  sendType.value = sendType.value === 'file' ? 'text' : 'file'
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

:deep(.payload-panel) {
  height: 10rem;
  min-height: 10rem;
}

:deep(.payload-panel textarea) {
  height: 100%;
}

@media (min-width: 640px) {
  :deep(.payload-panel) {
    height: 12rem;
    min-height: 12rem;
  }
}

select option {
  padding: 8px;
  margin: 4px;
  border-radius: 6px;
}

select option:checked {
  background: rgb(23 23 23 / 0.08) !important;
  color: rgb(29 29 31) !important;
}

.dark select option:checked {
  background: rgb(255 255 255 / 0.12) !important;
  color: rgb(224 224 224) !important;
}

select option:hover {
  background-color: rgb(23 23 23 / 0.06);
}

.dark select option:hover {
  background-color: rgb(255 255 255 / 0.08);
}
</style>
