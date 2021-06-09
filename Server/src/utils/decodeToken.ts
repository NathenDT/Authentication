import { JWTSecretKey } from '../index'

import jwt from 'jsonwebtoken'

function decodeToken(token: string): string {
  try {
    const decodedToken: any = jwt.verify(token, JWTSecretKey)
    return decodedToken.uuid
  } catch(e) {
    return ''
  }
}

export default decodeToken
