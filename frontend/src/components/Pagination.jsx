import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function Pagination({ currentPage, totalPages, onPageChange }) {

   if (totalPages <= 1) return null

   const getPages = () => {
      if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

      if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
      if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
      return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
   }

   return (
      <div className='pagination'>

         <button
            className='pagination-btn'
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
         >
            <FiChevronLeft />
         </button>

         {getPages().map((page, i) =>
            page === '...' ? (
               <span key={`ellipsis-${i}`} className='pagination-ellipsis'>…</span>
            ) : (
               <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'pagination-btn--active' : ''}`}
                  onClick={() => onPageChange(page)}
               >
                  {page}
               </button>
            )
         )}

         <button
            className='pagination-btn'
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
         >
            <FiChevronRight />
         </button>

      </div>
   )
}

export default Pagination
