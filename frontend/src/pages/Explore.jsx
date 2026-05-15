import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import {
   getOpportunities,
   applyOpportunity,
   saveOpportunity,
} from '../features/opportunities/opportunitySlice'

function Explore() {

   const dispatch = useDispatch()

   const [filter, setFilter] = useState('all')

   const [search, setSearch] = useState('')

   const { opportunities } = useSelector(
      (state) => state.opportunities
   )

   const { user } = useSelector(
      (state) => state.auth
   )

   useEffect(() => {

      dispatch(getOpportunities())

   }, [dispatch])

   return (

      <>

         <section className='heading'>

            <h1>Explore Opportunities</h1>

            <p>
               Discover projects, hackathons,
               research opportunities and more
            </p>

         </section>

         <section className='form'>

            <div className='form-group'>

               <input
                  type='text'
                  placeholder='Search opportunities...'
                  value={search}
                  onChange={(e) =>
                     setSearch(e.target.value)
                  }
               />

            </div>

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

                  <option value='student'>
                     Student Opportunities
                  </option>

                  <option value='faculty'>
                     Faculty Opportunities
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

         </section>

         <section className='content'>

            {opportunities.length > 0 ? (

               opportunities

                  .filter((opportunity) => {

                     const matchesSearch =

                        opportunity.title
                           .toLowerCase()
                           .includes(
                              search.toLowerCase()
                           )

                        ||

                        opportunity.description
                           .toLowerCase()
                           .includes(
                              search.toLowerCase()
                           )

                        ||

                        opportunity.skills.some(
                           (skill) =>

                              skill
                                 .toLowerCase()
                                 .includes(
                                    search.toLowerCase()
                                 )
                        )

                     if (filter === 'all') {
                        return matchesSearch
                     }

                     if (
                        filter === 'student' ||
                        filter === 'faculty'
                     ) {

                        return (

                           opportunity.postedBy?.role ===
                              filter && matchesSearch

                        )
                     }

                     return (

                        opportunity.category ===
                           filter && matchesSearch

                     )

                  })

                  .map((opportunity) => (

                     <div
                        key={opportunity._id}
                        className='opportunity-card'
                     >

                        <div className='card-top'>

                           <span className='category-badge'>

                              {opportunity.category}

                           </span>

                           <span className='role-badge'>

                              {opportunity.postedBy?.role}

                           </span>

                           {opportunity.postedBy?.role ===
                           'faculty' && (

                              <span className='faculty-badge'>

                                 Verified Faculty

                              </span>

                           )}

                        </div>

                        <h2>

                           {opportunity.title}

                        </h2>

                        <p className='posted-time'>

                           Posted on{' '}

                           {new Date(
                              opportunity.createdAt
                           ).toLocaleDateString()}

                        </p>

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

                        <div className='contact-section'>

                           <p>

                              <strong>Posted By:</strong>{' '}

                              {opportunity.postedBy?.name}

                           </p>

                           <p>

                              <strong>Role:</strong>{' '}

                              {opportunity.postedBy?.role}

                           </p>

                           <p>

                              <strong>Contact:</strong>{' '}

                              {opportunity.postedBy?.email}

                           </p>

                        </div>

                        {user && (

                           <button
                              className='save-btn'
                              onClick={() =>
                                 dispatch(
                                    saveOpportunity(
                                       opportunity._id
                                    )
                                 )
                              }
                           >

                              {opportunity.savedBy?.includes(
                                 user._id
                              )

                                 ? '★ Saved'

                                 : '☆ Save'}

                           </button>

                        )}

                        {user ? (

                           opportunity.applicants?.some(
                              (applicant) =>
                                 applicant._id === user._id
                           ) ? (

                              <button
                                 className='btn applied-btn'
                                 disabled
                              >

                                 Applied ✅

                              </button>

                           ) : (

                              <button
                                 className='btn'
                                 onClick={() =>
                                    dispatch(
                                       applyOpportunity(
                                          opportunity._id
                                       )
                                    )
                                 }
                              >

                                 Apply

                              </button>

                           )

                        ) : (

                           <p
                              style={{
                                 marginTop: '15px',
                              }}
                           >

                              Login to apply

                           </p>

                        )}

                     </div>

                  ))

            ) : (

               <div className='empty-state'>

                  <h2>
                     No opportunities found
                  </h2>

                  <p>
                     Try changing filters or
                     search keywords.
                  </p>

               </div>

            )}

         </section>

      </>

   )
}

export default Explore