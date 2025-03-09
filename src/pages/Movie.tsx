import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useParams } from 'react-router-dom'
import { useRootContext } from '../Context';
import { tmdbBaseUrl, formatMoney, tmdbOptions, fetchMovieFromTMDB, tmdbImageUrl } from '../utils';
import { MovieType } from '../types';
import { Info, OverViewHeading, Poster, Title } from '../components/MediaDetails';

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
                    <Title title={movie.title} />
                    <div className="movie w-full md:grid md:grid-cols-3">
                        <Poster src={`${tmdbImageUrl}${movie.poster_path || movie.backdrop_path}`} alt={movie.title} rating={movie.vote_average} />

                        <div className="movie-right md:col-span-2 mt-2 md:mt-0 md:px-4 md:w-full px-4 py-4 md:py-0 space-y-3">
                            <OverViewHeading externalLink={movie.homepage} />
                            <Info value={movie.overview || "N/A"} />
                            <Info label="Release Date" value={movie.release_date || "N/A"} />
                            <Info label="Runtime" value={movie.runtime ? movie.runtime + " minutes" : "N/A"} />
                            <Info label="Genres" value={movie.genres?.map((genre: any) => genre.name).join(", ") || "N/A"} />
                            <Info label="Original Language" value={movie.original_language || "N/A"} />
                            <Info label="Original Title" value={movie.original_title || "N/A"} />
                            <Info label="Budget" value={movie.budget ? "$" + formatMoney(movie.budget) : "N/A"} />
                            <Info label="Revenue" value={movie.revenue ? "$" + formatMoney(movie.revenue) : "N/A"} />
                        </div>
                    </div>
                </>
            )}
        </Wrapper>
    )
}

export default Movie