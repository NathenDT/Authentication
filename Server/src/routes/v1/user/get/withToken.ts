import { Express, Request, Response } from 'express'
import { Connection, RowDataPacket } from 'mysql2/promise'

import { ErrorResponseType, UserDatabaseSchema } from '../../index'

import getIdFromToken from '../../../../utils/getIdFromToken'

export type ResponseType = {
  first_name: string
  last_name: string
  email: string
  username: string
  created: Date
}

const get = (database: Connection) => async (req: Request, res: Response) => {
  try {
    const id = await getIdFromToken(
      database,
      req.headers.authorization as string
    )

    if (!id) {
      const response: ErrorResponseType = { errorMessage: 'Not Authorized' }
      return res.status(401).json(response)
    }

    const user = await getUser(database, id as string)

    if (!user) {
      const response: ErrorResponseType = { errorMessage: 'Not Authorized' }
      return res.status(401).json(response)
    }

    res.json(user as ResponseType)
  } catch (_) {
    const response: ErrorResponseType = {
      errorMessage: 'Something went wrong. Please try again later',
    }
    return res.status(400).json(response)
  }
}

export default function getWithToken(
  routePath: string,
  app: Express,
  database: Connection
) {
  app.get(routePath, get(database))
}

async function getUser(
  database: Connection,
  id: string
): Promise<UserDatabaseSchema> {
  const [users] = (await database.query(
    `
      SELECT
        first_name,
        last_name,
        email,
        username,
        created
      FROM Users
      WHERE id="${id}"
    `
  )) as RowDataPacket[][]

  return users[0] as UserDatabaseSchema
}

module.exports = getWithToken
