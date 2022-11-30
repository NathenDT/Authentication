import { ErrorResponseType } from '@backend/v1/'
import { RequestQuery } from '@backend/v1/forgotPassword/request'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

import axios, { AxiosError } from 'axios'
import { useContext, useState } from 'react'

import { AlertsContext, LoadingContext } from '../../../utils/context'
import getServerUrl from '../../../utils/getServerUrl'
import handleFormTextFieldChange from '../../../utils/handleTextFieldChange/form'
import emailValidation from '../../../utils/emailValidation'

export default function ForgotPassword() {
  const [alerts, setAlerts] = useContext(AlertsContext)
  const [, setLoading] = useContext(LoadingContext)

  const [open, setOpen] = useState(false)

  const [email, setEmail] = useState<FormTextFieldValues>({
    text: '',
    error: '',
  })

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const handleSubmit = async () => {
    setLoading(true)
    handleClose()
    setAlerts([])

    const params: RequestQuery = {
      email: email.text,
    }

    try {
      setLoading(false)

      await axios.get(getServerUrl() + '/v1/forgotpassword/request', { params })
    } catch (error) {
      const _error = error as AxiosError
      const response = _error.response

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
      <Button onClick={handleClickOpen} sx={{ margin: 1 }}>
        Forgot Password?
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Forgot Password</DialogTitle>

        <DialogContent>
          <DialogContentText margin={1}>
            Please enter the email that you used to create your account. An
            email will be sent for you to change your password.
          </DialogContentText>

          <TextField
            label="Email"
            value={email.text}
            onChange={handleFormTextFieldChange(setEmail, false, [
              {
                condition: !emailValidation(email.text),
                message: 'Enter a Valid Email',
              },
            ])}
            error={Boolean(email.error)}
            helperText={email.error}
            fullWidth
            sx={{ margin: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!Boolean(email.text) || Boolean(email.error)}
          >
            Forgot
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
