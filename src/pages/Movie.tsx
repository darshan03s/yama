import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { Link, useParams } from 'react-router-dom'
import { useRootContext } from '../Context';
import { ExternalLink, Star } from 'lucide-react';
import { tmdbBaseUrl, formatMoney, tmdbOptions, fetchMovieFromTMDB, tmdbImageUrl } from '../utils';
import { MovieType } from '../types';

const Movie: React.FC = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<MovieType | null>(null);
    const { fetchedMovies, setFetchedMovies } = useRootContext();

    useEffect(() => {
        if (!id) return;
        const url = `${tmdbBaseUrl}/movie/${id}`;
        const fetchMovie = async () => {
            const resJson = await fetchMovieFromTMDB(url, tmdbOptions);
            console.log(resJson);
            setMovie(resJson);
            setFetchedMovies((prev) => ({ ...prev, [id]: resJson }));
        }

        if (fetchedMovies[id as string]) {
            setMovie(fetchedMovies[id as string]);
        } else {
            fetchMovie();
        }

    }, [id]);
    return (
        <Wrapper>
            {(!movie) ? <div className="w-full flex items-center justify-center mt-2">Loading...</div> : (
                <>
                    <h1 className="text-3xl text-amber-500 py-2 mb-2 text-center sm:text-center md:text-left md:pl-2">{movie.title}</h1>
                    <div className="movie w-full md:grid md:grid-cols-3">
                        <div className="movie-left w-full flex items-center justify-center sm:justify-center md:justify-start md:w-[300px] md:pl-2 md:col-span-1">
                            <div className="relative">
                                <img
                                    src={`${tmdbImageUrl}${movie.poster_path || movie.backdrop_path}`}
                                    alt={movie.title}
                                    className='w-[300px] sm:w-[300px] md:w-[250px] xl:w-[300px]'
                                />
                                <span className='absolute top-2 right-2 bg-amber-300 text-xs p-1 rounded flex gap-1 items-center'>
                                    <Star className='size-3.5' /> {Math.trunc(movie.vote_average * 10) / 10}
                                </span>
                            </div>
                        </div>

                        <div className="movie-right md:col-span-2 mt-2 md:mt-0 md:px-4 md:w-full px-4 py-4 md:py-0 space-y-3">
                            <h2 className="text-lg text-amber-500 font-bold flex items-center gap-1">
                                Overview
                                {movie.homepage && (
                                    <span className='text-xs p-1 rounded'>
                                        <Link to={movie.homepage} target="_blank" ><ExternalLink className='size-3.5' /></Link>
                                    </span>
                                )}
                            </h2>
                            <p className=''>{movie.overview}</p>
                            <p className=""><span className="text-amber-500 font-bold">Release Date:</span> {movie.release_date || "N/A"}</p>
                            <p className=""><span className="text-amber-500 font-bold">Runtime:</span> {movie.runtime || "N/A"} minutes</p>
                            <p className=""><span className="text-amber-500 font-bold">Genres:</span> {movie.genres?.map((genre: any) => genre.name).join(", ") || "N/A"}</p>
                            <p className=""><span className="text-amber-500 font-bold">Original Language:</span> {movie.original_language || "N/A"}</p>
                            <p className=""><span className="text-amber-500 font-bold">Original Title:</span> {movie.original_title || "N/A"}</p>
                            <p className=""><span className="text-amber-500 font-bold">Budget:</span> {movie.budget ? "$" + formatMoney(movie.budget) : "N/A"}</p>
                            <p className=""><span className="text-amber-500 font-bold">Revenue:</span> {movie.revenue ? "$" + formatMoney(movie.revenue) : "N/A"}</p>
                        </div>
                    </div>
                </>
            )}
        </Wrapper>
    )
}

export default Movie