import { useEffect, useMemo, useState } from 'react';
import NavLayout from '../layouts/NavLayout'
import { pb, usePocket } from '../contexts/PocketContext'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { ProductList, TexpandVehicleDetailsShortResType } from '../types/result';
import { Collections, VehiclePackagesResponse } from '../types/pocketbase';
import { constants } from '../constants';
import NotFoundError from '../components/NotFoundError';
import DataFetchError from '../components/DataFetchError';
import {
    api,
    convertTo12Hour,
    countDaysBetweenDates,
    formatDateToShortString,
    formatDateStringToYYYYMMDD,
    formatPrice,
    formatToISOString,
} from '../helpers';
import CollapseForm from '../components/CollapseForm';
import { useCartStore } from '../stores/cartStore';
import { Img } from 'react-image';
import toast from 'react-hot-toast';

interface FormData {
    agencyId: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    vehiclePackageId: string
    vehicleOptionIds: string[]
}

interface BookingData {
    user: string;
    startAt: string;
    endAt: string;
    status: string;
    vehicle: string;
    agency: string;
    products: string[];
    vehiclePackage: string;
    vehicleOptions: string[];
    firstName: string;
    firstNameSec: string;
    lastName: string;
    lastNameSec: string;
    dateOfBirth: string;
    dateOfBirthSec: string;
    email: string;
    emailSec: string;
    contactNo: string;
    contactNoSec: string;
    driverLicenseNo: string;
    driverLicenseNoSec: string;
    driverLicensePlace: string;
    driverLicensePlaceSec: string;
    postCode: string;
    postCodeSec: string;
    address: string;
    addressSec: string;
    depositMethod: string;
}

