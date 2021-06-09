import { useState, useEffect } from 'react'

import Navigation from '../components/Navigation'

import * as Fetch from '../utils/Fetch'

import './style/Home.scss'

type Props = {
  token: string,
  changeToken: Function,
  changeMainPage: Function
}

function Home({ token, changeToken, changeMainPage }: Props): JSX.Element {
  const
    [firstname, setFirstname] = useState(''),
    [lastname, setLastname] = useState(''),
    [username, setUsername] = useState(''),
    [email, setEmail] = useState('')

  useEffect(() => {
    (async function() {
      const response: Response = await Fetch.getToken(token)

      if(response.status != 200) return changeToken(undefined)

      const data: any = await response.json()

      setFirstname(data.FirstName)
      setLastname(data.LastName)
      setUsername(data.Username)
      setEmail(data.Email)
    })()
  }, [])

  return (
    <div className = 'home-DIV'>
      <nav>
        <Navigation
          changeToken = { changeToken }
          changeMainPage = { changeMainPage }
        />
      </nav>
      <main>
        <h1>Main</h1>
        <h2>Hello, { firstname } { lastname }</h2>
        <h3>AKA { username }</h3>
        <p>Your Email is { email }</p>
      </main>
    </div>
  )
}

export default Home
