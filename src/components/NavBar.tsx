import { FiShoppingBag } from "react-icons/fi";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useLocation } from "react-router";
import { usePocket } from "../contexts/PocketContext";
import { useCartStore } from "../stores/cartStore";
import Logo from "../files/logo.png"
import { FaCalendarAlt, FaPhoneAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { RiMenuLine } from "react-icons/ri";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

function NavBar() {
    const location = useLocation()
    const { user, logOut } = usePocket()
    const { products } = useCartStore()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className="w-full text-base-100 h-[75px] flex-shrink-0 hidden lg:flex" style={{ background: "#141617" }}>
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
            <div className="w-full text-base-100 h-[115px] flex-shrink-0 hidden lg:flex" style={{ background: "#212326" }}>
                <div className="container h-full px-10 mx-auto flex justify-between items-center">
                    <Link to="https://locationvictor.com/">
                        <img className="h-[75px]" src={Logo} alt="" />
                    </Link>
                    <div className="gap-5 hidden md:flex">
                        <Link to="/" className="btn btn-ghost text-[16px]">Accueil</Link>
                        <Link to="/bookings" className="btn btn-ghost text-[16px]">Louer un véhicule</Link>
                        <Link to="/products" className="btn btn-ghost text-[16px]">Produits</Link>
                        <Link to="https://locationvictor.com/notre-histoire/" className="btn btn-ghost text-[16px]">Notre histoire</Link>
                        <Link to="https://locationvictor.com/contact/" className="btn btn-ghost text-[16px]">Contactez nous</Link>
                        <Link to="/bookings" className="btn btn-primary text-[16px]">
                            <FaCalendarAlt className="size-4" />
                            <div className="h-full w-[1px] bg-black mx-1"></div>
                            Nos Véhicules
                        </Link>
                    </div>
                </div>
            </div>
            <div className="w-full text-base-100 h-[115px] flex-shrink-0 flex lg:hidden relative" style={{ background: "#212326" }}>
                <div className="container h-full px-5 mx-auto flex justify-between items-center">
                    <Link to="https://locationvictor.com/">
                        <img className="h-[75px]" src={Logo} alt="" />
                    </Link>
                    <button className="w-[60px] h-[44px] bg-[#3b3b3b] text-[#fbe98c] flex justify-center items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <AiOutlineClose className="size-7" /> : <RiMenuLine className="size-7" />}
                    </button>
                </div>
                {isOpen && (
                    <div className="absolute bottom-0 left-0 w-full flex flex-col divide-y divide-[#141617] -mb-[18.5rem] bg-black">
                        <Link to="/" className="flex h-[50px] bg-[#141617] hover:bg-[#141617] text-lg font-semibold items-center px-8">Accueil</Link>
                        <Link to="/bookings" className="flex h-[50px] bg-[#212326] hover:bg-[#141617] text-lg font-semibold items-center px-8">Louer un véhicule</Link>
                        <Link to="/products" className="flex h-[50px] bg-[#212326] hover:bg-[#141617] text-lg font-semibold items-center px-8">Produits</Link>
                        <Link to="https://locationvictor.com/notre-histoire/" className="flex h-[50px] bg-[#212326] hover:bg-[#141617] text-lg font-semibold items-center px-8">Notre histoire</Link>
                        <Link to="https://locationvictor.com/contact/" className="flex h-[50px] bg-[#212326] hover:bg-[#141617] text-lg font-semibold items-center px-8">Contactez nous</Link>
                        <Link to="/bookings" className="flex h-[50px] bg-[#212326] hover:bg-[#141617] text-lg font-semibold items-center px-8">Nos Véhicules</Link>
                    </div>
                )}
            </div>
        </>
    )
}

export default NavBar