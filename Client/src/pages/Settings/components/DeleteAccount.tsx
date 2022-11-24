import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

import PasswordTextField from 'mui-passwordtextfield'
import { Dispatch, SetStateAction, useState } from 'react'

import getServerUrl from '../../../utils/getServerUrl'
import handleTextFieldChange from '../../../utils/handleTextFieldChange/form'

type Props = {
  token: string
  setToken: Dispatch<SetStateAction<string>>
  setLoading: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string>>
}

export default function DeleteAccount({
  token,
  setToken,
  setLoading,
  setError,
}: Props) {
  const [open, setOpen] = useState(false)

  const FTFVDEFAULT: FormTextFieldValues = { text: '', error: '' }

  const [password, setPassword] = useState(FTFVDEFAULT)
  const [here, setHere] = useState(FTFVDEFAULT)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async () => {
    setLoading(true)

    const request = await fetch(getServerUrl() + '/v1/user/delete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password.text,
      }),
    })

    setLoading(false)
    handleClose()

    if (!request.ok) {
      const json = await request.json()

      return setError(json.errorMessage)
    }

    setToken('')
    localStorage.removeItem('token')
  }
  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={handleClickOpen}
        sx={{ margin: 1 }}
      >
        Delete Account
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Account</DialogTitle>

        <DialogContent>
          <DialogContentText margin={1}>
            Deleting your account will blah blah blah
          </DialogContentText>

          <PasswordTextField
            label="Password"
            value={password.text}
            onChange={handleTextFieldChange(setPassword)}
            error={Boolean(password.error)}
            helperText={password.error}
            fullWidth
            sx={{ margin: 1 }}
          />

          <TextField
            label="Here"
            value={here.text}
            onChange={handleTextFieldChange(setHere, true)}
            helperText={'If you are sure, type "yes"'}
            fullWidth
            sx={{ margin: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={here.text.toUpperCase() != 'YES'}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
