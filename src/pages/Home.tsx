import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import { useRootContext } from '../Context'

const Home: React.FC = () => {
    const path = useLocation().pathname;
    const { data, setData } = useRootContext();
    const [currentList, setCurrentList] = useState<any[]>([]);
    const [mediaType, setMediaType] = useState<string>("");

    let url = "https://api.themoviedb.org/3/";

    useEffect(() => {
        if (path === "/") {
            url += "discover/movie?include_adult=false";
            setMediaType("movie");
        }
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
            },
        };
        const fetchData = async () => {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }
            const resJson = await response.json();
            setData(prev => ({ ...prev, discover: resJson.results }));
            setCurrentList(resJson.results);
        }
        if (!data.discover || data.discover.length === 0) {
            fetchData();
        } else {
            setCurrentList(data.discover);
        }
    }, [path]);

    return (
        <div
            className='max-w-6xl mx-auto'>
            <h1 className='text-3xl text-amber-500 py-1 mb-2'>Discover</h1>
            <div className="media-cards sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-2">
                {currentList.map((item: any, index: number) => (
                    <MediaCard item={item} mediaType={mediaType} key={index} />
                ))}
            </div>
        </div>
    )
}

export default Home;