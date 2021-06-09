import { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Main from './pages/Main'
import Settings from './pages/Settings'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Error from './pages/Error'

import './App.scss'

const testEmail: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const googleClientID: string = '491128102264-1usoevnu2jg73jc27867iosouk1ti4cu.apps.googleusercontent.com'

function App(): JSX.Element {
  const
    [token, setToken] = useState(localStorage.token),
    [currentMainPage, changeMainPage] = useState(token ? 0 : 1),
    [googleOAuthToken, setGoogleOAuthToken] = useState('')

  const changeToken = (_token: string, rememberMe: boolean = false) => {
    setToken(_token)

    if(!_token) return localStorage.removeItem('token')

    if(rememberMe) localStorage.setItem('token', _token)
  }

  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Main
            token = { token }
            changeToken = { changeToken }
            currentMainPage = { currentMainPage }
            changeMainPage = { changeMainPage }
            googleOAuthToken = { googleOAuthToken }
            setGoogleOAuthToken = { setGoogleOAuthToken }
          />
        </Route>

        <Route path='/settings'>
          <Settings
            token = { token }
            changeToken = { changeToken }
            changeMainPage = { changeMainPage }
          />
        </Route>

        <Route path='/forgotpassword'>
          <ForgotPassword
          />
        </Route>

        <Route path='/resetpassword/:token'>
          <ResetPassword
          />
        </Route>

        <Route path='*'>
          <Error />
        </Route>
      </Switch>
    </Router>
  )
}

export default App

export {
  testEmail,
  googleClientID
}
