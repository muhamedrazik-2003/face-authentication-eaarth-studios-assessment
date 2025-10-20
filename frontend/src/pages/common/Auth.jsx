import { LucideLoader } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearError, setIsRegistering, updateUser, verifyUser } from '../../redux/slices/AuthSlice';
import { registerSchema, loginSchema } from '../../utils/utils'
function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [validationErrors, setValidationErrors] = useState({})
  const { isLoading, user, error, isRegistering } = useSelector((state) => state.authSlice)

  const handleVerifyUser = async () => {
    dispatch(clearError());
    setValidationErrors({});

    const userData = isRegistering
      ? {
        fullName: user.fullName,
        email: user.email,
        password: user.password,
      }
      : {
        email: user.email,
        password: user.password,
      };

    try {
      if (isRegistering) {
        registerSchema.parse(userData)
      } else {
        loginSchema.parse(userData)
      }
    } catch (err) {
      if (err?.issues) {
        // Map Zod errors to state
        const fieldErrors = {};
        err.issues.forEach(issue => {
          fieldErrors[issue.path[0]] = issue.message
        });
        setValidationErrors(fieldErrors)
      }
      return
    }
    if (isRegistering) {
      navigate('/auth/verify-face')
    } else {
      const response = await dispatch(verifyUser(userData))
      if (verifyUser.fulfilled.match(response)) {
        navigate('/auth/verify-face')
      }
    }
  }

  return (
    <main className='flex flex-col gap-10 justify-center items-center w-screen min-h-screen'>
      <h1 className='text-2xl font-extrabold'>
        {isRegistering ? "Register New Account" : "Login To Your Account"}
      </h1>

      <div className='w-sm space-y-2'>
        {isRegistering && (
          <div className='flex flex-col gap-2'>
            <label className='px-1 text-slate-800'>Full Name</label>
            <input
              onChange={(e) => dispatch(updateUser({ field: "fullName", value: e.target.value }))}
              className='border rounded-3xl border-slate-500 shadow-sm w-full px-3 py-1.5'
              type="text"
              placeholder='Eg: John Doe'
            />
            {validationErrors.fullName && <p className='text-red-500 text-sm'>{validationErrors.fullName}</p>}
          </div>
        )}

        <div className='flex flex-col gap-2'>
          <label className='px-1 text-slate-800'>Email</label>
          <input
            onChange={(e) => dispatch(updateUser({ field: "email", value: e.target.value }))}
            className='border rounded-3xl border-slate-500 shadow-sm w-full px-3 py-1.5'
            type="email"
            placeholder='Eg: johndoe@gmail.com'
          />
          {validationErrors.email && <p className='text-red-500 text-sm'>{validationErrors.email}</p>}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='px-1 text-slate-800'>Password</label>
          <input
            onChange={(e) => dispatch(updateUser({ field: "password", value: e.target.value }))}
            className='border rounded-3xl border-slate-500 shadow-sm w-full px-3 py-1.5'
            type="password"
            placeholder='Eg: JohnDoe@123'
          />
          {validationErrors.password && <p className='text-red-500 text-sm'>{validationErrors.password}</p>}
        </div>

        {error && <p className='text-red-500 font-medium text-center mt-2 text-sm'>{error}</p>}
      </div>

      <div className='w-sm'>
        <button
          onClick={handleVerifyUser}
          className={`px-3 py-2 w-full border rounded-3xl text-white flex gap-2 items-center justify-center ${isLoading
            ? "bg-indigo-500 cursor-not-allowed opacity-70"
            : "bg-indigo-800 hover:bg-indigo-700"
            }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LucideLoader className='animate-spin size-4' /> Verifying user
            </>
          ) : (
            isRegistering ? "Register" : "Login"
          )}
        </button>
      </div>

      {isRegistering ? (
        <p>Don't have an account? <span className='text-indigo-800 cursor-pointer' onClick={() => dispatch(setIsRegistering(false))}>Sign In</span></p>
      ) : (
        <p>Already have an account? <span className='text-indigo-800 cursor-pointer' onClick={() => dispatch(setIsRegistering(true))}>Sign Up</span></p>
      )}
    </main>
  )
}

export default Auth