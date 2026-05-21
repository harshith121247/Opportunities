import { configureStore } from '@reduxjs/toolkit'
import authReducer        from '../features/auth/authSlice'
import opportunityReducer from '../features/opportunities/opportunitySlice'
import profileReducer     from '../features/profile/profileSlice'

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    opportunities: opportunityReducer,
    profile:       profileReducer,
  },
})