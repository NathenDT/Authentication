import { Express, Request, Response } from 'express'
import { Connection, RowDataPacket } from 'mysql2/promise'

import { ErrorResponse, UserDatabaseSchema } from '../../index'

type GetWithUsernameQuery = {
  username?: string
}

const get = (database: Connection) => async (req: Request, res: Response) => {
  const { username } = req.query as GetWithUsernameQuery

  if (!username) {
    const response: ErrorResponse = { errorMessage: 'Invalid Request' }

    return res.status(400).json(response)
  }

  const user = await getUser(database, username)

  if (!user) {
    const response: ErrorResponse = { errorMessage: 'Not Authorized' }

    return res.status(401).json(response)
  }

  res.json(user)
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
): Promise<UserDatabaseSchema> {
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
