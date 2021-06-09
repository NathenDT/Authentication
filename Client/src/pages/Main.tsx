import { useEffect } from 'react'

import Home from './Home'
import LogIn from './LogIn'
import SignUp from './SignUp'
import SignUpOAuth from './SignUpOAuth'

import * as Fetch from '../utils/Fetch'

type Props = {
  token: string,
  changeToken: Function,
  currentMainPage: number,
  changeMainPage: Function,
  googleOAuthToken: string,
  setGoogleOAuthToken: Function
}

function Main({ token, changeToken, currentMainPage, changeMainPage, googleOAuthToken, setGoogleOAuthToken }: Props): JSX.Element {
  const pages = [
    <Home
      token = { token }
      changeToken = { changeToken }
      changeMainPage = { changeMainPage }
    />,
    <LogIn
      changeToken = { changeToken }
      changeMainPage = { changeMainPage }
      setGoogleOAuthToken = { setGoogleOAuthToken }
    />,
    <SignUp
      changeToken = { changeToken }
      changeMainPage = { changeMainPage }
      setGoogleOAuthToken = { setGoogleOAuthToken }
    />,
    <SignUpOAuth
      changeToken = { changeToken }
      changeMainPage = { changeMainPage }
      googleOAuthToken = { googleOAuthToken }
    />
  ]

  useEffect(() => {
    if(!token) return
    (async function() {
      const response: Response = await Fetch.getToken(token)

      if(response.status === 200) return changeMainPage(0)

      changeToken(undefined)
      changeMainPage(1)
    })()
  }, [])

  return (
    <div className = 'main-DIV'>
      { pages[currentMainPage] }
    </div>
  )
}

export default Main
