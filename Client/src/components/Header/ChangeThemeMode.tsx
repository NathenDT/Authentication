import DarkMode from '@mui/icons-material/DarkMode'
import LightMode from '@mui/icons-material/LightMode'
import SettingsBrightness from '@mui/icons-material/SettingsBrightness'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { Dispatch, SetStateAction } from 'react'

type Props = {
  themeMode: ThemeModeType
  setThemeMode: Dispatch<SetStateAction<ThemeModeType>>
}

export default function ChangeThemeMode({ themeMode, setThemeMode }: Props) {
  const handleLightClick = () => setThemeMode('light')
  const handlePreferredClick = () => setThemeMode('preferred')
  const handleDarkClick = () => setThemeMode('dark')

  return (
    <MenuItem sx={{ padding: 1 }} disableRipple disableTouchRipple>
      <Stack>
        <Typography margin={1}>Color Theme</Typography>

        <ButtonGroup sx={{ margin: 1 }}>
          <Tooltip title="Light">
            <Button
              onClick={handleLightClick}
              variant={themeMode == 'light' ? 'contained' : 'outlined'}
            >
              <LightMode />
            </Button>
          </Tooltip>

          <Tooltip title="System Preferred">
            <Button
              onClick={handlePreferredClick}
              variant={themeMode == 'preferred' ? 'contained' : 'outlined'}
            >
              <SettingsBrightness />
            </Button>
          </Tooltip>

          <Tooltip title="Dark">
            <Button
              onClick={handleDarkClick}
              variant={themeMode == 'dark' ? 'contained' : 'outlined'}
            >
              <DarkMode />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Stack>
    </MenuItem>
  )
}
