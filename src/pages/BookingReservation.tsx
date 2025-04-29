import { useEffect, useMemo, useState } from 'react';
import NavLayout from '../layouts/NavLayout'
import { pb, usePocket } from '../contexts/PocketContext'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { TexpandVehicleDetailsShortResType } from '../types/result';
import { Collections, VehiclePackagesResponse } from '../types/pocketbase';
import { constants } from '../constants';
import NotFoundError from '../components/NotFoundError';
import DataFetchError from '../components/DataFetchError';
import { convertTo12Hour, formatDateToShortString, uppercaseToCapitalize } from '../helpers';
import CollapseForm from '../components/CollapseForm';

interface FormData {
    agencyId: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    vehiclePackageId: string
    vehicleOptionIds: string[]
}

function BookingReservation() {
    const { user } = usePocket()
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams();
    const navigate = useNavigate()
    const location = useLocation()
    const [isloading, setIsloading] = useState(true)
    const [showSecDriver, setShowSecDriver] = useState(false)

    const [formData, setFormData] = useState<FormData>({
        agencyId: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        vehiclePackageId: "",
        vehicleOptionIds: []
    });

    const [data, setData] = useState<TexpandVehicleDetailsShortResType | null>(null)
    const [packages, setPackages] = useState<VehiclePackagesResponse[]>([])
    const [notFound, setNotFound] = useState(false)
    const [fetchError, setFetchError] = useState(false)

    const payments = useMemo(
        () => [...(packages.filter(e => e.id == formData.vehiclePackageId)?.map(e => {
            return { type: "Kilometer Package", title: e.title, price: e.basePrice }
        }) || []), ...(data?.expand.vehicleOptions.filter(e => formData.vehicleOptionIds.includes(e.id))?.map(e => {
            return { type: "Additional Options", title: e.title, price: e.price }
        }) || [])],
        [formData, packages, data]
    );

    const pac = useMemo(() => packages.find(e => e.id == formData.vehiclePackageId), [formData, packages]);

    useEffect(() => {
        if (!!user) return;
        navigate("/sign-in?next=" + location.pathname + location.search)
    }, [user])

    useEffect(() => {
        if (!id || id.length == 0) return;
        pb
            .collection(Collections.Vehicles)
            .getOne(id, {
                expand: "agencies, vehicleOptions"
            })
            .then(res => {
                setData(res as unknown as TexpandVehicleDetailsShortResType)
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
                <div className="p-5 rounded border border-base-200 shadow">
                    <CollapseForm title='Vehicle Rent Details' defaultOpen>
                        <table className="table border border-base-200">
                            <tbody>
                                <tr>
                                    <th>Vehicle</th>
                                    <td>{data.title}, ({data.model})</td>
                                </tr>
                                <tr>
                                    <th>Kilometer Package</th>
                                    <td>
                                        {pac && (
                                            <div className="flex flex-col gap-1">
                                                <div className="flex">
                                                    <span className='font-semibold'>{pac.title}</span><span className='mx-1'>:</span><span>{pac.minKmLimit} kilometers package</span><span className='ml-1 font-bold text-primary'>CHF {pac.basePrice}.-</span>
                                                </div>
                                                <div className="flex text-sm opacity-80">
                                                    <span>Price per additional km: </span><span className='ml-1 font-bold text-primary'>CHF {pac.pricePerExtraKm}/km</span>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Additional Options</th>
                                    <td>
                                        <div className="flex flex-col gap-3">
                                            {data.expand.vehicleOptions.filter(e => formData.vehicleOptionIds.includes(e.id)).map((option, i) => (
                                                <div className="flex flex-col gap-1" key={i}>
                                                    <div className="flex gap-2">
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
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Agency</th>
                                    <td>{data.expand.agencies.find(e => e.id == formData.agencyId)?.name}</td>
                                </tr>
                                <tr>
                                    <th>Reserve from</th>
                                    <td>{formatDateToShortString(formData.startDate)} {convertTo12Hour(formData.startTime)}</td>
                                </tr>
                                <tr>
                                    <th>Reserve till</th>
                                    <td>{formatDateToShortString(formData.endDate)} {convertTo12Hour(formData.endTime)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CollapseForm>
                </div>

                <div className="shadow p-5 rounded border border-base-200 mt-5">
                    <div className="text-xl font-semibold mb-5">Rental Agreement</div>
                    <div className="grid grid-cols-3 gap-5">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">First Name</legend>
                            <input type="text" className="input w-full" />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Last Name</legend>
                            <input type="text" className="input w-full" />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Date of birth</legend>
                            <input type="date" className="input w-full" />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Email</legend>
                            <input type="text" className="input w-full" />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Driver Licence No</legend>
                            <input type="text" className="input w-full" />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Issue date of the license</legend>
                            <input type="date" className="input w-full" />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Post Code</legend>
                            <input type="text" className="input w-full" />
                        </fieldset>
                        <fieldset className="col-span-2 fieldset">
                            <legend className="fieldset-legend">Address</legend>
                            <input type="text" className="input w-full" />
                        </fieldset>
                        <div className="col-span-3">
                            <div className="flex items-center gap-3">
                                <div className="font-semibold mr-2">
                                    Deposit method
                                </div>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" />
                                    Cash
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" />
                                    Account
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" />
                                    Mypos
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" />
                                    Worldline
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shadow p-5 rounded border border-base-200 mt-5">
                    {!showSecDriver && (
                        <div className="flex gap-3 items-center">
                            <div className="text-xl font-semibold">Need secondary driver ?</div> <button onClick={() => setShowSecDriver(true)} className="btn btn-outline">Add driver</button>
                        </div>
                    )}
                    {showSecDriver && (
                        <>
                            <div className="text-xl font-semibold mb-5">Secondary Driver</div>
                            <div className="grid grid-cols-3 gap-5">
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">First Name</legend>
                                    <input type="text" className="input w-full" />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Last Name</legend>
                                    <input type="text" className="input w-full" />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Date of birth</legend>
                                    <input type="date" className="input w-full" />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Email</legend>
                                    <input type="text" className="input w-full" />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Driver Licence No</legend>
                                    <input type="text" className="input w-full" />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Issue date of the license</legend>
                                    <input type="date" className="input w-full" />
                                    <p className="label">Must needed</p>
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Post Code</legend>
                                    <input type="text" className="input w-full" />
                                    <p className="label">Must needed</p>
                                </fieldset>
                                <fieldset className="col-span-2 fieldset">
                                    <legend className="fieldset-legend">Address</legend>
                                    <input type="text" className="input w-full" />
                                    <p className="label">Must needed</p>
                                </fieldset>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </NavLayout>
    )
}

export default BookingReservation