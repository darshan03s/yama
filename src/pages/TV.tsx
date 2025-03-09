import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useParams } from 'react-router-dom'
import { useRootContext } from '../Context';
import { fetchTVShowFromTMDB, tmdbBaseUrl, tmdbOptions } from '../utils';

const TV: React.FC = () => {
    const { id } = useParams();
    const [tv, setTv] = useState<any>({});
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
            <h1>{tv.name}</h1>
        </Wrapper>
    )
}

export default TV