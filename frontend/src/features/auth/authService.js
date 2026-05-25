import axios from 'axios'

const BASE_URL = 'http://32.192.188.250:5000'

// Register user
const register = async (userData) => {
   const API_URL =
      userData.role === 'faculty'
         ? `${BASE_URL}/api/auth/faculty/`
         : `${BASE_URL}/api/auth/student/`

   const response = await axios.post(
      API_URL + 'register',
      userData
   )

   if (response.data) {
      localStorage.setItem(
         'user',
         JSON.stringify(response.data)
      )
   }

   return response.data
}

// Login user
const login = async (userData) => {
   const API_URL =
      userData.role === 'faculty'
         ? `${BASE_URL}/api/auth/faculty/`
         : `${BASE_URL}/api/auth/student/`

   const response = await axios.post(
      API_URL + 'login',
      userData
   )

   if (response.data) {
      localStorage.setItem(
         'user',
         JSON.stringify(response.data)
      )
   }

   return response.data
}

// Logout
const logout = () => {
   localStorage.removeItem('user')
}

const authService = {
   register,
   login,
   logout,
}

export default authService