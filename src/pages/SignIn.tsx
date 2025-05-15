import { useNavigate, useSearchParams } from 'react-router';
import NavLayout from '../layouts/NavLayout'
import { useEffect, useState } from 'react';
import { pb, usePocket } from '../contexts/PocketContext';
import { Collections } from '../types/pocketbase';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { isValidDate, isValidGenericLicense } from '../helpers';
import toast from 'react-hot-toast';
import { constants } from '../constants';

function SignIn() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const { logIn, user } = usePocket()

    const [isNewUser, setIsNewUser] = useState(false)
    const toogleNewUser = () => setIsNewUser(!isNewUser)
    const [isLoading, setIsLoading] = useState(false)
    const [accountCreated, setAccountCreated] = useState(false)

    const [error, setError] = useState<any>(null)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dateOfBirth: "",
        driverLicenseNo: ""
    })

    useEffect(() => {
      if(!!user) navigate(searchParams.get(constants.SEARCH_PARAMS.NEXT) || "")
    }, [])
    

    const createAccount = () => {
        if(formData.driverLicenseNo.length == 0 || !isValidGenericLicense(formData.driverLicenseNo)){
            alert("Provide correct driver license no")
            return;
        }
        if(formData.dateOfBirth.length == 0 || !isValidDate(formData.dateOfBirth)){
            alert("Provide correct Date de naissance")
            return;
        }

        setIsLoading(true)
        pb.collection(Collections.Users)
            .create({
                ...formData,
                passwordConfirm: formData.password
            })
            .then(() => {
                setAccountCreated(true)
                setIsNewUser(false)
            })
            .catch(err => {
                setError(err.data)
            })
            .finally(() => setIsLoading(false))

    }

    const signIn = () => {
        setIsLoading(true)
        logIn({email: formData.email, password: formData.password})
            .then(() => {
                toast.success("Signed in successfully")
                navigate(searchParams.get(constants.SEARCH_PARAMS.NEXT) || "")
            })
            .catch(() => toast.error("Sign in failed. Please try again."))
            .finally(() => setIsLoading(false))
    }


    return (
        <NavLayout>
            <div className="h-full w-full flex justify-center items-center">
                <div className="w-96 p-5 rounded border border-base-200 shadow my-10">
                    <div className="text-2xl font-bold text-center">
                        Bienvenue !!!
                    </div>
                    {isNewUser ? (
                        <div className="opacity-70 text-center text-sm">
                            Vous avez déjà un compte ? <button className='font-semibold text-yellow-600 opacity-100 btn-link cursor-pointer' onClick={toogleNewUser}>Se connecter</button>
                        </div>
                    ) : (
                        <div className="opacity-70 text-center text-sm">
                            Vous n'avez pas de compte ? <button className='font-semibold text-yellow-600 opacity-100 btn-link cursor-pointer' onClick={toogleNewUser}>Créer un compte</button>
                        </div>
                    )}
                    <div className="flex flex-col gap-3 mt-5">
                        {isNewUser && (
                            <>
                                <div className="grid grid-cols-2 gap-5">
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend">Prénom</legend>
                                        <input type="text" className="input w-full" placeholder='John' value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                    </fieldset>
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend">Nom de famille</legend>
                                        <input type="text" className="input w-full" placeholder='John' value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                    </fieldset>
                                </div>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Date de naissance</legend>
                                    <input type="date" className="input w-full" value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Driver License No</legend>
                                    <input type="text" className="input w-full" placeholder='SS-RRYYYYNNNNNNN' value={formData.driverLicenseNo} onChange={e => setFormData({ ...formData, driverLicenseNo: e.target.value.toUpperCase() })} />
                                </fieldset>
                            </>
                        )}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Email address</legend>
                            <input type="text" className="input w-full" placeholder='john.doe@gmail.com' value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Password</legend>
                            <input type="password" className="input w-full" placeholder='*********' value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        </fieldset>
                        {isNewUser ? (
                            <button className="btn w-full btn-primary" onClick={createAccount}>Créer un compte</button>
                        ) : (
                            <button className="btn w-full btn-primary" onClick={signIn}>Se connecter</button>
                        )}
                    </div>
                </div>
            </div>
            {isLoading && (
                <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center bg-base-300/25">
                    <span className="loading loading-spinner loading-xl"></span>
                </div>
            )}
            <Dialog open={!!error} onClose={() => setError(null)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-base-300/50">
                    <DialogPanel className="max-w-xl space-y-4 border border-base-200 bg-base-100 p-10">
                        <DialogTitle className="font-bold text-center text-error">Une erreur s'est produite</DialogTitle>
                        <div className="bg-error/50 p-5 w-full rounded text-xs">
                            <pre>{JSON.stringify(error, null, 2)}</pre>
                        </div>
                        <button className="btn w-full btn-primary mt-5" onClick={() => setError(null)}>Fermer</button>
                    </DialogPanel>
                </div>
            </Dialog>
            <Dialog open={accountCreated} onClose={() => setAccountCreated(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-base-300/50">
                    <DialogPanel className="max-w-xl space-y-4 border border-base-200 bg-base-100 p-10">
                        <div className="w-96 flex justify-center items-center flex-col gap-3">
                            <div className='text-5xl'>🌞</div>
                            <div>Compte créé avec succès. Veuillez vous connecter.</div>
                        </div>
                        <button className="btn w-full btn-primary mt-5" onClick={() => setAccountCreated(false)}>Fermer</button>
                    </DialogPanel>
                </div>
            </Dialog>
        </NavLayout>
    )
}

export default SignIn