// Adapted from https://github.com/Taofiqq/nextjs-paginate/blob/main/src/components/Pagination.js

interface PaginationProps {
    items: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }

const Pagination = ({ items, pageSize, currentPage, onPageChange }: PaginationProps) => {
    const pagesCount = Math.ceil(items / pageSize); // 100/10
  
    if (pagesCount === 1) return null;
    const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);
  
    return (
      <div>
        <ul className={""}>
          {pages.map((page) => (
            <li
              key={page}
              className={
                page === currentPage ? "font-bold" : ""
              }
            >
              <a className={""} onClick={() => onPageChange(page)}>
                {page}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Pagination;