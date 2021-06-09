import { app, JWTSecretKey, eMailINFO } from '../../index'
import * as findUser from '../../utils/findUser'

import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

function api(APIPath: string) {
  app.post(APIPath, async (req, res, next) => {
    const { email } = req.body

    const user: any = await findUser.email(email)

    if(!user) return next()

    const logInTypes: any = JSON.parse(user.LogInTypes)

    const token: string = jwt.sign({ uuid: user.UUID }, JWTSecretKey, { expiresIn: 60 * 15 })

    const url: string = `http://localhost:3000/resetpassword/${token}`

    const transporter = nodemailer.createTransport(eMailINFO)

    transporter.sendMail({
      from: eMailINFO.auth.user,
      to: email,
      subject: '[Authentication] Reset Password',
      html: logInTypes.google ? `<p>You Signed In With Google Although<a href="${url}"Click To Set A Password</a></p>` : `<a href="${url}">Click To Reset Password</a>`,
    }, (error) => {
      if(error) return next()
    });

    res.status(200).send()
  }, (req, res) => {
    res.status(401).send()
  })
}

module.exports = {api}
