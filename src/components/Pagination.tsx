interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className='pagination'>
      <button disabled={currentPage === 1} onClick={() => onPageChange(1)}>
        {'<<'}
      </button>
      <button disabled={currentPage === 1} onClick={handlePrevClick}>
        {'<'}
      </button>
      {pages.map((page) => (
        <button
          className='page-link'
          key={page}
          disabled={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button disabled={currentPage === totalPages} onClick={handleNextClick}>
        {'>'}
      </button>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        {'>>'}
      </button>
    </div>
  )
}
