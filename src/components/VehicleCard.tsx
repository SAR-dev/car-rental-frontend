import { BsGear } from "react-icons/bs";
import { GiOilySpiral } from "react-icons/gi";
import { BsDoorOpen } from "react-icons/bs";
import { BsPersonLinesFill } from "react-icons/bs";
import { Link, useSearchParams } from "react-router";
import { VehicleList } from "../types/result";
import { uppercaseToCapitalize } from "../helpers";
import {Img} from 'react-image'

function VehicleCard({ data }: { data: VehicleList }) {
    const [searchParams] = useSearchParams();
    
    return (
        <div>
            <div className='bg-base-200 p-5 rounded flex flex-col gap-3 w-full border border-base-content/15 shadow'>
                <div className='text-xl font-semibold poppins-bold'>
                    {data.title}
                </div>
                <div className="border-2 border-primary/20 h-10 px-5 rounded flex items-center justify-center font-semibold w-full bg-primary/50">
                    {data.model}
                </div>
                <div className="flex gap-1 items-end text-primary-content">
                    Dès <span className='text-4xl font-semibold'>CHF {data.minPrice}</span>
                </div>
                <div className="aspect-1 w-full">
                    <Img 
                        className='aspect-1 w-full object-cover rounded' 
                        src={`${import.meta.env.VITE_API_URL}${data.image}`}
                        loader={<div className="aspect-1 w-full rounded bg-base-100" />}
                        unloader={<div className="aspect-1 w-full rounded bg-base-100 flex justify-center items-center font-semibold text-base-content/50">Not Found</div>}
                    />
                </div>
                <div className="flex justify-between">
                    <div className="flex flex-col items-center gap-1">
                        <BsGear className="size-8" />
                        <div className="text-sm">{uppercaseToCapitalize(data.transmissionType)}</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <GiOilySpiral className="size-8" />
                        <div className="text-sm">{uppercaseToCapitalize(data.fuelType)}</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <BsDoorOpen className="size-8" />
                        <div className="text-sm">{data.noOfDoors} Doors</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <BsPersonLinesFill className="size-8" />
                        <div className="text-sm">{data.noOfSeats} Persons</div>
                    </div>
                </div>
                <Link to={`/bookings/${data.id}?${new URLSearchParams(searchParams).toString()}`} className="btn btn-primary">
                    Réservez maintenant
                </Link>
            </div>
        </div>
    )
}

export default VehicleCard