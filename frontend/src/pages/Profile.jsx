import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FiUser, FiMail, FiBook, FiTag, FiX, FiSave, FiBriefcase, FiLayers } from 'react-icons/fi'
import { getProfile, updateProfile, resetProfile } from '../features/profile/profileSlice'

const BRANCHES    = ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Biotechnology', 'Other']
const YEARS       = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Biotechnology',
                     'Physics', 'Mathematics', 'Management', 'Other']

function Profile() {

   const dispatch = useDispatch()
   const { profile, isLoading, isSuccess, isError, message } = useSelector((s) => s.profile)
   const { user } = useSelector((s) => s.auth)

   /* ── local form state ── */
   const [name,       setName]       = useState('')
   const [branch,     setBranch]     = useState('')
   const [year,       setYear]       = useState('')
   const [department, setDepartment] = useState('')
   const [bio,        setBio]        = useState('')
   const [skills,     setSkills]     = useState([])
   const [subjects,   setSubjects]   = useState([])
   const [skillInput,   setSkillInput]   = useState('')
   const [subjectInput, setSubjectInput] = useState('')
   const skillRef   = useRef(null)
   const subjectRef = useRef(null)

   /* ── seed form from Redux when profile loads/updates ── */
   useEffect(() => {
      dispatch(getProfile())
   }, [dispatch])

   useEffect(() => {
      if (!profile) return
      setName(profile.name             || '')
      setBranch(profile.branch         || '')
      setYear(profile.year             || '')
      setDepartment(profile.department || '')
      setBio(profile.bio               || '')
      setSkills(Array.isArray(profile.skills)   ? profile.skills   : [])
      setSubjects(Array.isArray(profile.subjects) ? profile.subjects : [])
   }, [profile])

   /* ── toast feedback ── */
   useEffect(() => {
      if (isError)   toast.error(message)
      if (isSuccess) toast.success('Profile updated successfully!')
      if (isError || isSuccess) dispatch(resetProfile())
   }, [isError, isSuccess, message, dispatch])

   /* ── chip helpers ── */
   const addChip = (val, list, setList, setInput) => {
      const clean = val.trim().replace(/,$/, '')
      if (clean && !list.includes(clean)) setList(prev => [...prev, clean])
      setInput('')
   }

   const onSkillKey = (e) => {
      if (e.key === 'Enter' || e.key === ',') {
         e.preventDefault()
         addChip(skillInput, skills, setSkills, setSkillInput)
      }
   }

   const onSubjectKey = (e) => {
      if (e.key === 'Enter' || e.key === ',') {
         e.preventDefault()
         addChip(subjectInput, subjects, setSubjects, setSubjectInput)
      }
   }

   /* ── submit ── */
   const onSubmit = (e) => {
      e.preventDefault()

      // auto-confirm any pending chip text
      let finalSkills   = skills
      let finalSubjects = subjects

      if (skillInput.trim()) {
         const clean = skillInput.trim().replace(/,$/, '')
         if (clean && !skills.includes(clean)) {
            finalSkills = [...skills, clean]
            setSkills(finalSkills)
         }
         setSkillInput('')
      }

      if (subjectInput.trim()) {
         const clean = subjectInput.trim().replace(/,$/, '')
         if (clean && !subjects.includes(clean)) {
            finalSubjects = [...subjects, clean]
            setSubjects(finalSubjects)
         }
         setSubjectInput('')
      }

      // Only send fields relevant to the user's role to avoid cross-field conflicts
      const payload = { name, bio }

      if (isStudent) {
         payload.branch = branch
         payload.year   = year
         payload.skills = finalSkills
      }

      if (isFaculty) {
         payload.department = department
         payload.subjects   = finalSubjects
      }

      dispatch(updateProfile(payload))
   }

   const isStudent = user?.role === 'student'
   const isFaculty = user?.role === 'faculty'

   return (
      <div className='dashboard'>
         <div className='profile-grid'>

            {/* ── LEFT CARD ── */}
            <div className='profile-avatar-card'>

               {/* Identity */}
               <div className='profile-avatar-identity'>
                  <div className='profile-avatar-circle'>
                     {(name || user?.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <p className='profile-avatar-name'>{name || user?.name}</p>
                  <p className='profile-avatar-email'>{profile?.email || user?.email}</p>
                  <span className='role-badge profile-role-badge'>{user?.role}</span>
               </div>

               {/* Details section — only when there's something to show */}
               {isStudent && (branch || year || skills.length > 0) && (
                  <div className='profile-avatar-details'>
                     {(branch || year) && (
                        <div className='profile-avatar-detail-item'>
                           <span className='profile-avatar-detail-label'>Branch &amp; Year</span>
                           <span className='profile-avatar-detail-value'>
                              {branch || '—'}{year ? `  ·  ${year}` : ''}
                           </span>
                        </div>
                     )}
                     {skills.length > 0 && (
                        <div className='profile-avatar-detail-item'>
                           <span className='profile-avatar-detail-label'>Skills</span>
                           <div className='profile-avatar-chips'>
                              {skills.map((s, i) => (
                                 <span key={i} className='skill-tag'>{s}</span>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               )}

               {isFaculty && (department || subjects.length > 0) && (
                  <div className='profile-avatar-details'>
                     {department && (
                        <div className='profile-avatar-detail-item'>
                           <span className='profile-avatar-detail-label'>Department</span>
                           <span className='profile-avatar-detail-value'>{department}</span>
                        </div>
                     )}
                     {subjects.length > 0 && (
                        <div className='profile-avatar-detail-item'>
                           <span className='profile-avatar-detail-label'>Subjects</span>
                           <div className='profile-avatar-chips'>
                              {subjects.map((s, i) => (
                                 <span key={i} className='skill-tag profile-subject-tag'>{s}</span>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               )}

            </div>

            {/* ── RIGHT FORM ── */}
            <div className='profile-form-card'>
               <h2 className='dash-section-title'>Edit Profile</h2>

               <form onSubmit={onSubmit} className='profile-form'>

                  {/* ROW 1 — Name + Email (all users) */}
                  <div className='profile-field-row'>
                     <div className='profile-field'>
                        <label className='profile-field-label'>
                           <FiUser size={13} /> Full Name
                        </label>
                        <input
                           className='profile-input'
                           type='text'
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           placeholder='Your full name'
                        />
                     </div>
                     <div className='profile-field'>
                        <label className='profile-field-label'>
                           <FiMail size={13} /> Email
                        </label>
                        <input
                           className='profile-input profile-input--readonly'
                           type='text'
                           value={profile?.email || user?.email || ''}
                           readOnly
                           tabIndex={-1}
                        />
                     </div>
                  </div>

                  {/* ROW 2 — Branch + Year (students) */}
                  {isStudent && (
                     <div className='profile-field-row'>
                        <div className='profile-field'>
                           <label className='profile-field-label'>
                              <FiBook size={13} /> Branch
                           </label>
                           <select
                              className='profile-select'
                              value={branch}
                              onChange={(e) => setBranch(e.target.value)}
                           >
                              <option value=''>Select Branch</option>
                              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                           </select>
                        </div>
                        <div className='profile-field'>
                           <label className='profile-field-label'>
                              <FiBook size={13} /> Year
                           </label>
                           <select
                              className='profile-select'
                              value={year}
                              onChange={(e) => setYear(e.target.value)}
                           >
                              <option value=''>Select Year</option>
                              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                           </select>
                        </div>
                     </div>
                  )}

                  {/* ROW 2 — Department (faculty) */}
                  {isFaculty && (
                     <div className='profile-field'>
                        <label className='profile-field-label'>
                           <FiBriefcase size={13} /> Department
                        </label>
                        <select
                           className='profile-select'
                           value={department}
                           onChange={(e) => setDepartment(e.target.value)}
                        >
                           <option value=''>Select Department</option>
                           {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                     </div>
                  )}

                  {/* Skills — students only */}
                  {isStudent && (
                     <div className='profile-field'>
                        <label className='profile-field-label'>
                           <FiTag size={13} /> Skills
                           <span className='profile-field-hint'>Press Enter or , to add</span>
                        </label>
                        <div
                           className='profile-chip-wrap'
                           onClick={() => skillRef.current?.focus()}
                        >
                           {skills.map((s, i) => (
                              <span key={i} className='profile-chip'>
                                 {s}
                                 <button type='button' onClick={() => setSkills(prev => prev.filter(x => x !== s))}>
                                    <FiX size={11} />
                                 </button>
                              </span>
                           ))}
                           <input
                              ref={skillRef}
                              className='profile-chip-input'
                              type='text'
                              placeholder={skills.length === 0 ? 'e.g. Python, React…' : ''}
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={onSkillKey}
                           />
                        </div>
                     </div>
                  )}

                  {/* Subjects — faculty only */}
                  {isFaculty && (
                     <div className='profile-field'>
                        <label className='profile-field-label'>
                           <FiLayers size={13} /> Subjects
                           <span className='profile-field-hint'>Press Enter or , to add</span>
                        </label>
                        <div
                           className='profile-chip-wrap'
                           onClick={() => subjectRef.current?.focus()}
                        >
                           {subjects.map((s, i) => (
                              <span key={i} className='profile-chip profile-chip--faculty'>
                                 {s}
                                 <button type='button' onClick={() => setSubjects(prev => prev.filter(x => x !== s))}>
                                    <FiX size={11} />
                                 </button>
                              </span>
                           ))}
                           <input
                              ref={subjectRef}
                              className='profile-chip-input'
                              type='text'
                              placeholder={subjects.length === 0 ? 'e.g. Data Structures, DBMS…' : ''}
                              value={subjectInput}
                              onChange={(e) => setSubjectInput(e.target.value)}
                              onKeyDown={onSubjectKey}
                           />
                        </div>
                     </div>
                  )}

                  {/* Bio — all users */}
                  <div className='profile-field'>
                     <label className='profile-field-label'>Bio</label>
                     <textarea
                        className='profile-textarea'
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        placeholder='A short intro about yourself…'
                     />
                  </div>

                  <button
                     type='submit'
                     className='btn'
                     disabled={isLoading}
                     style={{ alignSelf: 'flex-start' }}
                  >
                     <FiSave style={{ marginRight: 6 }} />
                     {isLoading ? 'Saving…' : 'Save Profile'}
                  </button>

               </form>
            </div>

         </div>
      </div>
   )
}

export default Profile
