import { Express, Request, Response } from 'express'
import { Connection, RowDataPacket } from 'mysql2/promise'

import { ErrorResponseType, UserDatabaseSchema } from '../../index'

export type RequestQueryType = {
  username?: string
}

export type ResponseType = {
  first_name: string
  last_name: string
  username: string
  created: string
}

const get = (database: Connection) => async (req: Request, res: Response) => {
  try {
    const { username } = req.query as RequestQueryType

    if (!username) {
      const response: ErrorResponseType = { errorMessage: 'Bad Request' }
      return res.status(400).json(response)
    }

    const user = await getUser(database, username)

    if (!user) {
      const response: ErrorResponseType = { errorMessage: 'Not Found' }
      return res.status(404).json(response)
    }

    res.json(user)
  } catch (_) {
    const response: ErrorResponseType = {
      errorMessage: 'Something went wrong. Please try again later',
    }
    return res.status(500).json(response)
  }
}

export default function getWithUsername(
  routePath: string,
  app: Express,
  database: Connection
) {
  app.get(routePath, get(database))
}

async function getUser(
  database: Connection,
  username: string
): Promise<UserDatabaseSchema | undefined> {
  const [users] = (await database.query(
    `
    SELECT
      first_name,
      last_name,
      username,
      created
    FROM Users
    WHERE UPPER(username) LIKE UPPER("${username}")
  `
  )) as RowDataPacket[][]

  return users[0] as UserDatabaseSchema
}

module.exports = getWithUsername
