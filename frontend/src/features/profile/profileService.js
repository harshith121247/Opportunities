import axios from 'axios'

const API_URL = '/api/users/profile'

const getProfile = async (token) => {
   const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
   })
   return res.data
}

const updateProfile = async (profileData, token) => {
   const res = await axios.put(API_URL, profileData, {
      headers: { Authorization: `Bearer ${token}` },
   })
   return res.data
}

const profileService = { getProfile, updateProfile }
export default profileService
