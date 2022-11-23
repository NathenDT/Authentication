import { createContext, Dispatch, SetStateAction } from 'react'

export const TokenContext = createContext<
  [string, Dispatch<SetStateAction<string>>]
>(['', () => {}])

export const LoadingContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => {}])

export const WrapperTitleContext = createContext<
  [string, Dispatch<SetStateAction<string>>]
>(['', () => {}])
