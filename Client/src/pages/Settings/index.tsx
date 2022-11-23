import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useContext, useEffect, useState } from 'react'

import ChangePassword from './components/ChangePassword'
import DeleteAccount from './components/DeleteAccount'
import UpdateUser from './components/UpdateUser'
import { LoadingContext, TokenContext } from '../../utils/context'

export default function Settings() {
  const [token, setToken] = useContext(TokenContext)
  const [, setLoading] = useContext(LoadingContext)

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

  const [error, setError] = useState('')

  useEffect(() => {
    ;(async function () {
      const response = await fetch(
        'https://authentication-7t3k.onrender.com/v1/user/get/withtoken',
        {
          method: 'GET',
          headers: new Headers({
            Authorization: token,
          }),
        }
      )

      const json = await response.json()

      setLoading(false)

      if (!response.ok) {
        setToken('')
        return localStorage.removeItem('token')
      }

      setFirstName({
        ...firstName,
        text: json.first_name,
        original: json.first_name,
      })
      setLastName({
        ...lastName,
        text: json.last_name,
        original: json.last_name,
      })
      setEmail({ ...email, text: json.email, original: json.email })
      setUsername({ ...username, text: json.username, original: json.username })
    })()
  }, [])

  return (
    <Stack width="100%">
      <UpdateUser
        token={token}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        username={username}
        setUsername={setUsername}
        setLoading={setLoading}
        setError={setError}
      />

      <ChangePassword
        token={token}
        setToken={setToken}
        setLoading={setLoading}
        setError={setError}
      />

      <DeleteAccount
        token={token}
        setToken={setToken}
        setLoading={setLoading}
        setError={setError}
      />

      {error && (
        <Typography variant="body2" color="error" sx={{ margin: 1 }}>
          {error}
        </Typography>
      )}
    </Stack>
  )
}
