import { ConfigService } from '@/services'
import { APP_NAME } from '@/constants'
import { useAlertStore } from '@/stores/alertStore'
import { useConfigStore } from '@/stores/configStore'

export function usePublicConfigBootstrap() {
  const alertStore = useAlertStore()
  const configStore = useConfigStore()

  const syncPublicConfig = async () => {
    const res = await ConfigService.getUserConfig()

    if (res.code !== 200 || !res.detail) {
      document.title = APP_NAME
      return
    }

    configStore.applyPublicMeta(res.detail.meta)
    const notifyMessage = configStore.applyRemoteConfig(res.detail.config)
    document.title = res.detail.config.name?.trim() || APP_NAME
    if (notifyMessage) {
      alertStore.showAlert(notifyMessage, 'success')
    }
  }

  return {
    syncPublicConfig
  }
}
