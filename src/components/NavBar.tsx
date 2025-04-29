import { MdMailOutline } from "react-icons/md";
import { CiPhone } from "react-icons/ci";
import { FiShoppingBag } from "react-icons/fi";
import { BsPersonCircle } from "react-icons/bs";
import { RiFacebookCircleLine } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa6";
import { Link, useLocation } from "react-router";
import { usePocket } from "../contexts/PocketContext";

function NavBar() {
    const location = useLocation()
    const { user } = usePocket()

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
                        <button className="btn btn-ghost btn-circle">
                            <FiShoppingBag className="size-6" />
                        </button>
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
                            <Link to="/profile" className="btn btn-neutral">{user.firstName + " " + user.lastName}</Link>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full border-b border-base-content/15">
                <div className="container py-5 px-10 mx-auto flex justify-between items-center">
                    <img className="h-10" src="https://www.patricklocation.ch/img/structure/logo.svg" alt="" />
                    <div className="flex gap-5">
                        <Link to="/" className="btn btn-ghost">Home</Link>
                        <Link to="/bookings" className="btn btn-ghost">Rentals</Link>
                        <button className="btn btn-ghost">Vehicle Types</button>
                        <button className="btn btn-ghost">Garage</button>
                        <button className="btn btn-ghost">Blog</button>
                        <button className="btn btn-ghost">Contact</button>
                        <button className="btn btn-primary">Book</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar