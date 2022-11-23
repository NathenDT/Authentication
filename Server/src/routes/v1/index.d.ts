import { UserDatabaseSchema } from '../../index'

export type ErrorResponse = {
  errorMessage: string
}

export type UserDatabaseSchema = UserDatabaseSchema

export type GetUserWithTokenResponse = {
  first_name: string
  last_name: string
  email: string
  username: string
  created: Date
}
