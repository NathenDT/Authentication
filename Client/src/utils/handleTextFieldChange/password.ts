import { ChangeEvent, Dispatch, SetStateAction } from 'react'

export default (
    setState: Dispatch<SetStateAction<FormTextFieldValues>>,
    otherState: FormTextFieldValues,
    otherSetState: Dispatch<SetStateAction<FormTextFieldValues>>,
    notRequired?: boolean
  ) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value

    let error = ''

    if (!Boolean(text) && !notRequired) error = 'Required'

    if (text != otherState.text) {
      const errorMessage = 'Passwords Do Not Match'

      error = errorMessage
      otherSetState({ ...otherState, error: errorMessage })
    } else otherSetState({ ...otherState, error: '' })

    setState({ text, error })
  }
