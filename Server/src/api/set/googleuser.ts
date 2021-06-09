import { app, database, JWTSecretKey, MySQLINFO } from '../../index'
import * as OAuth from '../../utils/OAuth'

import jwt from 'jsonwebtoken'
import { v4 as uuidV4 } from 'uuid'

function api(APIPath: string) {
  app.post(APIPath, async (req, res, next) => {
    const { username, googleOAuthToken } = req.body

    const ticket: any = await OAuth.google(googleOAuthToken)

    if(!ticket) return next()

    const { given_name, family_name, email } = ticket.getPayload()

    const uuid: string = uuidV4()

    const user: object = {
      uuid,
      firstname: given_name,
      lastname: family_name,
      username,
      email,
      LogInTypes: JSON.stringify({
        email: false,
        google: true
      })
    }
    
    const query: string = `INSERT INTO ${MySQLINFO.database} set ?`

    const createdUser: boolean = await new Promise(resolve => database.query(query, user, (err) => resolve(!err)))

    if(!createdUser) return next()

    const token = jwt.sign({ uuid }, JWTSecretKey)

    return res.json({
      token
    })
  }, (req, res) => {
    res.status(401).send()
  })
}

module.exports = { api }
