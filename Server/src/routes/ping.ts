import { Express, Request, Response } from 'express'

const get = () => async (_: Request, res: Response) => {
  res.send('Pong!')
}

export default function ping(routePath: string, app: Express) {
  app.get(routePath, get())
}
