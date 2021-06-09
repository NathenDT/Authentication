import { app, JWTSecretKey } from '../../index'
import * as findUser from '../../utils/findUser'
import * as OAuth from '../../utils/OAuth'
import * as updateUser from '../../utils/updateUser'

import jwt from 'jsonwebtoken'

function api(APIPath: string) {
  app.post(APIPath, async (req, res, next) => {
    const { googleOAuthToken } = req.body

    const ticket: any = await OAuth.google(googleOAuthToken)

    if(!ticket) return next()

    const { email }: any = ticket.getPayload()

    const user: any = await findUser.email(email)

    if(!user) return res.json({ signedUp: false, googleOAuthToken })

    const logInTypes: any = JSON.parse(user.LogInTypes)

    if(!logInTypes.google) {
      logInTypes.google = true
      updateUser.logInTypes(user.UUID, logInTypes)
    }

    const token = jwt.sign({ uuid: user.UUID }, JWTSecretKey)

    res.json({signedUp: true, token})
  }, (req, res) => {
    res.status(401).send()
  })
}

module.exports = { api }
