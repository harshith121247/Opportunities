import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoute from './components/PrivateRoute'

import Header from './components/Header'

import Home from './pages/Home'
import Explore from './pages/Explore'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Applicants from './pages/Applicants'
import Profile from './pages/Profile'

function AppLayout() {

  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)
  const isWide = ['/dashboard', '/applicants', '/explore', '/profile'].includes(location.pathname)

  return (

    <>

      {!isAuthPage && <Header />}

      <div className={isAuthPage ? '' : `container${isWide ? ' wide' : ''}`}>

        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route path='/' element={<PrivateRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/applicants' element={<Applicants />} />
            <Route path='/profile' element={<Profile />} />
          </Route>

        </Routes>

      </div>

      <ToastContainer
        position={isAuthPage ? 'top-center' : 'top-right'}
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

    </>

  )
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App