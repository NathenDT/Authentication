import { ErrorResponseType } from '@backend/v1/'
import { RequestBodyType, ResponseType } from '@backend/v1/user/signUp'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import axios, { AxiosError } from 'axios'
import PasswordTextField from 'mui-passwordtextfield'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  AlertsContext,
  LoadingContext,
  TokenContext,
  WrapperTitleContext,
} from '../utils/context'
import getServerUrl from '../utils/getServerUrl'
import handleFormTextFieldChange from '../utils/handleTextFieldChange/form'
import handleFormConfirmPasswordTextFieldChange from '../utils/handleTextFieldChange/password'
import { FTFVDEFAULT } from '../utils/textFieldDefault'

export default function LogIn() {
  const navigate = useNavigate()

  const [, setToken] = useContext(TokenContext)
  const [, setLoading] = useContext(LoadingContext)
  const [alerts, setAlerts] = useContext(AlertsContext)
  const [, setWrapperTitleContext] = useContext(WrapperTitleContext)

  const [firstName, setFirstName] = useState(FTFVDEFAULT)
  const [lastName, setLastName] = useState(FTFVDEFAULT)
  const [email, setEmail] = useState(FTFVDEFAULT)
  const [username, setUsername] = useState(FTFVDEFAULT)
  const [password, setPassword] = useState(FTFVDEFAULT)
  const [confirmPassword, setConfirmPassword] = useState(FTFVDEFAULT)

  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setAlerts([])

    const body: RequestBodyType = {
      first_name: firstName.text,
      last_name: lastName.text,
      email: email.text,
      username: username.text,
      password: password.text,
    }

    try {
      const response = await axios.post(
        getServerUrl() + '/v1/user/signup',
        JSON.stringify(body),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )

      const { token: _token } = response.data as ResponseType

      setToken(_token)
      if (rememberMe) localStorage.setItem('token', _token)

      setFirstName(FTFVDEFAULT)
      setLastName(FTFVDEFAULT)
      setEmail(FTFVDEFAULT)
      setUsername(FTFVDEFAULT)
      setPassword(FTFVDEFAULT)
      setConfirmPassword(FTFVDEFAULT)
      setRememberMe(false)

      navigate('/')
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

  useEffect(() => setWrapperTitleContext('Sign Up'), [])

  return (
    <>
      <Box display="flex" width="100%">
        <TextField
          label="First Name"
          value={firstName.text}
          onChange={handleFormTextFieldChange(setFirstName)}
          error={Boolean(firstName.error)}
          helperText={firstName.error}
          sx={{ margin: 1 }}
          fullWidth
        />

        <TextField
          label="Last Name"
          value={lastName.text}
          onChange={handleFormTextFieldChange(setLastName)}
          error={Boolean(lastName.error)}
          helperText={lastName.error}
          sx={{ margin: 1 }}
          fullWidth
        />
      </Box>

      <TextField
        label="Email"
        type="email"
        value={email.text}
        onChange={handleFormTextFieldChange(setEmail, false, [
          {
            condition: !Boolean(
              email.text.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
            ),
            message: 'Enter a Valid Email',
          },
        ])}
        error={Boolean(email.error)}
        helperText={email.error}
        sx={{ margin: 1 }}
      />

      <TextField
        label="Username"
        value={username.text}
        onChange={handleFormTextFieldChange(setUsername)}
        error={Boolean(username.error)}
        helperText={username.error}
        sx={{ margin: 1 }}
      />

      <PasswordTextField
        label="Password"
        sx={{ margin: 1 }}
        value={password.text}
        onChange={handleFormConfirmPasswordTextFieldChange(
          setPassword,
          confirmPassword,
          setConfirmPassword
        )}
        error={Boolean(password.error)}
        helperText={password.error}
      />

      <PasswordTextField
        label="Confirm Password"
        sx={{ margin: 1 }}
        value={confirmPassword.text}
        onChange={handleFormConfirmPasswordTextFieldChange(
          setConfirmPassword,
          password,
          setPassword
        )}
        error={Boolean(confirmPassword.error)}
        helperText={confirmPassword.error}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
        }
        label="Remember Me"
        sx={{ margin: 1, color: 'text.primary' }}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={
          !Boolean(firstName.text) ||
          Boolean(firstName.error) ||
          !Boolean(lastName.text) ||
          Boolean(lastName.error) ||
          !Boolean(email.text) ||
          Boolean(email.error) ||
          !Boolean(username.text) ||
          Boolean(username.error) ||
          !Boolean(password.text) ||
          Boolean(password.error) ||
          !Boolean(confirmPassword.text) ||
          Boolean(confirmPassword.error)
        }
        sx={{ margin: 1 }}
      >
        Sign Up
      </Button>

      <Box display="flex">
        <Box flexGrow={1}></Box>

        <Typography color="text.primary" sx={{ margin: 1 }}>
          Already have an account?
          <Button onClick={() => navigate('/login')}>Log In</Button>
        </Typography>
      </Box>
    </>
  )
}
