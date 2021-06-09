import { MySQLINFO } from '../index'
import databaseQuery from './databaseQuery'

function uuid(_uuid: string): Promise<any> {
  const query: string = `SELECT * FROM ${MySQLINFO.database} WHERE UUID = "${_uuid}"`
  return databaseQuery(query)
}

function username(_username: string): Promise<any> {
  const query: string = `SELECT * FROM ${MySQLINFO.database} WHERE Username = "${_username}"`
  return databaseQuery(query)
}

function email(_email: string): Promise<any> {
  const query: string = `SELECT * FROM ${MySQLINFO.database} WHERE Email = "${_email}"`
  return databaseQuery(query)
}

export {
  uuid,
  username,
  email
}
