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
    const [searchParams] = useSearchParams();

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
            agencyId: searchParams.get("agencyId") || "",
            startDate: searchParams.get("startDate") || "",
            startTime: searchParams.get("startTime") || "",
            endDate: searchParams.get("endDate") || "",
            endTime: searchParams.get("endTime") || "",
        });
    }, [searchParams]);

    return (
        <NavLayout>
            <div className="container py-16 px-5 mx-auto">
                <div className="text-5xl font-bold text-center mb-16">Rent a car in Switzerland</div>
                <div className="grid grid-cols-4 gap-10">
                    <div className='bg-base-200 rounded flex flex-col sticky top-0 h-fit border border-base-300 shadow'>
                        <CollapseForm title='Vehicle Types'>
                            <div className="flex flex-col gap-1">
                                {vehicleTypes.map(e => (
                                    <label className="fieldset-label">
                                        <input 
                                            type="checkbox" 
                                            className="checkbox bg-base-100" 
                                            checked={formData.vehicleTypeId == e.id} 
                                        />
                                        {e.title}
                                    </label>
                                ))}
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Agency (departure and return)'>
                            <div className="flex flex-col gap-1">
                                {agencies.map(e => (
                                    <label className="fieldset-label">
                                        <input type="checkbox" className="checkbox bg-base-100" checked={formData.agencyId == e.id} />
                                        {e.name}
                                    </label>
                                ))}
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Departure'>
                            <div className="flex flex-col gap-5">
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={e =>
                                        !isNaN(Date.parse(e.target.value)) &&
                                        setFormData({ ...formData, startDate: e.target.value })
                                    }
                                    className="input"
                                />
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={e =>
                                        constants.TIME_FORMAT.test(e.target.value) &&
                                        setFormData({ ...formData, startTime: e.target.value })
                                    }
                                    className="input"
                                />
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Return'>
                            <div className="flex flex-col gap-5">
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={e =>
                                        !isNaN(Date.parse(e.target.value)) &&
                                        setFormData({ ...formData, endDate: e.target.value })
                                    }
                                    className="input"
                                />
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={e =>
                                        constants.TIME_FORMAT.test(e.target.value) &&
                                        setFormData({ ...formData, endTime: e.target.value })
                                    }
                                    className="input"
                                />
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Options'>
                            <div className="flex flex-col gap-1">
                                {vehicleOptions.map(e => (
                                    <label className="fieldset-label">
                                        <input type="checkbox" className="checkbox bg-base-100" checked={formData.vehicleOptionId == e.id} />
                                        {e.title}
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