import bcrypt from 'bcrypt'
import { Express, Request, Response } from 'express'
import { Connection, RowDataPacket } from 'mysql2/promise'

import getIdFromToken from '../../../utils/getIdFromToken'

import { ErrorResponseType, UserDatabaseSchema } from '../index'

export type RequestBody = {
  new_password: string
}

const post = (database: Connection) => async (req: Request, res: Response) => {
  const id = await getIdFromToken(
    database,
    req.headers.authorization as string,
    true
  )

  const { new_password }: RequestBody = req.body

  if (!id || !new_password) {
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

  const encryptedPassword = await bcrypt.hash(new_password, 10)

  const updateError = await updatePassword(database, id, encryptedPassword)

  if (updateError) {
    const response: ErrorResponseType = {
      errorMessage: 'An Error Occured, Please Try Again',
    }

    return res.status(401).json(response)
  }

  res.end()
}

export default function password(
  routePath: string,
  app: Express,
  database: Connection
) {
  app.post(routePath, post(database))
}

async function getUser(database: Connection, id: string) {
  const [users] = (await database.query(
    `
      SELECT id
      FROM Users
      WHERE id="${id}"
    `
  )) as RowDataPacket[][]

  return users[0] as UserDatabaseSchema
}

async function updatePassword(
  database: Connection,
  id: string,
  encryptedPassword: string
): Promise<RowDataPacket[]> {
  const [, updateError] = (await database.query(
    `
      UPDATE Users
      SET password="${encryptedPassword}"
      WHERE id="${id}"
    `
  )) as RowDataPacket[][]

  return updateError
}

module.exports = password
