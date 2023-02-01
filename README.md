# Authentication

> A full stack web application that provided user authentication with a front-end built in React.js and Typescript, utilizing the Material-UI package for the user interface and a back-end system built with Node.JS, Typescript, and Express.js, integrating with a MySQL database to manage user data.

## [Demo](https://nathendt.github.io/Authentication)

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/NathenDT/Authentication.git
```

### 2. Install dependencies:

Run `cd client && yarn` and `cd server && yarn` from the root directory.

### 3. Create environment variables:

In the server folder create a `.env` file and insert

```
PORT=[Available Port]
MY_SQL_URL=[A MySQL Database URL]
JWT_SECRET=[Any String]
JWT_SECRET_FORGOT_PASSWORD=[Any String]
WEBSITE_URL=[The URL of the website (http://localhost:3000 for development)]
```

### 4. Run the app:

Run `cd client && yarn start` and `cd server && yarn start` from the root directory in separate terminals.

### 5. Open the app in the browser:

```bash
http://localhost:3000
```

### 6. Enjoy!
