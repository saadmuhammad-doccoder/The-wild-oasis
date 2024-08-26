// IMPORTS RELATED WITH THIRD-PARTY-LIBRARIES
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

// IMPORTS RELATED WITH STYLES
import GlobalStyles from "./styles/GlobalStyles";

// IMPORTS RELATED WITH PAGES
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";

// IMPORTS RELATED WITH COMPONENTS
import AppLayout from "./ui/AppLayout";
import Booking from "./pages/Booking";
import Checkin from "./pages/Checkin";
import ProtectedRoute from "./ui/ProtectedRoute";
import DarkModeProvider from "./context/DarkModeContext";

// new QueryClient({}) created with React Query and the stale time or re-fetch time is set to 0 to keep the UI updated with server state.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

// App Component
function App() {
  return (
    <DarkModeProvider>
      {/* QueryClientProvider for providing the fetched data to the Component
      Tree by passing query client to the client. */}
      <QueryClientProvider client={queryClient}>
        {/* ReactQueryDevtools Component for managing the state of the app with the server state (remote state) */}
        <ReactQueryDevtools initialIsOpen={false} />

        {/* Global Styles Component used to provide all styles to every component and html element */}
        <GlobalStyles />

        {/* BrowserRouter Component of REACT-ROUTER-DOM used to provide routes to different pages of the webapp without refreshing the state of the app.*/}
        <BrowserRouter>
          {/* Routes component to which all routes are passed as children to enable navigation through the app */}
          <Routes>
            {/* Route which has the element App Layout which creates the layout of the SPA */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Default route to the dashboard after logging in */}
              <Route index element={<Navigate replace to="dashboard" />} />

              {/* Route Component with path to dashboard page */}
              <Route path="dashboard" element={<Dashboard />} />
              {/* Route Component with path to Bookings page  */}
              <Route path="bookings" element={<Bookings />} />
              {/* Route Component with path to Booking Details page  */}
              <Route path="bookings/:bookingId" element={<Booking />} />
              {/* Route Component with path to Check-in page  */}
              <Route path="checkin/:bookingId" element={<Checkin />} />
              {/* Route Component with path to cabins page  */}
              <Route path="cabins" element={<Cabins />} />
              {/* Route Component with path to users page  */}
              <Route path="Users" element={<Users />} />
              {/* Route Component with path to settings page  */}
              <Route path="settings" element={<Settings />} />
              {/* Route Component with path to account page  */}
              <Route path="account" element={<Account />} />
            </Route>

            {/* Route Component with path to login page */}
            <Route path="login" element={<Login />} />

            {/* Route component for filtering all the pages that arent defined above in the list, and will show a page with 404 ERROR */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>

        {/* Toaster Component provided to entire Webapp for showing notifications, with prop position to position the notification pop-up or toast, with gutter prop set to 12 to maintain 12px gap between each notification, and object of toastOptions to configure the toast. */}
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-500)",
            },
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
