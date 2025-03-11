import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useSearchParams } from 'react-router-dom'
import { fetchSearchFromTMDB, tmdbBaseUrl, tmdbOptions } from '../utils';
import { Loading } from '../components/MediaDetails';
import MediaCard from '../components/MediaCard';

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [resultsList, setResultsList] = useState<any[]>([]);
    const category = searchParams.get('category');
    const url = `${tmdbBaseUrl}/search/${category}`;
    const query = searchParams.get('query');

    useEffect(() => {
        const fetchResults = async () => {
            const data = await fetchSearchFromTMDB(url, tmdbOptions, query!);
            setResultsList(data.results);
        }
        fetchResults();
    }, [query, category]);
    return (
        <Wrapper>
            <h1 className="text-xl sm:text-3xl text-amber-500 py-1 mb-2 text-center sm:text-left px-4 xl:px-0">Search results for {query} in {category === "movie" ? "Movies" : "TV Shows"}</h1>
            <div className="media-cards grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-2 px-4 xl:px-0">
                {resultsList.length === 0 ? <Loading /> : resultsList.map((item: any, index: number) => (
                    <MediaCard item={item} category={category!} key={index} />
                ))}
            </div>
        </Wrapper>
    )
}

export default SearchResults