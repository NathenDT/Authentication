import bcrypt from 'bcrypt'
import { Express, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Connection, RowDataPacket } from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'

import { ErrorResponseType } from '../'

export type RequestBodyType = {
  first_name: string | undefined
  last_name: string | undefined
  email: string | undefined
  username: string | undefined
  password: string | undefined
}

type SignUpUserType = {
  id: string
  first_name: string
  last_name: string
  email: string
  username: string
  password: string
}

export type ResponseType = {
  token: string
}

const post = (database: Connection) => async (req: Request, res: Response) => {
  const { first_name, last_name, email, username, password }: RequestBodyType =
    req.body

  if (!first_name || !last_name || !username || !email || !password) {
    const response: ErrorResponseType = { errorMessage: 'Bad Request' }

    return res.status(400).json(response)
  }

  const usernameTaken = await isUsernameTaken(database, username)
  const emailTaken = await isEmailTaken(database, email)

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

  const encryptedPassword = await bcrypt.hash(password, 10)

  const user: SignUpUserType = {
    id: uuidv4(),
    first_name,
    last_name,
    email,
    username,
    password: encryptedPassword,
  }

  const addUserError = await addUser(database, user)

  if (addUserError) {
    const response: ErrorResponseType = {
      errorMessage: 'An Error Occured, Please Try Again',
    }

    return res.status(500).json(response)
  }

  const token = jwt.sign(
    { id: user.id, password: user.password },
    process.env.JWT_SECRET as string
  )

  const response: ResponseType = { token }

  res.json(response)
}

export default function signUp(
  routePath: string,
  app: Express,
  database: Connection
) {
  app.post(routePath, post(database))
}

async function isUsernameTaken(database: Connection, username: string) {
  const [user] = (await database.query(
    `
      SELECT * FROM Users
      WHERE UPPER(username) LIKE UPPER('${username}')
    `
  )) as RowDataPacket[][]

  return Boolean(user.length)
}

async function isEmailTaken(database: Connection, email: string) {
  const [user] = (await database.query(
    `
      SELECT * FROM Users
      WHERE UPPER(email) LIKE UPPER('${email}')
    `
  )) as RowDataPacket[][]

  return Boolean(user.length)
}

async function addUser(database: Connection, user: SignUpUserType) {
  const [, error] = await database.query('INSERT INTO Users SET ?', user)

  return Boolean(error)
}

module.exports = signUp
