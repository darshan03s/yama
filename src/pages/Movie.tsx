import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useParams } from 'react-router-dom'

const Movie: React.FC = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<any>({});

    useEffect(() => {
        const url = `https://api.themoviedb.org/3/movie/${id}`;
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
            },
        };
        const fetchMovie = async () => {
            const response = await fetch(url, options);
            const resJson = await response.json();
            console.log(resJson);
            setMovie(resJson);
        }

        fetchMovie();
    }, [id]);
    return (
        <Wrapper>
            <h1 className="text-3xl text-amber-500 py-2 mb-2 text-center sm:text-center md:text-left md:pl-2">{movie.title}</h1>
            <div className="movie w-full md:grid md:grid-cols-3">
                <div className="movie-left w-full flex items-center justify-center sm:justify-center md:justify-start md:pl-2 md:col-span-1">
                    <img
                        src={`https://image.tmdb.org/t/p/original${movie.poster_path || movie.backdrop_path}`}
                        alt={movie.title}
                        width={200}
                        className='w-[400px] sm:w-[300px]'
                    />
                </div>

                <div className="movie-right md:col-span-2 mt-2 md:mt-0">
                    <h2 className="px-4 py-1 md:px-0 text-lg text-amber-500 font-bold">Overview</h2>
                    <p className='px-4 py-1 md:px-0 md:w-full'>{movie.overview}</p>
                </div>
            </div>
        </Wrapper>
    )
}

export default Movie