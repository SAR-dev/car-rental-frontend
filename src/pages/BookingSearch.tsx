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
import { api } from '../helpers';

function BookingSearch() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [formData, setFormData] = useState({
        vehicleTypeId: "",
        vehicleOptionId: "",
        agencyId: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
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
        api.get("/api/vehicles").then(res => setVehicles(res.data.vehicleList as unknown as VehicleList[]))
    }, [formData])


    useEffect(() => {
        setFormData({
            ...formData,
            vehicleTypeId: searchParams.get("vehicleTypeId") || "",
            vehicleOptionId: searchParams.get("vehicleOptionId") || "",
            agencyId: searchParams.get("agencyId") || "",
            startDate: searchParams.get("startDate") || "",
            startTime: searchParams.get("startTime") || "",
            endDate: searchParams.get("endDate") || "",
            endTime: searchParams.get("endTime") || "",
        });
    }, [searchParams]);

    const handleVehicleTypeChange = (id: string, checked: boolean) => {
        if (checked) {
            searchParams.set("vehicleTypeId", id)
        } else {
            searchParams.set("vehicleTypeId", "")
        }
        setSearchParams(searchParams)
    }

    const handleAgencyChange = (id: string, checked: boolean) => {
        if (checked) {
            searchParams.set("agencyId", id)
        } else {
            searchParams.set("agencyId", "")
        }
        setSearchParams(searchParams)
    }

    const handleVehicleOptionChange = (id: string, checked: boolean) => {
        if (checked) {
            searchParams.set("vehicleOptionId", id)
        } else {
            searchParams.set("vehicleOptionId", "")
        }
        setSearchParams(searchParams)
    }

    return (
        <NavLayout>
            <div className="container py-16 px-5 mx-auto">
                <div className="text-5xl font-bold text-center mb-16">Rent a car in Switzerland</div>
                <div className="grid grid-cols-4 gap-10">
                    <div className='bg-base-200 rounded flex flex-col sticky top-0 h-fit border border-base-300 shadow'>
                        <CollapseForm title='Vehicle Types'>
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
                        <CollapseForm title='Agency (departure and return)'>
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
                        <CollapseForm title='Departure' defaultOpen>
                            <div className="flex flex-col gap-5">
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={e => {
                                        if (isNaN(Date.parse(e.target.value))) return;
                                        searchParams.set("startDate", e.target.value)
                                        setSearchParams(searchParams)
                                    }}
                                    className="input"
                                />
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={e => {
                                        if (!constants.TIME_FORMAT.test(e.target.value)) return;
                                        searchParams.set("startTime", e.target.value)
                                    }}
                                    className="input"
                                />
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Return' defaultOpen>
                            <div className="flex flex-col gap-5">
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={e => {
                                        if (isNaN(Date.parse(e.target.value))) return;
                                        searchParams.set("endDate", e.target.value)
                                        setSearchParams(searchParams)
                                    }}
                                    className="input"
                                />
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={e => {
                                        if (!constants.TIME_FORMAT.test(e.target.value)) return;
                                        searchParams.set("endTime", e.target.value)
                                    }}
                                    className="input"
                                />
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Options'>
                            <div className="flex flex-col gap-2">
                                {vehicleOptions.map(el => (
                                    <label className="fieldset-label" key={el.id}>
                                        <input
                                            type="checkbox"
                                            className="checkbox bg-white"
                                            checked={formData.vehicleOptionId == el.id}
                                            onChange={e => handleVehicleOptionChange(el.id, e.target.checked)}
                                        />
                                        {el.title}
                                    </label>
                                ))}
                                <select className='select mt-5' value="">
                                    <option value="" disabled={true}>Transmission Type</option>
                                    <option value="AUTOMATIC">Automatic</option>
                                    <option value="MANUAL">Manual</option>
                                </select>
                                <select className='select' value="">
                                    <option value="" disabled={true}>Fuel Type</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Gas">Gas</option>
                                </select>
                                <select className='select' value="">
                                    <option value="" disabled={true}>No of Doors</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                                <select className='select' value="">
                                    <option value="" disabled={true}>No of Persons</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                        </CollapseForm>
                        <div className="p-5 w-full">
                            <button className="btn btn-primary w-full">
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="col-span-3">
                        <div className="grid grid-cols-3 gap-10 w-full">
                            {vehicles.map((data, i) => <VehicleCard data={data} key={i} />)}
                        </div>
                    </div>
                </div>
            </div>
        </NavLayout>
    )
}

export default BookingSearch