import { app } from '../../index'
import * as findUser from '../../utils/findUser'
import decodeToken from '../../utils/decodeToken'

function api(APIPath: string) {
  app.post(APIPath, async (req, res, next) => {
    const { token } = req.body

    const uuid: string = decodeToken(token)

    if(token === '') return next()

    const user: any = await findUser.uuid(uuid)

    if(!user) return next()

    const { FirstName, LastName, Username, Email } = user.FirstName

    res.json({
      FirstName,
      LastName,
      Username,
      Email
    })
  },(req, res) => {
    res.status(401).send()
  })
}

module.exports = { api }
