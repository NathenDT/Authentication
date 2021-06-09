import { BCRYPTSaltRounds, MySQLINFO } from '../index'
import databaseQuery from './databaseQuery'

import bcrypt from 'bcrypt'

function firstName(uuid: string, _firstname: string): Promise<any> {
  const query: string = `UPDATE ${MySQLINFO.database} SET FirstName = "${_firstname}" WHERE UUID = "${uuid}"`
  return databaseQuery(query)
}

function lastName(uuid: string, _lastname: string): Promise<any> {
  const query: string = `UPDATE ${MySQLINFO.database} SET LastName = "${_lastname}" WHERE UUID = "${uuid}"`
  return databaseQuery(query)
}

function username(uuid: string, _username: string): Promise<any> {
  const query: string = `UPDATE ${MySQLINFO.database} SET Email = "${_username}" WHERE UUID = "${uuid}"`
  return databaseQuery(query)
}

function email(uuid: string, _email: string): Promise<any> {
  const query: string = `UPDATE ${MySQLINFO.database} SET Password = "${_email}" WHERE UUID = "${uuid}"`
  return databaseQuery(query)
}

async function password(uuid: string, _password: string): Promise<any> {
  const encryptPassword: string = await bcrypt.hash(_password, BCRYPTSaltRounds)

  const query: string = `UPDATE ${MySQLINFO.database} SET Password = "${encryptPassword}" WHERE UUID = "${uuid}"`
  return databaseQuery(query)
}

function logInTypes(uuid: string, _logInTypes: any): Promise<any> {
  const query: string = `UPDATE ${MySQLINFO.database} SET LogInTypes = "${JSON.stringify(_logInTypes)}" WHERE UUID = "${uuid}"`
  return databaseQuery(query)
}

export {
  firstName,
  lastName,
  username,
  email,
  password,
  logInTypes
}
