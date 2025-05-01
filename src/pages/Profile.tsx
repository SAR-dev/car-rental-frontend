import { useEffect, useState } from 'react';
import NavLayout from '../layouts/NavLayout'
import { Collections } from '../types/pocketbase';
import { pb, usePocket } from '../contexts/PocketContext';
import { formatDateToYYYYMMDD } from '../helpers';
import toast from 'react-hot-toast';

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

function Profile() {
    const { user } = usePocket()
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

    const updateProfile = () => {
        if(!user) return;
        pb.collection(Collections.Users).update(user.id, {...userData}).then(() => toast.success("Profile updated")).catch(() => toast.error("Profile update failed"))
    }

    return (
        <NavLayout>
            <div className='py-16 px-10 max-w-6xl mx-auto'>
                <div className="text-xl font-semibold">Profile</div>
                <div className="grid grid-cols-3 gap-5 my-10">
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
                        <input type="text" className="input w-full" value={userData.driverLicenseNo} onChange={e => setUserData({ ...userData, driverLicenseNo: e.target.value })}  />
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
                    <button className="btn btn-primary" onClick={updateProfile}>Update Profile</button>
                </div>
            </div>
        </NavLayout>
    )
}

export default Profile