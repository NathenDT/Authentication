import { useState } from 'react'

import TextInput from '../components/TextInput'

import * as Fetch from '../utils/Fetch'

import './style/SignUpOAuth.scss'

type Props = {
  changeToken: Function,
  changeMainPage: Function,
  googleOAuthToken: string
}

function SignUpOAuth({ changeToken, changeMainPage, googleOAuthToken }: Props): JSX.Element {
  const
    [username, setUsername] = useState(''),
    [usernameErrorMessage, setUsernameErrorMessage] = useState(''),
    [rememberMe, setRememberMe] = useState(false),
    [errorMessage, setErrorMessage] = useState('')

  const handleRememberMeChange = (event: any) => setRememberMe(event.target.checked)

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if(username === '') return setUsernameErrorMessage('Please Enter an Value')

    const response: Response = await Fetch.setGoogleUser(username, googleOAuthToken)

    if(response.status != 200) return setErrorMessage('cant sign up, server do do')

    const data = await response.json()

    changeToken(data.token, rememberMe)
    changeMainPage(0)
  }

  return (
    <form className = 'SignUpOAuth-FORM form' onSubmit = { handleSubmit }>
      <div className = 'full'>
        <h1>Sign Up With Google</h1>
      </div>

      <div className = 'full'>
        <TextInput
          type = 'text'
          name = 'Username'
          value = { username }
          setValue = { setUsername }
          errorMessage = { usernameErrorMessage }
          setErrorMessage = { setUsernameErrorMessage }
          required = { true }
        />
      </div>

      <div className = 'full'>
        <input
          type = 'checkbox'
          checked = { rememberMe }
          onChange = { handleRememberMeChange }
        />
        <label>Remember Me</label>
      </div>

      <div className = 'full'>
        <input type = 'submit' value = 'Sign Up' />
      </div>

      <div className = 'full'>
        <p className = 'error'>{ errorMessage }</p>
      </div>
    </form>
  )
}

export default SignUpOAuth
