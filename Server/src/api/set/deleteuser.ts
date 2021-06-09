import { app, MySQLINFO } from '../../index'
import databaseQuery from '../../utils/databaseQuery'
import decodeToken from '../../utils/decodeToken'

function api(APIPath: string) {
  app.post(APIPath, async (req, res, next) => {
    const { token } = req.body

    const uuid: string = decodeToken(token)

    const query: string = `DELETE FROM ${MySQLINFO.database} WHERE UUID = "${uuid}"`
    const deleted: any = await databaseQuery(query)

    if(typeof deleted !== 'undefined') return next()

    res.status(200).send()
  }, (req, res) => {
    res.status(401).send()
  })
}

module.exports = { api }
