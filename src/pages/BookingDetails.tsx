import { useEffect, useState } from 'react'
import NavLayout from '../layouts/NavLayout'
import { BsGear } from "react-icons/bs";
import { GiOilySpiral } from "react-icons/gi";
import { BsDoorOpen } from "react-icons/bs";
import { BsPersonLinesFill } from "react-icons/bs";
import CollapseForm from '../components/CollapseForm';
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { useParams } from 'react-router';
import { pb } from '../contexts/PocketContext';
import { Collections, VehiclePackagesResponse } from '../types/pocketbase';
import NotFoundError from '../components/NotFoundError';
import DataFetchError from '../components/DataFetchError';
import { uppercaseToCapitalize } from '../helpers';
import { TexpandVehicleDetailsResType } from '../types/result';
import { Img } from 'react-image';

function BookingDetails() {
    const { id } = useParams();
    const [data, setData] = useState<TexpandVehicleDetailsResType | null>(null)
    const [packages, setPackages] = useState<VehiclePackagesResponse[]>([])
    const [notFound, setNotFound] = useState(false)
    const [fetchError, setFetchError] = useState(false)

    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [activePackageId, setActivePackageId] = useState("")

    useEffect(() => {
        if (!id || id.length == 0) return;
        pb
            .collection(Collections.Vehicles)
            .getOne(id, {
                expand: "images, featuresIncluded, featuresExcluded"
            })
            .then(res => {
                setData(res as unknown as TexpandVehicleDetailsResType)
            })
            .catch(err => {
                if (err.status == 404) {
                    setNotFound(true)
                    return;
                }
                setFetchError(err.status != 0)
            })
        pb
            .collection(Collections.VehiclePackages)
            .getList(1, 50, {
                filter: `vehicle = '${id}'`
            })
            .then(res => setPackages(res.items))
    }, [id])

    if (notFound) return (
        <NavLayout>
            <NotFoundError />
        </NavLayout>
    )

    if (fetchError) return (
        <NavLayout>
            <DataFetchError />
        </NavLayout>
    )

    return (
        <NavLayout>
            {data && (
                <div className='py-16 px-10 container mx-auto'>
                    <div className="grid grid-cols-2 gap-10">
                        <div className="w-full h-fit sticky top-0">
                            <div className="w-full p-5 bg-base-200 border border-base-300 rounded flex flex-col gap-5">
                                <div className="bg-base-200 rounded-lg w-full h-[35rem] flex items-center justify-center">
                                    <Img
                                        className='object-cover h-full w-full rounded'
                                        src={`${import.meta.env.VITE_API_URL}/api/files/images/${data.expand.images[activeImageIndex].id}/${data.expand.images[activeImageIndex].file}`}
                                        loader={<div className="h-full w-full rounded bg-base-100" />}
                                        unloader={<div className="h-full w-full rounded bg-base-100 flex justify-center items-center font-semibold text-base-content/50">Not Found</div>}
                                    />
                                </div>
                                <div className="flex gap-3 justify-between">
                                    {data.expand.images.map((img, i) => (
                                        <button
                                            className='h-20 w-full p-2 rounded bg-base-100 border border-base-300 hover:shadow hover:ring-2 hover:ring-primary ring-offset-4 cursor-pointer'
                                            onClick={() => setActiveImageIndex(i)}
                                            key={i}
                                        >
                                            <Img
                                                className='object-cover h-full w-full rounded'
                                                src={`${import.meta.env.VITE_API_URL}/api/files/images/${img.id}/${img.file}`}
                                                loader={<div className="h-full w-full rounded bg-base-100" />}
                                                unloader={<div className="h-full w-full rounded bg-base-100 flex justify-center items-center font-semibold text-base-content/50">Not Found</div>}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10">
                            <div className='text-4xl font-semibold'>{data.title}</div>
                            <div className='font-semibold bg-accent py-2 px-4 rounded w-fit -my-2'>{data.model}</div>
                            <div className="flex gap-5 w-fit">
                                <div className="flex flex-col items-center gap-1">
                                    <BsGear className="size-8 text-accent" />
                                    <div className="text-sm">{uppercaseToCapitalize(data.transmissionType)}</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <GiOilySpiral className="size-8 text-accent" />
                                    <div className="text-sm">{uppercaseToCapitalize(data.fuelType)}</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <BsDoorOpen className="size-8 text-accent" />
                                    <div className="text-sm">{data.noOfDoors} Doors</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <BsPersonLinesFill className="size-8 text-accent" />
                                    <div className="text-sm">{data.noOfSeats} Persons</div>
                                </div>
                            </div>
                            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-fit">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>Loading dimensions (L × W × H)</th>
                                            <td>{data.loadDimensions}</td>
                                        </tr>
                                        <tr>
                                            <th>Payload</th>
                                            <td>{data.payloadWeight}</td>
                                        </tr>
                                        <tr>
                                            <th>External heigh</th>
                                            <td>{data.externalHeight}</td>
                                        </tr>
                                        <tr>
                                            <th>License type</th>
                                            <td>{data.licenceType}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-base-200 rounded p-5 w-full grid grid-cols-1 gap-5">
                                <CollapseForm title='Kilometer package' titleClass='text-xl' defaultOpen>
                                    <div className="flex flex-col gap-3">
                                        {packages.map((pac, i) => (
                                            <div className='flex gap-3' key={i}>
                                                <input type="radio" className="radio" checked={pac.id == activePackageId} onChange={() => setActivePackageId(pac.id)} />
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex">
                                                        <span className='font-semibold'>{pac.title}</span><span className='mx-1'>:</span><span>{pac.minKmLimit} kilometers package</span><span className='ml-1 font-bold text-primary'>CHF {pac.basePrice}.-</span>
                                                    </div>
                                                    <div className="flex text-sm opacity-80">
                                                        <span>Price per additional km: </span><span className='ml-1 font-bold text-primary'>CHF {pac.pricePerExtraKm}/km</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CollapseForm>
                                <CollapseForm title='What is included' titleClass='text-xl' defaultOpen>
                                    <div className="flex flex-col gap-3">
                                        {data.expand.featuresIncluded.map((e, i) => (
                                            <div className="flex gap-3 items-center" key={i}>
                                                <FaCheckCircle className='size-5 text-success' />
                                                <div>{e.title}</div>
                                            </div>
                                        ))}
                                    </div>
                                </CollapseForm>
                                <CollapseForm title='What is not included' titleClass='text-xl'>
                                    <div className="flex flex-col gap-3">
                                        {data.expand.featuresExcluded.map((e, i) => (
                                            <div className="flex gap-3 items-center" key={i}>
                                                <MdError className='size-5 text-error' />
                                                <div>{e.title}</div>
                                            </div>
                                        ))}
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
            )}
        </NavLayout>
    )
}

export default BookingDetails