import { ReactNode } from 'react';
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

function NavLayout({ children }: { children: ReactNode }) {
    return (
        <div className='h-screen flex flex-col'>
            <NavBar />
            {children}
            <Footer />
        </div>
    )
}

export default NavLayout