// Somewhat adapted from https://github.com/Taofiqq/nextjs-paginate/blob/main/src/components/Pagination.js

interface PaginationProps {
  items: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  items,
  pageSize,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const pagesCount = Math.ceil(items / pageSize);

  if (pagesCount === 1) return null;
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < pagesCount) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <>
      <div className="flex items-center border-t border-gray-200 bg-white px-4 py-3 md:mx-auto md:w-2/3">
        <div className="flex flex-1 justify-center space-x-5">
          <button
            disabled={currentPage === 1}
            onClick={handlePrevClick}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Prev
          </button>
          <button
            disabled={currentPage === pagesCount}
            onClick={handleNextClick}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-1">
       <span>Page</span> <span className="font-bold">{currentPage}</span> <span>of</span> <span className="font-bold">{pagesCount}</span>
      </div>
    </>
  );
};

export default Pagination;
