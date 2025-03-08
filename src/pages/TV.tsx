import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useParams } from 'react-router-dom'

const TV: React.FC = () => {
    const { id } = useParams();
    const [tv, setTv] = useState<any>({});

    useEffect(() => {
        const url = `https://api.themoviedb.org/3/tv/${id}`;
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
            },
        };
        const fetchTv = async () => {
            const response = await fetch(url, options);
            const resJson = await response.json();
            console.log(resJson);
            setTv(resJson);
        }

        fetchTv();
    }, [id]);
    return (
        <Wrapper>
            <h1>{tv.name}</h1>
        </Wrapper>
    )
}

export default TV