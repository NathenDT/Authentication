import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import { useContext, useEffect, useState } from 'react'

import {
  LoadingContext,
  TokenContext,
  WrapperTitleContext,
} from '../utils/context'

export default function Home() {
  const [token, setToken] = useContext(TokenContext)
  const [loading, setLoading] = useContext(LoadingContext)
  const [, setTitleContext] = useContext(WrapperTitleContext)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    ;(async function () {
      setTitleContext('Home')
      setLoading(true)

      const response = await fetch(
        'https://authentication-7t3k.onrender.com/v1/user/get/withtoken',
        {
          method: 'GET',
          headers: new Headers({
            Authorization: token,
          }),
        }
      )

      const json = await response.json()

      setLoading(false)

      if (!response.ok) {
        setToken('')
        return localStorage.removeItem('token')
      }

      setFirstName(json.first_name)
      setLastName(json.last_name)
      setUsername(json.username)
    })()
  }, [])

  return (
    <>
      <Typography variant="h1" color="text.primary" margin={1} padding={1}>
        Hello
      </Typography>

      <Typography variant="h3" color="text.primary" margin={1} padding={1}>
        {loading ? <Skeleton /> : `${firstName} ${lastName}`}
      </Typography>

      <Typography variant="h4" color="text.primary" margin={1} padding={1}>
        {loading ? <Skeleton /> : `(${username})`}
      </Typography>
    </>
  )
}
