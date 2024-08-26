import { useSearchParams } from "react-router-dom";
import Select from "./Select";
import PropTypes from "prop-types";

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortby = searchParams.get("sortBy") || "";

  function handleChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      onChange={handleChange}
      value={sortby}
      options={options}
      type={"white"}
    />
  );
}

SortBy.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SortBy;
