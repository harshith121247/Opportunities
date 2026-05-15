import axios from 'axios'

// Register user

const register = async (userData) => {

   const API_URL =
      userData.role === 'faculty'

         ? '/api/auth/faculty/'

         : '/api/auth/student/'

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

         ? '/api/auth/faculty/'

         : '/api/auth/student/'

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