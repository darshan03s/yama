import React, { useEffect } from 'react';
import { useRootContext } from '../Context';
import { MediaCard, Wrapper } from '../components';
import { devLog, tmdbBaseUrl } from '../utils';
import GridWrapper from '../components/GridWrapper';

const Favorites: React.FC = () => {
    const { favorites, fetchedFavorites, setFetchedFavorites, toggleFavorite } = useRootContext();

    useEffect(() => {
        async function fetchFavorites() {
            const fetchedData = await Promise.all(
                favorites.listItems.map(async (item) => {
                    const url = `${tmdbBaseUrl}/${item.category}/${item.id}?api_key=${import.meta.env.VITE_TMDB_API}`;
                    const res = await fetch(url);
                    if (!res.ok) return null;

                    const data = await res.json();
                    return { category: item.category, data };
                })
            );

            const updatedFetchedFavorites = fetchedData.filter(item =>
                item !== null && favorites.listItems.some(f => f.id === item.data.id)
            );

            setFetchedFavorites(updatedFetchedFavorites);
        }

        if (favorites.listItems.length > 0) {
            fetchFavorites();
        } else {
            setFetchedFavorites([]);
        }
    }, [favorites.listItems]);

    devLog("Favorites", favorites);
    devLog("Fetched favorites", fetchedFavorites);

    return (
        <Wrapper>
            <h1 className="text-xl sm:text-3xl text-amber-500 py-1 mb-2 text-center sm:text-left px-4 xl:px-0">
                {favorites.listName}
            </h1>
            <GridWrapper>
                {fetchedFavorites.map((item, index) => (
                    <MediaCard item={item.data} category={item.category} key={index} isFavorited={favorites.listItems.find(f => f.id === item.data.id)?.isFavorited ?? false} toggleFavorite={toggleFavorite} />
                ))}
            </GridWrapper>
        </Wrapper>
    );
};

export default Favorites;
