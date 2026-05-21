import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiFileText, FiUsers } from 'react-icons/fi'
import Pagination from '../components/Pagination'

import { useDispatch, useSelector } from 'react-redux'

import { toast } from 'react-toastify'

import {
   createOpportunity,
   getMyOpportunities,
   getOpportunities,
   updateOpportunity,
   deleteOpportunity,
   applyOpportunity,
   reset,
} from '../features/opportunities/opportunitySlice'

function Dashboard() {

   const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: '',
      skills: '',
   })

   const navigate = useNavigate()
   const [activeTab, setActiveTab] = useState('mine')
   const [tooltip, setTooltip] = useState(null)
   const [minePage, setMinePage]     = useState(1)
   const [othersPage, setOthersPage] = useState(1)
   const PER_PAGE = 15

   const showTooltip = (e, text) => {
      if (!text) return
      const el = e.currentTarget
      if (el.scrollWidth <= el.offsetWidth) return   // not truncated — skip
      const rect = el.getBoundingClientRect()
      setTooltip({ text, x: rect.left, y: rect.top - 8 })
   }
   const hideTooltip = () => setTooltip(null)
   const [filter, setFilter] = useState('all')
   const [othersFilter, setOthersFilter] = useState('all')
   const [modalOpen, setModalOpen] = useState(false)
   const [editModalOpen, setEditModalOpen] = useState(false)
   const [editingOpportunity, setEditingOpportunity] = useState(null)
   const [editFormData, setEditFormData] = useState({
      title: '',
      description: '',
      category: '',
      skills: '',
   })

   const { title, description, category, skills } = formData

   const dispatch = useDispatch()

   const {
      opportunities,
      allOpportunities,
      isError,
      message,
   } = useSelector((state) => state.opportunities)

   const { user } = useSelector((state) => state.auth)

   useEffect(() => {
      dispatch(getMyOpportunities())
      dispatch(getOpportunities())
   }, [dispatch])

   useEffect(() => {
      if (isError) toast.error(message)
      dispatch(reset())
   }, [isError, message, dispatch])

   const onChange = (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
   }

   const onSubmit = (e) => {
      e.preventDefault()
      const opportunityData = {
         title,
         description,
         category: category.trim().toLowerCase(),
         skills: skills.split(',').map((s) => s.trim()).filter((s) => s !== ''),
      }
      dispatch(createOpportunity(opportunityData))
         .unwrap()
         .then(() => {
            toast.success('Opportunity created!')
            setFormData({ title: '', description: '', category: '', skills: '' })
            setModalOpen(false)
         })
         .catch(() => {})
   }

   const onEditOpen = (opportunity) => {
      setEditingOpportunity(opportunity)
      setEditFormData({
         title: opportunity.title,
         description: opportunity.description,
         category: opportunity.category,
         skills: opportunity.skills.join(', '),
      })
      setEditModalOpen(true)
   }

   const onEditChange = (e) => {
      setEditFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
   }

   const onEditSubmit = (e) => {
      e.preventDefault()
      const opportunityData = {
         title: editFormData.title,
         description: editFormData.description,
         category: editFormData.category.trim().toLowerCase(),
         skills: editFormData.skills.split(',').map((s) => s.trim()).filter((s) => s !== ''),
      }
      dispatch(updateOpportunity({ id: editingOpportunity._id, opportunityData }))
         .unwrap()
         .then(() => {
            toast.success('Opportunity updated!')
            setEditModalOpen(false)
            setEditingOpportunity(null)
         })
         .catch(() => {})
   }

   const onDelete = (id) => {
      dispatch(deleteOpportunity(id))
         .unwrap()
         .then(() => toast.success('Opportunity deleted!'))
         .catch(() => {})
   }

   const totalApplicants = opportunities.reduce(
      (sum, o) => sum + (o.applicants?.length || 0), 0
   )

   const oppositeRole = user?.role === 'student' ? 'faculty' : 'student'
   const oppositeLabel = oppositeRole === 'faculty' ? 'Faculty' : 'Student'

   const filteredMine = opportunities.filter((o) =>
      filter === 'all' ? true : o.category === filter
   )
   const mineTotalPages  = Math.ceil(filteredMine.length / PER_PAGE)
   const pagedMine       = filteredMine.slice((minePage - 1) * PER_PAGE, minePage * PER_PAGE)

   const filteredOthers = (allOpportunities || [])
      .filter((o) => o.postedBy?.role === oppositeRole)
      .filter((o) => othersFilter === 'all' ? true : o.category === othersFilter)
   const othersTotalPages = Math.ceil(filteredOthers.length / PER_PAGE)
   const pagedOthers      = filteredOthers.slice((othersPage - 1) * PER_PAGE, othersPage * PER_PAGE)

   // Is this student currently in a research/internship cooldown?
   const COOLDOWN_CATS = ['research', 'internship']
   const COOLDOWN_MS   = 24 * 60 * 60 * 1000
   let cooldownRemaining = null
   if (user?.role === 'student') {
      outer: for (const o of (allOpportunities || [])) {
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

   const categoryOptions = (
      <>
         <option value='all'>All</option>
         <option value='project'>Projects</option>
         <option value='internship'>Internships</option>
         <option value='hackathon'>Hackathons</option>
         <option value='research'>Research</option>
         <option value='competition'>Competitions</option>
         <option value='club'>Clubs</option>
         <option value='event'>Events</option>
         <option value='general'>General</option>
      </>
   )

   return (

      <div className='dashboard'>

         {/* STATS */}
         <div className='dash-stats'>
            <Link to='/dashboard' className='dash-stat-card dash-stat-card--link dash-stat-card--blue'>
               <div className='dash-stat-icon-wrap dash-stat-icon-wrap--blue'>
                  <FiFileText />
               </div>
               <div className='dash-stat-info'>
                  <span className='dash-stat-number'>{opportunities.length}</span>
                  <span className='dash-stat-label'>Total Posts</span>
               </div>
            </Link>
            <Link to='/applicants' className='dash-stat-card dash-stat-card--link dash-stat-card--purple'>
               <div className='dash-stat-icon-wrap dash-stat-icon-wrap--purple'>
                  <FiUsers />
               </div>
               <div className='dash-stat-info'>
                  <span className='dash-stat-number'>{totalApplicants}</span>
                  <span className='dash-stat-label'>Total Applicants</span>
               </div>
            </Link>
         </div>

         {/* TABBED SECTION */}
         <div className='dash-section'>

            {/* TABS */}
            <div className='dash-tabs'>
               <button
                  className={`dash-tab ${activeTab === 'mine' ? 'active' : ''}`}
                  onClick={() => setActiveTab('mine')}
               >
                  My Opportunities
                  <span className='dash-tab-count'>{opportunities.length}</span>
               </button>
               <button
                  className={`dash-tab ${activeTab === 'others' ? 'active' : ''}`}
                  onClick={() => setActiveTab('others')}
               >
                  Opportunities
                  <span className='dash-tab-count'>{filteredOthers.length}</span>
               </button>
            </div>

            {/* TAB: MY OPPORTUNITIES */}
            {activeTab === 'mine' && (
               <>
                  <div className='dash-section-header' style={{ marginTop: '20px' }}>
                     <div /> {/* spacer */}
                     <div className='dash-section-actions'>
                        <select
                           className='dash-filter'
                           value={filter}
                           onChange={(e) => { setFilter(e.target.value); setMinePage(1) }}
                        >
                           {categoryOptions}
                        </select>
                        <button className='btn' onClick={() => setModalOpen(true)}>
                           + New Opportunity
                        </button>
                     </div>
                  </div>

                  {filteredMine.length > 0 ? (
                     <div className='dash-table-wrap dash-table-wrap--fit'>
                        <table className='dash-table'>
                           <thead>
                              <tr>
                                 <th>Title</th>
                                 <th>Category</th>
                                 <th>Skills</th>
                                 <th>Applicants</th>
                                 <th>Posted</th>

                                 <th></th>
                              </tr>
                           </thead>
                           <tbody>
                              {pagedMine.map((opportunity) => (
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
                                       <span
                                          className={`dash-applicant-count ${opportunity.applicants?.length > 0 ? 'dash-applicant-count--clickable' : ''}`}
                                          onClick={() => opportunity.applicants?.length > 0 && navigate(`/applicants?id=${opportunity._id}`)}
                                          title={opportunity.applicants?.length > 0 ? 'View applicants' : ''}
                                       >
                                          {opportunity.applicants?.length || 0}
                                       </span>
                                    </td>

                                    <td className='dash-row-date'>
                                       {new Date(opportunity.createdAt).toLocaleDateString('en-IN', {
                                          day: 'numeric', month: 'short', year: 'numeric'
                                       })}
                                    </td>

                                    <td>
                                       <div className='dash-row-actions'>
                                          <button
                                             className='dash-edit-btn'
                                             onClick={() => onEditOpen(opportunity)}
                                             title='Edit'
                                          >
                                             <FiEdit2 />
                                          </button>
                                          <button
                                             className='dash-delete-btn'
                                             onClick={() => onDelete(opportunity._id)}
                                             title='Delete'
                                          >
                                             <FiTrash2 />
                                          </button>
                                       </div>
                                    </td>

                                 </tr>
                              ))}
                           </tbody>
                        </table>
                        <Pagination currentPage={minePage} totalPages={mineTotalPages} onPageChange={setMinePage} />
                     </div>
                  ) : (
                     <div className='empty-state'>
                        <h2>No opportunities found</h2>
                        <p>
                           {filter === 'all'
                              ? 'Click "+ New Opportunity" to post your first one.'
                              : `No ${filter} opportunities posted yet.`}
                        </p>
                     </div>
                  )}
               </>
            )}

            {/* TAB: OTHERS' OPPORTUNITIES */}
            {activeTab === 'others' && (
               <>
                  <div className='dash-section-header' style={{ marginTop: '20px' }}>
                     <div /> {/* spacer */}
                     <div className='dash-section-actions'>
                        <select
                           className='dash-filter'
                           value={othersFilter}
                           onChange={(e) => { setOthersFilter(e.target.value); setOthersPage(1) }}
                        >
                           {categoryOptions}
                        </select>
                     </div>
                  </div>

                  {filteredOthers.length > 0 ? (
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
                              {pagedOthers.map((opportunity) => {
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
                                          >
                                             Apply
                                          </button>
                                       )}
                                    </td>

                                 </tr>
                                 )
                              })}
                           </tbody>
                        </table>
                        <Pagination currentPage={othersPage} totalPages={othersTotalPages} onPageChange={setOthersPage} />
                     </div>
                  ) : (
                     <div className='empty-state'>
                        <h2>No {oppositeLabel.toLowerCase()} opportunities yet</h2>
                        <p>Check back later for new posts.</p>
                     </div>
                  )}
               </>
            )}

         </div>

         {/* ROW TOOLTIP */}
         {tooltip && (
            <div
               className='row-tooltip-box'
               style={{ left: tooltip.x, top: tooltip.y - 40 }}
            >
               {tooltip.text}
            </div>
         )}

         {/* EDIT MODAL */}
         {editModalOpen && (
            <div className='modal-overlay' onClick={() => setEditModalOpen(false)}>
               <div className='modal' onClick={(e) => e.stopPropagation()}>

                  <div className='modal-header'>
                     <h2>Edit Opportunity</h2>
                     <button className='modal-close' onClick={() => setEditModalOpen(false)}>×</button>
                  </div>

                  <form onSubmit={onEditSubmit} className='dash-form'>
                     <input type='text' name='title' value={editFormData.title} placeholder='Opportunity title' onChange={onEditChange} required />
                     <textarea name='description' value={editFormData.description} placeholder='Describe the opportunity...' onChange={onEditChange} required />
                     <select name='category' value={editFormData.category} onChange={onEditChange} required>
                        <option value=''>Select Category</option>
                        {user?.role === 'student' && (<><option value='project'>Project</option><option value='competition'>Competition</option><option value='club'>Club</option></>)}
                        {user?.role === 'faculty' && (<><option value='research'>Research</option><option value='internship'>Internship</option><option value='event'>Event</option></>)}
                        <option value='hackathon'>Hackathon</option>
                        <option value='general'>General</option>
                     </select>
                     <input type='text' name='skills' value={editFormData.skills} placeholder='Required skills (comma separated, optional)' onChange={onEditChange} />
                     <button type='submit' className='btn btn-block'>Save Changes</button>
                  </form>

               </div>
            </div>
         )}

         {/* CREATE MODAL */}
         {modalOpen && (
            <div className='modal-overlay' onClick={() => setModalOpen(false)}>
               <div className='modal' onClick={(e) => e.stopPropagation()}>

                  <div className='modal-header'>
                     <h2>Post an Opportunity</h2>
                     <button className='modal-close' onClick={() => setModalOpen(false)}>×</button>
                  </div>

                  <form onSubmit={onSubmit} className='dash-form'>
                     <input type='text' name='title' value={title} placeholder='Opportunity title' onChange={onChange} required />
                     <textarea name='description' value={description} placeholder='Describe the opportunity...' onChange={onChange} required />
                     <select name='category' value={category} onChange={onChange} required>
                        <option value=''>Select Category</option>
                        {user?.role === 'student' && (<><option value='project'>Project</option><option value='competition'>Competition</option><option value='club'>Club</option></>)}
                        {user?.role === 'faculty' && (<><option value='research'>Research</option><option value='internship'>Internship</option><option value='event'>Event</option></>)}
                        <option value='hackathon'>Hackathon</option>
                        <option value='general'>General</option>
                     </select>
                     <input type='text' name='skills' value={skills} placeholder='Required skills (comma separated, optional)' onChange={onChange} />
                     <button type='submit' className='btn btn-block'>Post Opportunity</button>
                  </form>

               </div>
            </div>
         )}

      </div>

   )
}

export default Dashboard
