import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../utils/constants";

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;

  & span {
    font-weight: 600;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.active ? " var(--color-brand-600)" : "var(--color-grey-50)"};
  color: ${(props) => (props.active ? " var(--color-brand-50)" : "inherit")};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

// Pagination Component
function Pagination({ count }) {
  // useSearchParams() hook for getting and setting state vars in the URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Variable for getting the page number from the URL, if the page=0, it will return only 1, else it will get the value from the URL and change its type from string to NUMBER for further operations
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  // Variable for creating the number of pages dividing *count* by the PAGE_SIZE
  const pageCount = Math.ceil(count / PAGE_SIZE);

  // function for handling the next page opening button
  function nextPage() {
    // Variable for storing the *currentPage* for updating the UI, if the *currentPage* === *pageCount* store *currentPage* else (currentpage + 1)
    const next = currentPage === pageCount ? currentPage : currentPage + 1;

    // Setting the variable, to keep it updated with the current state of the page
    searchParams.set("page", next);

    // Setting the *searchParams* by passing it to the setSearchParams()
    setSearchParams(searchParams);
  }

  // function for handling the prev page opening button
  function prevPage() {
    // Variable for storing the *currentPage* for updating the UI, if the *currentPage* === *1* store *currentPage* else (currentpage - 1)
    const prev = currentPage === 1 ? currentPage : currentPage - 1;

    // Setting the variable, to keep it updated with the current state of the page
    searchParams.set("page", prev);

    // Setting the *searchParams* by passing it to the setSearchParams()
    setSearchParams(searchParams);
  }

  // if *pageCount* <= 1 return null
  if (pageCount <= 1) return null;

  return (
    <StyledPagination>
      <P>
        {/* <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> */}
        {/* This element displays the starting value of currentPage */}
        {/* ///////////////////////////////////////////////////////// */}
        {/* {currentPage === pageCount ? count : currentPage * PAGE_SIZE} */}
        {/* This element displays the ending value of currentPage */}
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{" "}
        of <span>{count}</span> results
      </P>
      <Buttons>
        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
          <HiChevronLeft /> <span>Previous</span>
        </PaginationButton>
        <PaginationButton
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          <span>Next</span> <HiChevronRight />
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}

// Props of Pagination
Pagination.propTypes = {
  count: PropTypes.number.isRequired,
};

export default Pagination;
