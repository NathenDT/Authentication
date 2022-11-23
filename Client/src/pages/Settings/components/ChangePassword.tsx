import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import PasswordTextField from 'mui-passwordtextfield'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import handleTextFieldChange from '../../../utils/handleTextFieldChange/form'
import handleFormConfirmPasswordTextFieldChange from '../../../utils/handleTextFieldChange/password'

type Props = {
  token: string
  setToken: Dispatch<SetStateAction<string>>
  setLoading: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string>>
}

export default function ChangePassword({
  token,
  setToken,
  setLoading,
  setError,
}: Props) {
  const [open, setOpen] = useState(false)

  const FTFVDEFAULT: FormTextFieldValues = { text: '', error: '' }

  const [oldPassword, setOldPassword] = useState(FTFVDEFAULT)
  const [newPassword, setNewPassword] = useState(FTFVDEFAULT)
  const [confirmPassword, setConfirmPassword] = useState(FTFVDEFAULT)

  const handleOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const handleSubmit = async () => {
    setLoading(true)

    const request = await fetch('/v1/user/update/password', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        old_password: oldPassword.text,
        new_password: newPassword.text,
      }),
    })

    const json = await request.json()

    setLoading(false)
    handleClose()

    if (!request.ok) return setError(json.errorMessage)

    setToken(json.token)
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
            label="Current Password"
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

          <Button variant="contained" onClick={handleSubmit}>
            Submit Change
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
