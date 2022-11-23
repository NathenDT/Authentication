import bcrypt from 'bcrypt'
import { Express, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Connection, RowDataPacket } from 'mysql2/promise'

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

type LogInRequestBody = {
  first_name: string | undefined
  last_name: string | undefined
  email: string | undefined
  username: string | undefined
  password: string | undefined
}

const post = (database: Connection) => async (req: Request, res: Response) => {
  const { username, password }: LogInRequestBody = req.body

  if (!username || !password) {
    const response: ErrorResponse = { errorMessage: 'Bad Request' }

    return res.status(400).json(response)
  }

  const [users] = (await database.query(
    `SELECT id, password FROM Users WHERE UPPER(username) LIKE UPPER('${username}')`
  )) as RowDataPacket[][]

  if (!Boolean(users.length)) {
    const response: ErrorResponse = {
      errorMessage: 'Username or Password is wrong',
    }

    return res.status(401).json(response)
  }

  const user = users[0] as UserDatabaseSchema

  const isPassword = await bcrypt.compare(password, user.password)

  if (!isPassword) {
    const response: ErrorResponse = {
      errorMessage: 'Username or Password is wrong',
    }

    return res.status(401).json(response)
  }

  const token = jwt.sign(
    { id: user.id, password: user.password },
    process.env.JWT_SECRET as string
  )

  res.json({ token })
}

export default function logIn(
  routePath: string,
  app: Express,
  database: Connection
) {
  app.post(routePath, post(database))
}
