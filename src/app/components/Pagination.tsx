'use client'

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded disabled:opacity-50 cursor-pointer"
      >
        First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded disabled:opacity-50 cursor-pointer"
      >
        Prev
      </button>
      <span className="text-sm text-white px-4">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded disabled:opacity-50 cursor-pointer"
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded disabled:opacity-50 cursor-pointer"
      >
        Last
      </button>
    </div>
  )
}
