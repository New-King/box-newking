import { defineStore } from 'pinia'
import type { Alert, AlertType } from '@/types'
import { TIME_CONSTANTS } from '@/constants'

let alertIdSeed = 0
const alertRemoveTimers = new Map<number, ReturnType<typeof setTimeout>>()

export const useAlertStore = defineStore('alert', {
  state: () => ({
    alerts: [] as Alert[]
  }),
  actions: {
    showAlert(
      message: string,
      type: AlertType = 'info',
      duration = TIME_CONSTANTS.ALERT_DURATION
    ) {
      const id = Date.now() + alertIdSeed
      alertIdSeed = (alertIdSeed + 1) % 1000
      this.alerts.push({ id, message, type })
      alertRemoveTimers.set(id, setTimeout(() => this.removeAlert(id), duration))
    },
    removeAlert(id: number) {
      const removeTimer = alertRemoveTimers.get(id)
      if (removeTimer) {
        clearTimeout(removeTimer)
        alertRemoveTimers.delete(id)
      }

      const index = this.alerts.findIndex((alert) => alert.id === id)
      if (index > -1) {
        this.alerts.splice(index, 1)
      }
    }
  }
})
