import express from 'express'
import fs from 'fs'
import mysql from 'mysql'
import path from 'path'
import * as googleAuthLibrary from 'google-auth-library'

const
  PORT: number = 5000,
  JWTSecretKey: string = 'rhPrVBLkVdsCepUtdAyOUDvZxldRUkwj',
  BCRYPTSaltRounds: number = 10,
  MySQLINFO: any = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '*Password*', // Enter Password
    database: 'users'
  },
  googleCloudClientID: string = '491128102264-1usoevnu2jg73jc27867iosouk1ti4cu.apps.googleusercontent.com',
  eMailINFO: any = {
    service: "gmail",
    auth: {
      user: '*Email*', // Enter Email
      pass: '*Password*' // Enter Password
    }
  }

const
  app = express(),
  database = mysql.createConnection(MySQLINFO),
  googleClient = new googleAuthLibrary.OAuth2Client(googleCloudClientID)

export {
  app,
  database,
  googleClient,
  JWTSecretKey,
  BCRYPTSaltRounds,
  MySQLINFO,
  googleCloudClientID,
  eMailINFO
}

app.use(express.json())

const APIDirName = path.join(__dirname, 'api')
startAPIS(APIDirName)

app.listen(PORT, () => console.log('Listening on port:', PORT))

database.connect((err) => {
  if(err) return console.error('Can Not Connect to SQL Database', {err})
  console.log('Connected To SQL Database')
})

function startAPIS(_dirPath: string, _APIPath: string = '/api') {
  const apiFiles: string[] = fs.readdirSync(_dirPath)

  for(let fileName of apiFiles) {
    if(fileName.endsWith('.ts')) {
      const APIPath: string = _APIPath + '/' + fileName.slice(0, -3)
      const { api } = require(path.join(_dirPath, fileName))

      api(APIPath)
    } else {
      const newAPIDirPath: string = path.join(_dirPath, fileName)
      const APIPath: string = _APIPath + '/' + fileName

      startAPIS(newAPIDirPath, APIPath)
    }
  }
}
