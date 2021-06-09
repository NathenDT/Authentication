import { database } from '../index'

function databaseQuery(_query: string): Promise<any> {
  return new Promise(resolve => {
    database.query(_query, (err, result) => {
      if(err) resolve(false)
      resolve(result[0])
    })
  })
}

export default databaseQuery
