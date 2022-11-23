import { Express, Request, Response } from 'express'
import { Connection, RowDataPacket } from 'mysql2/promise'

import getIdFromToken from '../../../../utils/getIdFromToken'

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

type UpdateRequestBody = {
  first_name?: string
  last_name?: string
  email?: string
  username?: string
}

const post = (database: Connection) => async (req: Request, res: Response) => {
  const id = await getIdFromToken(database, req.headers.authorization as string)

  const { first_name, last_name, email, username }: UpdateRequestBody = req.body

  if (!id) {
    const response: ErrorResponse = { errorMessage: 'Bad Request' }

    return res.status(400).json(response)
  }

  let updates: UpdateRequestBody = {}

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
    let response: ErrorResponse = { errorMessage: '' }

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
    const response: ErrorResponse = {
      errorMessage: 'An Error Occured, Please Try Again',
    }

    return res.status(401).json(response)
  }

  const [users] = (await database.query(
    `SELECT first_name, last_name, email, username FROM Users WHERE id="${id}"`
  )) as RowDataPacket[][]

  if (!Boolean(users.length)) {
    const response: ErrorResponse = {
      errorMessage: 'Invalid Token',
    }

    return res.status(401).json(response)
  }

  const user = users[0] as UserDatabaseSchema

  res.json(user)
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
  updates: UpdateRequestBody
) {
  const [, updateError] = (await database.query(
    `UPDATE Users SET ? WHERE id="${id}"`,
    updates
  )) as RowDataPacket[][]

  return updateError
}
