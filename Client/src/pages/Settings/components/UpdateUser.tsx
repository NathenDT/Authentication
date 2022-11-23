import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import { Dispatch, SetStateAction } from 'react'

import SettingsTextField from '../components/SettingsTextField'

import settingFieldChanges from '../utils/settingFieldChanges'

type Props = {
  token: string
  firstName: SettingsTextFieldValues
  setFirstName: Dispatch<SetStateAction<SettingsTextFieldValues>>
  lastName: SettingsTextFieldValues
  setLastName: Dispatch<SetStateAction<SettingsTextFieldValues>>
  email: SettingsTextFieldValues
  setEmail: Dispatch<SetStateAction<SettingsTextFieldValues>>
  username: SettingsTextFieldValues
  setUsername: Dispatch<SetStateAction<SettingsTextFieldValues>>
  setLoading: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string>>
}

export default function UpdateUser({
  token,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  username,
  setUsername,
  setLoading,
  setError,
}: Props) {
  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const request = await fetch('/v1/user/update', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        settingFieldChanges(firstName, lastName, email, username)
      ),
    })

    const json = await request.json()

    setLoading(false)

    if (!request.ok) return setError(json.errorMessage)

    setFirstName({ ...firstName, original: json.first_name })
    setLastName({ ...lastName, original: json.last_name })
    setEmail({ ...email, original: json.email })
    setUsername({ ...username, original: json.username })
  }

  return (
    <>
      <Box display="flex" width="100%">
        <SettingsTextField
          name="First Name"
          state={firstName}
          setState={setFirstName}
          sx={{ margin: 1 }}
          fullWidth
        />

        <SettingsTextField
          name="Last Name"
          state={lastName}
          setState={setLastName}
          sx={{ margin: 1 }}
          fullWidth
        />
      </Box>

      <SettingsTextField
        name="Email"
        state={email}
        setState={setEmail}
        sx={{ margin: 1 }}
      />

      <SettingsTextField
        name="Username"
        state={username}
        setState={setUsername}
        sx={{ margin: 1 }}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={
          !Boolean(
            Object.keys(
              settingFieldChanges(firstName, lastName, email, username)
            ).length
          )
        }
        sx={{ margin: 1 }}
      >
        Submit Changes
      </Button>
    </>
  )
}
