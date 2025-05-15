import { FiShoppingBag } from "react-icons/fi";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useLocation } from "react-router";
import { usePocket } from "../contexts/PocketContext";
import { useCartStore } from "../stores/cartStore";
import Logo from "../files/logo.png"
import { FaCalendarAlt, FaPhoneAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";

function NavBar() {
    const location = useLocation()
    const { user, logOut } = usePocket()
    const { products } = useCartStore()

    return (
        <>
            <div className="w-full text-base-100 h-[75px] flex-shrink-0" style={{ background: "#141617" }}>
                <div className="container px-10 mx-auto flex h-full justify-between items-center">
                    <div className="flex gap-2 items-center text-[16px]">
                        <div className="size-8 bg-primary text-black flex justify-center items-center rounded-full">
                            <FaPhoneAlt className="size-4" />
                        </div>
                        +41 79 590 12 34
                    </div>
                    <div className="flex gap-2 items-center text-[16px]">
                        <div className="size-8 bg-primary text-black flex justify-center items-center rounded-full">
                            <MdMail className="size-4" />
                        </div>
                        info@location-victor.ch
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
                        {!!user && (
                            <>
                                <Link to="/profile" className="btn btn-outline text-lg">{user.firstName + " " + user.lastName}</Link>
                                <button className="btn text-lg" onClick={logOut}>Sign Out</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full text-base-100 h-[115px] flex-shrink-0" style={{ background: "#212326" }}>
                <div className="container h-full px-10 mx-auto flex justify-between items-center">
                    <Link to="https://locationvictor.com/">
                        <img className="h-[75px]" src={Logo} alt="" />
                    </Link>
                    <div className="gap-5 hidden md:flex">
                        <Link to="/" className="btn btn-ghost text-[16px]">Accueil</Link>
                        <Link to="/bookings" className="btn btn-ghost text-[16px]">Louer un véhicule</Link>
                        <Link to="/products" className="btn btn-ghost text-[16px]">Produits</Link>
                        <Link to="https://locationvictor.com/notre-histoire/" className="btn btn-ghost text-[16px]">Notre histoire</Link>
                        <Link to="https://locationvictor.com/contact/" className="btn btn-ghost text-[16px]">Contact</Link>
                        <Link to="/bookings" className="btn btn-primary text-[16px]">
                            <FaCalendarAlt className="size-4" />
                            <div className="h-full w-[1px] bg-black mx-1"></div>
                            Nos Véhicules
                        </Link>
                    </div>
                </div>
                <div className="flex py-5 px-16 justify-between w-full border-t border-base-300 md:hidden">
                    <Link to="/" className="btn btn-ghost">Accueil</Link>
                    <Link to="/products" className="btn btn-ghost">Produits</Link>
                    <Link to="/bookings" className="btn btn-primary">Louer un véhicule</Link>
                </div>
            </div>
        </>
    )
}

export default NavBar