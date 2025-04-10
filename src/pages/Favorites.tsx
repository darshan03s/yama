import React, { useEffect } from 'react';
import { useRootContext } from '../context/Context';
import { MediaCard, Wrapper } from '../components';
import { fetchFavorites } from '../utils';
import GridWrapper from '../components/GridWrapper';
import { Loading } from '../components/MediaDetails';

const Favorites: React.FC = () => {
    const { favorites, fetchedFavorites, setFetchedFavorites, toggleFavorite } = useRootContext();

    useEffect(() => {

        if (favorites.listItems.length > 0) {
            fetchFavorites(favorites).then((fetchedFavorites) => {
                setFetchedFavorites(fetchedFavorites);
            });
        } else {
            setFetchedFavorites([]);
        }
    }, [favorites.listItems]);

    return (
        <Wrapper>
            <h1 className="text-xl sm:text-3xl text-amber-500 py-1 mb-2 text-center sm:text-left px-4 xl:px-0">
                {favorites.listName}
            </h1>
            <GridWrapper>
                {fetchedFavorites.length === 0 ? <Loading /> :
                    fetchedFavorites.map((item, index) => (
                        <MediaCard item={item.data} category={item.category} key={index} isFavorited={favorites.listItems.find(f => f.id === item.data.id)?.isFavorited ?? false} toggleFavorite={toggleFavorite} />
                    ))}
            </GridWrapper>
        </Wrapper>
    );
};

export default Favorites;
