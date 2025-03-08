import React from 'react'
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
    name: string
    to: string
}

const NavItem: React.FC<NavItemProps> = ({ name, to }) => {
    const path = useLocation().pathname;
    return (
        <Link to={to} className='flex items-center'>
            <span
                className={`hidden sm:inline font-medium hover:text-black/80 transition-colors duration-100 ${path === to ? 'underline decoration-amber-800 decoration-2 underline-offset-4' : ''}`}>
                {name}
            </span>
        </Link>
    );
}

const Navbar: React.FC = () => {
    return (
        <nav className='bg-amber-300 p-2 flex items-center justify-center'>
            <div className="nav-items flex items-center gap-4">
                <NavItem name={"Movies"} to={"/movies"} />
                <NavItem name={"TV Shows"} to={"/tv-shows"} />
                <NavItem name={"Trendings"} to={"/trending"} />
            </div>
        </nav>
    )
}

export default Navbar