import { ResponseType } from '@backend/v1/user/get/withToken'

import Stack from '@mui/material/Stack'

import axios from 'axios'
import { useContext, useEffect, useState } from 'react'

import ChangePassword from './components/ChangePassword'
import DeleteAccount from './components/DeleteAccount'
import UpdateUser from './components/UpdateUser'
import {
  AlertsContext,
  LoadingContext,
  TokenContext,
  WrapperTitleContext,
} from '../../utils/context'
import getServerUrl from '../../utils/getServerUrl'

export default function Settings() {
  const [token, setToken] = useContext(TokenContext)
  const [, setLoading] = useContext(LoadingContext)
  const [alerts, setAlerts] = useContext(AlertsContext)
  const [, setTitleContext] = useContext(WrapperTitleContext)

  const STFVDEFAULT: SettingsTextFieldValues = {
    text: '',
    original: '',
    error: '',
  }

  const [firstName, setFirstName] =
    useState<SettingsTextFieldValues>(STFVDEFAULT)
  const [lastName, setLastName] = useState<SettingsTextFieldValues>(STFVDEFAULT)
  const [email, setEmail] = useState<SettingsTextFieldValues>(STFVDEFAULT)
  const [username, setUsername] = useState<SettingsTextFieldValues>(STFVDEFAULT)

  useEffect(() => {
    ;(async function () {
      setLoading(true)
      setAlerts([])
      setTitleContext('Settings')

      try {
        const response = await axios.get(
          getServerUrl() + '/v1/user/get/withtoken',
          { headers: { Authorization: token } }
        )

        setLoading(false)

        const {
          first_name,
          last_name,
          email: _email,
          username: _username,
        } = response.data as ResponseType

        setFirstName({
          ...firstName,
          text: first_name,
          original: first_name,
        })
        setLastName({
          ...lastName,
          text: last_name,
          original: last_name,
        })
        setEmail({
          ...email,
          text: _email,
          original: _email,
        })
        setUsername({
          ...username,
          text: _username,
          original: _username,
        })
      } catch (_) {
        setLoading(false)

        setToken('')
        localStorage.removeItem('token')

        setAlerts([
          ...alerts,
          {
            severity: 'error',
            message: 'An Error Occured, Please try again',
          },
        ])
      }
    })()
  }, [])

  return (
    <Stack width="100%">
      <UpdateUser
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        username={username}
        setUsername={setUsername}
      />

      <ChangePassword />

      <DeleteAccount />
    </Stack>
  )
}
