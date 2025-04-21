import { formatDateToDMY } from "../helpers/date";
import Testimonial from "../components/Testimonial";
import NavLayout from "../layouts/NavLayout";
import useLocalStorage from "use-local-storage";
import { AgenciesRecord, Collections, VehicleTypesRecord } from "../types/pocketbase";
import { constants } from "../constants";
import { useEffect, useState } from "react";
import { pb } from "../contexts/PocketContext";
import { useNavigate } from "react-router";

function Home() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        vehicleTypeId: "",
        agencyId: "",
        startDate: formatDateToDMY(new Date(new Date().setDate(new Date().getDate() + 1))),
        startTime: "09:00",
        endDate: formatDateToDMY(new Date(new Date().setDate(new Date().getDate() + 2))),
        endTime: "09:00",
    })

    const [vehicleTypes, setVehicleTypes] = useLocalStorage<VehicleTypesRecord[]>(constants.VEHICLE_TYPES_STORE_KEY, [])
    const [agencies, setAgencies] = useLocalStorage<AgenciesRecord[]>(constants.AGENCIES_STORE_KEY, [])

    useEffect(() => {
        pb.collection(Collections.VehicleTypes).getFullList().then(res => setVehicleTypes(res))
        pb.collection(Collections.Agencies).getFullList().then(res => setAgencies(res))
    }, [])

    const handleSearch = () => {
        const params = new URLSearchParams(formData).toString();
        navigate(`/bookings?${params}`)
    }

    return (
        <NavLayout>
            <div className="grid grid-cols-1">
                <div className="w-full h-[35rem] bg-[url(https://wallpapercave.com/wp/wp12988678.jpg)] bg-center bg-no-repeat bg-cover">
                    <div className="container px-10 mx-auto grid grid-cols-2 gap-10 h-full">
                        <div className="flex flex-col gap-5 justify-center">
                            <div className="text-5xl text-white font-bold tracking-wide leading-14">
                                Patrick Location: Your Trusted Choice for Car and Utility Vehicle Rentals in Switzerland
                            </div>
                            <div className="text-white text-lg font-semibold">
                                Discover the ease and flexibility of renting vehicles with Patrick Location. Whether you need a car for a day, a week or more, we have the perfect vehicle to meet your needs in Suisse Romande.
                            </div>
                            <div>
                                <button className="btn btn-primary btn-lg text-white w-24">
                                    Book
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-end items-end">
                            <div className="px-10 py-10 rounded-t bg-primary w-[25rem]">
                                <div className="flex flex-col gap-5">
                                    <div className="text-2xl text-center font-semibold text-white">Rent a car now</div>
                                    <select
                                        value={formData.vehicleTypeId}
                                        onChange={e => setFormData({ ...formData, vehicleTypeId: e.target.value })}
                                        className="select"
                                    >
                                        <option value="" disabled={true}>Vehicle Type</option>
                                        {vehicleTypes.map(e => (
                                            <option key={e.id} value={e.id}>{e.title}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={formData.agencyId}
                                        onChange={e => setFormData({ ...formData, agencyId: e.target.value })}
                                        className="select"
                                    >
                                        <option value="" disabled={true}>Agency</option>
                                        {agencies.map(e => (
                                            <option key={e.id} value={e.id}>{e.name}</option>
                                        ))}
                                    </select>
                                    <div className="grid grid-cols-2 gap-5">
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={e =>
                                                !isNaN(Date.parse(e.target.value)) &&
                                                setFormData({ ...formData, startDate: e.target.value })
                                            }
                                            className="input"
                                        />
                                        <input
                                            type="time"
                                            value={formData.startTime}
                                            onChange={e =>
                                                constants.TIME_FORMAT.test(e.target.value) &&
                                                setFormData({ ...formData, startTime: e.target.value })
                                            }
                                            className="input"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={e =>
                                                !isNaN(Date.parse(e.target.value)) &&
                                                setFormData({ ...formData, endDate: e.target.value })
                                            }
                                            className="input"
                                        />
                                        <input
                                            type="time"
                                            value={formData.endTime}
                                            onChange={e =>
                                                constants.TIME_FORMAT.test(e.target.value) &&
                                                setFormData({ ...formData, endTime: e.target.value })
                                            }
                                            className="input"
                                        />
                                    </div>
                                    <button className="btn" onClick={handleSearch}>Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-16 container px-10 mx-auto">
                    <div className="h-[30rem] w-full relative">
                        <img src="https://images.pexels.com/photos/70912/pexels-photo-70912.jpeg" className="absolute top-0 left-0 z-[-1] h-full [40rem] w-full object-cover" />
                        <div className="absolute top-0 left-0 h-full w-full bg-black/50 flex flex-col justify-center">
                            <div className="text-4xl text-white text-center">Special offers for long-term rentals</div>
                            <div className="max-w-[50rem] text-white mx-auto my-10 text-center text-xl">
                                Enjoy our advantageous rates for long-term rentals. Perfect for both businesses and individuals, these offers are ideal for extended needs without the cost of purchasing a vehicle. We offer flexible terms and competitive prices for our long-term clients.
                            </div>
                            <button className="btn btn-primary w-24 mx-auto">
                                Book
                            </button>
                        </div>
                    </div>
                </div>
                <div className="py-16">
                    <div className="container px-10 mx-auto">
                        <div className="text-5xl text-center font-semibold">
                            Customer testimonials
                        </div>
                        <div className="max-w-[60rem] px-5 text-center mx-auto mt-5 mb-10">
                            Discover what our customers say about us. At Patrick Location, we are committed to providing exceptional service and quality vehicles. Read the reviews to find out why our customers trust us for their rental needs.
                        </div>
                        <div className="carousel carousel-center space-x-5">
                            {[...Array(10)].map((_, i) => <Testimonial key={i} />)}
                        </div>
                    </div>
                </div>
                <div className="py-16 bg-base-200 border-y border-base-content/15">
                    <div className="container px-10 mx-auto">
                        <div className="text-5xl font-semibold mb-5">
                            FAQs
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            {[...Array(20)].map((_, i) => (
                                <div className="collapse collapse-plus bg-base-100 border border-base-content/15" key={i}>
                                    <input type="radio" />
                                    <div className="collapse-title font-semibold">How do I create an account?</div>
                                    <div className="collapse-content text-sm">Click the "Sign Up" button in the top right corner and follow the registration process.</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="py-16 bg-teal-700">
                    <div className="container px-10 mx-auto">
                        <div className="grid grid-cols-5 gap-10">
                            <img
                                className="h-full w-full object-cover rounded-xl col-span-2"
                                src="https://c1.wallpaperflare.com/preview/430/293/144/contact-us-contact-e-mail-communication.jpg" alt=""
                            />
                            <div className="col-span-3 rounded-xl bg-black/50 text-white p-10">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="col-span-2 text-4xl font-semibold">
                                        Contact
                                    </div>
                                    <div className="col-span-2">
                                        At Patrick Location, we are attentive to any request or question. Fill out the form below with your details and your message, and our team will respond as soon as possible. Whether it's a question about our car and utility vehicle rental services, a specific request, or assistance, we are here to help.
                                    </div>
                                    <input type="text" className="input bg-transparent border-white w-full" placeholder="Agency Name" />
                                    <input type="text" className="input bg-transparent border-white w-full" placeholder="Your Name" />
                                    <input type="text" className="input bg-transparent border-white w-full" placeholder="Your Email" />
                                    <input type="text" className="input bg-transparent border-white w-full" placeholder="Phone" />
                                    <textarea className="textarea col-span-2 w-full bg-transparent border-white h-48" placeholder="Your Message" />
                                    <button className="btn col-span-2">Send Message</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NavLayout>
    )
}

export default Home