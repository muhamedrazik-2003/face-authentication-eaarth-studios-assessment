import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from './pages/common/Auth'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserDashboard from './pages/user/UserDashboard'

function App() {
  return (
    <Routes>
      <Route path='/auth' element={<Auth/>}/>
      
      <Route path='/admin/dashboard' element={<AdminDashboard/>}/>

      <Route path='/dashboard' element={<UserDashboard/>}/>
    </Routes>
  )
}

export default App