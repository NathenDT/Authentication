import bcrypt from 'bcrypt'
import { Express, Request, Response } from 'express'
import { Connection, RowDataPacket } from 'mysql2/promise'

import getIdFromToken from '../../../utils/getIdFromToken'

type UserDatabaseSchema = {
  id: string
  first_name: string
  last_name: string
  email: string
  username: string
  password: string
  created: Date
  verified: boolean
}

type ErrorResponse = {
  errorMessage: string
}

type DeleteRequestBody = {
  password: string | undefined
}

const post = (database: Connection) => async (req: Request, res: Response) => {
  const id = await getIdFromToken(database, req.headers.authorization as string)

  const { password }: DeleteRequestBody = req.body

  if (!id || !password) {
    const response: ErrorResponse = { errorMessage: 'Bad Request' }

    return res.status(400).json(response)
  }

  const [users] = (await database.query(
    `SELECT password FROM Users WHERE id="${id}"`
  )) as RowDataPacket[][]

  if (!Boolean(users.length)) {
    const response: ErrorResponse = {
      errorMessage: 'Invalid Token',
    }

    return res.status(401).json(response)
  }

  const user = users[0] as UserDatabaseSchema

  const isPassword = await bcrypt.compare(password, user.password)

  if (!isPassword) {
    const response: ErrorResponse = {
      errorMessage: 'Password is wrong',
    }

    return res.status(401).json(response)
  }

  const [, deleteError] = (await database.query(
    `DELETE FROM Users WHERE id="${id}"`
  )) as RowDataPacket[][]

  if (deleteError) {
    const response: ErrorResponse = {
      errorMessage: 'An Error Occured, Please Try Again',
    }

    return res.status(401).json(response)
  }

  res.end()
}

export default function deleteUser(
  routePath: string,
  app: Express,
  database: Connection
) {
  app.post(routePath, post(database))
}
