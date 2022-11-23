import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { LoadingContext, WrapperTitleContext } from '../utils/context'

export default function User() {
  const [searchParams] = useSearchParams()

  const [loading, setLoading] = useContext(LoadingContext)
  const [, setWrapperTitle] = useContext(WrapperTitleContext)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    ;(async function () {
      setLoading(true)
      setWrapperTitle('User')

      const username = searchParams.get('username')

      const response = await fetch(
        'https://authentication-7t3k.onrender.com/v1/user/get/withusername?username=' +
          username
      )

      const json = await response.json()

      setLoading(false)

      if (!response.ok) return console.error(json)

      setFirstName(json.first_name)
      setLastName(json.last_name)
      setUsername(json.username)
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
