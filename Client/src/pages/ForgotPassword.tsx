import { useState } from 'react'

import TextInput from '../components/TextInput'

import * as Fetch from '../utils/Fetch'

import './style/ForgotPassword.scss'

function ForgotPassword(): JSX.Element {
  const 
    [email, setEmail] = useState(''),
    [emailErrorMessage, setEmailErrorMessage] = useState(''),
    [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if(email === '') return setEmailErrorMessage('Enter a value')

    const response: Response = await Fetch.getForgotPassword(email)

    if(response.status !== 200) return setErrorMessage('No can')

    console.log('email was sent to', email)
  }

  return (
    <form className = 'ForgotPassword-FORM form' onSubmit = { handleSubmit }>
      <div className = 'full'>
        <h1>Forgot Password</h1>
      </div>

      <div className = 'full'>
        <TextInput
          type = 'text'
          name = 'Email'
          value = { email }
          setValue = { setEmail }
          errorMessage = { emailErrorMessage }
          setErrorMessage = { setEmailErrorMessage }
          required = { true }
        />
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

export default ForgotPassword