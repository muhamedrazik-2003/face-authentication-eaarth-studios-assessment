import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/common/Auth'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserDashboard from './pages/user/UserDashboard'
import NotFound from './pages/common/NotFound'
import Unauthorized from './pages/common/Unauthorized'
import { useSelector } from 'react-redux'
import FaceAuth from './pages/common/FaceAuth'
import { ToastContainer } from 'react-toastify'
import AccountVerificationPending from './pages/common/AccountVerificationPending'

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
    if(user?.status === "pending") {
      return <Navigate to="/account-verification-pending" replace />
    }

    return children
  }

  return (
    <>
    <Routes>
      <Route path='/auth' element={<Auth />} />
      <Route path='/auth/verify-face' element={<FaceAuth />} />

      <Route path='*' element={<NotFound />} />
      <Route path='/unauthorized' element={<Unauthorized />} />
      <Route path='/account-verification-pending' element={<AccountVerificationPending />} />

      <Route path='/admin' element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

      <Route path='/' element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
    </Routes>

    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  )
}

export default App