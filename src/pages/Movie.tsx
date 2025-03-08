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
            <h1>{movie.title}</h1>
        </Wrapper>
    )
}

export default Movie