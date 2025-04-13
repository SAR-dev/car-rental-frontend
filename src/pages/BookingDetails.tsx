import { useState } from 'react'
import NavLayout from '../layouts/NavLayout'
import { BsGear } from "react-icons/bs";
import { GiOilySpiral } from "react-icons/gi";
import { BsDoorOpen } from "react-icons/bs";
import { BsPersonLinesFill } from "react-icons/bs";
import CollapseForm from '../components/CollapseForm';
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";

const images = [
    "https://cdn.pixabay.com/photo/2012/04/12/23/47/car-30984_1280.png",
    "https://cdn.pixabay.com/photo/2012/04/12/23/48/car-30990_640.png",
    "https://www.mbusa.com/content/dam/mb-nafta/us/myco/my24/amg-gt-class/2-door/all-vehicles/2024-AMG-GT55-COUPE-AVP-DR.png",
    "https://gvelondon.com/wp-content/uploads/2023/07/veyron-super-sport-300-bugatti.png"
]

function BookingDetails() {
    const [activeImage, setActiveImage] = useState(images[0])
    return (
        <NavLayout>
            <div className='py-16 px-5 container mx-auto'>
                <div className="grid grid-cols-2 gap-10">
                    <div className="w-full flex flex-col gap-5">
                        <div className="bg-base-200 rounded w-full h-[35rem] flex items-center justify-center">
                            <img className='object-contain' src={activeImage} />
                        </div>
                        <div className="flex gap-3 mx-auto">
                            {images.map((img, i) => (
                                <button className='h-20 w-32 p-2 rounded border border-base-300 hover:shadow hover:ring-2 hover:ring-primary ring-offset-4 cursor-pointer' onClick={() => setActiveImage(img)} key={i}>
                                    <img className='object-contain' src={img} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-10">
                        <div className='text-4xl font-semibold'>Class B, manual</div>
                        <div className="flex gap-5 w-fit">
                            <div className="flex flex-col items-center gap-1">
                                <BsGear className="size-8 text-accent" />
                                <div className="text-sm">Manual</div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <GiOilySpiral className="size-8 text-accent" />
                                <div className="text-sm">Diesel</div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <BsDoorOpen className="size-8 text-accent" />
                                <div className="text-sm">3 Doors</div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <BsPersonLinesFill className="size-8 text-accent" />
                                <div className="text-sm">3 Persons</div>
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-fit">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>Loading dimensions (L × W × H)</th>
                                        <td>2.45×1.35×1.45m</td>
                                    </tr>
                                    <tr>
                                        <th>Payload</th>
                                        <td>950Kg</td>
                                    </tr>
                                    <tr>
                                        <th>External heigh</th>
                                        <td>2.30m</td>
                                    </tr>
                                    <tr>
                                        <th>License type</th>
                                        <td>Category B</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-base-200 rounded p-5 w-full grid grid-cols-1 gap-5">
                            <CollapseForm title='Kilometer package' titleClass='text-xl' defaultOpen>
                                <div className="flex flex-col gap-3">
                                    {[...Array(5)].map((_, i) => (
                                        <div className='flex gap-3' key={i}>
                                            <input type="radio" className="radio" />
                                            <div className="flex flex-col gap-1">
                                                <div className="flex">
                                                    <span className='font-semibold'>City</span><span className='mx-1'>:</span><span>0 kilometers package</span><span className='ml-1 font-bold text-primary'>CHF 40.-</span>
                                                </div>
                                                <div className="flex text-sm opacity-80">
                                                    <span>Price per additional km: </span><span className='ml-1 font-bold text-primary'>CHF 1.20/km</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CollapseForm>
                            <CollapseForm title='Additional package' titleClass='text-xl' defaultOpen>
                                <div className="flex flex-col gap-3">
                                    <div className='flex gap-3'>
                                        <input type="checkbox" className="checkbox" />
                                        <div className="flex flex-col gap-1">
                                            <div className="flex">
                                                Insurance
                                            </div>
                                            <div className="flex">
                                                Deductible: CHF 1'000 instead of CHF 2'000
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CollapseForm>
                            <CollapseForm title='What is included' titleClass='text-xl'>
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-3 items-center">
                                        <FaCheckCircle className='size-5 text-success' />
                                        <div>Highway vignette</div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <FaCheckCircle className='size-5 text-success' />
                                        <div>VAT</div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <FaCheckCircle className='size-5 text-success' />
                                        <div>Additional driver insurance</div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <FaCheckCircle className='size-5 text-success' />
                                        <div>Under 25 insurance</div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <FaCheckCircle className='size-5 text-success' />
                                        <div>Health insurance</div>
                                    </div>
                                </div>
                            </CollapseForm>
                            <CollapseForm title='What is not included' titleClass='text-xl'>
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-3 items-center">
                                        <MdError className='size-5 text-error' />
                                        <div>Highway vignette</div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <MdError className='size-5 text-error' />
                                        <div>VAT</div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <MdError className='size-5 text-error' />
                                        <div>Additional driver insurance</div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <MdError className='size-5 text-error' />
                                        <div>Under 25 insurance</div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <MdError className='size-5 text-error' />
                                        <div>Health insurance</div>
                                    </div>
                                </div>
                            </CollapseForm>
                        </div>
                        <div className="flex gap-5 items-center justify-end">
                            <div className="text-2xl font-semibold uppercase opacity-70">
                                Amount To Pay
                            </div>
                            <div className="px-3 py-1 bg-primary/20 text-primary text-3xl font-bold">CRF 400.00</div>
                        </div>
                        <div className="flex gap-5 justify-end">
                            <button className="btn btn-lg">Cancel</button>
                            <button className="btn btn-lg btn-primary">Rent Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </NavLayout>
    )
}

export default BookingDetails