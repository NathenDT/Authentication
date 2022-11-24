import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import PasswordTextField from 'mui-passwordtextfield'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import getServerUrl from '../utils/getServerUrl'
import handleFormConfirmPasswordTextFieldChange from '../utils/handleTextFieldChange/password'

export default function ChangePassword() {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const FTFVDEFAULT: FormTextFieldValues = { text: '', error: '' }

  const [newPassword, setNewPassword] = useState(FTFVDEFAULT)
  const [confirmPassword, setConfirmPassword] = useState(FTFVDEFAULT)

  const handleSubmit = async () => {
    const token = searchParams.get('token') as string

    const response = await fetch(
      getServerUrl() + '/v1/forgotpassword/changepassword',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_password: newPassword.text,
        }),
      }
    )

    if (response.ok) return navigate('/login')

    const json = await response.json()

    console.error(json)
  }

  return (
    <Stack width="100%">
      <PasswordTextField
        label="New Password"
        value={newPassword.text}
        onChange={handleFormConfirmPasswordTextFieldChange(
          setNewPassword,
          confirmPassword,
          setConfirmPassword
        )}
        error={Boolean(newPassword.error)}
        helperText={newPassword.error}
        sx={{ margin: 1 }}
      />

      <PasswordTextField
        label="Current Password"
        value={confirmPassword.text}
        onChange={handleFormConfirmPasswordTextFieldChange(
          setConfirmPassword,
          newPassword,
          setNewPassword
        )}
        error={Boolean(confirmPassword.error)}
        helperText={confirmPassword.error}
        sx={{ margin: 1 }}
      />

      <Button variant="contained" onClick={handleSubmit} sx={{ margin: 1 }}>
        Change Password
      </Button>
    </Stack>
  )
}
