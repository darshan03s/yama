import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { House, Info, LogOut, LucideIcon, UserRound } from "lucide-react"
import { useRootContext } from '../Context'
import { signOut } from '../auth'

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
    const { session } = useRootContext();
    const navigate = useNavigate();
    const [showAccountOptions, setShowAccountOptions] = useState<boolean>(false);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowAccountOptions(false);
            }
        };

        if (showAccountOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showAccountOptions]);

    const handleLogOut = () => {
        signOut();
    }

    return (
        <header className='max-w-6xl mx-auto flex justify-between items-center py-1 px-2'>
            <div className=" menu-items p-2 flex items-center gap-8">
                <MenuItem name={"Home"} to={"/"} Icon={House} />
                <MenuItem name={"About"} to={"/about"} Icon={Info} />
            </div>
            <div className="logo account flex items-center justify-center gap-2">
                <Logo />
                {session ?
                    <>
                        <div className='cursor-pointer relative' onClick={() => setShowAccountOptions(!showAccountOptions)}>
                            <img src={session.user.user_metadata.avatar || session.user.user_metadata.picture} alt="Avatar" className='size-8 md:size-9 rounded-full' />
                            {showAccountOptions &&
                                <div ref={popupRef} className="account-options absolute z-20 bg-white shadow-lg rounded-md right-2 top-10 w-[150px] flex flex-col gap-2 py-1 px-1">
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="account-options-item hover:bg-gray-200 rounded-md h-8 flex items-center justify-center gap-2 transition-colors duration-100 cursor-pointer"
                                    >
                                        <UserRound className='size-4' /> Profile
                                    </button>
                                    <button
                                        onClick={handleLogOut}
                                        className="account-options-item hover:bg-red-100 text-red-500 rounded-md h-8 flex items-center justify-center gap-2 transition-colors duration-100 cursor-pointer"
                                    >
                                        <LogOut className='size-4' /> Logout
                                    </button>
                                </div>
                            }
                        </div>
                    </>
                    :
                    <>
                        <button
                            onClick={() => { navigate('/login') }}
                            className='text-sm md:text-lg p-1 px-2 rounded-md border cursor-pointer bg-black text-white'>
                            Login
                        </button>
                    </>}
            </div>
        </header>
    )
}

export default Header
