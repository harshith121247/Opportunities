import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiCheck, FiX, FiArrowLeft, FiSearch, FiMail, FiBook, FiTag, FiBriefcase, FiUser, FiLayers } from 'react-icons/fi'
import Pagination from '../components/Pagination'
import { getMyOpportunities, approveApplicant, rejectApplicant, reset } from '../features/opportunities/opportunitySlice'
import { toast } from 'react-toastify'

function Applicants() {

   const dispatch = useDispatch()
   const [searchParams] = useSearchParams()

   const [selectedOpportunity, setSelectedOpportunity] = useState(null)
   const [categoryFilter, setCategoryFilter] = useState('all')
   const [search, setSearch] = useState('')
   const [statusMap, setStatusMap] = useState({})
   const [tooltip, setTooltip] = useState(null)
   const [oppModal, setOppModal] = useState(null)
   const [profileModal, setProfileModal] = useState(null)   // applicant profile modal
   const [page, setPage] = useState(1)
   const PER_PAGE = 15

   const { user } = useSelector((state) => state.auth)
   const { opportunities, isError, message } = useSelector((state) => state.opportunities)

   const showTooltip = (e, text) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setTooltip({ text, x: rect.left, y: rect.top - 8 })
   }
   const hideTooltip = () => setTooltip(null)

   useEffect(() => { dispatch(getMyOpportunities()) }, [dispatch])

   useEffect(() => {
      if (isError) toast.error(message)
      dispatch(reset())
   }, [isError, message, dispatch])

   // Auto-select opportunity from ?id= query param (navigated from dashboard)
   useEffect(() => {
      const id = searchParams.get('id')
      if (!id || !opportunities.length) return
      const opp = opportunities.find((o) => o._id === id)
      if (opp) setSelectedOpportunity({ id: opp._id, title: opp.title, category: opp.category })
   }, [searchParams, opportunities])

   const setStatus = (key, value) =>
      setStatusMap((prev) => ({ ...prev, [key]: value }))

   const handleApprove = async (row, opportunityId, key) => {
      try {
         await dispatch(approveApplicant({ opportunityId, applicantId: row._id })).unwrap()
         setStatus(key, 'accepted')
         toast.success(`${row.name} approved! Approval email sent.`)
      } catch (err) {
         toast.error(err || 'Failed to approve applicant')
      }
   }

   // Opportunities with at least one applicant
   const oppsWithApplicants = opportunities.filter((o) => o.applicants?.length > 0)

   // Unique categories from those opportunities
   const activeCategories = [...new Set(oppsWithApplicants.map((o) => o.category))]

   // Flatten all rows — each applicant is now { user: {...}, status: 'pending'|'accepted'|'rejected' }
   const allRows = oppsWithApplicants.flatMap((o) =>
      o.applicants
         .filter((a) => a?.user)
         .map((a) => ({
            ...a.user,                     // _id, name, email, role, branch, year, skills, department, bio
            status: a.status || 'pending',
            opportunityId: o._id,
            opportunityTitle: o.title,
            opportunityCategory: o.category,
         }))
   )

   // Apply filters
   let filteredRows = allRows

   if (selectedOpportunity) {
      filteredRows = filteredRows.filter((r) => r.opportunityId === selectedOpportunity.id)
   } else if (categoryFilter !== 'all') {
      filteredRows = filteredRows.filter((r) => r.opportunityCategory === categoryFilter)
   }

   if (search.trim()) {
      const q = search.toLowerCase()
      filteredRows = filteredRows.filter((r) =>
         r.name?.toLowerCase().includes(q) ||
         r.email?.toLowerCase().includes(q) ||
         r.opportunityTitle?.toLowerCase().includes(q)
      )
   }

   const totalPages = Math.ceil(filteredRows.length / PER_PAGE)
   const pagedRows  = filteredRows.slice((page - 1) * PER_PAGE, page * PER_PAGE)

   const visibleChips = categoryFilter === 'all'
      ? oppsWithApplicants
      : oppsWithApplicants.filter((o) => o.category === categoryFilter)

   const clearDrill = () => {
      setSelectedOpportunity(null)
      setSearch('')
   }

   const handleReject = async (row, key) => {
      try {
         await dispatch(rejectApplicant({
            opportunityId: row.opportunityId,
            applicantId:   row._id,
         })).unwrap()
         setStatus(key, 'rejected')
         toast.info(`${row.name} has been rejected. Their cooldown has been cleared.`)
      } catch (err) {
         toast.error(err || 'Failed to reject applicant')
      }
   }

   const renderActions = (row) => {
      const key    = `${row._id}-${row.opportunityTitle}`
      const status = statusMap[key] || row.status
      if (status === 'accepted')
         return <span className='applicant-status-badge applicant-status-badge--accepted'>✓ Accepted</span>
      if (status === 'rejected')
         return <span className='applicant-status-badge applicant-status-badge--rejected'>✕ Rejected</span>
      return (
         <div className='dash-row-actions'>
            <button className='dash-edit-btn' title='Approve & send email'
               onClick={() => handleApprove(row, row.opportunityId, key)}>
               <FiCheck />
            </button>
            <button className='dash-delete-btn' title='Reject'
               onClick={() => handleReject(row, key)}>
               <FiX />
            </button>
         </div>
      )
   }

   return (
      <>
      <div className='dashboard'>

         <div className='dash-section'>

            {/* HEADER */}
            <div className='dash-section-header'>

               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {selectedOpportunity && (
                     <button className='applicants-back-chip' onClick={clearDrill} title='Back to all'>
                        <FiArrowLeft />
                     </button>
                  )}
                  <div>
                     <h2 className='dash-section-title'>
                        {selectedOpportunity ? selectedOpportunity.title : 'Applicants'}
                     </h2>
                  </div>
               </div>

               <div className='dash-section-actions'>
                  {/* SEARCH */}
                  <div className='applicants-search-wrap'>
                     <FiSearch className='applicants-search-icon' />
                     <input
                        className='applicants-search'
                        type='text'
                        placeholder='Search name, email or opportunity…'
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                     />
                  </div>

                  {/* CATEGORY FILTER */}
                  {!selectedOpportunity && (
                     <select
                        className='dash-filter'
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); setSearch(''); setPage(1) }}
                     >
                        <option value='all'>All Categories</option>
                        <option value='project'>Projects</option>
                        <option value='internship'>Internships</option>
                        <option value='hackathon'>Hackathons</option>
                        <option value='research'>Research</option>
                        <option value='competition'>Competitions</option>
                        <option value='club'>Clubs</option>
                        <option value='event'>Events</option>
                        <option value='general'>General</option>
                     </select>
                  )}

                  <Link to='/dashboard' className='btn' style={{ textDecoration: 'none' }}>
                     ← Dashboard
                  </Link>
               </div>

            </div>


            {/* TABLE */}
            {filteredRows.length > 0 ? (

               <div className='dash-table-wrap dash-table-wrap--fit'>
                  <table className='dash-table dash-table--applicants'>
                     <thead>
                        <tr>
                           <th>#</th>
                           <th>Name</th>
                           <th>Email</th>
                           <th>Role</th>
                           {!selectedOpportunity && <th>Opportunity</th>}
                           {!selectedOpportunity && <th>Category</th>}
                           <th>Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {pagedRows.map((row, i) => (
                           <tr key={`${row._id}-${row.opportunityId}`}>

                              <td style={{ color: '#9ca3af', fontWeight: 600 }}>{i + 1}</td>

                              <td>
                                 <div
                                    className='applicants-name-cell applicants-name-cell--clickable'
                                    onClick={() => setProfileModal(row)}
                                 >
                                    <p className='dash-row-name applicants-name-link'>
                                       {row.name}
                                    </p>
                                 </div>
                              </td>

                              <td>
                                 <p
                                    className='dash-row-name'
                                    style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.88rem' }}
                                    onMouseEnter={(e) => showTooltip(e, row.email)}
                                    onMouseLeave={hideTooltip}
                                 >{row.email}</p>
                              </td>

                              <td><span className='role-badge'>{row.role}</span></td>

                              {!selectedOpportunity && (
                                 <td>
                                    <p
                                       className='dash-row-name applicants-opp-link'
                                       style={{ fontSize: '0.88rem' }}
                                       onClick={() => {
                                          const opp = opportunities.find((o) => o._id === row.opportunityId)
                                          if (opp) setOppModal(opp)
                                       }}
                                       onMouseEnter={(e) =>
                                          row.opportunityTitle?.length > 28 &&
                                          showTooltip(e, row.opportunityTitle)
                                       }
                                       onMouseLeave={hideTooltip}
                                    >
                                       {row.opportunityTitle?.length > 28
                                          ? row.opportunityTitle.slice(0, 28) + '…'
                                          : row.opportunityTitle}
                                    </p>
                                 </td>
                              )}

                              {!selectedOpportunity && (
                                 <td><span className='category-badge'>{row.opportunityCategory}</span></td>
                              )}

                              <td>{renderActions(row)}</td>

                           </tr>
                        ))}
                     </tbody>
                  </table>
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
               </div>

            ) : (

               <div className='empty-state'>
                  <h2>No applicants found</h2>
                  <p>
                     {search
                        ? `No results for "${search}"`
                        : selectedOpportunity
                           ? 'No one has applied to this opportunity yet.'
                           : 'No one has applied to your opportunities yet.'}
                  </p>
               </div>

            )}

         </div>

      </div>

      {/* ── APPLICANT PROFILE MODAL ── */}
      {profileModal && (
         <div className='modal-overlay' onClick={() => setProfileModal(null)}>
            <div className='modal opp-detail-modal' onClick={(e) => e.stopPropagation()}>

               {/* BANNER — same structure as Opportunity detail modal */}
               <div className='opp-detail-banner'>
                  <div className='opp-detail-banner-topbar'>
                     <p className='opp-detail-banner-date'>{profileModal.email}</p>
                     <button className='opp-detail-banner-close' onClick={() => setProfileModal(null)}>×</button>
                  </div>
                  <div className='opp-detail-banner-title-row'>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className='apm-avatar-sm'>
                           {profileModal.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className='opp-detail-banner-title' style={{ margin: 0 }}>
                           {profileModal.name}
                        </h2>
                     </div>
                     <span className={`apm-role-badge apm-role-badge--${profileModal.role}`}>
                        {profileModal.role === 'student' ? 'Student' : 'Faculty'}
                     </span>
                  </div>
               </div>

               {/* BODY — same structure as Opportunity detail modal */}
               <div className='opp-detail-body'>

                  {/* ── STUDENT FIELDS ── */}
                  {profileModal.role === 'student' && (
                     <>
                        {(profileModal.branch || profileModal.year) && (
                           <div className='opp-detail-section'>
                              <p className='opp-detail-section-label'>Branch &amp; Year</p>
                              <p className='opp-detail-section-text'>
                                 {[profileModal.branch, profileModal.year].filter(Boolean).join('  ·  ')}
                              </p>
                           </div>
                        )}

                        {profileModal.skills?.length > 0 && (
                           <div className='opp-detail-section'>
                              <p className='opp-detail-section-label'>Skills</p>
                              <div className='opp-detail-skills'>
                                 {profileModal.skills.map((s, i) => (
                                    <span key={i} className='skill-tag'>{s}</span>
                                 ))}
                              </div>
                           </div>
                        )}

                        {!profileModal.branch && !profileModal.year && !profileModal.skills?.length && (
                           <p className='apm-empty'>No profile info added yet.</p>
                        )}
                     </>
                  )}

                  {/* ── FACULTY FIELDS ── */}
                  {profileModal.role === 'faculty' && (
                     <>
                        {profileModal.department && (
                           <div className='opp-detail-section'>
                              <p className='opp-detail-section-label'>Department</p>
                              <p className='opp-detail-section-text'>{profileModal.department}</p>
                           </div>
                        )}

                        {profileModal.subjects?.length > 0 && (
                           <div className='opp-detail-section'>
                              <p className='opp-detail-section-label'>Subjects</p>
                              <div className='opp-detail-skills'>
                                 {profileModal.subjects.map((s, i) => (
                                    <span key={i} className='skill-tag profile-subject-tag'>{s}</span>
                                 ))}
                              </div>
                           </div>
                        )}

                        {!profileModal.department && !profileModal.subjects?.length && (
                           <p className='apm-empty'>No department or subject info added yet.</p>
                        )}
                     </>
                  )}

                  {/* BIO — both roles */}
                  {profileModal.bio && (
                     <div className='opp-detail-section'>
                        <p className='opp-detail-section-label'>About</p>
                        <p className='opp-detail-section-text'>{profileModal.bio}</p>
                     </div>
                  )}

               </div>

            </div>
         </div>
      )}

      {/* OPPORTUNITY DETAIL MODAL */}
      {oppModal && (
         <div className='modal-overlay' onClick={() => setOppModal(null)}>
            <div className='modal opp-detail-modal' onClick={(e) => e.stopPropagation()}>

               {/* GRADIENT BANNER */}
               <div className='opp-detail-banner'>
                  <div className='opp-detail-banner-topbar'>
                     <p className='opp-detail-banner-date'>
                        Posted on {new Date(oppModal.createdAt).toLocaleDateString('en-IN', {
                           day: 'numeric', month: 'long', year: 'numeric'
                        })}
                     </p>
                     <button className='opp-detail-banner-close' onClick={() => setOppModal(null)}>×</button>
                  </div>
                  <div className='opp-detail-banner-title-row'>
                     <h2 className='opp-detail-banner-title'>{oppModal.title}</h2>
                     <span className='opp-detail-banner-cat'>{oppModal.category}</span>
                  </div>
               </div>

               {/* BODY */}
               <div className='opp-detail-body'>

                  {oppModal.description && (
                     <div className='opp-detail-section'>
                        <p className='opp-detail-section-label'>Description</p>
                        <p className='opp-detail-section-text'>{oppModal.description}</p>
                     </div>
                  )}

                  {oppModal.skills?.length > 0 && (
                     <div className='opp-detail-section'>
                        <p className='opp-detail-section-label'>Required Skills</p>
                        <div className='opp-detail-skills'>
                           {oppModal.skills.map((skill, i) => (
                              <span key={i} className='skill-tag'>{skill}</span>
                           ))}
                        </div>
                     </div>
                  )}

               </div>

            </div>
         </div>
      )}

      {/* JS tooltip */}
      {tooltip && (
         <div className='row-tooltip-box' style={{ left: tooltip.x, top: tooltip.y - 40 }}>
            {tooltip.text}
         </div>
      )}

</>
   )
}

export default Applicants
