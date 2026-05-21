import { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaLock, FaUserGraduate } from 'react-icons/fa'

import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { register, reset } from '../features/auth/authSlice'

function Register() {

   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      password2: '',
      role: 'student',
   })

   const { name, email, password, password2, role } = formData

   const [touched, setTouched] = useState({})

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

   const onBlur = (e) => {
      setTouched((prev) => ({ ...prev, [e.target.name]: true }))
   }

   const getEmailError = () => {
      if (!email) return 'Email is required'
      if (role === 'student' && !email.endsWith('@cb.students.amrita.edu'))
         return 'Use your student email (@cb.students.amrita.edu)'
      if (role === 'faculty' && !email.endsWith('@cb.amrita.edu'))
         return 'Use your faculty email (@cb.amrita.edu)'
      return ''
   }

   const errors = {
      name: !name ? 'Full name is required' : '',
      email: getEmailError(),
      password: !password ? 'Password is required' : password.length < 6 ? 'Minimum 6 characters' : '',
      password2: !password2 ? 'Please confirm your password' : password !== password2 ? 'Passwords do not match' : '',
   }

   const isFormValid = Object.values(errors).every((e) => e === '')

   const onSubmit = (e) => {

      e.preventDefault()

      setTouched({ name: true, email: true, password: true, password2: true })

      if (!isFormValid) return

      dispatch(register({ name, email, password, role }))
   }

   return (

      <div className='auth-page'>

         <div className='auth-card'>

            <div className='auth-card-top'>
               <div className='auth-card-icon'>
                  <FaUser />
               </div>
               <h1>Create Account</h1>
               <p>Join the Amrita Opportunities platform</p>
            </div>

            <div className='auth-card-body'>

               <form onSubmit={onSubmit} className='auth-form'>

                  <div className='auth-input-group'>
                     <FaUser className='auth-input-icon' />
                     <input
                        type='text'
                        name='name'
                        value={name}
                        placeholder='Full name'
                        onChange={onChange}
                        onBlur={onBlur}
                        className={touched.name && errors.name ? 'input-error' : ''}
                     />
                  </div>
                  {touched.name && errors.name && (
                     <p className='field-error'>✗ {errors.name}</p>
                  )}

                  <div className='auth-input-group'>
                     <FaUserGraduate className='auth-input-icon' />
                     <select
                        name='role'
                        value={role}
                        onChange={onChange}
                        className='auth-select'
                     >
                        <option value='student'>Student</option>
                        <option value='faculty'>Faculty</option>
                     </select>
                  </div>

                  <div className='auth-input-group'>
                     <FaEnvelope className='auth-input-icon' />
                     <input
                        type='text'
                        name='email'
                        value={email}
                        placeholder={
                           role === 'student'
                              ? 'yourname@cb.students.amrita.edu'
                              : 'yourname@cb.amrita.edu'
                        }
                        onChange={onChange}
                        onBlur={onBlur}
                        className={touched.email && errors.email ? 'input-error' : email && !errors.email ? 'input-success' : ''}
                     />
                  </div>
                  {email ? (
                     errors.email
                        ? <p className='field-error'>✗ {errors.email}</p>
                        : <p className='field-success'>✓ Valid {role} email</p>
                  ) : (
                     <p className='field-hint'>
                        {role === 'student'
                           ? 'Must end with @cb.students.amrita.edu'
                           : 'Must end with @cb.amrita.edu'}
                     </p>
                  )}

                  <div className='auth-input-group'>
                     <FaLock className='auth-input-icon' />
                     <input
                        type='password'
                        name='password'
                        value={password}
                        placeholder='Password'
                        onChange={onChange}
                        onBlur={onBlur}
                        className={touched.password && errors.password ? 'input-error' : ''}
                     />
                  </div>
                  {touched.password && errors.password && (
                     <p className='field-error'>✗ {errors.password}</p>
                  )}

                  <div className='auth-input-group'>
                     <FaLock className='auth-input-icon' />
                     <input
                        type='password'
                        name='password2'
                        value={password2}
                        placeholder='Confirm password'
                        onChange={onChange}
                        onBlur={onBlur}
                        className={touched.password2 && errors.password2 ? 'input-error' : ''}
                     />
                  </div>
                  {touched.password2 && (
                     <p className={errors.password2 ? 'field-error' : 'password-match'}>
                        {errors.password2 ? `✗ ${errors.password2}` : '✓ Passwords match'}
                     </p>
                  )}

                  <button
                     type='submit'
                     className='auth-btn'
                     disabled={!isFormValid && Object.keys(touched).length > 0}
                  >
                     Create Account
                  </button>

               </form>

               <p className='auth-footer'>
                  Already have an account?{' '}
                  <Link to='/login'>Sign in here</Link>
               </p>

            </div>

         </div>

      </div>
   )
}

export default Register
