import { Express } from 'express'

export default function index(routePath: string, app: Express) {
  app.get(routePath, (_, res) => {
    res.redirect(process.env.WEBSITE_URL as string)
  })
}

module.exports = index
