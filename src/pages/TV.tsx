import React, { useEffect, useState } from 'react'
import { Wrapper } from '../components'
import { useParams } from 'react-router-dom'
import { useRootContext } from '../context/Context';
import { devLog, fetchTvShowCredits, fetchTVShowFromTMDB, fetchTVShowSeasonFromTMDB, fetchTVShowVideosFromTMDB, formatTime, stillPlaceholder, tmdbBaseUrl, tmdbImageUrl} from '../utils';
import { Info, Loading, Poster, Title } from '../components/MediaDetails';
import { TYShowType } from '../types';
import { useTVShowContext } from '../context/TVShowContext';
import { Star } from 'lucide-react';

const Overview: React.FC<{ tv: TYShowType }> = ({ tv }) => {
    return (
        <>
            <Info value={tv.overview || "N/A"} />
            <Info label="First air date" value={tv.first_air_date || "N/A"} />
            <Info label="Last air date" value={tv.last_air_date || "N/A"} />
            <Info label="Seasons" value={tv.number_of_seasons || "N/A"} />
            <Info label="Episodes" value={tv.number_of_episodes || "N/A"} />
            <Info label="Genres" value={tv.genres?.map((genre: any) => genre.name).join(", ") || "N/A"} />
            <Info label="Original Language" value={tv.original_language || "N/A"} />
            <Info label="Original Name" value={tv.original_name || "N/A"} />
        </>
    )
}

