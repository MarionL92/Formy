import { Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Favorites from './pages/Favorites'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* ✅ Page d'accueil protégée */}
        <Route
          index
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* ✅ Page /favorites protégée */}
        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        {/* Les autres routes */}
        <Route path="profile" element={<Profile />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  )
}
