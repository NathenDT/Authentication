import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import PasswordTextField from 'mui-passwordtextfield'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  LoadingContext,
  TokenContext,
  WrapperTitleContext,
} from '../utils/context'
import handleFormTextFieldChange from '../utils/handleTextFieldChange/form'
import handleFormConfirmPasswordTextFieldChange from '../utils/handleTextFieldChange/password'
import isTextFieldFormOk from '../utils/isTextFieldFormOk'
import { FTFVDEFAULT } from '../utils/textFieldDefault'

export default function LogIn() {
  const navigate = useNavigate()

  const [, setToken] = useContext(TokenContext)
  const [, setLoading] = useContext(LoadingContext)
  const [, setWrapperTitleContext] = useContext(WrapperTitleContext)

  const [firstName, setFirstName] = useState(FTFVDEFAULT)
  const [lastName, setLastName] = useState(FTFVDEFAULT)
  const [email, setEmail] = useState(FTFVDEFAULT)
  const [username, setUsername] = useState(FTFVDEFAULT)
  const [password, setPassword] = useState(FTFVDEFAULT)
  const [confirmPassword, setConfirmPassword] = useState(FTFVDEFAULT)

  const [rememberMe, setRememberMe] = useState(false)

  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (
      !isTextFieldFormOk([
        { state: firstName, setState: setFirstName },
        { state: lastName, setState: setLastName },
        { state: email, setState: setEmail },
        { state: username, setState: setUsername },
        { state: password, setState: setPassword },
        { state: confirmPassword, setState: setConfirmPassword },
      ])
    )
      return setError('Fix Errors')

    setLoading(true)

    const request = await fetch(
      'https://authentication-7t3k.onrender.com/v1/user/signup',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName.text,
          last_name: lastName.text,
          email: email.text,
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

      <Button variant="contained" onClick={handleSubmit} sx={{ margin: 1 }}>
        Sign Up
      </Button>

      {error && (
        <Typography variant="body2" color="error" sx={{ margin: 1 }}>
          {error}
        </Typography>
      )}

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
