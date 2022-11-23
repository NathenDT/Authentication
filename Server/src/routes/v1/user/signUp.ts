import bcrypt from 'bcrypt'
import { Express, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Connection, RowDataPacket } from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'

type ErrorResponse = {
  errorMessage: string
}

type SignUpRequestBody = {
  first_name: string | undefined
  last_name: string | undefined
  email: string | undefined
  username: string | undefined
  password: string | undefined
}

type SignUpUser = {
  id: string
  first_name: string
  last_name: string
  email: string
  username: string
  password: string
}

const post = (database: Connection) => async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    email,
    username,
    password,
  }: SignUpRequestBody = req.body

  if (!first_name || !last_name || !username || !email || !password) {
    const response: ErrorResponse = { errorMessage: 'Bad Request' }

    return res.status(400).json(response)
  }

  let usernameTaken = false
  let emailTaken = false

  const [existingUsernames] = (await database.query(
    `SELECT * FROM Users WHERE UPPER(username) LIKE UPPER('${username}')`
  )) as RowDataPacket[][]

  if (Boolean(existingUsernames.length)) usernameTaken = true

  const [existingEmails] = (await database.query(
    `SELECT * FROM Users WHERE UPPER(email) LIKE UPPER('${email}')`
  )) as RowDataPacket[][]

  if (Boolean(existingEmails.length)) emailTaken = true

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

  const encryptedPassword = await bcrypt.hash(password, 10)

  const user: SignUpUser = {
    id: uuidv4(),
    first_name,
    last_name,
    email,
    username,
    password: encryptedPassword,
  }

  const [, addUserError] = await database.query('INSERT INTO Users SET ?', user)

  if (addUserError) {
    console.error(addUserError)

    const response: ErrorResponse = {
      errorMessage: 'An Error Occured, Please Try Again',
    }

    return res.status(500).json(response)
  }

  const token = jwt.sign(
    { id: user.id, password: user.password },
    process.env.JWT_SECRET as string
  )

  res.json({ token })
}

export default function signUp(
  routePath: string,
  app: Express,
  database: Connection
) {
  app.post(routePath, post(database))
}
