import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiSearch, FiFilter, FiStar } from 'react-icons/fi'
import { toast } from 'react-toastify'
import {
   getOpportunities,
   applyOpportunity,
   reset,
} from '../features/opportunities/opportunitySlice'
import { getProfile } from '../features/profile/profileSlice'
import MultiSelect from '../components/MultiSelect'
import Pagination from '../components/Pagination'

const CATEGORY_OPTIONS = [
   { value: 'project',     label: 'Project'     },
   { value: 'internship',  label: 'Internship'  },
   { value: 'hackathon',   label: 'Hackathon'   },
   { value: 'research',    label: 'Research'    },
   { value: 'competition', label: 'Competition' },
   { value: 'club',        label: 'Club'        },
   { value: 'event',       label: 'Event'       },
   { value: 'general',     label: 'General'     },
]

const ROLE_OPTIONS = [
   { value: 'student', label: 'Student' },
   { value: 'faculty', label: 'Faculty' },
]

function Explore() {

   const dispatch = useDispatch()

   const [categories, setCategories] = useState([])
   const [roles, setRoles]           = useState([])
   const [search, setSearch]         = useState('')
   const [tooltip, setTooltip]       = useState(null)
   const [page, setPage]             = useState(1)
   const PER_PAGE = 15

   const { allOpportunities: opportunities, isError, message } = useSelector((state) => state.opportunities)
   const { user } = useSelector((state) => state.auth)
   const { profile } = useSelector((state) => state.profile)

   useEffect(() => { dispatch(getOpportunities()) }, [dispatch])

   useEffect(() => {
      if (user?.role === 'student') dispatch(getProfile())
   }, [dispatch, user])

   useEffect(() => {
      if (isError) toast.error(message)
      dispatch(reset())
   }, [isError, message, dispatch])

   const showTooltip = (e, text) => {
      if (!text) return
      const el = e.currentTarget
      if (el.scrollWidth <= el.offsetWidth) return
      const rect = el.getBoundingClientRect()
      setTooltip({ text, x: rect.left, y: rect.top - 8 })
   }
   const hideTooltip = () => setTooltip(null)

   const clearFilters = () => { setCategories([]); setRoles([]); setSearch(''); setPage(1) }

   const hasFilters = categories.length > 0 || roles.length > 0 || search.trim() !== ''

   const filtered = opportunities.filter((o) => {
      const q = search.toLowerCase()
      const matchSearch   = !q ||
         o.title.toLowerCase().includes(q) ||
         o.skills.some((s) => s.toLowerCase().includes(q))
      const matchCategory = categories.length === 0 || categories.includes(o.category)
      const matchRole     = roles.length === 0     || roles.includes(o.postedBy?.role)
      return matchSearch && matchCategory && matchRole
   })

   const totalPages  = Math.ceil(filtered.length / PER_PAGE)
   const pagedResult = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

   // Is this student currently in a research/internship cooldown?
   const COOLDOWN_CATS = ['research', 'internship']
   const COOLDOWN_MS   = 24 * 60 * 60 * 1000
   let cooldownRemaining = null
   if (user?.role === 'student') {
      outer: for (const o of opportunities) {
         if (!COOLDOWN_CATS.includes(o.category)) continue
         for (const a of (o.applicants || [])) {
            if (a.user?._id !== user?._id || a.status !== 'pending') continue
            const elapsed = Date.now() - new Date(a.appliedAt).getTime()
            if (elapsed < COOLDOWN_MS) {
               const rem  = COOLDOWN_MS - elapsed
               const hrs  = Math.floor(rem / (1000 * 60 * 60))
               const mins = Math.floor((rem % (1000 * 60 * 60)) / (1000 * 60))
               cooldownRemaining = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
               break outer
            }
         }
      }
   }
   const inCooldown = !!cooldownRemaining

   // Skill-based recommendations for students
   const profileSkills = (profile?.skills || []).map((s) => s.toLowerCase())
   const recommended = user?.role === 'student' && profileSkills.length > 0
      ? opportunities
         .filter((o) => {
            const oppSkills = (o.skills || []).map((s) => s.toLowerCase())
            return oppSkills.some((s) => profileSkills.includes(s))
         })
         .map((o) => ({
            ...o,
            matchCount: (o.skills || []).filter((s) =>
               profileSkills.includes(s.toLowerCase())
            ).length,
         }))
         .sort((a, b) => b.matchCount - a.matchCount)
         .slice(0, 5)
      : []

   return (
      <>
      <div className='dashboard'>

         {/* ── RECOMMENDATIONS (student with skills only) ── */}
         {user?.role === 'student' && profileSkills.length > 0 && (
            <div className='explore-rec-section'>

               <div className='explore-rec-header'>
                  <FiStar style={{ color: '#7c3aed', fontSize: '1.1rem', flexShrink: 0 }} />
                  <h2 className='explore-rec-title'>Recommended for You</h2>
                  <span className='explore-rec-badge'>{recommended.length} match{recommended.length !== 1 ? 'es' : ''}</span>
               </div>

               <div className='explore-rec-skills'>
                  {profileSkills.map((s, i) => (
                     <span key={i} className='explore-rec-skill-chip'>{s}</span>
                  ))}
               </div>

               {recommended.length > 0 ? (
                  <div className='dash-table-wrap dash-table-wrap--fit'>
                     <table className='dash-table'>
                        <thead>
                           <tr>
                              <th>Title</th>
                              <th>Category</th>
                              <th>Skills</th>
                              <th>Posted By</th>
                              <th>Posted</th>
                              <th>Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           {recommended.map((opportunity) => {
                              const myApp = opportunity.applicants?.find(
                                 (a) => a.user?._id === user?._id
                              )
                              return (
                                 <tr key={opportunity._id}>

                                    <td>
                                       <p
                                          className='dash-row-name'
                                          onMouseEnter={(e) => showTooltip(e, opportunity.title)}
                                          onMouseLeave={hideTooltip}
                                       >{opportunity.title}</p>
                                       <p
                                          className='dash-row-desc'
                                          onMouseEnter={(e) => showTooltip(e, opportunity.description)}
                                          onMouseLeave={hideTooltip}
                                       >{opportunity.description}</p>
                                    </td>

                                    <td>
                                       <span className='category-badge'>{opportunity.category}</span>
                                    </td>

                                    <td>
                                       <div className='dash-row-skills'>
                                          {opportunity.skills.length > 0
                                             ? opportunity.skills.slice(0, 2).map((skill, i) => {
                                                  const isMatch = profileSkills.includes(skill.toLowerCase())
                                                  return (
                                                     <span key={i} className={isMatch ? 'skill-tag skill-match-badge' : 'skill-tag'}>{skill}</span>
                                                  )
                                               })
                                             : <span className='no-skills'>—</span>
                                          }
                                          {opportunity.skills.length > 2 && (
                                             <span className='skill-tag skill-overflow'>
                                                +{opportunity.skills.length - 2}
                                                <span className='skill-tooltip'>
                                                   {opportunity.skills.slice(2).join(', ')}
                                                </span>
                                             </span>
                                          )}
                                       </div>
                                    </td>

                                    <td>
                                       <p
                                          className='dash-row-name'
                                          style={{ fontSize: '0.88rem' }}
                                          onMouseEnter={(e) => showTooltip(e, opportunity.postedBy?.name)}
                                          onMouseLeave={hideTooltip}
                                       >{opportunity.postedBy?.name}</p>
                                       <p
                                          className='dash-row-desc'
                                          onMouseEnter={(e) => showTooltip(e, opportunity.postedBy?.email)}
                                          onMouseLeave={hideTooltip}
                                       >{opportunity.postedBy?.email}</p>
                                    </td>

                                    <td className='dash-row-date'>
                                       {new Date(opportunity.createdAt).toLocaleDateString('en-IN', {
                                          day: 'numeric', month: 'short', year: 'numeric'
                                       })}
                                    </td>

                                    <td>
                                       {myApp?.status === 'accepted' ? (
                                          <span className='dash-applied-badge dash-applied-badge--accepted'>✓ Accepted</span>
                                       ) : myApp?.status === 'rejected' ? (
                                          <span className='dash-applied-badge dash-applied-badge--rejected'>✕ Rejected</span>
                                       ) : myApp?.status === 'pending' ? (
                                          <span className='dash-applied-badge'>⏳ Applied</span>
                                       ) : COOLDOWN_CATS.includes(opportunity.category) && inCooldown ? (
                                          <span className='dash-cooldown-badge' title={`You have a pending research/internship application. Try again in ${cooldownRemaining}.`}>⏱ {cooldownRemaining} left</span>
                                       ) : (
                                          <button
                                             className='dash-apply-btn'
                                             onClick={() =>
                                                dispatch(applyOpportunity(opportunity._id))
                                                   .unwrap()
                                                   .then(() => toast.success('Applied successfully!'))
                                                   .catch((err) => toast.error(err))
                                             }
                                          >Apply</button>
                                       )}
                                    </td>

                                 </tr>
                              )
                           })}
                        </tbody>
                     </table>
                  </div>
               ) : (
                  <p className='explore-rec-empty'>No matching opportunities found for your skills yet.</p>
               )}

            </div>
         )}

         {/* ── SECTION 1: FILTERS ── */}
         <div className='explore-filter-card'>

            <div className='explore-filter-card-header'>
               <FiFilter className='explore-filter-icon' />
               <h2 className='explore-filter-title'>Find Opportunities</h2>
               {hasFilters && (
                  <button className='explore-clear-btn' onClick={clearFilters}>
                     Clear filters
                  </button>
               )}
            </div>

            <div className='explore-filter-row'>

               {/* CATEGORY */}
               <div className='explore-filter-group'>
                  <label className='explore-filter-label'>Category</label>
                  <MultiSelect
                     placeholder='All Categories'
                     options={CATEGORY_OPTIONS}
                     selected={categories}
                     onChange={(v) => { setCategories(v); setPage(1) }}
                  />
               </div>

               {/* ROLE */}
               <div className='explore-filter-group'>
                  <label className='explore-filter-label'>Posted By</label>
                  <MultiSelect
                     placeholder='All Roles'
                     options={ROLE_OPTIONS}
                     selected={roles}
                     onChange={(v) => { setRoles(v); setPage(1) }}
                  />
               </div>

               {/* TITLE / SKILLS */}
               <div className='explore-filter-group explore-filter-group--wide'>
                  <label className='explore-filter-label'>Title or Skills</label>
                  <div className='applicants-search-wrap'>
                     <FiSearch className='applicants-search-icon' />
                     <input
                        className='applicants-search'
                        type='text'
                        placeholder='Search by title or skill…'
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                     />
                  </div>
               </div>

            </div>

         </div>

         {/* ── SECTION 2: RESULTS ── */}
         {hasFilters && (
            <div className='dash-section'>

               <div className='dash-section-header'>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <h2 className='dash-section-title' style={{ margin: 0 }}>Results</h2>
                     <span className='explore-results-count'>
                        {filtered.length} opportunit{filtered.length !== 1 ? 'ies' : 'y'}
                     </span>
                  </div>
               </div>

               {filtered.length > 0 ? (

                  <div className='dash-table-wrap dash-table-wrap--fit'>
                     <table className='dash-table'>
                        <thead>
                           <tr>
                              <th>Title</th>
                              <th>Category</th>
                              <th>Skills</th>
                              <th>Posted By</th>
                              <th>Posted</th>
                              <th>Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           {pagedResult.map((opportunity) => {
                              const myApp = opportunity.applicants?.find(
                                 (a) => a.user?._id === user?._id
                              )
                              return (
                                 <tr key={opportunity._id}>

                                    <td>
                                       <p
                                          className='dash-row-name'
                                          onMouseEnter={(e) => showTooltip(e, opportunity.title)}
                                          onMouseLeave={hideTooltip}
                                       >{opportunity.title}</p>
                                       <p
                                          className='dash-row-desc'
                                          onMouseEnter={(e) => showTooltip(e, opportunity.description)}
                                          onMouseLeave={hideTooltip}
                                       >{opportunity.description}</p>
                                    </td>

                                    <td>
                                       <span className='category-badge'>{opportunity.category}</span>
                                    </td>

                                    <td>
                                       <div className='dash-row-skills'>
                                          {opportunity.skills.length > 0
                                             ? opportunity.skills.slice(0, 2).map((skill, i) => (
                                                  <span key={i} className='skill-tag'>{skill}</span>
                                               ))
                                             : <span className='no-skills'>—</span>
                                          }
                                          {opportunity.skills.length > 2 && (
                                             <span className='skill-tag skill-overflow'>
                                                +{opportunity.skills.length - 2}
                                                <span className='skill-tooltip'>
                                                   {opportunity.skills.slice(2).join(', ')}
                                                </span>
                                             </span>
                                          )}
                                       </div>
                                    </td>

                                    <td>
                                       <p
                                          className='dash-row-name'
                                          style={{ fontSize: '0.88rem' }}
                                          onMouseEnter={(e) => showTooltip(e, opportunity.postedBy?.name)}
                                          onMouseLeave={hideTooltip}
                                       >{opportunity.postedBy?.name}</p>
                                       <p
                                          className='dash-row-desc'
                                          onMouseEnter={(e) => showTooltip(e, opportunity.postedBy?.email)}
                                          onMouseLeave={hideTooltip}
                                       >{opportunity.postedBy?.email}</p>
                                    </td>

                                    <td className='dash-row-date'>
                                       {new Date(opportunity.createdAt).toLocaleDateString('en-IN', {
                                          day: 'numeric', month: 'short', year: 'numeric'
                                       })}
                                    </td>

                                    <td>
                                       {user?.role === 'student' ? (
                                          myApp?.status === 'accepted' ? (
                                             <span className='dash-applied-badge dash-applied-badge--accepted'>✓ Accepted</span>
                                          ) : myApp?.status === 'rejected' ? (
                                             <span className='dash-applied-badge dash-applied-badge--rejected'>✕ Rejected</span>
                                          ) : myApp?.status === 'pending' ? (
                                             <span className='dash-applied-badge'>⏳ Applied</span>
                                          ) : COOLDOWN_CATS.includes(opportunity.category) && inCooldown ? (
                                             <span className='dash-cooldown-badge' title='You have a pending research/internship application. Wait 24h before applying to another.'>⏱ Cooldown</span>
                                          ) : (
                                             <button
                                                className='dash-apply-btn'
                                                onClick={() =>
                                                   dispatch(applyOpportunity(opportunity._id))
                                                      .unwrap()
                                                      .then(() => toast.success('Applied successfully!'))
                                                      .catch((err) => toast.error(err))
                                                }
                                             >Apply</button>
                                          )
                                       ) : (
                                          <span className='role-badge'>{opportunity.postedBy?.role}</span>
                                       )}
                                    </td>

                                 </tr>
                              )
                           })}
                        </tbody>
                     </table>
                     <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
                  </div>

               ) : (

                  <div className='empty-state'>
                     <h2>No opportunities found</h2>
                     <p>Try adjusting your filters or search term.</p>
                  </div>

               )}

            </div>
         )}

         {!hasFilters && (
            <div className='explore-placeholder'>
               <p className='explore-placeholder-text'>
                  Select a category or role above to explore opportunities
               </p>
            </div>
         )}

      </div>

      {tooltip && (
         <div className='row-tooltip-box' style={{ left: tooltip.x, top: tooltip.y - 40 }}>
            {tooltip.text}
         </div>
      )}
      </>
   )
}

export default Explore
