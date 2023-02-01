import { ErrorResponseType } from '@backend/v1/'
import { RequestBodyType, ResponseType } from '@backend/v1/user/logIn'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import axios, { AxiosError } from 'axios'
import PasswordTextField from 'mui-passwordtextfield'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ForgotPassword from './components/ForgotPasswordButton'

import {
  AlertsContext,
  LoadingContext,
  TokenContext,
  WrapperTitleContext,
} from '../../utils/context'
import getServerUrl from '../../utils/getServerUrl'
import handleFormTextFieldChange from '../../utils/handleTextFieldChange/form'
import { FTFVDEFAULT } from '../../utils/textFieldDefault'

export default function LogIn() {
  const navigate = useNavigate()

  const [alerts, setAlerts] = useContext(AlertsContext)
  const [, setToken] = useContext(TokenContext)
  const [, setLoading] = useContext(LoadingContext)
  const [, setWrapperTitleContext] = useContext(WrapperTitleContext)

  const [username, setUsername] = useState(FTFVDEFAULT)
  const [password, setPassword] = useState(FTFVDEFAULT)

  const [rememberMe, setRememberMe] = useState(false)

  setWrapperTitleContext('Log In')

  const handleSubmit = async () => {
    setAlerts([])
    setLoading(true)

    const body: RequestBodyType = {
      username: username.text,
      password: password.text,
    }

    try {
      const response = await axios.post(
        getServerUrl() + '/v1/user/login',
        JSON.stringify(body),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )

      setLoading(false)

      const { token } = response.data as ResponseType

      setToken(token)
      if (rememberMe) localStorage.setItem('token', token)

      setUsername(FTFVDEFAULT)
      setPassword(FTFVDEFAULT)
      setRememberMe(false)

      navigate('/')
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
        onChange={handleFormTextFieldChange(setPassword)}
        error={Boolean(password.error)}
        helperText={password.error}
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
        sx={{ margin: 1 }}
        disabled={
          !Boolean(username.text) ||
          Boolean(username.error) ||
          !Boolean(password.text) ||
          Boolean(username.error)
        }
      >
        Log In
      </Button>

      <Box display="flex">
        <ForgotPassword />

        <Box flexGrow={1}></Box>

        <Typography margin={1} color="text.primary">
          Don't have an account?
          <Button onClick={() => navigate('/signup')}>Sign Up</Button>
        </Typography>
      </Box>
    </>
  )
}
