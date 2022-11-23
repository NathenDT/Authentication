import Login from '@mui/icons-material/Login'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type Props = {
  handleClose: () => void
}

export default function NoToken({ handleClose }: Props) {
  const location = useLocation()
  const navigate = useNavigate()

  const [pathName] = useState(location.pathname)

  const handleLogIn = () => {
    handleClose()

    navigate('/login')
  }

  const handleSignUp = () => {
    handleClose()

    navigate('/signup')
  }

  return (
    <>
      <MenuItem onClick={handleLogIn} disabled={pathName == '/login'}>
        <ListItemIcon>
          <Login />
        </ListItemIcon>

        <Typography>Log In</Typography>
      </MenuItem>

      <MenuItem onClick={handleSignUp} disabled={pathName == '/signup'}>
        <ListItemIcon>
          <Login />
        </ListItemIcon>

        <Typography>Sign Up</Typography>
      </MenuItem>
    </>
  )
}
