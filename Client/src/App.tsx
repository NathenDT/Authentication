import { useState } from 'react'
import { Navigate, Route } from 'react-router-dom'

import Wrapper from './components/Wrapper'
import ChangePassword from './pages/ChangePassword'
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import NotFound from './pages/NotFound'
import Settings from './pages/Settings'
import SignUp from './pages/SignUp'
import User from './pages/User'

export default function App() {
  const [token, setToken] = useState(
    (localStorage.getItem('token') as string) || ''
  )

  return (
    <Wrapper token={token} setToken={setToken}>
      <Route
        path="/"
        element={Boolean(token) ? <Home /> : <Navigate to="/login" />}
      />

      <Route
        path="/login"
        element={Boolean(token) ? <Navigate to="/" /> : <LogIn />}
      />

      <Route
        path="/signup"
        element={Boolean(token) ? <Navigate to="/" /> : <SignUp />}
      />

      <Route
        path="/settings"
        element={Boolean(token) ? <Settings /> : <Navigate to="/login" />}
      />

      <Route path="/user" element={<User />} />

      <Route
        path="/changepassword"
        element={Boolean(token) ? <Navigate to="/" /> : <ChangePassword />}
      />

      <Route path="*" element={<NotFound />} />
    </Wrapper>
  )
}
