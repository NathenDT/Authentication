import { ErrorResponseType } from '@backend/v1/'
import { RequestBody } from '@backend/v1/forgotPassword/changePassword'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import axios, { AxiosError } from 'axios'
import PasswordTextField from 'mui-passwordtextfield'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  AlertsContext,
  LoadingContext,
  WrapperTitleContext,
} from '../utils/context'
import getServerUrl from '../utils/getServerUrl'
import handleFormConfirmPasswordTextFieldChange from '../utils/handleTextFieldChange/password'

export default function ChangePassword() {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const [, setLoading] = useContext(LoadingContext)
  const [alerts, setAlerts] = useContext(AlertsContext)
  const [, setWrapperTitle] = useContext(WrapperTitleContext)

  const FTFVDEFAULT: FormTextFieldValues = { text: '', error: '' }

  const [newPassword, setNewPassword] = useState(FTFVDEFAULT)
  const [confirmPassword, setConfirmPassword] = useState(FTFVDEFAULT)

  const handleSubmit = async () => {
    const token = searchParams.get('token') as string

    setLoading(true)
    setAlerts([])

    const body: RequestBody = { new_password: newPassword.text }

    try {
      await axios.post(
        getServerUrl() + '/v1/forgotpassword/changepassword',
        JSON.stringify(body),
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )

      setNewPassword(FTFVDEFAULT)
      setConfirmPassword(FTFVDEFAULT)

      setLoading(false)

      return navigate('/login')
    } catch (error) {
      const _error = error as AxiosError
      const { response } = _error

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

  useEffect(() => setWrapperTitle('Change Password'), [])

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
        label="Confirm Password"
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

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={
          !Boolean(newPassword.text) ||
          Boolean(newPassword.error) ||
          !Boolean(confirmPassword.text) ||
          Boolean(confirmPassword.error)
        }
        sx={{ margin: 1 }}
      >
        Change Password
      </Button>
    </Stack>
  )
}
