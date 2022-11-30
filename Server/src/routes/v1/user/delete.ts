import bcrypt from 'bcrypt'
import { Express, Request, Response } from 'express'
import { Connection, RowDataPacket } from 'mysql2/promise'

import getIdFromToken from '../../../utils/getIdFromToken'

import { ErrorResponseType, UserDatabaseSchema } from '../'

export type RequestBodyType = {
  password: string | undefined
}

const post = (database: Connection) => async (req: Request, res: Response) => {
  const id = await getIdFromToken(database, req.headers.authorization as string)

  const { password }: RequestBodyType = req.body

  if (!id || !password) {
    const response: ErrorResponseType = { errorMessage: 'Bad Request' }

    return res.status(400).json(response)
  }

  const user = await getUser(database, id)

  if (!user) {
    const response: ErrorResponseType = {
      errorMessage: 'Invalid Token',
    }

    return res.status(401).json(response)
  }

  const isPassword = await bcrypt.compare(password, user.password)

  if (!isPassword) {
    const response: ErrorResponseType = {
      errorMessage: 'Password is wrong',
    }

    return res.status(401).json(response)
  }

  const deleteError = await deleteDatabaseUser(database, id)

  if (deleteError) {
    const response: ErrorResponseType = {
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

async function getUser(
  database: Connection,
  id: string
): Promise<UserDatabaseSchema | undefined> {
  const [users] = (await database.query(
    `SELECT password FROM Users WHERE id="${id}"`
  )) as RowDataPacket[][]

  if (!Boolean(users.length)) return

  return users[0] as UserDatabaseSchema
}

async function deleteDatabaseUser(database: Connection, id: string) {
  const [, deleteError] = (await database.query(
    `
      DELETE FROM Users
      WHERE id="${id}"
    `
  )) as RowDataPacket[][]

  return Boolean(deleteError)
}

module.exports = deleteUser
