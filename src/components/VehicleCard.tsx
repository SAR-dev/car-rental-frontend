import { BsGear } from "react-icons/bs";
import { GiOilySpiral } from "react-icons/gi";
import { BsDoorOpen } from "react-icons/bs";
import { BsPersonLinesFill } from "react-icons/bs";
import { Link } from "react-router";

function VehicleCard() {
    return (
        <div>
            <div className='bg-base-200 p-5 rounded flex flex-col gap-3 w-full border border-base-300 shadow'>
                <div className='text-xl font-semibold'>Class B, manual</div>
                <div className="border border-base-300 h-10 px-5 rounded flex items-center justify-center font-semibold w-full bg-base-100">
                    Geneva
                </div>
                <div className="flex gap-1 items-end text-primary">
                    From <span className='text-4xl font-semibold'>CHF 20</span>/day
                </div>
                <div className="h-64">
                    <img className='h-64 object-contain' src="https://www.patricklocation.ch/img/location/9/1706685554.png" alt="" />
                </div>
                <div className="flex justify-between">
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
                <Link to="/bookings/1" className="btn btn-primary">
                    Book Now
                </Link>
            </div>
        </div>
    )
}

export default VehicleCard