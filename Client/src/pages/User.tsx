import { ErrorResponseType } from '@backend/v1/'
import {
  RequestQueryType,
  ResponseType,
} from '@backend/v1/user/get/withUsername'

import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import axios, { AxiosError } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  AlertsContext,
  LoadingContext,
  WrapperTitleContext,
} from '../utils/context'
import getServerUrl from '../utils/getServerUrl'

export default function User() {
  const [searchParams] = useSearchParams()

  const [loading, setLoading] = useContext(LoadingContext)
  const [alerts, setAlerts] = useContext(AlertsContext)
  const [, setWrapperTitle] = useContext(WrapperTitleContext)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    ;(async function () {
      setLoading(true)
      setAlerts([])
      setWrapperTitle('User')

      const username = searchParams.get('username') as string | undefined

      const params: RequestQueryType = { username }

      try {
        const response = await axios.get(
          getServerUrl() + '/v1/user/get/withusername',
          { params }
        )

        const {
          first_name,
          last_name,
          username: _username,
        } = response.data as ResponseType

        setFirstName(first_name)
        setLastName(last_name)
        setUsername(_username)

        setLoading(false)
      } catch (error) {
        const _error = error as AxiosError
        const { response } = _error

        if (!response) {
          return setAlerts([
            ...alerts,
            {
              severity: 'error',
              message: 'An Error Occured, Please try again',
            },
          ])
        }

        const { errorMessage } = response.data as ErrorResponseType

        setAlerts([
          ...alerts,
          {
            severity: 'error',
            message: errorMessage,
          },
        ])
      }
    })()
  }, [])

  return (
    <Stack width="100%">
      <Typography variant="h2" color="text.primary" margin={1} padding={1}>
        Say Hello to
      </Typography>
      <Typography variant="h3" color="text.primary" margin={1} padding={1}>
        {loading ? <Skeleton /> : `${firstName} ${lastName}`}
      </Typography>
      <Typography variant="h4" color="text.primary" margin={1} padding={1}>
        {loading ? <Skeleton /> : `(${username})`}
      </Typography>
    </Stack>
  )
}
