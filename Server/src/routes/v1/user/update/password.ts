import bcrypt from 'bcrypt'
import { Express, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Connection, RowDataPacket } from 'mysql2/promise'

import { ErrorResponseType, UserDatabaseSchema } from '../../'
import getIdFromToken from '../../../../utils/getIdFromToken'

export type RequestBodyType = {
  old_password: string
  new_password: string
}

export type ResponseType = {
  token: string
}

const post = (database: Connection) => async (req: Request, res: Response) => {
  const id = await getIdFromToken(database, req.headers.authorization as string)

  const { old_password, new_password }: RequestBodyType = req.body

  if (!id || !old_password || !new_password) {
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

  const isPassword = await bcrypt.compare(old_password, user.password)

  if (!isPassword) {
    const response: ErrorResponseType = {
      errorMessage: 'Password is wrong',
    }

    return res.status(401).json(response)
  }

  const encryptedPassword = await bcrypt.hash(new_password, 10)

  const updateError = await updateUser(database, id, encryptedPassword)

  if (updateError) {
    const response: ErrorResponseType = {
      errorMessage: 'An Error Occured, Please Try Again',
    }

    return res.status(401).json(response)
  }

  const token = jwt.sign(
    { id, password: encryptedPassword },
    process.env.JWT_SECRET as string
  )

  const response: ResponseType = { token }

  res.json(response)
}

export default function password(
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
    `
      SELECT password
      FROM Users
      WHERE id="${id}"
    `
  )) as RowDataPacket[][]

  if (!Boolean(users.length)) return

  return users[0] as UserDatabaseSchema
}

async function updateUser(
  database: Connection,
  id: string,
  encryptedPassword: string
) {
  const [, updateError] = (await database.query(
    `
      UPDATE Users
      SET password="${encryptedPassword}"
      WHERE id="${id}"
    `
  )) as RowDataPacket[][]

  return Boolean(updateError)
}

module.exports = password
