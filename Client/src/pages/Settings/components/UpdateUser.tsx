import { ErrorResponseType } from '@backend/v1/'
import { ResponseType } from '@backend/v1/user/update'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import axios, { AxiosError } from 'axios'
import { Dispatch, SetStateAction, useContext } from 'react'

import SettingsTextField from '../components/SettingsTextField'
import settingFieldChanges from '../utils/settingFieldChanges'
import emailValidation from '../../../utils/emailValidation'
import getServerUrl from '../../../utils/getServerUrl'
import {
  AlertsContext,
  LoadingContext,
  TokenContext,
} from '../../../utils/context'

type Props = {
  firstName: SettingsTextFieldValues
  setFirstName: Dispatch<SetStateAction<SettingsTextFieldValues>>
  lastName: SettingsTextFieldValues
  setLastName: Dispatch<SetStateAction<SettingsTextFieldValues>>
  email: SettingsTextFieldValues
  setEmail: Dispatch<SetStateAction<SettingsTextFieldValues>>
  username: SettingsTextFieldValues
  setUsername: Dispatch<SetStateAction<SettingsTextFieldValues>>
}

export default function UpdateUser({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  username,
  setUsername,
}: Props) {
  const [token] = useContext(TokenContext)
  const [, setLoading] = useContext(LoadingContext)
  const [alerts, setAlerts] = useContext(AlertsContext)

  const handleSubmit = async () => {
    setLoading(true)
    setAlerts([])

    try {
      const response = await axios.post(
        getServerUrl() + '/v1/user/update',
        JSON.stringify(
          settingFieldChanges(firstName, lastName, email, username)
        ),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      )

      setLoading(false)

      const {
        first_name,
        last_name,
        email: _email,
        username: _username,
      } = response.data as ResponseType

      setFirstName({ ...firstName, original: first_name })
      setLastName({ ...lastName, original: last_name })
      setEmail({ ...email, original: _email })
      setUsername({ ...username, original: _username })
    } catch (error) {
      const _error = error as AxiosError
      const { response } = _error

      setLoading(false)

      if (!response) {
        return setAlerts([
          ...alerts,
          {
            severity: 'error',
            message: 'An Error Occured, Please try again',
          },
        ])
      }

      const { errorMessage } = response.data as ErrorResponseType

      setAlerts([
        ...alerts,
        {
          severity: 'error',
          message: errorMessage,
        },
      ])
    }
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
        extraErrors={[
          { condition: !emailValidation(email.text), message: 'Invalid Email' },
        ]}
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
          ) ||
          !Boolean(firstName.text) ||
          Boolean(firstName.error) ||
          !Boolean(lastName.text) ||
          Boolean(lastName.error) ||
          !Boolean(email.text) ||
          Boolean(email.error) ||
          !Boolean(username.text) ||
          Boolean(username.error)
        }
        sx={{ margin: 1 }}
      >
        Submit Changes
      </Button>
    </>
  )
}
