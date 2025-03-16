import React from 'react'
import Wrapper from '../components/Wrapper'
import { useRootContext } from '../Context';

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
                        <h2 className="text-lg font-bold text-center sm:text-left">{user?.name}</h2>
                    </div>
                    <div className="user-email">
                        <p className="text-sm text-center sm:text-left">{user?.email}</p>
                    </div>
                </div>
            </div>
            <div className="user-lists my-4">
                <h2 className="text-xl sm:text-3xl text-amber-500 py-1 mb-2 text-center sm:text-left px-4 xl:px-0">Lists</h2>
            </div>
        </Wrapper>
    )
}

export default Profile