function BookingReservation() {
    const { user } = usePocket()
    const [searchParams] = useSearchParams();
    const { id } = useParams();
    const navigate = useNavigate()
    const location = useLocation()
    const [isloading, setIsloading] = useState(true)
    const [showSecDriver, setShowSecDriver] = useState(false)
    const [products, setProducts] = useState<ProductList[]>([])
    const { products: productList, clearProducts } = useCartStore()
    const [completed, setCompleted] = useState(false)

    const [formData, setFormData] = useState<FormData>({
        agencyId: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        vehiclePackageId: "",
        vehicleOptionIds: []
    });

    const [bookingData, setBookingData] = useState<BookingData>({
        user: '',
        startAt: '',
        endAt: '',
        status: '',
        vehicle: '',
        agency: '',
        products: [],
        vehiclePackage: '',
        vehicleOptions: [],
        firstName: '',
        firstNameSec: '',
        lastName: '',
        lastNameSec: '',
        dateOfBirth: '',
        dateOfBirthSec: '',
        email: '',
        emailSec: '',
        contactNo: '',
        contactNoSec: '',
        driverLicenseNo: '',
        driverLicenseNoSec: '',
        driverLicensePlace: '',
        driverLicensePlaceSec: '',
        postCode: '',
        postCodeSec: '',
        address: '',
        addressSec: '',
        depositMethod: ''
    })

    const [data, setData] = useState<TexpandVehicleDetailsShortResType | null>(null)
    const [packages, setPackages] = useState<VehiclePackagesResponse[]>([])
    const [notFound, setNotFound] = useState(false)
    const [fetchError, setFetchError] = useState(false)

    const pac = useMemo(() => packages.find(e => e.id == formData.vehiclePackageId), [formData, packages]);

    useEffect(() => {
        if (!!user) return;
        navigate("/sign-in?next=" + location.pathname + location.search)
    }, [user])

    useEffect(() => {
        if (!user) return;
        pb.collection(Collections.Users).getOne(user.id).then(res => {
            setBookingData({
                ...bookingData,
                firstName: res.firstName,
                lastName: res.lastName,
                dateOfBirth: formatDateStringToYYYYMMDD(res.dateOfBirth),
                email: res.email,
                driverLicenseNo: res.driverLicenseNo,
                driverLicensePlace: res.driverLicensePlace,
                contactNo: res.contactNo,
                address: res.address,
                postCode: res.postCode,
            })
        })
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

    useEffect(() => {
        api
            .get("/api/cart-products", {
                params: {
                    productIds: productList.join(",")
                }
            })
            .then(res => setProducts(res.data.productList as unknown as ProductList[]))
    }, [])

    const productCount = useMemo(() => {
        return productList.reduce((acc: { [key: string]: number }, id: string) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
        }, {});
    }, [productList]);

    const handleSubmit = () => {
        const payload: BookingData = {
            ...bookingData,
            user: user?.id ?? "",
            products: productList,
            agency: formData.agencyId,
            startAt: formatToISOString(formData.startDate, formData.startTime),
            endAt: formatToISOString(formData.endDate, formData.endTime),
            vehicle: id ?? "",
            status: 'ONGOING',
            vehiclePackage: formData.vehiclePackageId,
            vehicleOptions: formData.vehicleOptionIds
        }
        pb.collection(Collections.Reservations).create({
            ...payload
        })
            .then(() => {
                setCompleted(true)
                clearProducts()
            })
            .catch(() => toast.error("Reservation failed. Try again."))
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
                <div className="p-5 rounded border border-base-200 shadow grid grid-cols-1 gap-5">
                    <CollapseForm title='Vehicle Rent Details' titleClass='text-2xl poppins-bold' defaultOpen>
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
                                <tr>
                                    <th>No of Days</th>
                                    <td>{countDaysBetweenDates(formData.startDate, formData.endDate)} Days</td>
                                </tr>
                            </tbody>
                        </table>
                    </CollapseForm>

                    <CollapseForm title='Cart Products' titleClass='text-2xl poppins-bold' defaultOpen>
                        <div className="flex flex-col divide-y divide-base-300 border border-base-300">
                            {products.map((data) => {
                                const count = productCount[data.id] || 0;

                                return [...Array(count)].map((_, i) => (
                                    <div className="p-5 flex flex-col lg:flex-row gap-8" key={`${data.id}-${i}`}>
                                        <div className='h-32 w-64 flex-shrink-0'>
                                            <Img
                                                className='h-32 w-full object-cover rounded'
                                                src={`${import.meta.env.VITE_API_URL}${data.image}`}
                                                loader={<div className="h-64 w-full rounded bg-base-100" />}
                                                unloader={<div className="h-64 w-full rounded bg-base-100 flex justify-center items-center font-semibold text-base-content/50">Not Found</div>}
                                            />
                                        </div>
                                        <div className='flex flex-col justify-between'>
                                            <div>
                                                <Link to={`/products/${data.id}`} className="font-semibold text-xl hover:text-info">{data.title}</Link>
                                                <div className="mt-3 line-clamp-5">{data.summary}</div>
                                                <div className="text-blue-700 font-bold mt-2 text-xl">CHF ${formatPrice(data.price)}</div>

                                            </div>
                                        </div>
                                    </div>
                                ));
                            })}
                        </div>
                    </CollapseForm>
                </div>

                <div className="shadow p-5 rounded border border-base-200 mt-5">
                    <div className="text-2xl poppins-bold font-semibold mb-5">Rental Agreement</div>
                    <div className="grid grid-cols-3 gap-5">
                        <fieldset className="fieldset col-span-3 lg:col-span-1">
                            <legend className="fieldset-legend">First Name</legend>
                            <input type="text" className="input w-full" value={bookingData.firstName} onChange={e => setBookingData({ ...bookingData, firstName: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset col-span-3 lg:col-span-1">
                            <legend className="fieldset-legend">Last Name</legend>
                            <input type="text" className="input w-full" value={bookingData.lastName} onChange={e => setBookingData({ ...bookingData, lastName: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset col-span-3 lg:col-span-1">
                            <legend className="fieldset-legend">Date of birth</legend>
                            <input type="date" className="input w-full" value={bookingData.dateOfBirth} onChange={e => setBookingData({ ...bookingData, dateOfBirth: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset col-span-3 lg:col-span-1">
                            <legend className="fieldset-legend">Email</legend>
                            <input type="text" className="input w-full" value={bookingData.email} onChange={e => setBookingData({ ...bookingData, email: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset col-span-3 lg:col-span-1">
                            <legend className="fieldset-legend">Driver Licence No</legend>
                            <input type="text" className="input w-full" value={bookingData.driverLicenseNo} onChange={e => setBookingData({ ...bookingData, driverLicenseNo: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset col-span-3 lg:col-span-1">
                            <legend className="fieldset-legend">Issue place of the license</legend>
                            <input type="text" className="input w-full" value={bookingData.driverLicensePlace} onChange={e => setBookingData({ ...bookingData, driverLicensePlace: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset col-span-3 lg:col-span-1">
                            <legend className="fieldset-legend">Post Code</legend>
                            <input type="text" className="input w-full" value={bookingData.postCode} onChange={e => setBookingData({ ...bookingData, postCode: e.target.value })} />
                        </fieldset>
                        <fieldset className="col-span-3 lg:col-span-2 fieldset">
                            <legend className="fieldset-legend">Address</legend>
                            <input type="text" className="input w-full" value={bookingData.address} onChange={e => setBookingData({ ...bookingData, address: e.target.value })} />
                        </fieldset>
                        <div className="col-span-3">
                            <div className="flex items-center gap-3">
                                <div className="font-semibold mr-2">
                                    Deposit method
                                </div>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" onChange={e => {
                                        if (e.target.checked) setBookingData({ ...bookingData, depositMethod: "Cash" })
                                    }} />
                                    Cash
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" onChange={e => {
                                        if (e.target.checked) setBookingData({ ...bookingData, depositMethod: "Account" })
                                    }} />
                                    Account
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" onChange={e => {
                                        if (e.target.checked) setBookingData({ ...bookingData, depositMethod: "Mypos" })
                                    }} />
                                    Mypos
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" onChange={e => {
                                        if (e.target.checked) setBookingData({ ...bookingData, depositMethod: "Worldline" })
                                    }} />
                                    Worldline
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shadow p-5 rounded border border-base-200 mt-5">
                    {!showSecDriver && (
                        <div className="flex gap-3 items-center">
                            <div className="text-2xl poppins-bold font-semibold">Need secondary driver ?</div> <button onClick={() => setShowSecDriver(true)} className="btn btn-outline">Add driver</button>
                        </div>
                    )}
                    {showSecDriver && (
                        <>
                            <div className="text-xl font-semibold mb-5">Secondary Driver</div>
                            <div className="grid grid-cols-3 gap-5">
                                <fieldset className="fieldset col-span-3 lg:col-span-1">
                                    <legend className="fieldset-legend">First Name</legend>
                                    <input type="text" className="input w-full" value={bookingData.firstNameSec} onChange={e => setBookingData({ ...bookingData, firstNameSec: e.target.value })} />
                                </fieldset>
                                <fieldset className="fieldset col-span-3 lg:col-span-1">
                                    <legend className="fieldset-legend">Last Name</legend>
                                    <input type="text" className="input w-full" value={bookingData.lastNameSec} onChange={e => setBookingData({ ...bookingData, lastNameSec: e.target.value })} />
                                </fieldset>
                                <fieldset className="fieldset col-span-3 lg:col-span-1">
                                    <legend className="fieldset-legend">Date of birth</legend>
                                    <input type="date" className="input w-full" value={bookingData.dateOfBirthSec} onChange={e => setBookingData({ ...bookingData, dateOfBirthSec: e.target.value })} />
                                </fieldset>
                                <fieldset className="fieldset col-span-3 lg:col-span-1">
                                    <legend className="fieldset-legend">Email</legend>
                                    <input type="text" className="input w-full" value={bookingData.emailSec} onChange={e => setBookingData({ ...bookingData, emailSec: e.target.value })} />
                                </fieldset>
                                <fieldset className="fieldset col-span-3 lg:col-span-1">
                                    <legend className="fieldset-legend">Driver Licence No</legend>
                                    <input type="text" className="input w-full" value={bookingData.driverLicenseNoSec} onChange={e => setBookingData({ ...bookingData, driverLicenseNoSec: e.target.value })} />
                                </fieldset>
                                <fieldset className="fieldset col-span-3 lg:col-span-1">
                                    <legend className="fieldset-legend">Issue place of the license</legend>
                                    <input type="text" className="input w-full" value={bookingData.driverLicensePlaceSec} onChange={e => setBookingData({ ...bookingData, driverLicensePlaceSec: e.target.value })} />
                                </fieldset>
                                <fieldset className="fieldset col-span-3 lg:col-span-1">
                                    <legend className="fieldset-legend">Post Code</legend>
                                    <input type="text" className="input w-full" value={bookingData.postCodeSec} onChange={e => setBookingData({ ...bookingData, postCodeSec: e.target.value })} />
                                </fieldset>
                                <fieldset className="col-span-3 lg:col-span-2 fieldset">
                                    <legend className="fieldset-legend">Address</legend>
                                    <input type="text" className="input w-full" value={bookingData.addressSec} onChange={e => setBookingData({ ...bookingData, addressSec: e.target.value })} />
                                </fieldset>
                            </div>
                        </>
                    )}
                </div>
                <button className="btn btn-primary w-full mt-10" onClick={handleSubmit}>Submit Request</button>
                {completed && (
                    <div className="fixed top-0 left-0 bg-base-300/80 w-full h-screen flex justify-center items-center">
                        <div className='flex flex-col items-center'>
                            <div className='text-xl font-semibold'>Reservation Completed</div>
                            <button className="btn btn-info mt-5" onClick={() => navigate("/profile")}>Go Back</button>
                        </div>
                    </div>
                )}
            </div>
        </NavLayout>
    )
}

export default BookingReservation