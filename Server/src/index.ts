import cors from 'cors'
import express from 'express'
import { createConnection } from 'mysql2/promise'
import nodemailer from 'nodemailer'

import ping from './routes/ping'
import forgotPasswordChangePassword from './routes/v1/forgotPassword/changePassword'
import forgotPasswordRequest from './routes/v1/forgotPassword/request'
import deleteUser from './routes/v1/user/delete'
import getWithToken from './routes/v1/user/get/withToken'
import getWithUsername from './routes/v1/user/get/withUsername'
import logIn from './routes/v1/user/logIn'
import signUp from './routes/v1/user/signUp'
import update from './routes/v1/user/update'
import updatePassword from './routes/v1/user/update/password'

require('dotenv').config()

const PORT = parseInt(process.env.PORT!, 10)
const MY_SQL_URL = process.env.MY_SQL_URL as string

;(async function () {
  const database = await createConnection(MY_SQL_URL)
  const app = express()
  const emailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nathendtauthentication@gmail.com',
      pass: 'rzderatxqozrarlt',
    },
  })

  app.use(express.json())
  app.use(cors())

  ping('/ping', app)
  forgotPasswordChangePassword(
    '/v1/forgotpassword/changePassword',
    app,
    database
  )
  forgotPasswordRequest(
    '/v1/forgotpassword/request',
    app,
    database,
    emailTransport
  )
  deleteUser('/v1/user/delete', app, database)
  getWithToken('/v1/user/get/withtoken', app, database)
  getWithUsername('/v1/user/get/withusername', app, database)
  signUp('/v1/user/signup', app, database)
  logIn('/v1/user/login', app, database)
  update('/v1/user/update', app, database)
  updatePassword('/v1/user/update/password', app, database)

  app.get('/', (_, res) => {
    res.redirect(process.env.WEBSITE_URL as string)
  })

  app.get('*', (_, res) => {
    res.redirect(process.env.WEBSITE_URL as string)
  })

  app.listen(PORT, () => {
    console.log('Listening on Port:', PORT)

    console.log('Connected to Database:', database.config.database)
  })
})()
