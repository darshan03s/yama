import { Star } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

interface MediaCardProps {
    item: any
    category: string
}

const MediaCard: React.FC<MediaCardProps> = ({ item, category }) => {
    return (
        <div className="media-card bg-amber-200 rounded-md hover:scale-105 transition-all duration-300" key={item.id}>
            <Link to={`/${category}/${item.id}`} key={item.id} className='relative'>
                <img
                    src={`https://image.tmdb.org/t/p/original${item.poster_path || item.backdrop_path}`}
                    alt={item.title}
                    height={500}
                    width={300}
                    className='rounded-t-md'
                />

                <span className='absolute top-2 right-2 bg-amber-300 text-xs p-1 rounded flex gap-1 items-center'><Star className='size-3.5' /> {Math.trunc(item.vote_average * 10) / 10}</span>
            </Link>

            <div className="info p-1">
                <h2 className='text-center text-lg truncate font-medium'>{item.title || item.name}</h2>
                <div className="text-center text-xs">{item.release_date || item.first_air_date}</div>
            </div>
        </div>
    )
}

export default MediaCard