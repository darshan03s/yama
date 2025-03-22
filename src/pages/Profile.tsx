import React from 'react'
import { Wrapper } from '../components'
import { useRootContext } from '../Context';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
    const { user } = useRootContext();
    return (
        <Wrapper>
            <h1 className="text-xl sm:text-3xl text-amber-500 py-1 mb-2 text-center sm:text-left px-4 xl:px-0">
                Profile
            </h1>
            <div className="user-info w-full flex flex-col sm:flex-row gap-2 sm:gap-6 items-center justify-center sm:justify-start px-4 xl:px-0">
                <div className="user-image">
                    <img src={user?.avatar_url} alt="Avatar" className='rounded-full size-20' />
                </div>
                <div className='sm:flex sm:flex-col sm:gap-1'>
                    <div className="user-name">
                        <h2 className="text-lg font-bold text-center sm:text-left">{user?.username}</h2>
                    </div>
                    <div className="user-email">
                        <p className="text-sm text-center sm:text-left">{user?.email}</p>
                    </div>
                </div>
            </div>
            <div className="user-lists-info my-4">
                <h2 className="text-xl sm:text-3xl text-amber-500 py-1 mb-2 text-center sm:text-left px-4 xl:px-0">Lists</h2>
                <div className="user-lists w-full px-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                    <Link to="/profile/favorites">
                        <div className="list-card favorite-list w-[200px] bg-amber-200 h-80 hover:scale-105 transition-all cursor-pointer duration-300 flex items-center justify-center flex-col rounded-lg">
                            <Heart className="text-amber-500 opacity-30" fill="orange" size={140} />
                            <h3 className="text-amber-500 font-bold">Favorites</h3>
                        </div>
                    </Link>
                </div>
            </div>
        </Wrapper>
    )
}

export default Profile