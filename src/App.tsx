import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Home from "./pages/Home";
import BookingSearch from "./pages/BookingSearch";
import BookingDetails from "./pages/BookingDetails";
import SignIn from "./pages/SignIn";
import BookingReservation from "./pages/BookingReservation";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";

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
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/products/:id",
    element: <ProductDetails />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
