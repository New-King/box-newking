import { SEND_TYPES, STORAGE_KEYS } from '@/constants'
import type { SendType, ThemeMode } from '@/types'

const LOCALE_STORAGE_KEY = 'locale'

export function readStoredThemeMode(): string | null {
  return localStorage.getItem(STORAGE_KEYS.COLOR_MODE)
}

export function writeStoredThemeMode(mode: ThemeMode) {
  localStorage.setItem(STORAGE_KEYS.COLOR_MODE, mode)
}

export function readStoredLocale(): string | null {
  return localStorage.getItem(LOCALE_STORAGE_KEY)
}

export function writeStoredLocale(locale: string) {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

export function readStoredSendType(): SendType {
  const value = localStorage.getItem(STORAGE_KEYS.SEND_TYPE)
  if (value === SEND_TYPES.FILE || value === SEND_TYPES.TEXT) {
    return value
  }
  return SEND_TYPES.FILE
}

export function writeStoredSendType(type: SendType) {
  localStorage.setItem(STORAGE_KEYS.SEND_TYPE, type)
}
