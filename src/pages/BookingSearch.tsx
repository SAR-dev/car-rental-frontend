import NavLayout from '../layouts/NavLayout'
import { formatDateToDMY } from '../helpers/date'
import VehicleCard from '../components/VehicleCard'
import CollapseForm from '../components/CollapseForm'

function BookingSearch() {
    return (
        <NavLayout>
            <div className="container py-16 px-5 mx-auto">
                <div className="text-5xl font-bold text-center mb-16">Rent a car in Switzerland</div>
                <div className="grid grid-cols-4 gap-10">
                    <div className='bg-base-200 rounded flex flex-col sticky top-0 h-fit border border-base-300 shadow'>
                        <CollapseForm title='Vehicle Types'>
                            <div className="flex flex-col gap-1">
                                <label className="fieldset-label">
                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                    Cars
                                </label>
                                <label className="fieldset-label">
                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                    Utility Vehicles
                                </label>
                                <label className="fieldset-label">
                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                    Family Cars
                                </label>
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Agency (departure and return)'>
                            <div className="flex flex-col gap-1">
                                <label className="fieldset-label">
                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                    Bussigny Lausanne
                                </label>
                                <label className="fieldset-label">
                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                    Nyon
                                </label>
                                <label className="fieldset-label">
                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                    Geneva
                                </label>
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Departure'>
                            <div className="flex flex-col gap-5">
                                <input
                                    type="date"
                                    defaultValue={formatDateToDMY(new Date())}
                                    className="input"
                                />
                                <input
                                    type="time"
                                    defaultValue="09:00"
                                    className="input"
                                />
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Return'>
                            <div className="flex flex-col gap-5">
                                <input
                                    type="date"
                                    defaultValue={formatDateToDMY(new Date())}
                                    className="input"
                                />
                                <input
                                    type="time"
                                    defaultValue="09:00"
                                    className="input"
                                />
                            </div>
                        </CollapseForm>
                        <CollapseForm title='Options'>
                            <div className="flex flex-col gap-1">
                                <label className="fieldset-label">
                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                    Automatic
                                </label>
                                <label className="fieldset-label">
                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                    Manual
                                </label>
                                <label className="fieldset-label">
                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                    3 Seats
                                </label>
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