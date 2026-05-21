import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import profileService from './profileService'

const initialState = {
   profile:   null,
   isLoading: false,
   isSuccess: false,
   isError:   false,
   message:   '',
}

export const getProfile = createAsyncThunk(
   'profile/get',
   async (_, thunkAPI) => {
      try {
         const token = thunkAPI.getState().auth.user.token
         return await profileService.getProfile(token)
      } catch (err) {
         return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
         )
      }
   }
)

export const updateProfile = createAsyncThunk(
   'profile/update',
   async (profileData, thunkAPI) => {
      try {
         const token = thunkAPI.getState().auth.user.token
         return await profileService.updateProfile(profileData, token)
      } catch (err) {
         return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
         )
      }
   }
)

const profileSlice = createSlice({
   name: 'profile',
   initialState,
   reducers: {
      resetProfile: (state) => {
         state.isLoading = false
         state.isSuccess = false
         state.isError   = false
         state.message   = ''
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getProfile.pending,   (state) => { state.isLoading = true })
         .addCase(getProfile.fulfilled, (state, action) => {
            state.isLoading = false
            state.profile   = action.payload
         })
         .addCase(getProfile.rejected,  (state, action) => {
            state.isLoading = false
            state.isError   = true
            state.message   = action.payload
         })

         .addCase(updateProfile.pending,   (state) => { state.isLoading = true })
         .addCase(updateProfile.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.profile   = action.payload
         })
         .addCase(updateProfile.rejected,  (state, action) => {
            state.isLoading = false
            state.isError   = true
            state.message   = action.payload
         })
   },
})

export const { resetProfile } = profileSlice.actions
export default profileSlice.reducer