const Seasons: React.FC<{ id: string }> = ({ id }) => {
    const { selectedSeason, setSelectedSeason } = useTVShowContext();
    const { fetchedTVShows, setFetchedTVShows } = useRootContext();
    const tv = fetchedTVShows[id];
    const [activeTab, setActiveTab] = useState<string>("seasons_details");

    useEffect(() => {
        devLog("Selected season", selectedSeason);
        const tvShowVideosUrl = `${tmdbBaseUrl}/tv/${id}/season/${selectedSeason}/videos`;
        if (tv?.seasons[selectedSeason]) return;
        const seasonUrl = `${tmdbBaseUrl}/tv/${id}/season/${selectedSeason}`;
        fetchTVShowSeasonFromTMDB(seasonUrl).then((seasonsDetails) => {
            devLog(`Season details for season ${selectedSeason}`, seasonsDetails);
            const updatedTVShow = {
                ...fetchedTVShows[id],
                seasons: {
                    ...fetchedTVShows[id].seasons,
                    [selectedSeason]: seasonsDetails
                }
            };
            fetchTVShowVideosFromTMDB(tvShowVideosUrl).then((videos) => {
                devLog(`Videos for season ${selectedSeason}`, videos.results);
                const ytVideos = videos.results.filter((video: any) => video.site === "YouTube").reverse().filter((video: any) => video.type === "Trailer" || video.type === "Teaser" || video.name.includes("Trailer") || video.name.includes("Teaser"));
                updatedTVShow["videos"] = [...ytVideos];
                setFetchedTVShows((prev) => ({ ...prev, [id]: updatedTVShow }));
            });
        });

    }, [selectedSeason]);

    useEffect(() => {
        devLog(activeTab);
    }, [activeTab]);

    return (
        <>
            <div className="seasons-header flex gap-2">
                <div className="select-season bg-amber-200 rounded-lg flex items-center px-2 cursor-pointer">
                    <select
                        name="seasons"
                        id="seasons-select"
                        className='px-4 py-1 not-last-of-type:border-none outline-none appearance-none w-full cursor-pointer'
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                        onClick={() => setActiveTab("seasons_details")}
                        value={selectedSeason}
                    >
                        {
                            Array.from({ length: Number(tv.number_of_seasons) }, (_, i) => Number(tv.number_of_seasons) - i).map((season) => (
                                <option
                                    key={season}
                                    value={season}
                                    className='border-none outline-none'
                                >Season {season}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <button className='bg-amber-200 rounded-lg flex items-center px-2 py-1 cursor-pointer'
                    onClick={() => setActiveTab("videos")}
                >
                    Videos
                </button>

            </div>

            {!fetchedTVShows[id].seasons[selectedSeason] ? <Loading /> :
                activeTab === "seasons_details" &&
                <div className="season-details mb-2">
                    <p>{tv?.seasons[selectedSeason]?.overview}</p>
                    <div className="episodes mt-2 flex flex-col gap-2">
                        <h2 className="text-amber-500 font-bold text-lg">Episodes</h2>

                        {tv?.seasons[selectedSeason]?.episodes?.map((episode) => (
                            <div key={episode.id} className='episode flex gap-2 flex-1 bg-amber-100 p-2 rounded-md'>
                                <div className="episode-still min-w-[150px] aspect-video sm:min-w-[180px] h-[100px]">
                                    <img src={episode.still_path ? `${tmdbImageUrl}${episode.still_path}` : stillPlaceholder} alt={episode.name}
                                        className='w-full h-full rounded-sm'
                                    />
                                </div>

                                <div className="episode-details text-xs sm:text-xs h-[100px] flex flex-col gap-1">
                                    <h3 className='line-clamp-1 font-bold text-amber-500 text-sm md:text-lg'>
                                        {episode.name}
                                    </h3>
                                    <div className='flex gap-1'>
                                        {episode.air_date &&
                                            <span className="text-xs bg-black text-white px-1 py-1 rounded-md">
                                                {episode.air_date}
                                            </span>
                                        }
                                        <span className="text-xs bg-black text-white px-1 py-1 rounded-md">
                                            {formatTime(episode.runtime)}
                                        </span>
                                        <span className="text-xs bg-black text-white px-1 py-1 rounded-md flex gap-1 items-center">
                                            <Star className='size-3.5' fill='white' /> {Math.trunc(episode.vote_average * 10) / 10}
                                        </span>
                                    </div>
                                    <p className='line-clamp-2 text-xs'>{episode.overview}</p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            }

            {activeTab === "videos" ? (
                fetchedTVShows[id]?.videos.length === 0 ? (
                    <div>No Videos</div>
                ) : (
                    <div className="videos flex flex-col gap-2 mb-2">
                        {fetchedTVShows[id]?.videos?.map((video, index) => (
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
            ) : null}

        </>
    )
}

const Cast: React.FC<{ id: string }> = ({ id }) => {
    const { fetchedTVShows } = useRootContext();
    const tv = fetchedTVShows[id];
    return (
        <>
            <div className="cast grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {tv?.cast.map((castDetails, index) => (
                    <>
                        <div key={index} className={`person flex flex-col items-center ${!castDetails.profile_path ? "justify-center" : ""}`}>
                            <img src={castDetails.profile_path ? `${tmdbImageUrl}${castDetails.profile_path}` : stillPlaceholder} alt={castDetails.name} className="rounded-lg" loading="lazy" />
                            <p className="text-sm font-bold text-amber-500 text-center">{castDetails.name}</p>
                            <p className="text-sm text-center">{castDetails?.roles?.[0]?.character} ({castDetails.known_for_department})</p>
                        </div>
                    </>
                ))}
            </div>
        </>
    )
}

const Crew: React.FC<{ id: string }> = ({ id }) => {
    const { fetchedTVShows } = useRootContext();
    const tv = fetchedTVShows[id];
    return (
        <>
            <div className="cast grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {tv?.crew.map((crewDetails, index) => (
                    <>
                        <div key={index} className={`person flex flex-col items-center ${!crewDetails.profile_path ? "justify-center" : ""}`}>
                            <img src={crewDetails.profile_path ? `${tmdbImageUrl}${crewDetails.profile_path}` : stillPlaceholder} alt={crewDetails.name} className="rounded-lg" loading="lazy" />
                            <p className="text-sm font-bold text-amber-500 text-center">{crewDetails.name}</p>
                            <p className="text-sm text-center">{crewDetails?.roles?.[0]?.character} ({crewDetails.department || crewDetails.known_for_department}, {crewDetails.jobs.map((job: any) => job.job).join(", ")})</p>
                        </div>
                    </>
                ))}
            </div>
        </>
    )
}

const TV: React.FC = () => {
    const { id } = useParams();
    const [tv, setTv] = useState<TYShowType | null>(null);
    const { fetchedTVShows, setFetchedTVShows } = useRootContext();
    const [activeTab, setActiveTab] = useState<string>("overview");
    const { setSelectedSeason, selectedSeason } = useTVShowContext();
    const [posterUrl, setPosterUrl] = useState<string>("");

    useEffect(() => {
        if (!id) return;
        const tvShowDetailsUrl = `${tmdbBaseUrl}/tv/${id}`;
        const tvShowCreditsUrl = `${tmdbBaseUrl}/tv/${id}/aggregate_credits`;

        if (fetchedTVShows[id as string]) {
            setTv(fetchedTVShows[id as string]);
        } else {
            fetchTVShowFromTMDB(tvShowDetailsUrl)
                .then((tvShowDetails) => {
                    fetchTvShowCredits(tvShowCreditsUrl).then((castAndCrewDetails) => {
                        const tvJson = {
                            ...tvShowDetails,
                            cast: castAndCrewDetails.cast,
                            crew: castAndCrewDetails.crew,
                            seasons: []
                        };
                        setSelectedSeason(Number(tvJson.number_of_seasons) || 1);
                        setTv(tvJson);
                        setFetchedTVShows((prev) => ({ ...prev, [id]: tvJson }));
                    });
                });
        }
    }, [id]);

    useEffect(() => {
        devLog("Fetched TV shows", fetchedTVShows);
    }, [fetchedTVShows]);

    useEffect(() => {
        devLog("Setting poster url...");
        if (activeTab === "seasons" && fetchedTVShows?.[id!]?.seasons?.[selectedSeason]) {
            const posterUrl = fetchedTVShows?.[id!]?.seasons?.[selectedSeason]?.poster_path
                ? `${tmdbImageUrl}${fetchedTVShows[id!].seasons[selectedSeason].poster_path}`
                : `${tmdbImageUrl}${tv?.poster_path || tv?.backdrop_path}`;

            devLog(`Poster url for season ${selectedSeason}`, posterUrl);
            setPosterUrl(posterUrl);
        } else {
            setPosterUrl(`${tmdbImageUrl}${(tv?.poster_path || tv?.backdrop_path)}`);
        }
    }, [activeTab, selectedSeason, fetchedTVShows]);

    return (
        <Wrapper>
            {(!tv) ? <Loading /> : (
                <>
                    <Title title={tv.name} />
                    <div className="movie w-full md:grid md:grid-cols-3">
                        <Poster src={posterUrl} alt={tv.title} rating={tv.vote_average} externalLink={tv.homepage} />
                        <div className="movie-right md:col-span-2 mt-2 md:mt-0 md:px-4 md:w-full px-4 py-4 md:py-0 space-y-3">

                            <div className="tabs bg-amber-200 rounded-xl px-1 sm:px-2 py-2 flex gap-1 text-xs sm:text-base">
                                <button className={`px-4 py-1 rounded-lg ${activeTab === "overview" ? "bg-amber-300" : ""}`} onClick={() => setActiveTab("overview")}>
                                    Overview
                                </button>
                                <button className={`px-4 py-1 rounded-lg ${activeTab === "seasons" ? "bg-amber-300" : ""}`} onClick={() => setActiveTab("seasons")}>
                                    Seasons
                                </button>
                                <button className={`px-4 py-1 rounded-lg ${activeTab === "cast" ? "bg-amber-300" : ""}`} onClick={() => setActiveTab("cast")}>
                                    Cast
                                </button>
                                <button className={`px-4 py-1 rounded-lg ${activeTab === "crew" ? "bg-amber-300" : ""}`} onClick={() => setActiveTab("crew")}>
                                    Crew
                                </button>
                            </div>

                            {activeTab === "overview" && <Overview tv={tv} />}
                            {activeTab === "seasons" && <Seasons id={id!} />}
                            {activeTab === "cast" && <Cast id={id!} />}
                            {activeTab === "crew" && <Crew id={id!} />}

                        </div>
                    </div>
                </>
            )}
        </Wrapper>
    )
}

export default TV