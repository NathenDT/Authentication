import GoogleLogin from 'react-google-login'

import { googleClientID } from '../App'

import * as Fetch from '../utils/Fetch'

type Props = {
  changeToken: Function,
  changeMainPage: Function,
  setGoogleOAuthToken: Function
}

function GoogleLogIn({ changeToken, changeMainPage, setGoogleOAuthToken }: Props): JSX.Element {
  const handleSubmit = async (googleData: any) => {
    const response: Response = await Fetch.getGoogleUser(googleData.tokenId)

    if(response.status != 200) return console.log('cant google log in')

    const data = await response.json()

    if(!data.signedUp) {
      setGoogleOAuthToken(data.googleOAuthToken)
      return changeMainPage(3)
    }

    changeToken(data.token)
    changeMainPage(0)
  }

  return (
    <GoogleLogin
      clientId={ googleClientID }
      buttonText="Log in with Google"
      onSuccess={ handleSubmit }
      cookiePolicy={ 'single_host_origin' }
    />
  )
}

export default GoogleLogIn
