import { Link, useNavigate } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import { logout, reset } from '../features/auth/authSlice'

function Header() {

   const navigate = useNavigate()

   const dispatch = useDispatch()

   const { user } = useSelector((state) => state.auth)

   const onLogout = () => {

      dispatch(logout())

      dispatch(reset())

      navigate('/')
   }

   return (

      <header className='header'>

         <div className='logo'>

            <Link to='/'>
               Opportunities
            </Link>

         </div>

         <ul>

            <li>
            <Link to='/explore'>
               Explore
            </Link>
            </li>

            {user && (

               <li>

                  <Link to='/dashboard'>
                     Dashboard
                  </Link>

               </li>

            )}

            {user ? (

               <>

                  <li className='welcome-user'>
                     {user.name}
                  </li>

                  <li>

                     <button
                        className='btn btn-small'
                        onClick={onLogout}
                     >
                        Logout
                     </button>

                  </li>

               </>

            ) : (

               <>

                  <li>

                     <Link to='/login'>
                        Login
                     </Link>

                  </li>

                  <li>

                     <Link to='/register'>
                        Register
                     </Link>

                  </li>

               </>

            )}

         </ul>

      </header>

   )
}

export default Header