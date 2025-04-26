import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Home from "./pages/Home";
import BookingSearch from "./pages/BookingSearch";
import BookingDetails from "./pages/BookingDetails";
import SignIn from "./pages/SignIn";
import BookingReservation from "./pages/BookingReservation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/bookings",
    element: <BookingSearch />,
  },
  {
    path: "/bookings/:id",
    element: <BookingDetails />,
  },
  {
    path: "/bookings/:id/reservation",
    element: <BookingReservation />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
