import { MdMailOutline } from "react-icons/md";
import { CiPhone } from "react-icons/ci";
import { FiShoppingBag } from "react-icons/fi";
import { BsPersonCircle } from "react-icons/bs";
import { RiFacebookCircleLine } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa6";
import { Link, useLocation } from "react-router";
import { usePocket } from "../contexts/PocketContext";
import { useCartStore } from "../stores/cartStore";
import Logo from "../files/logo.png"

function NavBar() {
    const location = useLocation()
    const { user, logOut } = usePocket()
    const { products } = useCartStore()

    return (
        <>
            <div className="w-full border-b border-base-content/15">
                <div className="container py-5 px-10 mx-auto grid grid-cols-3">
                    <div className="flex gap-3 items-center">
                        <div className="p-1 rounded-full border border-base-content">
                            <MdMailOutline className='size-4' />
                        </div>
                        <div className="font-semibold">Contact Us</div>
                    </div>
                    <div className="flex gap-3 items-center justify-center">
                        <div className="p-1 rounded-full border border-base-content">
                            <CiPhone className='size-4' />
                        </div>
                        <div className="font-semibold">+41 (0) 848 000 849</div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Link to="/cart" className="btn btn-ghost btn-circle relative">
                            <FiShoppingBag className="size-6" />
                            <div className="absolute top-0 right-0 h-6 w-6 bg-info flex justify-center items-center text-white rounded-full -m-2">{products.length}</div>
                        </Link>
                        {!user && (
                            <Link to={"/sign-in?next=" + location.pathname + location.search} className="btn btn-ghost btn-circle">
                                <BsPersonCircle className="size-6" />
                            </Link>
                        )}
                        <button className="btn btn-ghost btn-circle">
                            <RiFacebookCircleLine className="size-6 text-blue-500" />
                        </button>
                        <button className="btn btn-ghost btn-circle">
                            <FaInstagram className="size-6 text-pink-500" />
                        </button>
                        {!!user && (
                            <>
                            <Link to="/profile" className="btn btn-neutral">{user.firstName + " " + user.lastName}</Link>
                            <button className="btn" onClick={logOut}>Sign Out</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full border-b border-base-content/15">
                <div className="container py-5 px-10 mx-auto flex justify-between items-center">
                    <Link to="https://locationvictor.com/">
                    <img className="h-10" src={Logo} alt="" />
                    </Link>
                    <div className="flex gap-5">
                        <Link to="/" className="btn btn-ghost">Home</Link>
                        <Link to="/bookings" className="btn btn-ghost">Rentals</Link>
                        <Link to="/products" className="btn btn-ghost">Products</Link>
                        <Link to="/bookings" className="btn btn-primary">Book</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar