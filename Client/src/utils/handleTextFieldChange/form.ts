import { ChangeEvent, Dispatch, SetStateAction } from 'react'

type ExtraErrors = {
  condition: boolean
  message: string
}

export default (
    setState: Dispatch<SetStateAction<FormTextFieldValues>>,
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

    setState({ text, error })
  }
