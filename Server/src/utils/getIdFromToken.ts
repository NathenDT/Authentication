import jwt from 'jsonwebtoken'
import { Connection, RowDataPacket } from 'mysql2/promise'

import { UserDatabaseSchema } from '../routes/v1/index'

type JWTDecoded = {
  id: string
  password: string
}

export default async function getIdFromToken(
  database: Connection,
  token: string,
  isForgotPassword = false
) {
  const decodedToken = decodeToken(token, isForgotPassword)

  if (!decodedToken) return

  const { id, password: tokenPassword } = decodedToken

  if (!id || !tokenPassword) return

  const password = await getPassword(database, id)

  if (tokenPassword != password) return

  return id
}

function decodeToken(token: string, isForgotPassword = false) {
  const SECRET = isForgotPassword
    ? (process.env.JWT_SECRET_FORGOT_PASSWORD as string)
    : (process.env.JWT_SECRET as string)

  try {
    return jwt.verify(token, SECRET) as JWTDecoded
  } catch (_) {
    return
  }
}

async function getPassword(database: Connection, id: string) {
  const [users] = (await database.query(
    `
      SELECT password
      FROM Users
      WHERE id="${id}"
    `
  )) as RowDataPacket[][]

  const user = users[0] as UserDatabaseSchema

  return user.password
}
