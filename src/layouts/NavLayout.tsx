import { ReactNode } from 'react';
import NavBar from '../components/NavBar'

function NavLayout({ children }: { children: ReactNode }) {
    return (
        <div className='h-screen flex flex-col'>
            <NavBar />
            {children}
        </div>
    )
}

export default NavLayout