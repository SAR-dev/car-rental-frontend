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
    formatDateToYYYYMMDD,
    formatPrice,
} from '../helpers';
import CollapseForm from '../components/CollapseForm';
import { useCartStore } from '../stores/cartStore';
import { Img } from 'react-image';

interface FormData {
    agencyId: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    vehiclePackageId: string
    vehicleOptionIds: string[]
}

interface UserUpdateData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    driverLicenseNo: string;
    driverLicensePlace: string;
    contactNo: string;
    address: string;
    postCode: string;
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
    const { products: productList } = useCartStore()

    const [formData, setFormData] = useState<FormData>({
        agencyId: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        vehiclePackageId: "",
        vehicleOptionIds: []
    });

    const [userData, setUserData] = useState<UserUpdateData>({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        email: "",
        driverLicenseNo: "",
        driverLicensePlace: "",
        contactNo: "",
        address: "",
        postCode: "",
    })

    const [data, setData] = useState<TexpandVehicleDetailsShortResType | null>(null)
    const [packages, setPackages] = useState<VehiclePackagesResponse[]>([])
    const [notFound, setNotFound] = useState(false)
    const [fetchError, setFetchError] = useState(false)

    // const payments = useMemo(
    //     () => [...(packages.filter(e => e.id == formData.vehiclePackageId)?.map(e => {
    //         return { type: "Kilometer Package", title: e.title, price: e.basePrice }
    //     }) || []), ...(data?.expand.vehicleOptions.filter(e => formData.vehicleOptionIds.includes(e.id))?.map(e => {
    //         return { type: "Additional Options", title: e.title, price: e.price }
    //     }) || [])],
    //     [formData, packages, data]
    // );

    const pac = useMemo(() => packages.find(e => e.id == formData.vehiclePackageId), [formData, packages]);

    useEffect(() => {
        if (!!user) return;
        navigate("/sign-in?next=" + location.pathname + location.search)
    }, [user])

    useEffect(() => {
        if (!user) return;
        pb.collection(Collections.Users).getOne(user.id).then(res => {
            setUserData({
                firstName: res.firstName,
                lastName: res.lastName,
                dateOfBirth: formatDateToYYYYMMDD(res.dateOfBirth),
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
                                <tr>
                                    <th>No of Days</th>
                                    <td>{countDaysBetweenDates(formData.startDate, formData.endDate)} Days</td>
                                </tr>
                            </tbody>
                        </table>
                    </CollapseForm>

                    <CollapseForm title='Cart Products' defaultOpen>
                        <div className="flex flex-col divide-y divide-base-200 border border-base-200">
                            {products.map((data) => {
                                const count = productCount[data.id] || 0;

                                return [...Array(count)].map((_, i) => (
                                    <div className="p-5 flex gap-8" key={`${data.id}-${i}`}>
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
                    <div className="text-xl font-semibold mb-5">Rental Agreement</div>
                    <div className="grid grid-cols-3 gap-5">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">First Name</legend>
                            <input type="text" className="input w-full" value={userData.firstName} onChange={e => setUserData({ ...userData, firstName: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Last Name</legend>
                            <input type="text" className="input w-full" value={userData.lastName} onChange={e => setUserData({ ...userData, lastName: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Date of birth</legend>
                            <input type="date" className="input w-full" value={userData.dateOfBirth} onChange={e => setUserData({ ...userData, dateOfBirth: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Email</legend>
                            <input type="text" className="input w-full" value={userData.email} onChange={e => setUserData({ ...userData, email: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Driver Licence No</legend>
                            <input type="text" className="input w-full" value={userData.driverLicenseNo} onChange={e => setUserData({ ...userData, driverLicenseNo: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Issue place of the license</legend>
                            <input type="text" className="input w-full" value={userData.driverLicensePlace} onChange={e => setUserData({ ...userData, driverLicensePlace: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Post Code</legend>
                            <input type="text" className="input w-full" value={userData.postCode} onChange={e => setUserData({ ...userData, postCode: e.target.value })} />
                        </fieldset>
                        <fieldset className="col-span-2 fieldset">
                            <legend className="fieldset-legend">Address</legend>
                            <input type="text" className="input w-full" value={userData.address} onChange={e => setUserData({ ...userData, address: e.target.value })} />
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