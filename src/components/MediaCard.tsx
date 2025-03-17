import { Heart, Star } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { tmdbImageUrl } from '../utils'
import { MovieType, TYShowType } from '../types'

interface MediaCardProps {
    item: MovieType | TYShowType
    category: string
    isFavorited: boolean
    toggleFavorite: (id: number, category: string) => void
}

const MediaCard: React.FC<MediaCardProps> = ({ item, category, isFavorited, toggleFavorite }) => {
    const getRating = () => {
        return Math.trunc(item.vote_average * 10) / 10;
    }

    const handleAddToFavorites = (e: React.MouseEvent, id: number, category: string) => {
        e.stopPropagation();
        toggleFavorite(id, category);
    }

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

                <div className="absolute top-2 flex justify-between w-full">
                    <span
                        className='favorite bg-amber-300 text-xs rounded-full py-1 px-1 ml-2 cursor-pointer hover:scale-115 transition-all duration-100'
                        title='Add to Favorites'
                        onClick={
                            (e) => handleAddToFavorites(e, item.id, category)
                        }>
                        <Heart className='size-3.5' fill={isFavorited ? 'black' : 'transparent'} stroke='black' />
                    </span>
                    <span className='bg-amber-300 text-xs rounded flex gap-1 px-1 items-center mr-2' title='Rating'>
                        <Star className='size-3.5' /> {getRating()}
                    </span>
                </div>

            </div>

            <div className="info p-1">
                <h2 className='text-center text-lg truncate font-medium'>{category === "movie" ? (item as MovieType).title : (item as TYShowType).name}</h2>
                <div className="text-center text-xs">{category === "movie" ? (item as MovieType).release_date : (item as TYShowType).first_air_date}</div>
            </div>
        </div>
    )
}

export default MediaCard