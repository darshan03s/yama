import React, { useEffect, useState } from 'react'
import { Wrapper } from '../components'
import { useParams } from 'react-router-dom'
import { useRootContext } from '../context/Context';
import { tmdbBaseUrl, formatMoney, fetchMovieFromTMDB, tmdbImageUrl, devLog, fetchMovieVideosFromTMDB, fetchMovieCreditsFromTMDB, stillPlaceholder } from '../utils';
import { MovieType } from '../types';
import { Info, Loading, Poster, Title } from '../components/MediaDetails';

const Overview: React.FC<{ movie: MovieType }> = ({ movie }) => {
    return (
        <>
            <Info value={movie.overview || "N/A"} />
            <Info label="Release Date" value={movie.release_date || "N/A"} />
            <Info label="Runtime" value={movie.runtime ? movie.runtime + " minutes" : "N/A"} />
            <Info label="Genres" value={movie.genres?.map((genre: any) => genre.name).join(", ") || "N/A"} />
            <Info label="Original Language" value={movie.original_language || "N/A"} />
            <Info label="Original Title" value={movie.original_title || "N/A"} />
            <Info label="Budget" value={movie.budget ? "$" + formatMoney(movie.budget) : "N/A"} />
            <Info label="Revenue" value={movie.revenue ? "$" + formatMoney(movie.revenue) : "N/A"} />
        </>
    )
}

const Videos: React.FC<{ movie: MovieType }> = ({ movie }) => {
    return (
        <>
            {
                movie.videos.length === 0 ? (
                    <div>No Videos</div>
                ) : (
                    <div className="videos flex flex-col gap-2 mb-2">
                        {movie.videos?.map((video, index) => (
                            <div key={index} className="video">
                                <iframe
                                    src={`https://www.youtube.com/embed/${video.key}`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className='aspect-video w-full rounded-lg'
                                />
                            </div>
                        ))}
                    </div>
                )
            }
        </>
    )
}

const Cast: React.FC<{ movie: MovieType }> = ({ movie }) => {
    return (
        <div className="cast grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movie?.cast?.map((castDetails, index) => (
                <div key={index} className={`person flex flex-col items-center ${!castDetails.profile_path ? "justify-center" : ""}`}>
                    <img src={castDetails.profile_path ? `${tmdbImageUrl}${castDetails.profile_path}` : stillPlaceholder} alt={castDetails.name} className="rounded-lg" loading="lazy" />
                    <p className="text-sm font-bold text-amber-500 text-center">{castDetails.name}</p>
                    <p className="text-sm text-center">{castDetails?.character} ({castDetails.known_for_department})</p>
                </div>
            ))}
        </div>
    )
}

const Crew: React.FC<{ movie: MovieType }> = ({ movie }) => {
    return (
        <div className="cast grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movie?.crew.map((crewDetails, index) => (
                <div key={index} className={`person flex flex-col items-center ${!crewDetails.profile_path ? "justify-center" : ""}`}>
                    <img src={crewDetails.profile_path ? `${tmdbImageUrl}${crewDetails.profile_path}` : stillPlaceholder} alt={crewDetails.name} className="rounded-lg" loading="lazy" />
                    <p className="text-sm font-bold text-amber-500 text-center">{crewDetails.name}</p>
                    <p className="text-sm text-center">{crewDetails?.roles?.[0]?.character} ({crewDetails.department || crewDetails.known_for_department}, {crewDetails.job})</p>
                </div>
            ))}
        </div>
    )
}

const Movie: React.FC = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<MovieType | null>(null);
    const { fetchedMovies, setFetchedMovies } = useRootContext();
    let imgSrc = (movie?.poster_path || movie?.backdrop_path) ? `${tmdbImageUrl}${movie?.poster_path || movie?.backdrop_path}` : "https://placehold.co/620x900?text=No+Poster";
    const [activeTab, setActiveTab] = useState<string>("overview");
    const url = `${tmdbBaseUrl}/movie/${id}`;
    const movieVideosUrl = `${tmdbBaseUrl}/movie/${id}/videos`;
    const movieCreditsUrl = `${tmdbBaseUrl}/movie/${id}/credits`;

    useEffect(() => {
        if (!id) return;
        const fetchMovie = async () => {
            fetchMovieFromTMDB(url).then((resJson: MovieType) => {
                fetchMovieVideosFromTMDB(movieVideosUrl).then((videos: any) => {
                    resJson.videos = videos.results.filter((video: any) => video.site === "YouTube").reverse().filter((video: any) => video.type === "Trailer" || video.name.includes("Trailer"));
                    fetchMovieCreditsFromTMDB(movieCreditsUrl).then((credits: any) => {
                        devLog("Credits", credits);
                        resJson.cast = credits.cast;
                        resJson.crew = credits.crew;
                        devLog("Final Movie Object", resJson);
                        setMovie(resJson);
                        setFetchedMovies((prev) => ({ ...prev, [id]: resJson }));
                    });
                });
            });
        }

        if (fetchedMovies[id as string]) {
            setMovie(fetchedMovies[id as string]);
        } else {
            fetchMovie();
        }

    }, [id]);

    useEffect(() => {
        devLog("Fetched movies", fetchedMovies);
    }, [fetchedMovies]);

    return (
        <Wrapper>
            {(!movie) ? <Loading /> : (
                <>
                    <Title title={movie.title} />
                    <div className="movie w-full md:grid md:grid-cols-3">
                        <Poster src={imgSrc} alt={movie.title} rating={movie.vote_average} externalLink={movie.homepage} />
                        <div className="movie-right md:col-span-2 mt-2 md:mt-0 md:px-4 md:w-full px-4 py-4 md:py-0 space-y-3">
                            <div className="tabs bg-amber-200 rounded-xl px-1 sm:px-2 py-2 flex gap-1 text-xs sm:text-base">
                                <button className={`px-4 py-1 rounded-lg ${activeTab === "overview" ? "bg-amber-300" : ""}`} onClick={() => setActiveTab("overview")}>
                                    Overview
                                </button>
                                <button className={`px-4 py-1 rounded-lg ${activeTab === "videos" ? "bg-amber-300" : ""}`} onClick={() => setActiveTab("videos")}>
                                    Videos
                                </button>
                                <button className={`px-4 py-1 rounded-lg ${activeTab === "cast" ? "bg-amber-300" : ""}`} onClick={() => setActiveTab("cast")}>
                                    Cast
                                </button>
                                <button className={`px-4 py-1 rounded-lg ${activeTab === "crew" ? "bg-amber-300" : ""}`} onClick={() => setActiveTab("crew")}>
                                    Crew
                                </button>
                            </div>

                            {activeTab === "overview" && <Overview movie={movie} />}
                            {activeTab === "videos" && <Videos movie={movie} />}
                            {activeTab === "cast" && <Cast movie={movie} />}
                            {activeTab === "crew" && <Crew movie={movie} />}

                        </div>
                    </div>
                </>
            )}
        </Wrapper>
    )
}

export default Movie