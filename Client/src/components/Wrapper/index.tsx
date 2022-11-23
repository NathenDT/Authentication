import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { BrowserRouter, HashRouter, Routes } from 'react-router-dom'

import WrapperBox from './WrapperBox'
import Header from '../Header'
import {
  LoadingContext,
  TokenContext,
  WrapperTitleContext,
} from '../../utils/context'

type Props = {
  children: ReactNode
  token: string
  setToken: Dispatch<SetStateAction<string>>
}

export default function Wrapper({ children, token, setToken }: Props) {
  const [loading, setLoading] = useState(false)

  const [themeMode, setThemeMode] = useState<ThemeModeType>(
    (localStorage.getItem('theme') as ThemeModeType) || 'preferred'
  )

  const [wrapperTitle, setWrapperTitle] = useState('')

  const theme = useMemo(() => {
    let mode = themeMode

    if (mode == 'preferred')
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

    return createTheme({
      palette: {
        mode,
      },
    })
  }, [themeMode])

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default

    localStorage.setItem('theme', themeMode)
  }, [themeMode])

  return (
    <ThemeProvider theme={theme}>
      <TokenContext.Provider value={[token, setToken]}>
        <LoadingContext.Provider value={[loading, setLoading]}>
          <WrapperTitleContext.Provider value={[wrapperTitle, setWrapperTitle]}>
            <WrapperBox>
              <HashRouter>
                <Header themeMode={themeMode} setThemeMode={setThemeMode} />

                <Routes>{children}</Routes>

                <Backdrop
                  sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={loading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </HashRouter>
            </WrapperBox>
          </WrapperTitleContext.Provider>
        </LoadingContext.Provider>
      </TokenContext.Provider>
    </ThemeProvider>
  )
}
