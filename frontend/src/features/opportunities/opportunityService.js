import axios from 'axios'

const API_URL = '/api/opportunities/'

// Get all opportunities
const getOpportunities = async (token) => {

   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   }

   const response = await axios.get(
      API_URL,
      config
   )

   return response.data
}

// Get logged-in user's opportunities
const getMyOpportunities = async (token) => {

   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   }

   const response = await axios.get(
      API_URL + 'my',
      config
   )

   return response.data
}

// Create opportunity
const createOpportunity = async (
   opportunityData,
   token
) => {

   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   }

   const response = await axios.post(
      API_URL,
      opportunityData,
      config
   )

   return response.data
}

// Update opportunity
const updateOpportunity = async (
   opportunityId,
   opportunityData,
   token
) => {

   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   }

   const response = await axios.put(
      API_URL + opportunityId,
      opportunityData,
      config
   )

   return response.data
}

// Delete opportunity
const deleteOpportunity = async (
   opportunityId,
   token
) => {

   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   }

   const response = await axios.delete(
      API_URL + opportunityId,
      config
   )

   return response.data
}

// Apply for opportunity
const applyOpportunity = async (
   opportunityId,
   token
) => {

   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   }

   const response = await axios.put(
      API_URL + opportunityId + '/apply',
      {},
      config
   )

   return response.data
}

// Save / Unsave opportunity
const saveOpportunity = async (
   opportunityId,
   token
) => {

   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   }

   const response = await axios.put(
      API_URL + 'save/' + opportunityId,
      {},
      config
   )

   return response.data
}

// Approve applicant
const approveApplicant = async (opportunityId, applicantId, token) => {
   const config = { headers: { Authorization: `Bearer ${token}` } }
   const response = await axios.post(
      `${API_URL}${opportunityId}/approve/${applicantId}`,
      {},
      config
   )
   return response.data
}

// Reject applicant
const rejectApplicant = async (opportunityId, applicantId, token) => {
   const config = { headers: { Authorization: `Bearer ${token}` } }
   const response = await axios.post(
      `${API_URL}${opportunityId}/reject/${applicantId}`,
      {},
      config
   )
   return response.data
}

const opportunityService = {

   getOpportunities,

   getMyOpportunities,

   createOpportunity,

   updateOpportunity,

   deleteOpportunity,

   applyOpportunity,

   saveOpportunity,

   approveApplicant,

   rejectApplicant,

}

export default opportunityService