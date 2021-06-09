import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { testEmail } from '../App'

import TextInput from '../components/TextInput'
import Navigation from '../components/Navigation'

import './style/Settings.scss'

type Props = {
  token: string,
  changeToken: Function,
  changeMainPage: Function
}

function Settings({ token, changeToken, changeMainPage }: Props): JSX.Element {
  const history = useHistory()

  const
    [firstname, setFirstname] = useState(''),
    [firstnameErrorMessage, setFirstnameErrorMessage] = useState(''),
    [lastname, setLastname] = useState(''),
    [lastnameErrorMessage, setLastnameErrorMessage] = useState(''),
    [username, setUsername] = useState(''),
    [usernameErrorMessage, setUsernameErrorMessage] = useState(''),
    [email, setEmail] = useState(''),
    [emailErrorMessage, setEmailErrorMessage] = useState(''),
    [password, setPassword] = useState(''),
    [passwordErrorMessage, setPasswordErrorMessage] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()
  }

  const handleDelete = async (e: any) => {
    e.preventDefault()

    const response: Response = await fetchDelete(token)

    if(response.status != 200) return console.error('cant delete')

    changeToken(undefined)

    changeMainPage(1)

    history.push('/')
  }

  useEffect(() => {
    (async function() {
      const response: Response = await fetchToken(token)

      if(response.status != 200) {
        changeToken(undefined)

        changeMainPage(1)
        
        return history.push('/')
      }

      const data: any = await response.json()

      setFirstname(data.FirstName)
      setLastname(data.LastName)
      setUsername(data.Username)
      setEmail(data.Email)
    })()
  }, [])

  return (
    <div className = 'settings-DIV'>
      <nav>
        <Navigation 
          changeToken = { changeToken }
          changeMainPage = { changeMainPage }
        />
      </nav>
      <main>
        <form className = 'Settings-FORM form' onSubmit = { handleSubmit }>
          <h1 className = 'full'>Settings</h1>

          <div className = 'full'>
            <label>Change First Name: </label>
            <TextInput
              type = 'fname'
              name = 'First Name'
              value = { firstname }
              setValue = { setFirstname }
              errorMessage = { firstnameErrorMessage }
              setErrorMessage = { setFirstnameErrorMessage }
            />
          </div>

          <div className = 'full'>
            <label>Change Last Name: </label>
            <TextInput
              type = 'lname'
              name = 'Last Name'
              value = { lastname }
              setValue = { setLastname }
              errorMessage = { lastnameErrorMessage }
              setErrorMessage = { setLastnameErrorMessage }
            />
          </div>

          <div className = 'full'>
            <label>Change Username: </label>
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
            />
          </div>

          <div className = 'full'>
            <label>Change Email: </label>
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
            />
          </div>

          <div className = 'full'>
            <label>Change Password: </label>
            <TextInput
              type = 'password'
              name = 'Password'
              value = { password }
              setValue = { setPassword }
              errorMessage = { passwordErrorMessage }
              setErrorMessage = { setPasswordErrorMessage }
            />
          </div>

          <div className = 'full'>
            <input type = 'submit' value = 'Sign Up' />
          </div>

          <div className = 'full'>
            <input type = 'button' value = 'Delete Account' onClick = { handleDelete } />
          </div>
        </form>
      </main>
    </div>
  )
}

async function fetchToken(token: string) {
  const sendData: object = { token }
  return fetch('/api/get/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sendData)
  })
}

async function fetchDelete(token: string) {
  const sendData: object = { token }
  return fetch('/api/set/deleteuser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sendData)
  })
}

export default Settings
