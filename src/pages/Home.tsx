import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import MediaCard from '../components/MediaCard';

const Home: React.FC = () => {
    const path = useLocation().pathname;
    const [data, setData] = useState([]);
    const [mediaType, setMediaType] = useState("");

    let url = "https://api.themoviedb.org/3/";

    console.log(data);

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
            next: { revalidate: 60 },
        };
        const fetchData = async () => {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }
            const resJson = await response.json();
            setData(resJson.results);
        }

        fetchData();
    }, [path]);

    return (
        <div
            className='max-w-6xl mx-auto'>
            <h1 className='text-3xl text-amber-500 py-1 mb-2'>Discover</h1>
            <div className="media-cards sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-2">
                {data.map((item: any) => (
                    <MediaCard item={item} mediaType={mediaType} />
                ))}
            </div>
        </div>
    )
}

export default Home;