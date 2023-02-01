import bcrypt from 'bcrypt'
import { Express, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Connection, RowDataPacket } from 'mysql2/promise'

import { ErrorResponseType, UserDatabaseSchema } from '../'

export type RequestBodyType = {
  username: string | undefined
  password: string | undefined
}

export type ResponseType = {
  token: string
}

const post = (database: Connection) => async (req: Request, res: Response) => {
  try {
    const { username, password }: RequestBodyType = req.body

    if (!username || !password) {
      const response: ErrorResponseType = { errorMessage: 'Bad Request' }

      return res.status(400).json(response)
    }

    const user = await getUser(database, username)

    if (!user) {
      const response: ErrorResponseType = {
        errorMessage: 'Username or Password is wrong',
      }
      return res.status(401).json(response)
    }

    const isPassword = await bcrypt.compare(password, user.password)

    if (!isPassword) {
      const response: ErrorResponseType = {
        errorMessage: 'Username or Password is wrong',
      }

      return res.status(401).json(response)
    }

    const token = jwt.sign(
      { id: user.id, password: user.password },
      process.env.JWT_SECRET as string
    )

    const response: ResponseType = { token }

    res.json(response)
  } catch (_) {
    const response: ErrorResponseType = {
      errorMessage: 'Something went wrong. Please try again later',
    }
    return res.status(401).json(response)
  }
}

export default function logIn(
  routePath: string,
  app: Express,
  database: Connection
) {
  app.post(routePath, post(database))
}

async function getUser(
  database: Connection,
  username: string
): Promise<UserDatabaseSchema | undefined> {
  const [users] = (await database.query(
    `
      SELECT
        id,
        password
      FROM Users
      WHERE UPPER(username) LIKE UPPER('${username}')
    `
  )) as RowDataPacket[][]

  if (!Boolean(users.length)) return

  return users[0] as UserDatabaseSchema
}

module.exports = logIn
