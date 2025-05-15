import NavLayout from '../layouts/NavLayout'
import VehicleCard from '../components/VehicleCard'
import CollapseForm from '../components/CollapseForm'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import useLocalStorage from 'use-local-storage';
import { AgenciesRecord, Collections, VehicleOptionsRecord, VehicleTypesRecord } from '../types/pocketbase';
import { constants } from '../constants';
import { pb } from '../contexts/PocketContext';
import { VehicleList } from '../types/result';
import { api, generateTimeList } from '../helpers';

interface FormData {
    vehicleTypeId: string
    vehicleOptionIds: string[],
    agencyId: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    transmissionType: string
    fuelType: string
    noOfDoors: string
    noOfSeats: string
}

const timeList = generateTimeList(constants.TIME_RANGE.MIN, constants.TIME_RANGE.MAX)

function BookingSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loaded, setLoaded] = useState(false)

    const [formData, setFormData] = useState<FormData>({
        vehicleTypeId: "",
        vehicleOptionIds: [],
        agencyId: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        transmissionType: "",
        fuelType: "",
        noOfDoors: "",
        noOfSeats: ""
    });

    const [vehicles, setVehicles] = useState<VehicleList[]>([])

    const [vehicleTypes, setVehicleTypes] = useLocalStorage<VehicleTypesRecord[]>(constants.VEHICLE_TYPES_STORE_KEY, [])
    const [agencies, setAgencies] = useLocalStorage<AgenciesRecord[]>(constants.AGENCIES_STORE_KEY, [])
    const [vehicleOptions, setVehicleOptions] = useLocalStorage<VehicleOptionsRecord[]>(constants.VEHICLE_OPTIONS_STORE_KEY, [])

    useEffect(() => {
        pb.collection(Collections.VehicleTypes).getFullList().then(res => setVehicleTypes(res))
        pb.collection(Collections.Agencies).getFullList().then(res => setAgencies(res))
        pb.collection(Collections.VehicleOptions).getFullList().then(res => setVehicleOptions(res))
    }, [])

    useEffect(() => {
        api
            .get("/api/vehicles", {
                params: {
                    ...formData,
                    vehicleOptionIds: formData.vehicleOptionIds.filter(e => e.length > 0).join(",")
                }
            })
            .then(res => setVehicles(res.data.vehicleList as unknown as VehicleList[]))
            .then(() => setLoaded(true))
    }, [formData])


    useEffect(() => {
        setFormData({
            ...formData,
            vehicleTypeId: searchParams.get(constants.SEARCH_PARAMS.VEHICLE_TYPE_ID) || "",
            vehicleOptionIds: [...new Set((searchParams.get(constants.SEARCH_PARAMS.VEHICLE_OPTION_IDS) || "").split(","))],
            agencyId: searchParams.get(constants.SEARCH_PARAMS.AGENCY_ID) || "",
            startDate: searchParams.get(constants.SEARCH_PARAMS.START_DATE) || "",
            startTime: searchParams.get(constants.SEARCH_PARAMS.START_TIME) || "",
            endDate: searchParams.get(constants.SEARCH_PARAMS.END_DATE) || "",
            endTime: searchParams.get(constants.SEARCH_PARAMS.END_TIME) || "",
            transmissionType: searchParams.get(constants.SEARCH_PARAMS.TRANSMISSION_TYPE) || "",
            fuelType: searchParams.get(constants.SEARCH_PARAMS.FUEL_TYPE) || "",
            noOfDoors: searchParams.get(constants.SEARCH_PARAMS.NO_OF_DOORS) || "",
            noOfSeats: searchParams.get(constants.SEARCH_PARAMS.NO_OF_SEATS) || "",
        });
    }, [searchParams]);

    const handleVehicleTypeChange = (id: string, checked: boolean) => {
        if (checked) {
            searchParams.set(constants.SEARCH_PARAMS.VEHICLE_TYPE_ID, id)
        } else {
            searchParams.set(constants.SEARCH_PARAMS.VEHICLE_TYPE_ID, "")
        }
        setSearchParams(searchParams)
    }

    const handleAgencyChange = (id: string, checked: boolean) => {
        if (checked) {
            searchParams.set(constants.SEARCH_PARAMS.AGENCY_ID, id)
        } else {
            searchParams.set(constants.SEARCH_PARAMS.AGENCY_ID, "")
        }
        setSearchParams(searchParams)
    }

    const handleVehicleOption = (vehicleOptionId: string) => {
        const list = (searchParams.get(constants.SEARCH_PARAMS.VEHICLE_OPTION_IDS) || "").split(",")
        let str = ""
        if (list.includes(vehicleOptionId)) {
            str = list.filter(c => c != vehicleOptionId).join(",")
        } else {
            str = [...list, vehicleOptionId].join(",")
        }
        searchParams.set(constants.SEARCH_PARAMS.VEHICLE_OPTION_IDS, str)
        setSearchParams(searchParams)
    }

    return (
        <NavLayout>
            <div className="container py-16 px-5 mx-auto">
                <div className="text-5xl font-bold text-center mb-16 poppins-bold">Louer une voiture en France</div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    <div className='bg-base-200 rounded flex flex-col lg:sticky top-0 h-fit border border-base-content/15 shadow'>
                        <CollapseForm title='Types de véhicules'>
                            <div className="flex flex-col gap-2">
                                {vehicleTypes.map(el => (
                                    <label className="fieldset-label" key={el.id}>
                                        <input
                                            type="checkbox"
                                            className="checkbox bg-white"
                                            checked={formData.vehicleTypeId == el.id}
                                            onChange={e => handleVehicleTypeChange(el.id, e.target.checked)}
                                        />
                                        {el.title}
                                    </label>
                                ))}
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Agence (départ et retour)'>
                            <div className="flex flex-col gap-2">
                                {agencies.map(el => (
                                    <label className="fieldset-label" key={el.id}>
                                        <input
                                            type="checkbox"
                                            className="checkbox bg-white"
                                            checked={formData.agencyId == el.id}
                                            onChange={e => handleAgencyChange(el.id, e.target.checked)}
                                        />
                                        {el.name}
                                    </label>
                                ))}
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Départ' defaultOpen>
                            <div className="flex flex-col gap-5">
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
                                <select
                                    value={formData.startTime}
                                    onChange={e => searchParams.set(constants.SEARCH_PARAMS.START_TIME, e.target.value)}
                                    className="select"
                                >
                                    {timeList.map(e => (
                                        <option key={e} value={e}>{e}</option>
                                    ))}
                                </select>
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Retour' defaultOpen>
                            <div className="flex flex-col gap-5">
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
                                <select
                                    value={formData.endTime}
                                    onChange={e => searchParams.set(constants.SEARCH_PARAMS.END_TIME, e.target.value)}
                                    className="select"
                                >
                                    {timeList.map(e => (
                                        <option key={e} value={e}>{e}</option>
                                    ))}
                                </select>
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Options'>
                            <div className="flex flex-col gap-2">
                                {vehicleOptions.map(el => (
                                    <label className="fieldset-label" key={el.id}>
                                        <input
                                            type="checkbox"
                                            className="checkbox bg-white"
                                            checked={formData.vehicleOptionIds.includes(el.id)}
                                            onChange={() => handleVehicleOption(el.id)}
                                        />
                                        {el.title}
                                    </label>
                                ))}
                                <fieldset className="fieldset mt-3">
                                    <legend className="fieldset-legend">Transmission Type</legend>
                                    <select
                                        className='select'
                                        value={formData.transmissionType}
                                        onChange={(e) => {
                                            searchParams.set(constants.SEARCH_PARAMS.TRANSMISSION_TYPE, e.target.value)
                                            setSearchParams(searchParams)
                                        }
                                        }>
                                        <option value="">All</option>
                                        <option value="AUTOMATIC">Automatic</option>
                                        <option value="MANUAL">Manual</option>
                                    </select>
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Fuel Type</legend>
                                    <select
                                        className='select'
                                        value={formData.fuelType}
                                        onChange={(e) => {
                                            searchParams.set(constants.SEARCH_PARAMS.FUEL_TYPE, e.target.value)
                                            setSearchParams(searchParams)
                                        }
                                        }>
                                        <option value="">All</option>
                                        <option value="PETROL">Petrol</option>
                                        <option value="DIESEL">Diesel</option>
                                        <option value="ELECTRIC">Electric</option>
                                        <option value="HYBRID">Hybrid</option>
                                        <option value="CNG">CNG</option>
                                        <option value="LPG">LPG</option>
                                        <option value="HYDROGEN">Hydrogen</option>
                                        <option value="ETHANOL">Ethanol</option>
                                        <option value="BIODIESEL">Biodiesel</option>
                                        <option value="METHANOL">Methanol</option>
                                        <option value="PROPANE">Propane</option>
                                    </select>
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">No of Doors</legend>
                                    <select
                                        className='select'
                                        value={formData.noOfDoors}
                                        onChange={(e) => {
                                            searchParams.set(constants.SEARCH_PARAMS.NO_OF_DOORS, e.target.value)
                                            setSearchParams(searchParams)
                                        }
                                        }>
                                        <option value="">All</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">No of Seats</legend>
                                    <select
                                        className='select'
                                        value={formData.noOfSeats}
                                        onChange={(e) => {
                                            searchParams.set(constants.SEARCH_PARAMS.NO_OF_SEATS, e.target.value)
                                            setSearchParams(searchParams)
                                        }
                                        }>
                                        <option value="">All</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </fieldset>
                            </div>
                        </CollapseForm>
                    </div>
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
                            {vehicles.map((data, i) => <VehicleCard data={data} key={i} />)}
                        </div>
                        {vehicles.length == 0 && loaded && (
                            <div className='w-full h-20 flex justify-center items-center rounded border border-base-content/15 bg-base-200'>
                                ¯\_(ツ)_/¯ Aucune voiture trouvée ¯\_(ツ)_/¯
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </NavLayout>
    )
}

export default BookingSearch