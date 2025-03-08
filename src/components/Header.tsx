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
        <Link to={'/'} className='text-xl font-bold bg-amber-300 p-2 rounded-md'>MovieDB</Link>
    )
}

const Header: React.FC = () => {
    return (
        <header className='max-w-6xl mx-auto flex justify-between items-center p-2'>
            <div className=" menu-items p-2 flex items-center gap-8">
                <MenuItem name={"Home"} to={"/"} Icon={House} />
                <MenuItem name={"About"} to={"/about"} Icon={Info} />
            </div>
            <div className="logo"><Logo /></div>
        </header>
    )
}

export default Header
