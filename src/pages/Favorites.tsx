import React from 'react'
import { useRootContext } from '../Context';
import { Wrapper } from '../components';

const Favorites: React.FC = () => {
    const { favorites } = useRootContext();
    return (
        <Wrapper>
            <h1 className="text-xl sm:text-3xl text-amber-500 py-1 mb-2 text-center sm:text-left px-4 xl:px-0">{favorites.listName}</h1>
            <div className="favorites">
                {favorites.listItems.map((item, index) => (
                    <div key={index}>{item.id}</div>
                ))}
            </div>
        </Wrapper>
    )
}

export default Favorites