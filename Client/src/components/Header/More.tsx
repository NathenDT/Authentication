import MoreVert from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'

import { Dispatch, SetStateAction, useContext, useState } from 'react'

import ChangeThemeMode from './ChangeThemeMode'
import IfToken from './IfToken'
import NoToken from './NoToken'
import { TokenContext } from '../../utils/context'

type Props = {
  themeMode: ThemeModeType
  setThemeMode: Dispatch<SetStateAction<ThemeModeType>>
}

export default function More({ themeMode, setThemeMode }: Props) {
  const [token, setToken] = useContext(TokenContext)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  return (
    <>
      <IconButton
        sx={{ margin: 1, color: 'primary.contrastText' }}
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <ChangeThemeMode themeMode={themeMode} setThemeMode={setThemeMode} />

        {Boolean(token) ? (
          <IfToken setToken={setToken} handleClose={handleClose} />
        ) : (
          <NoToken handleClose={handleClose} />
        )}
      </Menu>
    </>
  )
}
