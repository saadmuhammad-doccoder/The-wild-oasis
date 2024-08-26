import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

// REUSABLE TABLE COMPONENT

// Creating the context
const TableContext = createContext();

// Table Component
function Table({ columns, children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

// Props of Table component
Table.propTypes = {
  children: PropTypes.node,
  columns: PropTypes.string.isRequired,
};

// Header Component
function Header({ children }) {
  // Using the columns from the TableContext
  const { columns } = useContext(TableContext);
  return (
    <StyledHeader role="row" columns={columns} as={"header"}>
      {children}
    </StyledHeader>
  );
}

// Props of Header Component
Header.propTypes = {
  children: PropTypes.node,
};

// Row Component
function Row({ children }) {
  // Using the columns from the TableContext
  const { columns } = useContext(TableContext);
  return (
    <StyledRow role="row" columns={columns}>
      {children}
    </StyledRow>
  );
}

// Props of Row Component
Row.propTypes = {
  children: PropTypes.node,
};

// Body Component
function Body({ data, render }) {
  // if length of data is 0 or doesnt exist it will return Empty Component
  if (!data.length) return <Empty>No data to show at the moment</Empty>;

  // else return StyledBody with data
  return <StyledBody>{data.map(render)}</StyledBody>;
}

// Props of Body
Body.propTypes = {
  data: PropTypes.array,
  render: PropTypes.func,
};

//Setting Properties for Table Component
Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
