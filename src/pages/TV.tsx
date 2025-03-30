import React, { useEffect, useState } from 'react'
import { Wrapper } from '../components'
import { useParams } from 'react-router-dom'
import { useRootContext } from '../context/Context';
import { devLog, fetchTvShowCredits, fetchTVShowFromTMDB, fetchTVShowSeasonFromTMDB, formatTime, stillPlaceholder, tmdbBaseUrl, tmdbImageUrl, tmdbOptions } from '../utils';
import { Info, Loading, Poster, Title } from '../components/MediaDetails';
import { TYShowType } from '../types';
import { useTVShowContext } from '../context/TVShowContext';
import { Star } from 'lucide-react';

const Overview: React.FC<{ tv: TYShowType }> = ({ tv }) => {
    return (
        <>
            {/* <OverViewHeading /> */}
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
    const [fetchingSeason, setFetchingSeason] = useState(false);
    const tv = fetchedTVShows[id];

    useEffect(() => {
        devLog("Selected season", selectedSeason);
        if (tv?.seasons[selectedSeason]) return;
        const seasonUrl = `${tmdbBaseUrl}/tv/${id}/season/${selectedSeason}`;
        setFetchingSeason(true);
        fetchTVShowSeasonFromTMDB(seasonUrl, tmdbOptions).then((seasonsDetails) => {
            devLog(`Season details for season ${selectedSeason}`, seasonsDetails);
            const updatedTVShow = {
                ...fetchedTVShows[id],
                seasons: {
                    ...fetchedTVShows[id].seasons,
                    [selectedSeason]: seasonsDetails
                }
            };
            setFetchedTVShows((prev) => ({ ...prev, [id]: updatedTVShow }));
        });
        setFetchingSeason(false);

    }, [selectedSeason]);

    return (
        <>
            <div className="seasons-header flex justify-between">
                <div className="select-season bg-amber-200 rounded-lg flex items-center px-2">
                    <select
                        name="seasons"
                        id="seasons-select"
                        className='px-4 py-1 not-last-of-type:border-none outline-none appearance-none w-full'
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
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

            </div>

            {fetchingSeason ? <Loading /> :
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
        </>
    )
}

const CastAndCrew: React.FC<{ tv: TYShowType }> = ({ tv }) => {
    return (
        <>
            <h2 className="">Cast & Crew</h2>
        </>
    )
}

const TV: React.FC = () => {
    const { id } = useParams();
    const [tv, setTv] = useState<TYShowType | null>(null);
    const { fetchedTVShows, setFetchedTVShows } = useRootContext();
    const [activeTab, setActiveTab] = useState<string>("overview");
    const { setSelectedSeason } = useTVShowContext();

    useEffect(() => {
        if (!id) return;
        const tvShowDetailsUrl = `${tmdbBaseUrl}/tv/${id}`;
        const tvShowCreditsUrl = `${tmdbBaseUrl}/tv/${id}/aggregate_credits`;

        if (fetchedTVShows[id as string]) {
            setTv(fetchedTVShows[id as string]);
        } else {
            fetchTVShowFromTMDB(tvShowDetailsUrl, tmdbOptions)
                .then((tvShowDetails) => {
                    fetchTvShowCredits(tvShowCreditsUrl, tmdbOptions).then((castAndCrewDetails) => {
                        const tvJson = {
                            ...tvShowDetails,
                            cast: castAndCrewDetails.cast,
                            crew: castAndCrewDetails.crew,
                            seasons: []
                        }
                        setSelectedSeason(Number(tvJson.number_of_seasons) || 1);
                        setTv(tvJson);
                        setFetchedTVShows((prev) => ({ ...prev, [id]: tvJson }));
                    });
                });
        }
    }, [id]);

    useEffect(() => {
        devLog("Fetched TV shows", fetchedTVShows);
    }, [fetchedTVShows])

    return (
        <Wrapper>
            {(!tv) ? <Loading /> : (
                <>
                    <Title title={tv.name} />
                    <div className="movie w-full md:grid md:grid-cols-3">
                        <Poster src={`${tmdbImageUrl}${tv.poster_path || tv.backdrop_path}`} alt={tv.title} rating={tv.vote_average} externalLink={tv.homepage} />
                        <div className="movie-right md:col-span-2 mt-2 md:mt-0 md:px-4 md:w-full px-4 py-4 md:py-0 space-y-3">

                            <div className="tabs bg-amber-200 rounded-xl px-1 sm:px-2 py-2 flex gap-1 text-xs sm:text-base">
                                <button className={`px-4 py-1 rounded-lg ${activeTab === "overview" ? "bg-amber-300" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
                                <button className={`px-4 py-1 rounded-lg ${activeTab === "seasons" ? "bg-amber-300" : ""}`} onClick={() => setActiveTab("seasons")}>Seasons</button>
                                <button className={`px-4 py-1 rounded-lg ${activeTab === "cast_and_crew" ? "bg-amber-300" : ""}`} onClick={() => setActiveTab("cast_and_crew")}>Cast & Crew</button>
                            </div>

                            {activeTab === "overview" && <Overview tv={tv} />}
                            {activeTab === "seasons" && <Seasons id={id!} />}
                            {activeTab === "cast_and_crew" && <CastAndCrew tv={tv} />}

                        </div>
                    </div>
                </>
            )}
        </Wrapper>
    )
}

export default TV