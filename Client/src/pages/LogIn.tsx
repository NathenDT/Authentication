import { useState } from 'react'
import { useHistory } from 'react-router-dom'

import TextInput from '../components/TextInput'
import GoogleLogIn from '../components/GoogleLogIn'

import * as Fetch from '../utils/Fetch'

import './style/LogIn.scss'

type Props = {
  changeToken: Function,
  changeMainPage: Function,
  setGoogleOAuthToken: Function
}

function LogIn({ changeToken, changeMainPage, setGoogleOAuthToken }: Props): JSX.Element {
  const history = useHistory()

  const
    [usernameEmail, setUsernameEmail] = useState(''),
    [password, setPassword] = useState(''),
    [rememberMe, setRememberMe] = useState(false),
    [errorMessage, setErrorMessage] = useState('')

  const
    [usernameEmailErrorMessage, setUsernameEmailErrorMessage] = useState(''),
    [passwordErrorMessage, setPasswordErrorMessage] = useState('')

  const handleSignUp = () => changeMainPage(2)

  const handleRememberMeChange = (e: any) => setRememberMe(e.target.checked)

  const goForgotPassword = () => {
    history.push('/forgotpassword')
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    let hasError: boolean = false

    if(usernameEmail === '') {
      setUsernameEmailErrorMessage('Please Enter an Value')
      hasError = true
    }

    if(password === '') {
      setPasswordErrorMessage('Please Enter an Value')
      hasError = true
    }

    if(hasError) return

    const response = await Fetch.getUser(usernameEmail, password)

    if(response.status != 200) return setErrorMessage('Can\'t Log In')

    const data: any = await response.json()

    changeToken(data.token, rememberMe)
    changeMainPage(0)
  }

  return (
    <form className = 'LogIn-FORM form' onSubmit = { handleSubmit }>
      <h1 className = 'full'>Log In</h1>

      <div className = 'full'>
        <TextInput
          type = 'text'
          name = 'Username or Email'
          value = { usernameEmail }
          setValue = { setUsernameEmail }
          errorMessage = { usernameEmailErrorMessage }
          setErrorMessage = { setUsernameEmailErrorMessage }
          required = { true }
        />
      </div>

      <div className = 'full'>
        <TextInput
          type = 'password'
          name = 'Password'
          value = { password }
          setValue = { setPassword }
          errorMessage = { passwordErrorMessage }
          setErrorMessage = { setPasswordErrorMessage }
          required = { true }
        />
      </div>

      <div className = 'full'>
        <input type = 'button' value = 'Forgot Password Or Username?' onClick = { goForgotPassword }/>
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
        <input type = 'submit' value = 'Log In' />
      </div>

      <div className = 'full'>
        <p className = 'error'>{ errorMessage }</p>
      </div>

      <div className = 'full'>
        <GoogleLogIn
          changeToken = { changeToken }
          changeMainPage = { changeMainPage }
          setGoogleOAuthToken = { setGoogleOAuthToken }
        /> 
      </div>

      <p className = 'full'>Don't have an Account? <button type = 'button' onClick = { handleSignUp }>Sign Up</button></p>
    </form>
  )
}

export default LogIn
