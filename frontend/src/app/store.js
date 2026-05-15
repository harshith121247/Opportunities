import { configureStore } from '@reduxjs/toolkit'
import opportunityReducer from '../features/opportunities/opportunitySlice'

import authReducer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    opportunities: opportunityReducer,
 },
})