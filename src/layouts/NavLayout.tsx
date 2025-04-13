import { ReactNode } from 'react';
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

function NavLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <NavBar />
            {children}
            <Footer />
        </div>
    )
}

export default NavLayout