import { Express, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Connection, RowDataPacket } from 'mysql2/promise'
import { Transporter } from 'nodemailer'

import { ErrorResponse, UserDatabaseSchema } from '../index'

type GetWithUsernameQuery = {
  email?: string
}

const get =
  (database: Connection, emailTransport: Transporter) =>
  async (req: Request, res: Response) => {
    const { email } = req.query as GetWithUsernameQuery

    if (!email) {
      const response: ErrorResponse = { errorMessage: 'Invalid Request' }

      return res.status(400).json(response)
    }

    const user = await getUser(database, email)

    if (!user) {
      const response: ErrorResponse = {
        errorMessage: 'Not Account with that Email',
      }

      return res.status(401).json(response)
    }

    const token = jwt.sign(
      { id: user.id, password: user.password },
      process.env.JWT_SECRET_FORGOT_PASSWORD as string,
      { expiresIn: '15m' } // 15 Minutes
    )

    try {
      await emailTransport.sendMail({
        from: 'nathendtauthentication@gmail.com',
        to: email,
        subject: 'Change Password',
        html: getEmailHTML(user, token),
      })
    } catch (_) {
      const response: ErrorResponse = {
        errorMessage: 'An error occurred please try again',
      }

      return res.status(500).json(response)
    }

    res.end()
  }

export default function forgotPasswordRequest(
  routePath: string,
  app: Express,
  database: Connection,
  emailTransport: Transporter
) {
  app.get(routePath, get(database, emailTransport))
}

async function getUser(
  database: Connection,
  email: string
): Promise<UserDatabaseSchema> {
  const [users] = (await database.query(
    `
      SELECT
        id,
        first_name,
        last_name,
        email,
        username,
        password
      FROM Users
      WHERE UPPER(email) LIKE UPPER("${email}")
    `
  )) as RowDataPacket[][]

  return users[0] as UserDatabaseSchema
}

function getEmailHTML(user: UserDatabaseSchema, token: string) {
  return `
<div>
  <style>
    * {
      font-family: sans-serif;
      margin: 0;
    }

    .wrapper {
      display: flex;
      width: 600px;
      margin: 0 auto;
      flex-direction: column;
    }

    .hello {
      margin: 0.25rem;
      font-size: 3rem;
      line-height: 1;
    }

    .name {
      margin: 0.25rem;
      font-size: 1.875rem;
      line-height: 2.25rem;
    }

    .username {
      margin: 0.25rem;
      font-size: 1.875rem;
      line-height: 2.25rem;
    }

    .text {
      margin: 1rem;
    }

    .button {
      display: inline-block;
      padding: 0.625rem 1.5rem;
      margin: 0.25rem;
      background-color: #2563eb;
      color: white;
      font-weight: 500;
      font-size: 1.25rem;
      text-decoration: none;
      line-height: 1rem;
      text-align: center;
      line-height: 1.25;
      border-radius: 0.25rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    .button:hover {
      background-color: #1d4ed8;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    .button:focus {
      background-color: #1d4ed8;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1);
      outline-width: 0px;
      box-shadow: var(--tw-ring-inset) 0 0 0
        calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    }

    .button:active {
      background-color: #1e40af;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    @media only screen and (max-width: 640px) {
      .wrapper {
        width: 100%;
      }
    }
  </style>

  <div class="wrapper">
    <p class="hello">Hello</p>

    <p class="name">${user.first_name} ${user.last_name}</p>

    <p class="username">(${user.username})</p>

    <p class="text">You requested to change your password</p>

    <a
      class="button"
      href="${process.env.WEBSITE_URL as string}changepassword?token=${token}"
    >
      Click to Change Password
    </a>
  </div>
</div>
`
}
