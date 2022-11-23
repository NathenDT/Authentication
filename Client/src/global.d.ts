export {}

declare global {
  type FormTextFieldValues = {
    text: string
    error: string
  }

  type SettingsTextFieldValues = FormTextFieldValues & {
    original: string
  }

  type ThemeModeType = 'light' | 'preferred' | 'dark'
}
