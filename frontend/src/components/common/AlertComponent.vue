<template>
  <transition-group
    name="alert-fade"
    tag="div"
    class="pointer-events-none fixed right-3 top-3 z-50 flex w-[min(20rem,calc(100vw-1.5rem))] flex-col gap-2 sm:right-4"
  >
    <div
      v-for="alert in alerts"
      :key="alert.id"
      :class="[
        'pointer-events-auto flex items-center gap-2 rounded-lg border px-3 py-2 shadow-md backdrop-blur-md',
        cardClass
      ]"
    >
      <component
        :is="alertIcons[alert.type]"
        class="h-4 w-4 flex-shrink-0"
        :class="iconClass(alert.type)"
      />
      <p class="min-w-0 flex-1 text-xs leading-5" :class="messageClass">
        {{ alert.message }}
      </p>
      <button
        type="button"
        class="inline-flex flex-shrink-0 rounded p-0.5 transition-colors"
        :class="closeClass"
        @click="removeAlert(alert.id)"
      >
        <span class="sr-only">{{ t('common.close') }}</span>
        <X class="h-3.5 w-3.5" />
      </button>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAlertStore } from '@/stores/alertStore'
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInjectedDarkMode } from '@/composables'

const { t } = useI18n()
const isDarkMode = useInjectedDarkMode()

const alertStore = useAlertStore()
const { alerts } = storeToRefs(alertStore)
const { removeAlert } = alertStore

type AlertType = 'success' | 'error' | 'warning' | 'info'

const alertIcons = {
  success: CheckCircle,
  error: AlertTriangle,
  warning: AlertCircle,
  info: Info
}

const cardClass = computed(() =>
  isDarkMode.value
    ? 'border-white/10 bg-[#343436]'
    : 'border-zinc-200/80 bg-white/95'
)

const messageClass = computed(() => (isDarkMode.value ? 'text-zinc-100' : 'text-zinc-800'))
const closeClass = computed(() =>
  isDarkMode.value
    ? 'text-zinc-500 hover:text-zinc-200'
    : 'text-zinc-400 hover:text-zinc-700'
)

const iconClass = (type: AlertType) => {
  const classes: Record<AlertType, string> = {
    success: isDarkMode.value ? 'text-emerald-300' : 'text-emerald-600',
    info: isDarkMode.value ? 'text-zinc-300' : 'text-zinc-600',
    warning: isDarkMode.value ? 'text-amber-300' : 'text-amber-600',
    error: isDarkMode.value ? 'text-red-300' : 'text-red-600'
  }

  return classes[type]
}
</script>

<style scoped>
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
