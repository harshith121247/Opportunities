import { useState, useEffect } from 'react'

import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa'

import { Link, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'

import { toast } from 'react-toastify'

import { login, reset } from '../features/auth/authSlice'

function Login() {

   const [formData, setFormData] = useState({
      email: '',
      password: '',
   })

   const { email, password } = formData

   const navigate = useNavigate()
   const dispatch = useDispatch()

   const { user, isError, isSuccess, message } = useSelector(
      (state) => state.auth
   )

   useEffect(() => {

      if (isError) toast.error(message)
      if (isSuccess) navigate('/dashboard')
      dispatch(reset())

   }, [user, isError, isSuccess, message, navigate, dispatch])

   const onChange = (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
   }

   const onSubmit = (e) => {

      e.preventDefault()

      let role = ''

      if (email.endsWith('@cb.students.amrita.edu')) {
         role = 'student'
      } else if (email.endsWith('@cb.amrita.edu')) {
         role = 'faculty'
      } else {
         return toast.error('Use your college email to login')
      }

      dispatch(login({ email, password, role }))
   }

   return (

      <div className='auth-page'>

         <div className='auth-card'>

            <div className='auth-card-top'>
               <div className='auth-card-icon'>
                  <FaSignInAlt />
               </div>
               <h1>Welcome Back</h1>
               <p>Sign in to your Amrita account</p>
            </div>

            <div className='auth-card-body'>

               <form onSubmit={onSubmit} className='auth-form'>

                  <div className='auth-input-group'>
                     <FaEnvelope className='auth-input-icon' />
                     <input
                        type='text'
                        name='email'
                        value={email}
                        placeholder='College email address'
                        onChange={onChange}
                        required
                     />
                  </div>

                  <div className='auth-input-group'>
                     <FaLock className='auth-input-icon' />
                     <input
                        type='password'
                        name='password'
                        value={password}
                        placeholder='Password'
                        onChange={onChange}
                        required
                     />
                  </div>

                  <button type='submit' className='auth-btn'>
                     Sign In
                  </button>

               </form>

               <p className='auth-footer'>
                  Don't have an account?{' '}
                  <Link to='/register'>Register here</Link>
               </p>

            </div>

         </div>

      </div>
   )
}

export default Login
