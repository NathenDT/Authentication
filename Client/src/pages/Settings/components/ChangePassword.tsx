import { ErrorResponseType } from '@backend/v1/'
import { RequestBodyType, ResponseType } from '@backend/v1/user/update/password'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import axios, { AxiosError } from 'axios'
import PasswordTextField from 'mui-passwordtextfield'
import { useContext, useState } from 'react'

import {
  AlertsContext,
  LoadingContext,
  TokenContext,
} from '../../../utils/context'
import getServerUrl from '../../../utils/getServerUrl'
import handleTextFieldChange from '../../../utils/handleTextFieldChange/form'
import handleFormConfirmPasswordTextFieldChange from '../../../utils/handleTextFieldChange/password'

export default function ChangePassword() {
  const [token, setToken] = useContext(TokenContext)
  const [, setLoading] = useContext(LoadingContext)
  const [alerts, setAlerts] = useContext(AlertsContext)

  const [open, setOpen] = useState(false)

  const FTFVDEFAULT: FormTextFieldValues = { text: '', error: '' }

  const [oldPassword, setOldPassword] = useState(FTFVDEFAULT)
  const [newPassword, setNewPassword] = useState(FTFVDEFAULT)
  const [confirmPassword, setConfirmPassword] = useState(FTFVDEFAULT)

  const handleOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const handleSubmit = async () => {
    setLoading(true)
    setAlerts([])

    const body: RequestBodyType = {
      old_password: oldPassword.text,
      new_password: newPassword.text,
    }

    try {
      const response = await axios.post(
        getServerUrl() + '/v1/user/update/password',
        JSON.stringify(body),
        {
          headers: { Authorization: token, 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )

      setLoading(false)
      handleClose()
      setOldPassword(FTFVDEFAULT)
      setNewPassword(FTFVDEFAULT)
      setConfirmPassword(FTFVDEFAULT)

      const { token: _token } = response.data as ResponseType

      setToken(_token)
    } catch (error) {
      const _error = error as AxiosError
      const response = _error.response

      setLoading(false)
      handleClose()
      setOldPassword(FTFVDEFAULT)
      setNewPassword(FTFVDEFAULT)
      setConfirmPassword(FTFVDEFAULT)

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

      return setAlerts([
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
      <Button
        variant="contained"
        color="secondary"
        onClick={handleOpen}
        sx={{ margin: 1 }}
      >
        Change Password
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Password</DialogTitle>

        <DialogContent>
          <PasswordTextField
            label="Old Password"
            value={oldPassword.text}
            onChange={handleTextFieldChange(setOldPassword)}
            error={Boolean(oldPassword.error)}
            helperText={oldPassword.error}
            fullWidth
            sx={{ margin: 1 }}
          />

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
            fullWidth
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
            fullWidth
            sx={{ margin: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !Boolean(oldPassword.text) ||
              Boolean(oldPassword.error) ||
              !Boolean(newPassword.text) ||
              Boolean(newPassword.error) ||
              !Boolean(confirmPassword.text) ||
              Boolean(confirmPassword.error)
            }
          >
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
