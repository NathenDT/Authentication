import { Express, Request, Response } from 'express'
import { Connection, RowDataPacket } from 'mysql2/promise'

import { ErrorResponseType, UserDatabaseSchema } from '../../'
import getIdFromToken from '../../../../utils/getIdFromToken'

export type RequestBodyType = {
  first_name?: string
  last_name?: string
  email?: string
  username?: string
}

export type ResponseType = {
  first_name: string
  last_name: string
  email: string
  username: string
}

const post = (database: Connection) => async (req: Request, res: Response) => {
  try {
    const id = await getIdFromToken(
      database,
      req.headers.authorization as string
    )

    const { first_name, last_name, email, username }: RequestBodyType = req.body

    if (!id) {
      const response: ErrorResponseType = { errorMessage: 'Bad Request' }

      return res.status(400).json(response)
    }

    let updates: RequestBodyType = {}

    let usernameTaken = false
    let emailTaken = false

    if (first_name) updates.first_name = first_name
    if (last_name) updates.last_name = last_name
    if (email) {
      if (await emailExists(database, email)) {
        emailTaken = true
      } else {
        updates.email = email
      }
    }
    if (username) {
      if (await usernameExists(database, username)) {
        usernameTaken = true
      } else {
        updates.username = username
      }
    }

    if (usernameTaken || emailTaken) {
      let response: ErrorResponseType = { errorMessage: '' }

      if (usernameTaken && emailTaken) {
        response.errorMessage = 'Username and Email Taken'
      } else if (usernameTaken) {
        response.errorMessage = 'Username Taken'
      } else if (emailTaken) {
        response.errorMessage = 'Email Taken'
      }

      return res.status(400).json(response)
    }

    const updateError = await updateUser(database, id, updates)

    if (updateError) {
      const response: ErrorResponseType = {
        errorMessage: 'An Error Occured, Please Try Again',
      }

      return res.status(401).json(response)
    }

    const user = await getUser(database, id)

    if (!user) {
      const response: ErrorResponseType = {
        errorMessage: 'Invalid Token',
      }

      return res.status(401).json(response)
    }

    res.json(user)
  } catch (_) {
    const response: ErrorResponseType = {
      errorMessage: 'Something went wrong. Please try again later',
    }
    return res.status(500).json(response)
  }
}

export default function update(
  routePath: string,
  app: Express,
  database: Connection
) {
  app.post(routePath, post(database))
}

async function emailExists(database: Connection, email: string) {
  const [users] = (await database.query(
    `
      SELECT
        id
      FROM Users
      WHERE UPPER(email) LIKE UPPER("${email}")
    `
  )) as RowDataPacket[][]

  return Boolean(users.length)
}

async function usernameExists(database: Connection, username: string) {
  const [users] = (await database.query(
    `
      SELECT
        id
      FROM Users
      WHERE UPPER(username) LIKE UPPER("${username}")
    `
  )) as RowDataPacket[][]

  return Boolean(users.length)
}

async function updateUser(
  database: Connection,
  id: string,
  updates: RequestBodyType
) {
  const [, updateError] = (await database.query(
    `
      UPDATE Users
      SET ?
      WHERE id="${id}"
    `,
    updates
  )) as RowDataPacket[][]

  return updateError
}

async function getUser(
  database: Connection,
  id: string
): Promise<UserDatabaseSchema | undefined> {
  const [users] = (await database.query(
    `
      SELECT
        first_name,
        last_name,
        email,
        username
      FROM Users
      WHERE id="${id}"
    `
  )) as RowDataPacket[][]

  if (!Boolean(users.length)) return

  return users[0] as UserDatabaseSchema
}

module.exports = update
