import { ChangeEvent, Dispatch, SetStateAction } from 'react'

export default (
    state: SettingsTextFieldValues,
    setState: Dispatch<SetStateAction<SettingsTextFieldValues>>,
    notRequired?: boolean
  ) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value

    let error = ''

    if (!Boolean(text) && !notRequired) error = 'Required'

    setState({ ...state, text, error })
  }
