import { useEffect } from 'react';
import NavLayout from '../layouts/NavLayout'
import { usePocket } from '../contexts/PocketContext'
import { useLocation, useNavigate } from 'react-router'

function BookingReservation() {
    const { user } = usePocket()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
      if(!!user) return;
      navigate("/sign-in?next=" + location.pathname + location.search)
    }, [user])
    

    return (
        <NavLayout>
            <div className='py-16 px-10 container mx-auto'>

            </div>
        </NavLayout>
    )
}

export default BookingReservation