import { useHistory } from 'react-router-dom'

import './style/Navigation.scss'

type Props = {
  changeToken: Function,
  changeMainPage: Function
}

function Navigation({changeToken, changeMainPage}: Props): JSX.Element {
  const history = useHistory()

  const handleGoHome = () => {
    history.push('/')
    changeMainPage(0)
  }

  const handleGoSettings = () => {
    history.push('/settings')
  }

  const handleLogOut = () => {
    history.push('/')
    changeToken(undefined)
    changeMainPage(1)
  }

  return(
    <div className = 'navigation'>
      <h1>Navigation</h1>
      <button onClick = { handleGoHome }>Home</button>
      <button onClick = { handleGoSettings }>Settings</button>
      <button onClick = { handleLogOut }>Log Out</button>
    </div>
  )
}

export default Navigation
