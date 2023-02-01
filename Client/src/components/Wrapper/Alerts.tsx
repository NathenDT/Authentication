import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import { useContext, useEffect } from 'react'

import { AlertsContext } from '../../utils/context'

export default function Alerts() {
  const [alerts, setAlerts] = useContext(AlertsContext)

  const upperCaseFirstLetter = (word: string) => {
    const letters = word.split('')

    const [first, ...rest] = letters

    return first.toUpperCase() + rest.join('')
  }

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setAlerts([...alerts.slice(1)])
    }, 10 * 1000) // 10 Seconds

    return () => {
      clearTimeout(timeOut)
    }
  }, [alerts])

  return (
    <>
      {alerts.map(({ severity, message }, index) => (
        <Alert
          severity={severity}
          sx={{ margin: 1 }}
          onClose={() => {
            setAlerts([...alerts.filter((_, i) => i !== index)])
          }}
          key={index}
        >
          <AlertTitle>{upperCaseFirstLetter(severity!)}</AlertTitle>

          {message}
        </Alert>
      ))}
    </>
  )
}
