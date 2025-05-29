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
import { Collections } from '../types/pocketbase';
import NotFoundError from '../components/NotFoundError';
import DataFetchError from '../components/DataFetchError';
import {
    countDifferenceBetweenDateTime,
    formatPrice,
    generateTimeList,
    uppercaseToCapitalize,
} from '../helpers';
import { TexpandVehicleDetailsResType } from '../types/result';
import { Img } from 'react-image';
import { constants } from '../constants';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import classNames from 'classnames';

interface FormData {
    agencyId: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    vehiclePackageId: string
    vehicleOptionIds: string[]
}

const timeList = generateTimeList(constants.TIME_RANGE.MIN, constants.TIME_RANGE.MAX)

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

    const enablePackage = useMemo(
        () => formData.agencyId.trim().length > 0
            && !isNaN(Date.parse(formData.startDate))
            && constants.TIME_FORMAT.test(formData.startTime)
            && !isNaN(Date.parse(formData.endDate))
            && constants.TIME_FORMAT.test(formData.endTime),
        [formData]
    );

    const selectedNoOfDays = useMemo(() => countDifferenceBetweenDateTime({
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime
    }).days, [formData])

    const selectedVehiclePackage = useMemo(() => data?.expand.vehiclePackages.find(e => e.id == formData.vehiclePackageId), [formData, data]);
    const selectedOptions = useMemo(() => data?.expand.vehicleOptions.filter(e => formData.vehicleOptionIds.includes(e.id)) ?? [], [formData, data]);

    useEffect(() => {
      if(selectedNoOfDays <= 1 && selectedVehiclePackage?.timeUnit == 'DAY'){
        searchParams.set(constants.SEARCH_PARAMS.VEHICLE_PACKAGE_ID, "")
        setSearchParams(searchParams)
        return;
      }
      if(selectedNoOfDays > 1 && selectedVehiclePackage?.timeUnit == 'HOUR'){
        searchParams.set(constants.SEARCH_PARAMS.VEHICLE_PACKAGE_ID, "")
        setSearchParams(searchParams)
        return;
      }
    }, [selectedNoOfDays, selectedVehiclePackage])
    

    useEffect(() => {
        if (!id || id.length == 0) return;
        pb
            .collection(Collections.Vehicles)
            .getOne(id, {
                expand: "images, featuresIncluded, featuresExcluded, agencies, vehicleOptions, vehiclePackages"
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

    const calculateVhiclePackagePrice = (timeUnit: string, unitPrice: number) => {
        if (timeUnit == 'HOUR') return countDifferenceBetweenDateTime({
            startDate: formData.startDate,
            startTime: formData.startTime,
            endDate: formData.endDate,
            endTime: formData.endTime
        }).hours * unitPrice
        if (timeUnit == 'DAY') return countDifferenceBetweenDateTime({
            startDate: formData.startDate,
            startTime: formData.startTime,
            endDate: formData.endDate,
            endTime: formData.endTime
        }).days * unitPrice
        return 0;
    }

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
                                <BsGear className="size-8" />
                                <div className="text-sm">{uppercaseToCapitalize(data.transmissionType)}</div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <GiOilySpiral className="size-8" />
                                <div className="text-sm">{uppercaseToCapitalize(data.fuelType)}</div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <BsDoorOpen className="size-8" />
                                <div className="text-sm">{data.noOfDoors} Portes</div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <BsPersonLinesFill className="size-8" />
                                <div className="text-sm">{data.noOfSeats} Personnes</div>
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-box border border-base-content/15 bg-base-100 w-full">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>Dimensions de chargement (L × W × H)</th>
                                        <td>{data.loadDimensions}</td>
                                    </tr>
                                    <tr>
                                        <th>Charge utile</th>
                                        <td>{data.payloadWeight}</td>
                                    </tr>
                                    <tr>
                                        <th>Hauteur extérieure</th>
                                        <td>{data.externalHeight}</td>
                                    </tr>
                                    <tr>
                                        <th>Type de licence</th>
                                        <td>{data.licenceType}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-base-200 border border-base-content/15 rounded w-full grid grid-cols-1">
                            <div className="p-5">
                                <CollapseForm title='Ramassage et retour' titleClass='text-xl' defaultOpen>
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
                                                <legend className="fieldset-legend">Date de début</legend>
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
                                                <legend className="fieldset-legend">Heure de début</legend>
                                                <select
                                                    value={formData.startTime}
                                                    onChange={e => {
                                                        searchParams.set(constants.SEARCH_PARAMS.START_TIME, e.target.value)
                                                        setSearchParams(searchParams)
                                                    }}
                                                    className="select"
                                                >
                                                    {timeList.map(e => (
                                                        <option key={e} value={e}>{e}</option>
                                                    ))}
                                                </select>
                                            </fieldset>
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <fieldset className="fieldset">
                                                <legend className="fieldset-legend">Date de fin</legend>
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
                                                <legend className="fieldset-legend">Fin des temps</legend>
                                                <select
                                                    value={formData.endTime}
                                                    onChange={e => {
                                                        searchParams.set(constants.SEARCH_PARAMS.END_TIME, e.target.value)
                                                        setSearchParams(searchParams)
                                                    }}
                                                    className="select"
                                                >
                                                    {timeList.map(e => (
                                                        <option key={e} value={e}>{e}</option>
                                                    ))}
                                                </select>
                                            </fieldset>
                                        </div>
                                        <div className={classNames("text-sm font-semibold", {
                                            "text-info": !!enablePackage,
                                            "text-error": !enablePackage
                                        })}>
                                            👆 Veuillez remplir ce formulaire pour continuer
                                        </div>
                                    </div>
                                </CollapseForm>
                            </div>
                            <hr className='text-base-content/25' />
                            <div className="p-5">
                                <CollapseForm title='Forfait véhicule' titleClass='text-xl' defaultOpen>
                                    <div className="flex flex-col gap-3">
                                        {data.expand.vehiclePackages.map((pac, i) => (
                                            <div className='flex gap-3' key={i}>
                                                <input
                                                    type="radio"
                                                    className="radio"
                                                    checked={pac.id == formData.vehiclePackageId}
                                                    disabled={!enablePackage || pac.timeUnit == 'HOUR' && selectedNoOfDays > 1 || pac.timeUnit == 'DAY' && selectedNoOfDays <= 1}
                                                    onChange={() => {
                                                        searchParams.set(constants.SEARCH_PARAMS.VEHICLE_PACKAGE_ID, pac.id)
                                                        setSearchParams(searchParams)
                                                    }}
                                                />
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex">
                                                        <span className='font-semibold'>{pac.title}</span><span className='mx-1'>:</span><span>{pac.maxDistanceKm} km package</span><span className='ml-1 font-bold text-primary bg-black px-2'>CHF {pac.pricePerTimeUnit}/ {pac.timeUnit.toLowerCase()}</span>
                                                    </div>
                                                    <div className="flex text-sm opacity-80">
                                                        <span>Prix ​​par km supplémentaire : </span><span className='ml-1'>CHF {pac.pricePerExtraKm}/km</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className={classNames("text-sm font-semibold", {
                                            "text-info": !!selectedVehiclePackage,
                                            "text-error": !selectedVehiclePackage
                                        })}>
                                            👆 Sélectionnez un forfait pour continuer
                                        </div>
                                    </div>
                                </CollapseForm>
                            </div>
                            <hr className='text-base-content/25' />
                            <div className="p-5">
                                <CollapseForm title='Options' titleClass='text-xl' defaultOpen>
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
                                                        <div className='font-bold text-primary bg-black px-2'>
                                                            CHF {option.price}/ day
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
                                <CollapseForm title='Ce qui est inclus' titleClass='text-xl'>
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
                                <CollapseForm title='Ce qui nest pas inclus' titleClass='text-xl'>
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
                            <div className="flex justify-between p-5 bg-base-content text-base-100">
                                <div className="flex gap-3 items-center justify-end">
                                    <div className="text-xl font-semibold uppercase opacity-70">
                                        Montant à payer
                                    </div>
                                    <div className="text-xl font-bold">CHF {enableRentNow ? formatPrice(
                                        selectedVehiclePackage ? calculateVhiclePackagePrice(selectedVehiclePackage.timeUnit, selectedVehiclePackage.pricePerTimeUnit) : 0 +
                                            ((selectedOptions.map(e => e.price).reduce((partialSum, a) => partialSum + a, 0)) * countDifferenceBetweenDateTime({
                                                startDate: formData.startDate,
                                                startTime: formData.startTime,
                                                endDate: formData.endDate,
                                                endTime: formData.endTime
                                            }).days)
                                    ) : 0}</div>
                                </div>
                                <div className="flex gap-5 justify-end">
                                    <button className="btn" onClick={() => navigate(-1)}>Annuler</button>
                                    <button className="btn btn-primary" onClick={() => setIsOpened(true)} disabled={!enableRentNow}>Nos Véhicules</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={isOpened} onClose={() => setIsOpened(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-base-300/50">
                    <DialogPanel className="max-w-xl space-y-4 border border-base-300 bg-base-100 shadow p-10">
                        <DialogTitle className="font-bold poppins-bold">Examiner les options sélectionnées</DialogTitle>
                        <table className="table border border-slate-300 mt-5">
                            <tbody>
                                <tr>
                                    <th>Agency</th>
                                    <td>{data.expand.agencies.find(e => e.id == formData.agencyId)?.name || "N/A"}</td>
                                </tr>
                                <tr>
                                    <th>Commencer à</th>
                                    <td>{formData.startDate} {formData.startTime}</td>
                                </tr>
                                <tr>
                                    <th>Fin à</th>
                                    <td>{formData.endDate} {formData.endTime}</td>
                                </tr>
                                <tr>
                                    <th>Nombre de jours</th>
                                    <td>{countDifferenceBetweenDateTime({
                                        startDate: formData.startDate,
                                        startTime: formData.startTime,
                                        endDate: formData.endDate,
                                        endTime: formData.endTime
                                    }).days} Jours</td>
                                </tr>
                                <tr>
                                    <th>Nombre d'heures</th>
                                    <td>{countDifferenceBetweenDateTime({
                                        startDate: formData.startDate,
                                        startTime: formData.startTime,
                                        endDate: formData.endDate,
                                        endTime: formData.endTime
                                    }).hours} Heures</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table border border-slate-300 mt-5">
                            <tbody>
                                <tr>
                                    <th>Taper</th>
                                    <th>Prix ​​unitaire</th>
                                    <th>Unité de temps</th>
                                    <th>Prix ​​total</th>
                                </tr>
                                {selectedVehiclePackage && (
                                    <tr>
                                        <td>Forfait véhicule: {selectedVehiclePackage.title}</td>
                                        <td>CHF {selectedVehiclePackage.pricePerTimeUnit}</td>
                                        <td>{selectedVehiclePackage.timeUnit}</td>
                                        <td>CHF {calculateVhiclePackagePrice(selectedVehiclePackage.timeUnit, selectedVehiclePackage.pricePerTimeUnit)}</td>
                                    </tr>
                                )}
                                {selectedOptions.map((e, i) => (
                                    <tr key={i}>
                                        <td>Supplémentaire: {e.title}</td>
                                        <td>CHF {e.price}</td>
                                        <td>DAY</td>
                                        <td>CHF {e.price * countDifferenceBetweenDateTime({
                                            startDate: formData.startDate,
                                            startTime: formData.startTime,
                                            endDate: formData.endDate,
                                            endTime: formData.endTime
                                        }).days}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <th>Prix ​​total</th>
                                    <th></th>
                                    <th></th>
                                    <th>CHF {formatPrice(
                                        selectedVehiclePackage ? calculateVhiclePackagePrice(selectedVehiclePackage.timeUnit, selectedVehiclePackage.pricePerTimeUnit) : 0 +
                                            ((selectedOptions.map(e => e.price).reduce((partialSum, a) => partialSum + a, 0)) * countDifferenceBetweenDateTime({
                                                startDate: formData.startDate,
                                                startTime: formData.startTime,
                                                endDate: formData.endDate,
                                                endTime: formData.endTime
                                            }).days)
                                    )}</th>
                                </tr>
                            </tbody>
                        </table>
                        <Link
                            to={"/bookings/" + id + "/reservation" + location.search}
                            className="btn w-full btn-primary mt-5"
                        >
                            Procéder
                        </Link>
                    </DialogPanel>
                </div>
            </Dialog>
        </NavLayout>
    )
}

export default BookingDetails