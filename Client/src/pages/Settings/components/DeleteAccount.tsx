import { ErrorResponseType } from '@backend/v1/'
import { RequestBodyType } from '@backend/v1/user/delete'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

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

export default function DeleteAccount() {
  const [token, setToken] = useContext(TokenContext)
  const [, setLoading] = useContext(LoadingContext)
  const [alerts, setAlerts] = useContext(AlertsContext)

  const [open, setOpen] = useState(false)

  const FTFVDEFAULT: FormTextFieldValues = { text: '', error: '' }

  const [password, setPassword] = useState(FTFVDEFAULT)
  const [here, setHere] = useState(FTFVDEFAULT)

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const handleSubmit = async () => {
    setLoading(true)
    setAlerts([])

    const body: RequestBodyType = {
      password: password.text,
    }

    const response = await fetch(getServerUrl() + '/v1/user/delete', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', Authorization: token },
    })

    setLoading(false)
    handleClose()

    if (!response.ok) {
      const { errorMessage }: ErrorResponseType = await response.json()

      return setAlerts([
        ...alerts,
        {
          severity: 'error',
          message: errorMessage || 'An Error Occured, Please try again',
        },
      ])
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
            disabled={
              !Boolean(password.text) ||
              Boolean(password.error) ||
              here.text.toUpperCase() != 'YES'
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
