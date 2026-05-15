import { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import {
   createOpportunity,
   getMyOpportunities,
   deleteOpportunity,
} from '../features/opportunities/opportunitySlice'

function Dashboard() {

   const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: '',
      skills: '',
   })

   const [filter, setFilter] = useState('all')

   const {
      title,
      description,
      category,
      skills,
   } = formData

   const dispatch = useDispatch()

   const { opportunities } = useSelector(
      (state) => state.opportunities
   )

   const { user } = useSelector(
      (state) => state.auth
   )

   console.log(user)

   useEffect(() => {

      dispatch(getMyOpportunities())

   }, [dispatch])

   const onChange = (e) => {

      setFormData((prevState) => ({
         ...prevState,
         [e.target.name]: e.target.value,
      }))
   }

   const onSubmit = (e) => {

      e.preventDefault()

      const opportunityData = {
         title,
         description,
         category: category.trim().toLowerCase(),
         skills: skills
            .split(',')
            .map((skill) => skill.trim())
            .filter((skill) => skill !== ''),
      }

      dispatch(createOpportunity(opportunityData))

      dispatch(getMyOpportunities())

      setFormData({
         title: '',
         description: '',
         category: '',
         skills: '',
      })
   }

   return (

      <>

         <section className='heading'>

            <h1>Dashboard</h1>

            <p>
               Create and manage your opportunities
            </p>

         </section>

         <section className='form'>

            <form onSubmit={onSubmit}>

               <div className='form-group'>

                  <input
                     type='text'
                     name='title'
                     value={title}
                     placeholder='Opportunity title'
                     onChange={onChange}
                     required
                  />

               </div>

               <div className='form-group'>

                  <textarea
                     name='description'
                     value={description}
                     placeholder='Describe the opportunity'
                     onChange={onChange}
                     required
                  />

               </div>

               <div className='form-group'>

               <select
   name='category'
   value={category}
   onChange={onChange}
   required
>

   <option value=''>
      Select Category
   </option>

   {/* STUDENT CATEGORIES */}

   {user?.role === 'student' && (
      <>
         <option value='project'>
            Project
         </option>

         <option value='competition'>
            Competition
         </option>

         <option value='club'>
            Club
         </option>
      </>
   )}

   {/* FACULTY CATEGORIES */}

   {user?.role === 'faculty' && (
      <>
         <option value='research'>
            Research
         </option>

         <option value='internship'>
            Internship
         </option>

         <option value='event'>
            Event
         </option>
      </>
   )}

   {/* COMMON CATEGORIES */}

   <option value='hackathon'>
      Hackathon
   </option>

   <option value='general'>
      General
   </option>

</select>

               </div>

               <div className='form-group'>

                  <input
                     type='text'
                     name='skills'
                     value={skills}
                     placeholder='Optional: Add required skills (comma separated)'
                     onChange={onChange}
                  />

               </div>

               <div className='form-group'>

                  <button
                     type='submit'
                     className='btn btn-block'
                  >

                     Create Opportunity

                  </button>

               </div>

            </form>

         </section>

         <section className='content'>

            <h2>Manage Your Opportunities</h2>

            <div className='form-group'>

               <select
                  value={filter}
                  onChange={(e) =>
                     setFilter(e.target.value)
                  }
               >

                  <option value='all'>
                     All Opportunities
                  </option>

                  <option value='project'>
                     Projects
                  </option>

                  <option value='internship'>
                     Internships
                  </option>

                  <option value='hackathon'>
                     Hackathons
                  </option>

                  <option value='research'>
                     Research
                  </option>

               </select>

            </div>

            {opportunities.length > 0 ? (

               opportunities

                  .filter((opportunity) => {

                     if (filter === 'all') {
                        return true
                     }

                     return (
                        opportunity.category === filter
                     )
                  })

                  .map((opportunity) => (

                     <div
                        key={opportunity._id}
                        className='opportunity-card'
                     >

                        <button
                           className='close'
                           onClick={() =>
                              dispatch(
                                 deleteOpportunity(
                                    opportunity._id
                                 )
                              )
                           }
                        >

                           ×

                        </button>

                        <div className='card-top'>

                           <span className='category-badge'>

                              {opportunity.category}

                           </span>

                        </div>

                        <h2>

                           {opportunity.title}

                        </h2>

                        <p className='description'>

                           {opportunity.description}

                        </p>

                        <div className='skills-container'>

                           {opportunity.skills.length > 0 ? (

                              opportunity.skills.map(
                                 (skill, index) => (

                                    <span
                                       key={index}
                                       className='skill-tag'
                                    >

                                       {skill}

                                    </span>

                                 )
                              )

                           ) : (

                              <span className='no-skills'>

                                 No specific skills required

                              </span>

                           )}

                        </div>

                        <div className='applicants-box'>

                           <h3>

                              Applicants (
                              {opportunity.applicants?.length || 0}
                              )

                           </h3>

                           {opportunity.applicants?.length > 0 ? (

                              opportunity.applicants.map(
                                 (applicant) => (

                                    <div
                                       key={applicant._id}
                                       className='applicant-card'
                                    >

                                       <p>

                                          <strong>Name:</strong>{' '}

                                          {applicant.name}

                                       </p>

                                       <p>

                                          <strong>Email:</strong>{' '}

                                          {applicant.email}

                                       </p>

                                       <p>

                                          <strong>Role:</strong>{' '}

                                          {applicant.role}

                                       </p>

                                    </div>

                                 )
                              )

                           ) : (

                              <p>
                                 No applicants yet
                              </p>

                           )}

                        </div>

                     </div>

                  ))

            ) : (

               <div className='opportunity-card'>

                  <h3>
                     You haven't posted any opportunities yet.
                  </h3>

                  <p>
                     Create one to get started.
                  </p>

               </div>

            )}

         </section>

      </>

   )
}

export default Dashboard