import { app, JWTSecretKey } from '../../index'
import * as findUser from '../../utils/findUser'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

function api(APIPath: string) {
  app.post(APIPath, async (req: any, res, next) => {
    const { username, email, password } = req.body

    const user: any = username ? await findUser.username(username) : await findUser.email(email)

    if(!user) return next()

    const correctPassword: boolean = await bcrypt.compare(password, user.Password)

    if(!correctPassword) return next()

    const token = jwt.sign({ uuid: user.UUID }, JWTSecretKey)

    res.json({ token })
  },(req: any, res) => {
    res.status(401).send()
  })
}

module.exports = { api }
