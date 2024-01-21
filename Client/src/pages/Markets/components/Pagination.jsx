import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount, onPageChange }) => (
  <ReactPaginate
    pageCount={pageCount}
    pageRangeDisplayed={2}
    marginPagesDisplayed={1}
    onPageChange={onPageChange}
    containerClassName="pagination justify-content-center"
    pageClassName="page-item"
    pageLinkClassName="page-link"
    activeClassName="active"
    previousClassName="page-item"
    previousLinkClassName="page-link"
    nextClassName="page-item"
    nextLinkClassName="page-link"
  />
);

export default Pagination;
