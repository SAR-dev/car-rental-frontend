import { formatDateToDMY } from "../helpers/date";
import NavLayout from "../layouts/NavLayout";
import useLocalStorage from "use-local-storage";
import { AgenciesRecord, Collections, VehicleTypesRecord } from "../types/pocketbase";
import { constants } from "../constants";
import { useEffect, useState } from "react";
import { pb } from "../contexts/PocketContext";
import { useNavigate } from "react-router";

function Home() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        vehicleTypeId: "",
        agencyId: "",
        startDate: formatDateToDMY(new Date(new Date().setDate(new Date().getDate() + 1))),
        startTime: "09:00",
        endDate: formatDateToDMY(new Date(new Date().setDate(new Date().getDate() + 2))),
        endTime: "09:00",
    })

    const [vehicleTypes, setVehicleTypes] = useLocalStorage<VehicleTypesRecord[]>(constants.VEHICLE_TYPES_STORE_KEY, [])
    const [agencies, setAgencies] = useLocalStorage<AgenciesRecord[]>(constants.AGENCIES_STORE_KEY, [])

    useEffect(() => {
        pb.collection(Collections.VehicleTypes).getFullList().then(res => setVehicleTypes(res))
        pb.collection(Collections.Agencies).getFullList().then(res => setAgencies(res))
    }, [])

    const handleSearch = () => {
        const params = new URLSearchParams(formData).toString();
        navigate(`/bookings?${params}`)
    }

    return (
        <NavLayout>
            <div className="flex w-full my-16 justify-center">
                <div className="px-10 py-10 rounded-t bg-primary w-[25rem]">
                    <div className="flex flex-col gap-5">
                        <div className="text-2xl text-center font-semibold text-white">Rent a car now</div>
                        <select
                            value={formData.vehicleTypeId}
                            onChange={e => setFormData({ ...formData, vehicleTypeId: e.target.value })}
                            className="select"
                        >
                            <option value="" disabled={true}>Vehicle Type</option>
                            {vehicleTypes.map(e => (
                                <option key={e.id} value={e.id}>{e.title}</option>
                            ))}
                        </select>
                        <select
                            value={formData.agencyId}
                            onChange={e => setFormData({ ...formData, agencyId: e.target.value })}
                            className="select"
                        >
                            <option value="" disabled={true}>Agency</option>
                            {agencies.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                        <div className="grid grid-cols-2 gap-5">
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
                        <div className="grid grid-cols-2 gap-5">
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
                        <button className="btn" onClick={handleSearch}>Search</button>
                    </div>
                </div>
            </div>
        </NavLayout>
    )
}

export default Home