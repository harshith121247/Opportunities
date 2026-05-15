import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import opportunityService from './opportunityService'

const initialState = {
   opportunities: [],
   isError: false,
   isSuccess: false,
   isLoading: false,
   message: '',
}

// Get all opportunities
export const getOpportunities = createAsyncThunk(
   'opportunities/getAll',

   async (_, thunkAPI) => {

      try {

         const token =
            thunkAPI.getState().auth.user.token

         return await opportunityService.getOpportunities(
            token
         )

      } catch (error) {

         const message =
            (error.response &&
               error.response.data &&
               error.response.data.message) ||

            error.message ||

            error.toString()

         return thunkAPI.rejectWithValue(message)
      }

   }
)

// Get logged-in user's opportunities
export const getMyOpportunities =
   createAsyncThunk(

      'opportunities/getMine',

      async (_, thunkAPI) => {

         try {

            const token =
               thunkAPI.getState().auth.user.token

            return await
               opportunityService.getMyOpportunities(
                  token
               )

         } catch (error) {

            const message =
               (error.response &&
                  error.response.data &&
                  error.response.data.message) ||

               error.message ||

               error.toString()

            return thunkAPI.rejectWithValue(
               message
            )
         }

      }
   )

// Create opportunity
export const createOpportunity =
   createAsyncThunk(

      'opportunities/create',

      async (opportunityData, thunkAPI) => {

         try {

            const token =
               thunkAPI.getState().auth.user.token

            return await
               opportunityService.createOpportunity(
                  opportunityData,
                  token
               )

         } catch (error) {

            const message =
               (error.response &&
                  error.response.data &&
                  error.response.data.message) ||

               error.message ||

               error.toString()

            return thunkAPI.rejectWithValue(
               message
            )
         }

      }
   )

// Delete opportunity
export const deleteOpportunity =
   createAsyncThunk(

      'opportunities/delete',

      async (id, thunkAPI) => {

         try {

            const token =
               thunkAPI.getState().auth.user.token

            return await
               opportunityService.deleteOpportunity(
                  id,
                  token
               )

         } catch (error) {

            const message =
               (error.response &&
                  error.response.data &&
                  error.response.data.message) ||

               error.message ||

               error.toString()

            return thunkAPI.rejectWithValue(
               message
            )
         }

      }
   )

// Apply for opportunity
export const applyOpportunity =
   createAsyncThunk(

      'opportunities/apply',

      async (id, thunkAPI) => {

         try {

            const token =
               thunkAPI.getState().auth.user.token

            return await
               opportunityService.applyOpportunity(
                  id,
                  token
               )

         } catch (error) {

            const message =
               (error.response &&
                  error.response.data &&
                  error.response.data.message) ||

               error.message ||

               error.toString()

            return thunkAPI.rejectWithValue(
               message
            )
         }

      }
   )

// Save / Unsave opportunity
export const saveOpportunity =
   createAsyncThunk(

      'opportunities/save',

      async (id, thunkAPI) => {

         try {

            const token =
               thunkAPI.getState()
                  .auth.user.token

            return await
               opportunityService.saveOpportunity(
                  id,
                  token
               )

         } catch (error) {

            const message =
               (error.response &&
                  error.response.data &&
                  error.response.data.message) ||

               error.message ||

               error.toString()

            return thunkAPI.rejectWithValue(
               message
            )
         }

      }
   )

export const opportunitySlice = createSlice({

   name: 'opportunity',

   initialState,

   reducers: {

      reset: (state) => {

         state.isLoading = false
         state.isSuccess = false
         state.isError = false
         state.message = ''

      },

   },

   extraReducers: (builder) => {

      builder

         // GET ALL
         .addCase(
            getOpportunities.pending,
            (state) => {

               state.isLoading = true

            }
         )

         .addCase(
            getOpportunities.fulfilled,
            (state, action) => {

               state.isLoading = false
               state.isSuccess = true
               state.opportunities =
                  action.payload

            }
         )

         .addCase(
            getOpportunities.rejected,
            (state, action) => {

               state.isLoading = false
               state.isError = true
               state.message = action.payload

            }
         )

         // GET MY OPPORTUNITIES
         .addCase(
            getMyOpportunities.fulfilled,
            (state, action) => {

               state.isLoading = false
               state.isSuccess = true
               state.opportunities =
                  action.payload

            }
         )

         // CREATE
         .addCase(
            createOpportunity.fulfilled,
            (state, action) => {

               state.opportunities.push(
                  action.payload
               )

            }
         )

         // DELETE
         .addCase(
            deleteOpportunity.fulfilled,
            (state, action) => {

               state.opportunities =
                  state.opportunities.filter(
                     (opportunity) =>

                        opportunity._id !==
                        action.payload.id
                  )

            }
         )

         // APPLY
         .addCase(
            applyOpportunity.fulfilled,
            (state, action) => {

               state.opportunities =
                  state.opportunities.map(
                     (opportunity) =>

                        opportunity._id ===
                        action.payload._id

                           ? action.payload

                           : opportunity
                  )

            }
         )

         // SAVE
         .addCase(
            saveOpportunity.fulfilled,
            (state, action) => {

               state.opportunities =
                  state.opportunities.map(
                     (opportunity) =>

                        opportunity._id ===
                        action.payload._id

                           ? action.payload

                           : opportunity
                  )

            }
         )

   },

})

export const { reset } =
   opportunitySlice.actions

export default opportunitySlice.reducer