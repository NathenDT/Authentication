import { ResponseType } from '@backend/v1/user/get/withToken'

import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import axios, { AxiosError } from 'axios'
import { useContext, useEffect, useState } from 'react'

import {
  AlertsContext,
  LoadingContext,
  TokenContext,
  WrapperTitleContext,
} from '../utils/context'
import getServerUrl from '../utils/getServerUrl'

export default function Home() {
  const [token, setToken] = useContext(TokenContext)
  const [loading, setLoading] = useContext(LoadingContext)
  const [alerts, setAlerts] = useContext(AlertsContext)
  const [, setTitleContext] = useContext(WrapperTitleContext)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    ;(async function () {
      setTitleContext('Home')
      setLoading(true)
      setAlerts([])

      try {
        const response = await axios.get(
          getServerUrl() + '/v1/user/get/withtoken',
          { headers: { Authorization: token } }
        )

        setLoading(false)

        const {
          first_name,
          last_name,
          username: _username,
        } = response.data as ResponseType

        setFirstName(first_name)
        setLastName(last_name)
        setUsername(_username)
      } catch (error) {
        const _error = error as AxiosError
        const { response } = _error

        setLoading(false)

        if (!response) {
          return setAlerts([
            ...alerts,
            {
              severity: 'error',
              message: 'An Error Occured, Please try again',
            },
          ])
        }

        setToken('')
        localStorage.removeItem('token')
      }
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
