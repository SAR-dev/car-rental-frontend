import { useEffect, useMemo, useState } from 'react'
import NavLayout from '../layouts/NavLayout'
import { BsGear } from "react-icons/bs";
import { GiOilySpiral } from "react-icons/gi";
import { BsDoorOpen } from "react-icons/bs";
import { BsPersonLinesFill } from "react-icons/bs";
import CollapseForm from '../components/CollapseForm';
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router';
import { pb } from '../contexts/PocketContext';
import { Collections, VehiclePackagesResponse } from '../types/pocketbase';
import NotFoundError from '../components/NotFoundError';
import DataFetchError from '../components/DataFetchError';
import { countDaysBetweenDates, formatPrice, uppercaseToCapitalize } from '../helpers';
import { TexpandVehicleDetailsResType } from '../types/result';
import { Img } from 'react-image';
import { constants } from '../constants';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

interface FormData {
    agencyId: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    vehiclePackageId: string
    vehicleOptionIds: string[]
}

function BookingDetails() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams();
    const navigate = useNavigate()
    const location = useLocation()
    const [isloading, setIsloading] = useState(true)

    const [formData, setFormData] = useState<FormData>({
        agencyId: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        vehiclePackageId: "",
        vehicleOptionIds: []
    });

    const [data, setData] = useState<TexpandVehicleDetailsResType | null>(null)
    const [packages, setPackages] = useState<VehiclePackagesResponse[]>([])
    const [notFound, setNotFound] = useState(false)
    const [fetchError, setFetchError] = useState(false)

    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [isOpened, setIsOpened] = useState(false)

    const enableRentNow = useMemo(
        () => formData.vehiclePackageId.trim().length > 0
            && formData.agencyId.trim().length > 0
            && !isNaN(Date.parse(formData.startDate))
            && constants.TIME_FORMAT.test(formData.startTime)
            && !isNaN(Date.parse(formData.endDate))
            && constants.TIME_FORMAT.test(formData.endTime),
        [formData]
    );

    const payments = useMemo(
        () => [...(packages.filter(e => e.id == formData.vehiclePackageId)?.map(e => {
            return { type: "Kilometer Package", title: e.title, price: e.basePrice }
        }) || []), ...(data?.expand.vehicleOptions.filter(e => formData.vehicleOptionIds.includes(e.id))?.map(e => {
            return { type: "Additional Options", title: e.title, price: e.price }
        }) || [])],
        [formData, packages, data]
    );

    useEffect(() => {
        if (!id || id.length == 0) return;
        pb
            .collection(Collections.Vehicles)
            .getOne(id, {
                expand: "images, featuresIncluded, featuresExcluded, agencies, vehicleOptions"
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
            .finally(() => setIsloading(false))
        pb
            .collection(Collections.VehiclePackages)
            .getList(1, 50, {
                filter: `vehicle = '${id}'`
            })
            .then(res => setPackages(res.items))
    }, [id])

    useEffect(() => {
        setFormData({
            ...formData,
            agencyId: searchParams.get(constants.SEARCH_PARAMS.AGENCY_ID) || "",
            startDate: searchParams.get(constants.SEARCH_PARAMS.START_DATE) || "",
            startTime: searchParams.get(constants.SEARCH_PARAMS.START_TIME) || "",
            endDate: searchParams.get(constants.SEARCH_PARAMS.END_DATE) || "",
            endTime: searchParams.get(constants.SEARCH_PARAMS.END_TIME) || "",
            vehiclePackageId: searchParams.get(constants.SEARCH_PARAMS.VEHICLE_PACKAGE_ID) || "",
            vehicleOptionIds: [...new Set((searchParams.get(constants.SEARCH_PARAMS.VEHICLE_OPTION_IDS) || "").split(",").filter(e => e.length > 0))],
        });
    }, [searchParams]);

    const handleVehicleOption = (vehicleOptionId: string) => {
        const list = (searchParams.get(constants.SEARCH_PARAMS.VEHICLE_OPTION_IDS) || "").split(",").filter(e => e.length > 0)
        let str = ""
        if (list.includes(vehicleOptionId)) {
            str = list.filter(c => c != vehicleOptionId).join(",")
        } else {
            str = [...list, vehicleOptionId].filter(e => e.length > 0).join(",")
        }
        searchParams.set(constants.SEARCH_PARAMS.VEHICLE_OPTION_IDS, str)
        setSearchParams(searchParams)
    }

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

    if (!data || isloading) return (
        <NavLayout>
            <div className="h-screen w-full"></div>
        </NavLayout>
    )

    return (
        <NavLayout>
            <div className='py-16 px-10 container mx-auto'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="w-full h-fit lg:sticky top-0">
                        <div className="w-full p-5 bg-base-200 border border-base-content/15 rounded flex flex-col gap-5">
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
                                        className='h-20 w-full p-2 rounded bg-base-100 border border-base-content/15 hover:shadow hover:ring-2 hover:ring-primary ring-offset-4 cursor-pointer'
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
                        <div className='text-4xl font-semibold poppins-bold'>{data.title}</div>
                        <div className='font-semibold bg-base-content text-base-100 py-2 px-4 rounded w-fit -my-2'>{data.model}</div>
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
                        <div className="overflow-x-auto rounded-box border border-base-content/15 bg-base-100 w-full">
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
                        <div className="bg-base-200 border border-base-content/15 rounded w-full grid grid-cols-1">
                            <div className="p-5">
                                <CollapseForm title='Kilometer package' titleClass='text-xl' defaultOpen>
                                    <div className="flex flex-col gap-3">
                                        {packages.map((pac, i) => (
                                            <div className='flex gap-3' key={i}>
                                                <input
                                                    type="radio"
                                                    className="radio"
                                                    checked={pac.id == formData.vehiclePackageId}
                                                    onChange={() => {
                                                        searchParams.set(constants.SEARCH_PARAMS.VEHICLE_PACKAGE_ID, pac.id)
                                                        setSearchParams(searchParams)
                                                    }}
                                                />
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
                                        <div className="text-info text-sm font-semibold">
                                            👆 Select a package to continue
                                        </div>
                                    </div>
                                </CollapseForm>
                            </div>
                            <hr className='text-base-content/25' />
                            <div className="p-5">
                                <CollapseForm title='Additional Options' titleClass='text-xl' defaultOpen>
                                    <div className="flex flex-col gap-3">
                                        {data.expand.vehicleOptions.map((option, i) => (
                                            <div className='flex gap-3' key={i}>
                                                <input
                                                    type="radio"
                                                    className="radio"
                                                    checked={formData.vehicleOptionIds.includes(option.id)}
                                                    onClick={() => handleVehicleOption(option.id)}
                                                />
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            {option.title}
                                                        </div>
                                                        <div className='font-bold text-primary'>
                                                            CHF {option.price}
                                                        </div>
                                                    </div>
                                                    <div className="flex text-sm opacity-80">
                                                        {option.subtitle}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CollapseForm>
                            </div>
                            <hr className='text-base-content/25' />
                            <div className="p-5">
                                <CollapseForm title='What is included' titleClass='text-xl'>
                                    <div className="flex flex-col gap-3">
                                        {data.expand.featuresIncluded.map((e, i) => (
                                            <div className="flex gap-3 items-center" key={i}>
                                                <FaCheckCircle className='size-5 text-success' />
                                                <div>{e.title}</div>
                                            </div>
                                        ))}
                                    </div>
                                </CollapseForm>
                            </div>
                            <hr className='text-base-content/25' />
                            <div className="p-5">
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
                            <hr className='text-base-content/25' />
                            <div className="p-5">
                                <CollapseForm title='Pickup & Return' titleClass='text-xl' defaultOpen>
                                    <div className="flex flex-col gap-5">
                                        <fieldset className="fieldset">
                                            <legend className="fieldset-legend">Choose Agency</legend>
                                            <select
                                                className='select'
                                                value={formData.agencyId}
                                                onChange={(e) => {
                                                    searchParams.set(constants.SEARCH_PARAMS.AGENCY_ID, e.target.value)
                                                    setSearchParams(searchParams)
                                                }}
                                            >
                                                <option value="" disabled>None</option>
                                                {data.expand.agencies.map((e, i) => (
                                                    <option value={e.id} key={i}>{e.name}</option>
                                                ))}
                                            </select>
                                        </fieldset>
                                        <div className="grid grid-cols-2 gap-5">
                                            <fieldset className="fieldset">
                                                <legend className="fieldset-legend">Start Date</legend>
                                                <input
                                                    type="date"
                                                    value={formData.startDate}
                                                    onChange={e => {
                                                        if (isNaN(Date.parse(e.target.value))) return;
                                                        searchParams.set(constants.SEARCH_PARAMS.START_DATE, e.target.value)
                                                        setSearchParams(searchParams)
                                                    }}
                                                    className="input"
                                                />
                                            </fieldset>
                                            <fieldset className="fieldset">
                                                <legend className="fieldset-legend">Start Time</legend>
                                                <input
                                                    type="time"
                                                    value={formData.startTime}
                                                    onChange={e => {
                                                        if (!constants.TIME_FORMAT.test(e.target.value)) return;
                                                        searchParams.set(constants.SEARCH_PARAMS.START_TIME, e.target.value)
                                                        setSearchParams(searchParams)
                                                    }}
                                                    className="input"
                                                />
                                            </fieldset>
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <fieldset className="fieldset">
                                                <legend className="fieldset-legend">End Date</legend>
                                                <input
                                                    type="date"
                                                    value={formData.endDate}
                                                    onChange={e => {
                                                        if (isNaN(Date.parse(e.target.value))) return;
                                                        searchParams.set(constants.SEARCH_PARAMS.END_DATE, e.target.value)
                                                        setSearchParams(searchParams)
                                                    }}
                                                    className="input"
                                                />
                                            </fieldset>
                                            <fieldset className="fieldset">
                                                <legend className="fieldset-legend">End Time</legend>
                                                <input
                                                    type="time"
                                                    value={formData.endTime}
                                                    onChange={e => {
                                                        if (!constants.TIME_FORMAT.test(e.target.value)) return;
                                                        searchParams.set(constants.SEARCH_PARAMS.END_TIME, e.target.value)
                                                        setSearchParams(searchParams)
                                                    }}
                                                    className="input"
                                                />
                                            </fieldset>
                                        </div>
                                        <div className="text-info text-sm font-semibold">
                                            👆 Please fill this form to continue
                                        </div>
                                    </div>
                                </CollapseForm>
                            </div>
                            <hr className='text-base-content/25' />
                            <div className="flex justify-between p-5 bg-base-content text-base-100">
                                <div className="flex gap-3 items-center justify-end">
                                    <div className="text-xl font-semibold uppercase opacity-70">
                                        Amount To Pay
                                    </div>
                                    <div className="text-xl font-bold">CHF {enableRentNow ? formatPrice(payments.map(e => e.price).reduce((partialSum, a) => partialSum + a, 0) * countDaysBetweenDates(formData.startDate, formData.endDate)) : 0}</div>
                                </div>
                                <div className="flex gap-5 justify-end">
                                    <button className="btn" onClick={() => navigate(-1)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={() => setIsOpened(true)} disabled={!enableRentNow}>Rent Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={isOpened} onClose={() => setIsOpened(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-base-300/50">
                    <DialogPanel className="max-w-xl space-y-4 border border-base-300 bg-base-100 shadow p-10">
                        <DialogTitle className="font-bold poppins-bold">Review Selected Options</DialogTitle>
                        <table className="table border border-base-200 mt-5">
                            <tbody>
                                <tr>
                                    <th>Agency</th>
                                    <td>{data.expand.agencies.find(e => e.id == formData.agencyId)?.name || "N/A"}</td>
                                </tr>
                                <tr>
                                    <th>Start At</th>
                                    <td>{formData.startDate} {formData.startTime}</td>
                                </tr>
                                <tr>
                                    <th>End At</th>
                                    <td>{formData.endDate} {formData.endTime}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table border border-base-200 mt-5">
                            <tbody>
                                {payments.map((e, i) => (
                                    <tr key={i}>
                                        <th>{e.type}</th>
                                        <td>{e.title}</td>
                                        <td>CHF {e.price}</td>
                                    </tr>

                                ))}
                                <tr className='text-primary'>
                                    <th></th>
                                    <th>Daily Payment</th>
                                    <th>CHF {formatPrice(payments.map(e => e.price).reduce((partialSum, a) => partialSum + a, 0))}</th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th>No of Days</th>
                                    <th>{countDaysBetweenDates(formData.startDate, formData.endDate)}</th>
                                </tr>
                                <tr className='text-primary'>
                                    <th></th>
                                    <th>Total Payment</th>
                                    <th>CHF {formatPrice(payments.map(e => e.price).reduce((partialSum, a) => partialSum + a, 0) * countDaysBetweenDates(formData.startDate, formData.endDate))}</th>
                                </tr>
                            </tbody>
                        </table>
                        <Link
                            to={"/bookings/" + id + "/reservation" + location.search}
                            className="btn w-full btn-primary mt-5"
                        >
                            Proceed
                        </Link>
                    </DialogPanel>
                </div>
            </Dialog>
        </NavLayout>
    )
}

export default BookingDetails