import { useState } from 'react'

import { testEmail } from '../App'

import GoogleLogIn from '../components/GoogleLogIn'
import TextInput from '../components/TextInput'

import * as Fetch from '../utils/Fetch'

import './style/SignUp.scss'

type Props = {
  changeToken: Function,
  changeMainPage: Function,
  setGoogleOAuthToken: Function
}

function SignUp({ changeToken, changeMainPage, setGoogleOAuthToken }: Props): JSX.Element {
  const
    [firstname, setFirstname] = useState(''),
    [lastname, setLastname] = useState(''),
    [username, setUsername] = useState(''),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [rememberMe, setRememberMe] = useState(false)

  const
    [firstnameErrorMessage, setFirstnameErrorMessage] = useState(''),
    [lastnameErrorMessage, setLastnameErrorMessage] = useState(''),
    [usernameErrorMessage, setUsernameErrorMessage] = useState(''),
    [emailErrorMessage, setEmailErrorMessage] = useState(''),
    [passwordErrorMessage, setPasswordErrorMessage] = useState('')

  const handleGoLogIn = () => changeMainPage(1)

  const handleRememberMe = (e: any) => setRememberMe(e.target.checked)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    let hasError: boolean = false

    if(firstname === '') {
      setFirstnameErrorMessage('Please Enter an Value')
      hasError = true
    }

    if(lastname === '') {
      setLastnameErrorMessage('Please Enter an Value')
      hasError = true
    }

    if(username === '') {
      setUsernameErrorMessage('Please Enter an Value')
      hasError = true
    }

    if(email === '') {
      setEmailErrorMessage('Please Enter an Value')
      hasError = true
    }

    if(password === '') {
      setPasswordErrorMessage('Please Enter an Value')
      hasError = true
    }

    if(firstnameErrorMessage + lastnameErrorMessage + usernameErrorMessage + emailErrorMessage + passwordErrorMessage !== '') {
      hasError = true
    }

    if(hasError) return

    const response = await Fetch.setNewUser(firstname, lastname, username.toUpperCase(), email, password)
    const data: any = await response.json()

    if(response.status != 200) {
      return data.locations.forEach((location: string) => {
        switch(location) {
          case 'username':
            setUsernameErrorMessage('Username Taken')
            break
          case 'email':
            setEmailErrorMessage('Use a different email')
            break
        }
      })
    }

    changeToken(data.token, rememberMe)
    changeMainPage(0)
  }

  return (
    <form className = 'SignUp-FORM form' onSubmit = { handleSubmit }>
      <h1 className = 'full'>Sign Up</h1>

      <div className = 'half'>
        <TextInput
          type = 'fname'
          name = 'First Name'
          value = { firstname }
          setValue = { setFirstname }
          errorMessage = { firstnameErrorMessage }
          setErrorMessage = { setFirstnameErrorMessage }
          required = { true }
        />
      </div>

      <div className = 'half'>
        <TextInput
          type = 'lname'
          name = 'Last Name'
          value = { lastname }
          setValue = { setLastname }
          errorMessage = { lastnameErrorMessage }
          setErrorMessage = { setLastnameErrorMessage }
          required = { true }
        />
      </div>

      <div className = 'full'>
        <TextInput
          type = 'username'
          name = 'Username'
          value = { username }
          setValue = { setUsername }
          errors = { [{
            condition: testEmail.test(username),
            message: 'Don\'t Enter an Email'
          }] }
          errorMessage = { usernameErrorMessage }
          setErrorMessage = { setUsernameErrorMessage }
          required = { true }
        />
      </div>

      <div className = 'full'>
        <TextInput
          type = 'email'
          name = 'Email'
          value = { email }
          setValue = { setEmail }
          errors = { [{
            condition: !testEmail.test(email),
            message: 'Enter an Email'
          }] }
          errorMessage = { emailErrorMessage }
          setErrorMessage = { setEmailErrorMessage }
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
        <input
          type = 'checkbox'
          checked = { rememberMe }
          onChange = { handleRememberMe }
        />
        <label>Remember Me</label>
      </div>

      <div className = 'full'>
        <input type = 'submit' value = 'Sign Up' />
      </div>

      <div className = 'full'>
        <GoogleLogIn
          changeToken = { changeToken }
          changeMainPage = { changeMainPage }
          setGoogleOAuthToken = { setGoogleOAuthToken }
        /> 
      </div>

      <p className = 'full'>Have an Account? <button type = 'button' onClick = { handleGoLogIn }>Log In</button></p>
    </form>
  )
}

export default SignUp
