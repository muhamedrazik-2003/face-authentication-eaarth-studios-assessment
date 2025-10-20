import { LucideLoader } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Auth() {
  const navigate = useNavigate()
  const [isRegistering, setIsRegistering] = useState(false)
  const { isLoading, user } = useSelector((state) => state.authSlice)
  
const verifyUser = () => {

}
  return (
    <main className='flex flex-col gap-10 justify-center items-center w-screen min-h-screen'>
      {isRegistering
        ? <h1 className='text-2xl font-extrabold'>Register New Account</h1>
        : <h1 className='text-2xl font-extrabold'>Login To Your Account</h1>
      }
      <div className='w-sm space-y-2'>
        {isRegistering
          && <div className='flex flex-col gap-2'>
            <label htmlFor="" className='px-1 text-slate-800'>Full Name</label>
            <input className='border rounded-3xl border-slate-500 shadow-sm w-full px-3 py-1.5' type="text" placeholder='Eg: John Doe' />
          </div>
        }

        <div className='flex flex-col gap-2'>
          <label htmlFor="" className='px-1 text-slate-800'>Email</label>
          <input className='border rounded-3xl border-slate-500 shadow-sm w-full px-3 py-1.5' type="email" placeholder='Eg: johndoe@gmail.com' />
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor="" className='px-1 text-slate-800'>Password</label>
          <input className='border rounded-3xl border-slate-500 shadow-sm w-full px-3 py-1.5' type="password" placeholder='Eg: JohnDoe@123' />
        </div>
      </div>
      <div className='w-sm'>
        {isRegistering
          ? <button onClick={() => {
            navigate('/auth/verify-face')
          }} className='px-3 py-1.5 w-full border rounded-3xl bg-indigo-800 text-white'>Register</button>
          : <button onClick={verifyUser} className='px-3 py-1.5 w-full border rounded-3xl bg-indigo-800 text-white'>{
            isLoading
              ?
              <>
                <LucideLoader className='animate-spin' /> validating user
              </>
              : "Login"
          }</button>
        }
      </div>
      {isRegistering
        ? <p>Don't have an account? <span className='text-indigo-800 cursor-pointer' onClick={() => setIsRegistering(false)}>Sign Up</span></p>
        : <p>Already have an account? <span className='text-indigo-800 cursor-pointer' onClick={() => setIsRegistering(true)}>Sign In</span></p>
      }
    </main>
  )
}

export default Auth