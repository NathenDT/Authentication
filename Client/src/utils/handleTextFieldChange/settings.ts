import { ChangeEvent, Dispatch, SetStateAction } from 'react'

export default (
    state: SettingsTextFieldValues,
    setState: Dispatch<SetStateAction<SettingsTextFieldValues>>,
    notRequired?: boolean,
    extraErrors: ExtraErrors[] = []
  ) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value

    let error = ''

    if (!Boolean(text) && !notRequired) error = 'Required'

    for (const { condition, message } of extraErrors) {
      if (condition) error = message
    }

    setState({ ...state, text, error })
  }
