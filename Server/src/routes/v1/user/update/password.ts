import bcrypt from 'bcrypt'
import { Express, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
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

type UpdatePasswordRequestBody = {
  old_password: string
  new_password: string
}

const post = (database: Connection) => async (req: Request, res: Response) => {
  const id = await getIdFromToken(database, req.headers.authorization as string)

  const { old_password, new_password }: UpdatePasswordRequestBody = req.body

  if (!id || !old_password || !new_password) {
    const response: ErrorResponse = { errorMessage: 'Bad Request' }

    return res.status(400).json(response)
  }

  const [users] = (await database.query(
    `SELECT password FROM Users WHERE id="${id}"`
  )) as RowDataPacket[][]

  if (!Boolean(users.length)) {
    const response: ErrorResponse = {
      errorMessage: 'Invalid Token',
    }

    return res.status(401).json(response)
  }

  const user = users[0] as UserDatabaseSchema

  const isPassword = await bcrypt.compare(old_password, user.password)

  if (!isPassword) {
    const response: ErrorResponse = {
      errorMessage: 'Password is wrong',
    }

    return res.status(401).json(response)
  }

  const encryptedPassword = await bcrypt.hash(new_password, 10)

  const [, updateError] = (await database.query(
    `UPDATE Users SET password="${encryptedPassword}" WHERE id="${id}"`
  )) as RowDataPacket[][]

  if (updateError) {
    const response: ErrorResponse = {
      errorMessage: 'An Error Occured, Please Try Again',
    }

    return res.status(401).json(response)
  }

  const token = jwt.sign(
    { id, password: encryptedPassword },
    process.env.JWT_SECRET as string
  )

  res.json({ token })
}

export default function password(
  routePath: string,
  app: Express,
  database: Connection
) {
  app.post(routePath, post(database))
}
