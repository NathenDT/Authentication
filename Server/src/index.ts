import cors from 'cors'
import express, { Express } from 'express'
import { Connection, createConnection } from 'mysql2/promise'
import nodemailer, { Transporter } from 'nodemailer'
import path from 'path'

import getRoutePaths from './utils/getRoutePaths'

require('dotenv').config()

const PORT = parseInt(process.env.PORT!, 10)
const MY_SQL_URL = process.env.MY_SQL_URL as string

;(async function () {
  const database = await createConnection(MY_SQL_URL)
  const app = express()
  const emailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSWORD,
    },
  })

  app.use(express.json())

  const corsOpts: cors.CorsOptions = {
    origin: '*',

    methods: ['GET', 'POST'],

    allowedHeaders: ['Content-Type'],
  }

  app.use(cors(corsOpts))

  createRoutes('routes', app, database, emailTransport)

  app.get('*', (_, res) => {
    res.redirect(process.env.WEBSITE_URL as string)
  })

  app.listen(PORT, () => {
    console.log('Listening on Port:', PORT)

    console.log('Connected to Database:', database.config.database)
  })
})()

async function createRoutes(
  _path: string,
  app: Express,
  database: Connection,
  emailTransport: Transporter
) {
  const routePaths = getRoutePaths(path.join(__dirname, _path))

  for (const routePath of routePaths) {
    try {
      const func = require('./' + _path + routePath)

      func(routePath.toLowerCase(), app, database, emailTransport)
    } catch (_) {
      console.error(routePath)
    }
  }
}
