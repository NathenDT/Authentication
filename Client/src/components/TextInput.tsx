import { useState, useEffect } from 'react'

import './style/TextInput.scss'

type Props = {
  type: string,
  name: string,
  value: string,
  setValue: Function,
  errors?: Array<any>,
  errorMessage?: string,
  setErrorMessage?: Function,
  required?: boolean
}

function TextInput({
  type,
  name,
  value,
  setValue,
  errors = [{
    condition: false,
    message: ''
  }],
  errorMessage = '',
  setErrorMessage = (x: string) => { return x },
  required = false
}: Props): JSX.Element {
  const
    [borderColor, setBorderColor] = useState('#000000'),
    [passwordToggle, setPasswordToggle] = useState('show')

  const doesHaveError = new Promise(resolve => {
    errors.forEach((error) => {
      if(error.condition) resolve(error.message)
    })

    resolve(null)
  })

  const handleChange = (e: any) => setValue(e.target.value)

  const handleAny = async (e: any) => {
    const text: string = e.target.value

    if(required && text === '') return setErrorMessage('Please Enter An Value')

    const hasError = await doesHaveError

    setErrorMessage(hasError ? hasError : '')
  }

  const handlePasswordToggle = (e: any) => setPasswordToggle(passwordToggle === 'show' ? 'hide' : 'show')

  useEffect(() => setBorderColor(errorMessage !== '' ? '#ff0000' : '#000000'), [errorMessage])

  return (
    <div className = 'TextInputParent-DIV'>
      <input
        type = {
          type === 'password' ? (passwordToggle === 'show' ? 'password' : 'text') : type
        }
        placeholder = { name }
        value = { value }
        style = { { borderColor: borderColor } }
        onChange = { handleChange }
        onKeyUp = { handleAny }
        onFocus = { handleAny }
      />
      <span onClick = { handlePasswordToggle }>{ type === 'password' ? passwordToggle : '' }</span>
      <p>{ errorMessage }</p>
    </div>
  )
}

export default TextInput
