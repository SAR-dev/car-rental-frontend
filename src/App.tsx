import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Home from "./pages/Home";
import BookingSearch from "./pages/BookingSearch";
import BookingDetails from "./pages/BookingDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/bookings",
    element: <BookingSearch />,
  },
  {
    path: "/bookings/:id",
    element: <BookingDetails />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
