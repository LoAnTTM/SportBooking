import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/dashboard/Dashboard'
import ClubsPage from './pages/clubs/ClubsPage'
import CreateClub from './pages/clubs/CreateClub'
import EditClub from './pages/clubs/EditClub'
import UnitsPage from './pages/units/UnitsPage'
import CreateUnit from './pages/units/CreateUnit'
import EditUnit from './pages/units/EditUnit'

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="clubs" element={<ClubsPage />} />
              <Route path="clubs/create" element={<CreateClub />} />
              <Route path="clubs/edit/:id" element={<EditClub />} />
              <Route path="units" element={<UnitsPage />} />
              <Route path="units/create" element={<CreateUnit />} />
              <Route path="units/edit/:id" element={<EditUnit />} />
            </Route>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App