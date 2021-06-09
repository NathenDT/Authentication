import { app, database, JWTSecretKey, BCRYPTSaltRounds, MySQLINFO } from '../../index'
import * as findUser from '../../utils/findUser'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidV4 } from 'uuid'

function api(APIPath: string) {
  app.post(APIPath, async (req: any, res, next) => {
    req.error = []

    const { firstname, lastname, username, email, password }: any = req.body

    const foundUsername = await findUser.username(username)
    const foundEmail = await findUser.email(email)

    if(foundUsername) req.error.push('username')

    if(foundEmail) req.error.push('email')

    if(req.error.length !== 0) return next()

    const uuid: string = uuidV4()
    const encryptPassword: string = await bcrypt.hash(password, BCRYPTSaltRounds)

    const user: object = {
      uuid,
      firstname,
      lastname,
      username,
      email,
      password: encryptPassword,
      LogInTypes: JSON.stringify({
        email: true,
        google: false
      })
    }

    const query: string = `INSERT INTO ${MySQLINFO.database} set ?`

    const createdUser: boolean = await new Promise(resolve => database.query(query, user, (err) => resolve(!err)))

    if(!createdUser) {
      req.error.push('server')
      return next()
    }

    const token = jwt.sign({ uuid }, JWTSecretKey)
    
    return res.json({
      token
    })
  }, (req: any, res) => {
    res.status(401).json({
      locations: req.error
    })
  })
}

module.exports = { api }
