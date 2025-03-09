import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useParams } from 'react-router-dom'
import { useRootContext } from '../Context';
import { fetchTVShowFromTMDB, tmdbBaseUrl, tmdbImageUrl, tmdbOptions } from '../utils';
import { Info, OverViewHeading, Poster, Title } from '../components/MediaDetails';

const TV: React.FC = () => {
    const { id } = useParams();
    const [tv, setTv] = useState<any | null>(null);
    const { fetchedTVShows, setFetchedTVShows } = useRootContext();

    useEffect(() => {
        if (!id) return;
        const url = `${tmdbBaseUrl}/tv/${id}`;
        const fetchTv = async () => {
            const resJson = await fetchTVShowFromTMDB(url, tmdbOptions);
            console.log(resJson);
            setTv(resJson);
            setFetchedTVShows((prev) => ({ ...prev, [id]: resJson }));
        }

        if (fetchedTVShows[id as string]) {
            setTv(fetchedTVShows[id as string]);
        } else {
            fetchTv();
        }
    }, [id]);
    return (
        <Wrapper>
            {(!tv) ? <div className="w-full flex items-center justify-center mt-2">Loading...</div> : (
                <>
                    <Title title={tv.name} />
                    <div className="movie w-full md:grid md:grid-cols-3">
                        <Poster src={`${tmdbImageUrl}${tv.poster_path || tv.backdrop_path}`} alt={tv.title} rating={tv.vote_average} />
                        <div className="movie-right md:col-span-2 mt-2 md:mt-0 md:px-4 md:w-full px-4 py-4 md:py-0 space-y-3">
                            <OverViewHeading externalLink={tv.homepage} />
                            <Info value={tv.overview || "N/A"} />
                            <Info label="First air date" value={tv.first_air_date || "N/A"} />
                            <Info label="Last air date" value={tv.last_air_date || "N/A"} />
                            <Info label="Seasons" value={tv.number_of_seasons || "N/A"} />
                            <Info label="Episodes" value={tv.number_of_episodes || "N/A"} />
                            <Info label="Genres" value={tv.genres?.map((genre: any) => genre.name).join(", ") || "N/A"} />
                            <Info label="Original Language" value={tv.original_language || "N/A"} />
                            <Info label="Original Name" value={tv.original_name || "N/A"} />

                        </div>
                    </div>
                </>
            )}
        </Wrapper>
    )
}

export default TV