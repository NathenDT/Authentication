import Button from '@mui/material/Button'
import TextField, { TextFieldProps } from '@mui/material/TextField'

import { Dispatch, SetStateAction } from 'react'

import handleSettingsTextFieldChange from '../../../utils/handleTextFieldChange/settings'

type Props = TextFieldProps & {
  name: string
  state: SettingsTextFieldValues
  setState: Dispatch<SetStateAction<SettingsTextFieldValues>>
  extraErrors?: ExtraErrors[]
}

export default ({
  name,
  state,
  setState,
  extraErrors,
  ...textFieldProps
}: Props) => (
  <TextField
    label={name}
    value={state.text}
    onChange={handleSettingsTextFieldChange(
      state,
      setState,
      false,
      extraErrors || []
    )}
    error={Boolean(state.error)}
    helperText={state.error}
    InputProps={{
      endAdornment: <ResetButton state={state} setState={setState} />,
    }}
    {...textFieldProps}
  />
)

type ResetButtonProps = {
  state: SettingsTextFieldValues
  setState: Dispatch<SetStateAction<SettingsTextFieldValues>>
}

function ResetButton({ state, setState }: ResetButtonProps) {
  if (state.text === state.original) return <></>

  const handleClick = () => setState({ ...state, text: state.original })

  return (
    <Button variant="contained" onClick={handleClick}>
      Reset
    </Button>
  )
}
