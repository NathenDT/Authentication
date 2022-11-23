import { useContext, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import PasswordTextField from 'mui-passwordtextfield'
import { useNavigate } from 'react-router-dom'

import ForgotPassword from './components/ForgotPasswordButton'

import {
  LoadingContext,
  TokenContext,
  WrapperTitleContext,
} from '../../utils/context'
import handleFormTextFieldChange from '../../utils/handleTextFieldChange/form'
import isTextFieldFormOk from '../../utils/isTextFieldFormOk'
import { FTFVDEFAULT } from '../../utils/textFieldDefault'

export default function LogIn() {
  const navigate = useNavigate()

  const [, setToken] = useContext(TokenContext)
  const [, setLoading] = useContext(LoadingContext)
  const [, setWrapperTitleContext] = useContext(WrapperTitleContext)

  const [username, setUsername] = useState(FTFVDEFAULT)
  const [password, setPassword] = useState(FTFVDEFAULT)

  const [rememberMe, setRememberMe] = useState(false)

  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (
      !isTextFieldFormOk([
        { state: username, setState: setUsername },
        { state: password, setState: setPassword },
      ])
    )
      return setError('Fix Errors')

    setLoading(true)

    const request = await fetch(
      'https://authentication-7t3k.onrender.com/v1/user/login',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.text,
          password: password.text,
        }),
      }
    )

    const json = await request.json()

    setLoading(false)

    if (!request.ok) return setError(json.errorMessage)

    setError('')

    const _token = json.token

    setToken(_token)

    if (rememberMe) localStorage.setItem('token', _token)

    navigate('/')
  }

  useEffect(() => setWrapperTitleContext('Log In'), [])

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

      <Button variant="contained" onClick={handleSubmit} sx={{ margin: 1 }}>
        Log In
      </Button>

      {error && (
        <Typography variant="body2" color="error" sx={{ margin: 1 }}>
          {error}
        </Typography>
      )}

      <Box display="flex">
        <ForgotPassword setError={setError} />

        <Box flexGrow={1}></Box>

        <Typography margin={1} color="text.primary">
          Don't have an account?
          <Button onClick={() => navigate('/signup')}>Sign Up</Button>
        </Typography>
      </Box>
    </>
  )
}
