import { Dispatch, SetStateAction } from 'react'

type value = {
  state: FormTextFieldValues
  setState: Dispatch<SetStateAction<FormTextFieldValues>>
  notRequired?: boolean
}

export default function isTextFieldFormFilled(values: value[]) {
  let res: boolean = true

  for (const { state, setState, notRequired } of values) {
    if (Boolean(state.error)) res = false

    if (Boolean(state.text) || notRequired) continue

    setState({ ...state, error: 'Required' })

    res = false
  }

  return res
}
