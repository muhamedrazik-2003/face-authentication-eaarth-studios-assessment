import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from './pages/common/Auth'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserDashboard from './pages/user/UserDashboard'
import NotFound from './pages/common/NotFound'
import Unauthorized from './pages/common/Unauthorized'
import { useSelector } from 'react-redux'

function App() {

  function PrivateRoute({ children, role }) {
    const { isAuthenticated, user, isLoading } = useSelector(
      state => state.authSlice
    )

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

      <Route path='*' element={<NotFound />} />
      <Route path='/unauthorized' element={<Unauthorized />} />

      <Route path='/admin/dashboard' element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

      <Route path='/dashboard' element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
    </Routes>
  )
}

export default App