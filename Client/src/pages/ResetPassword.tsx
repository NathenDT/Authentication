import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import TextInput from '../components/TextInput'

import * as Fetch from '../utils/Fetch'

import './style/ResetPassword.scss'

function ResetPassword(): JSX.Element {
  const history = useHistory()
  const { token }: any = useParams()

  const
    [password, setPassword] = useState(''),
    [passwordErrorMessage, setPasswordErrorMessage] = useState(''),
    [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if(password === '') return setPasswordErrorMessage('please enter a value')

    const response: Response = await Fetch.setPassword(token, password)

    if(response.status !== 200) return setErrorMessage('cant change password')

    history.push('/')
  }

  return (
    <form className = 'ResetPassword-FORM form' onSubmit = { handleSubmit }>
      <div className = 'full'>
        <h1>Reset Password</h1>
      </div>

      <div className = 'full'>
        <TextInput
          type = 'text'
          name = 'Email'
          value = { password }
          setValue = { setPassword }
          errorMessage = { passwordErrorMessage }
          setErrorMessage = { setPasswordErrorMessage }
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

export default ResetPassword
