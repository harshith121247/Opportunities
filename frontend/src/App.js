import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoute from './components/PrivateRoute'

import Header from './components/Header'

import Home from './pages/Home'
import Explore from './pages/Explore'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  return (

    <Router>

      <div className='container'>

        <Header />

        <Routes>

        <Route path='/' element={<Home />} />
        <Route
   path='/explore'
   element={<Explore />}
/>

          <Route path='/login' element={<Login />} />

          <Route path='/register' element={<Register />} />

          <Route path='/' element={<PrivateRoute />}>

   <Route path='/dashboard' element={<Dashboard />} />

</Route>

        </Routes>

        <ToastContainer />

      </div>

    </Router>

  )
}

export default App