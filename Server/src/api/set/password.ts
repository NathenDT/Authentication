import { app } from '../../index'
import decodeToken from '../../utils/decodeToken'
import * as updateUser from '../../utils/updateUser'

function api(APIPath: string) {
  app.post(APIPath, async (req, res, next) => {
    const { token, newPassword } = req.body

    const uuid = decodeToken(token)

    console.log(uuid)

    const update = await updateUser.password(uuid, newPassword)

    console.log(update)

    if(typeof update !== 'undefined') return next()
    
    res.status(200).send()
  }, (req, res) => {
    res.status(401).send()
  })
}

module.exports = { api }
