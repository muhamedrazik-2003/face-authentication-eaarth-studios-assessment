import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/common/Auth'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserDashboard from './pages/user/UserDashboard'
import NotFound from './pages/common/NotFound'
import Unauthorized from './pages/common/Unauthorized'
import { useSelector } from 'react-redux'
import FaceAuth from './pages/common/FaceAuth'

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
      state => state.authSlice
    )

  function PrivateRoute({ children, role }) {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />
    }

    if (role && user?.role !== role && user?.role !== "admin") {
      return <Navigate to="/unauthorized" replace />
    }

    return children
  }

  if(isLoading) return 

  return (
    <Routes>
      <Route path='/auth' element={<Auth />} />
      <Route path='/auth/verify-face' element={<FaceAuth />} />

      <Route path='*' element={<NotFound />} />
      <Route path='/unauthorized' element={<Unauthorized />} />

      <Route path='/admin/dashboard' element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

      <Route path='/' element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
    </Routes>
  )
}

export default App