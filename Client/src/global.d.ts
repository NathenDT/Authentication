import { AlertProps } from '@mui/material/Alert'

export {}

declare global {
  type AlertsType = {
    severity: AlertProps['severity']
    message: string
  }

  type ExtraErrors = {
    condition: boolean
    message: string
  }

  type FormTextFieldValues = {
    text: string
    error: string
  }

  type SettingsTextFieldValues = FormTextFieldValues & {
    original: string
  }

  type ThemeModeType = 'light' | 'preferred' | 'dark'
}
