import React from 'react'
import { Link } from 'react-router-dom'
import { House, Info, LucideIcon } from "lucide-react"

interface MenuItemProps {
    name: string
    to: string
    Icon: LucideIcon
}

const MenuItem: React.FC<MenuItemProps> = ({ name, to, Icon }) => {
    return (
        <Link to={to} className='flex items-center'><Icon className='sm:hidden inline' /> <span className='hidden sm:inline font-medium hover:text-amber-400 transition-colors duration-100'>{name}</span></Link>
    )
}

const Logo: React.FC = () => {
    return (
        <Link to={'/'} className='text-sm md:text-lg font-bold bg-amber-300 p-1 rounded-md'>YAMDb</Link>
    )
}

const Header: React.FC = () => {
    return (
        <header className='max-w-6xl mx-auto flex justify-between items-center p-2'>
            <div className=" menu-items p-2 flex items-center gap-8">
                <MenuItem name={"Home"} to={"/"} Icon={House} />
                <MenuItem name={"About"} to={"/about"} Icon={Info} />
            </div>
            <div className="logo account flex items-center gap-2">
                <Logo />
                <div className="account">
                    <Link to={'/login'} className="text-sm md:text-lg border p-1 rounded-md cursor-pointer">
                        Login
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header
