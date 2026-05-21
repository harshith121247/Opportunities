import { useState, useRef, useEffect } from 'react'
import { FiChevronDown, FiCheck } from 'react-icons/fi'

function MultiSelect({ label, options, selected, onChange, placeholder }) {

   const [open, setOpen] = useState(false)
   const ref = useRef(null)

   // Close on outside click
   useEffect(() => {
      const handler = (e) => {
         if (ref.current && !ref.current.contains(e.target)) setOpen(false)
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
   }, [])

   const toggle = (val) => {
      onChange(
         selected.includes(val)
            ? selected.filter((v) => v !== val)
            : [...selected, val]
      )
   }

   const displayLabel =
      selected.length === 0
         ? placeholder
         : selected.length === 1
            ? options.find((o) => o.value === selected[0])?.label
            : `${selected.length} selected`

   return (
      <div className='ms-wrap' ref={ref}>
         <button
            className={`ms-trigger ${open ? 'ms-trigger--open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            type='button'
         >
            <span className={`ms-trigger-label ${selected.length > 0 ? 'ms-trigger-label--active' : ''}`}>
               {displayLabel}
            </span>
            <FiChevronDown className={`ms-chevron ${open ? 'ms-chevron--up' : ''}`} />
         </button>

         {open && (
            <div className='ms-dropdown'>
               {options.map((opt) => {
                  const isSelected = selected.includes(opt.value)
                  return (
                     <button
                        key={opt.value}
                        className={`ms-option ${isSelected ? 'ms-option--selected' : ''}`}
                        onClick={() => toggle(opt.value)}
                        type='button'
                     >
                        <span className={`ms-checkbox ${isSelected ? 'ms-checkbox--checked' : ''}`}>
                           {isSelected && <FiCheck size={10} />}
                        </span>
                        {opt.label}
                     </button>
                  )
               })}
               {selected.length > 0 && (
                  <button className='ms-clear' onClick={() => onChange([])} type='button'>
                     Clear
                  </button>
               )}
            </div>
         )}
      </div>
   )
}

export default MultiSelect
