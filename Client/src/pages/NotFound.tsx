import { useContext, useEffect } from 'react'

import { Button, Stack, Typography } from '@mui/material'

import { WrapperTitleContext } from '../utils/context'

export default function NotFound() {
  const [, setWrapperTitle] = useContext(WrapperTitleContext)

  useEffect(() => setWrapperTitle('404'), [])

  return (
    <Stack width="100%" alignSelf="center">
      <Typography variant="h1" color="text.primary" margin={1}>
        404
      </Typography>
      <Typography variant="h4" color="text.primary" margin={1}>
        Page Not Found
      </Typography>

      <Button variant="contained" href="/" sx={{ margin: 1 }}>
        Return to Safety
      </Button>
    </Stack>
  )
}
