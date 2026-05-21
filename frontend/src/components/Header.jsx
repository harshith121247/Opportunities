import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import { logout, reset } from '../features/auth/authSlice'

function Header() {

   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { user } = useSelector((state) => state.auth)
   const { pathname } = useLocation()

   const onLogout = () => {
      dispatch(logout())
      dispatch(reset())
      navigate('/')
   }

   return (

      <header className='grad-header'>

         <div className='grad-header-inner'>

            <Link to='/' className='grad-logo'>
               Opportunities
            </Link>

            <nav className='grad-nav'>

               {user && (
                  <NavLink
                     to='/dashboard'
                     className={({ isActive }) =>
                        isActive ? 'grad-nav-link active' : 'grad-nav-link'
                     }
                  >
                     Dashboard
                  </NavLink>
               )}

               {pathname !== '/' && (
                  <NavLink
                     to='/explore'
                     className={({ isActive }) =>
                        isActive ? 'grad-nav-link active' : 'grad-nav-link'
                     }
                  >
                     Explore
                  </NavLink>
               )}

               {user && (
                  <NavLink
                     to='/profile'
                     className={({ isActive }) =>
                        isActive ? 'grad-nav-link active' : 'grad-nav-link'
                     }
                  >
                     Profile
                  </NavLink>
               )}

            </nav>

            <div className='grad-nav-right'>

               {user ? (

                  <>
                     <div className='grad-user-badge' onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                        <span className='grad-user-avatar'>
                           {user.name.charAt(0).toUpperCase()}
                        </span>
                        <div className='grad-user-tooltip'>
                           <span className='grad-user-tooltip-avatar'>
                              {user.name.charAt(0).toUpperCase()}
                           </span>
                           <div className='grad-user-tooltip-info'>
                              <span className='grad-user-tooltip-name'>{user.name}</span>
                              <span className='grad-user-tooltip-role'>{user.role}</span>
                           </div>
                        </div>
                     </div>

                     <button className='grad-logout-btn' onClick={onLogout}>
                        Logout
                     </button>
                  </>

               ) : (

                  <>
                     <Link to='/login' className='grad-nav-link'>
                        Login
                     </Link>
                     <Link to='/register' className='grad-register-btn'>
                        Register
                     </Link>
                  </>

               )}

            </div>

         </div>

      </header>

   )
}

export default Header