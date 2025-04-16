import NavLayout from '../layouts/NavLayout'
import VehicleCard from '../components/VehicleCard'
import CollapseForm from '../components/CollapseForm'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import useLocalStorage from 'use-local-storage';
import { AgenciesRecord, Collections, VehicleOptionsRecord, VehicleTypesRecord } from '../types/pocketbase';
import { constants } from '../constants';
import { pb } from '../contexts/PocketContext';

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

    const [vehicleTypes, setVehicleTypes] = useLocalStorage<VehicleTypesRecord[]>(constants.VEHICLE_TYPES_STORE_KEY, [])
    const [agencies, setAgencies] = useLocalStorage<AgenciesRecord[]>(constants.AGENCIES_STORE_KEY, [])
    const [vehicleOptions, setVehicleOptions] = useLocalStorage<VehicleOptionsRecord[]>(constants.VEHICLE_OPTIONS_STORE_KEY, [])

    useEffect(() => {
        pb.collection(Collections.VehicleTypes).getFullList().then(res => setVehicleTypes(res))
        pb.collection(Collections.Agencies).getFullList().then(res => setAgencies(res))
        pb.collection(Collections.VehicleOptions).getFullList().then(res => setVehicleOptions(res))
    }, [])

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
                            <div className="flex flex-col gap-1">
                                {vehicleTypes.map(el => (
                                    <label className="fieldset-label" key={el.id}>
                                        <input
                                            type="checkbox"
                                            className="checkbox bg-base-100"
                                            checked={formData.vehicleTypeId == el.id}
                                            onChange={e => handleVehicleTypeChange(el.id, e.target.checked)}
                                        />
                                        {el.title}
                                    </label>
                                ))}
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Agency (departure and return)'>
                            <div className="flex flex-col gap-1">
                                {agencies.map(el => (
                                    <label className="fieldset-label" key={el.id}>
                                        <input
                                            type="checkbox"
                                            className="checkbox bg-base-100"
                                            checked={formData.agencyId == el.id}
                                            onChange={e => handleAgencyChange(el.id, e.target.checked)}
                                        />
                                        {el.name}
                                    </label>
                                ))}
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Departure'>
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
                        <CollapseForm title='Return'>
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
                            <div className="flex flex-col gap-1">
                                {vehicleOptions.map(el => (
                                    <label className="fieldset-label" key={el.id}>
                                        <input
                                            type="checkbox"
                                            className="checkbox bg-base-100"
                                            checked={formData.vehicleOptionId == el.id}
                                            onChange={e => handleVehicleOptionChange(el.id, e.target.checked)}
                                        />
                                        {el.title}
                                    </label>
                                ))}
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
                            {[...Array(18)].map((_, i) => <VehicleCard key={i} />)}
                        </div>
                    </div>
                </div>
            </div>
        </NavLayout>
    )
}

export default BookingSearch