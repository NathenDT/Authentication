import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { Dispatch, SetStateAction, useContext } from 'react'

import More from './More'
import { WrapperTitleContext } from '../../utils/context'

type Props = {
  themeMode: ThemeModeType
  setThemeMode: Dispatch<SetStateAction<ThemeModeType>>
}

export default function Header({ themeMode, setThemeMode }: Props) {
  const [wrapperTitle] = useContext(WrapperTitleContext)

  return (
    <Box display="flex" bgcolor="primary.main" margin={1}>
      <Typography variant="h4" color="primary.contrastText" margin={1}>
        Auth | {wrapperTitle}
      </Typography>

      <Box flexGrow={1}></Box>

      <More themeMode={themeMode} setThemeMode={setThemeMode} />
    </Box>
  )
}
