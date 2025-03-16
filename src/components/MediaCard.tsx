import { Star } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { tmdbImageUrl } from '../utils'

interface MediaCardProps {
    item: any
    category: string
}

const MediaCard: React.FC<MediaCardProps> = ({ item, category }) => {
    const navigate = useNavigate();
    let imgSrc = (item.poster_path || item.backdrop_path) ? `${tmdbImageUrl}${item.poster_path || item.backdrop_path}` : "https://placehold.co/620x1000?text=No+Poster";
    return (
        <div
            className="media-card max-w-[360px] sm:max-w-2xl bg-amber-200 rounded-md hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/${category === "tv" ? "tv" : "movie"}/${item.id}`)}
        >
            <div key={item.id} className='relative'>
                <img
                    src={imgSrc}
                    alt={item.title}
                    className='rounded-t-md w-full xl:h-[350px]'
                />

                <span className='absolute top-2 right-2 bg-amber-300 text-xs p-1 rounded flex gap-1 items-center'><Star className='size-3.5' /> {Math.trunc(item.vote_average * 10) / 10}</span>
            </div>

            <div className="info p-1">
                <h2 className='text-center text-lg truncate font-medium'>{item.title || item.name}</h2>
                <div className="text-center text-xs">{item.release_date || item.first_air_date}</div>
            </div>
        </div>
    )
}

export default MediaCard