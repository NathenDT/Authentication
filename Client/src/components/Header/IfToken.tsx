import Home from '@mui/icons-material/Home'
import Logout from '@mui/icons-material/Logout'
import Settings from '@mui/icons-material/Settings'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import { Dispatch, SetStateAction, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type Props = {
  setToken: Dispatch<SetStateAction<string>>
  handleClose: () => void
}

export default function IfToken({ setToken, handleClose }: Props) {
  const location = useLocation()
  const navigate = useNavigate()

  const [pathName] = useState(location.pathname)

  const handleHome = () => {
    handleClose()

    navigate('/')
  }

  const handleSettings = () => {
    handleClose()

    navigate('/settings')
  }

  const handleLogOut = () => {
    handleClose()

    setToken('')
    localStorage.removeItem('token')
  }

  return (
    <>
      <MenuItem onClick={handleHome} disabled={pathName == '/'}>
        <ListItemIcon>
          <Home />
        </ListItemIcon>

        <Typography>Home</Typography>
      </MenuItem>

      <MenuItem onClick={handleSettings} disabled={pathName == '/settings'}>
        <ListItemIcon>
          <Settings />
        </ListItemIcon>

        <Typography>Settings</Typography>
      </MenuItem>

      <MenuItem onClick={handleLogOut}>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>

        <Typography>Log Out</Typography>
      </MenuItem>
    </>
  )
}
