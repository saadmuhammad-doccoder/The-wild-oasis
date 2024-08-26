import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient();
  // useSearchParams() hook for getting state from url
  const [searchParams] = useSearchParams();

  // Filter
  const filterValue = searchParams.get("status");

  // Variable for filtering the data, if it is all or doesnt exist store null else the status from the URL for filtering data according to the filter applied
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // Sort
  const sortByRaw = searchParams.get("sortBy") || "startDate-asc";

  // Destructuring the sortByRaw, extracting field and direction (asc or desc) from the raw string
  const [field, direction] = sortByRaw.split("-");

  // Assigning the field and direction as properties in object
  const sortBy = { field, direction };

  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // FETCHING
  // Destructuring the useQuery() hook of React Query which fetches the data from the server
  const {
    isLoading,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    // passing array of the bookings string, filter, and sortBy
    queryKey: ["bookings", filter, sortBy, page],
    // queryFn for fetching data by passing the same filter and sortBy
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);
  if (page < pageCount)
    queryClient.prefetchQuery({
      // passing array of the bookings string, filter, and sortBy
      queryKey: ["bookings", filter, sortBy, page + 1],
      // queryFn for fetching data by passing the same filter and sortBy
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      // passing array of the bookings string, filter, and sortBy
      queryKey: ["bookings", filter, sortBy, page - 1],
      // queryFn for fetching data by passing the same filter and sortBy
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });

  return { isLoading, bookings, error, count };
}
