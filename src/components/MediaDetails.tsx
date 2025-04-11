import { ExternalLink, Star } from "lucide-react";
import { Link } from "react-router-dom";

export const Loading: React.FC = () => {
    return (
        <div className="w-full flex items-center justify-start mt-2 px-4 sm:px-0">Loading...</div>
    );
}

interface TitleProps {
    title: string;
}

export const Title: React.FC<TitleProps> = ({ title }) => {
    return (
        <h1 className="text-3xl text-amber-500 py-2 mb-2 text-center sm:text-center md:text-left md:pl-2">{title}</h1>
    )
}

interface PosterProps {
    src: string;
    alt: string;
    rating: number;
    externalLink: string | undefined;
}

export const Poster: React.FC<PosterProps> = ({ src, alt, rating, externalLink }) => {
    return (
        <div className="movie-left w-full flex items-start justify-center sm:justify-center md:justify-start md:w-[300px] md:pl-2 md:col-span-1">
            <div className="relative">
                <img
                    src={src}
                    alt={alt}
                    className='w-[300px] sm:w-[300px] md:w-[250px] xl:w-[300px]'
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    {externalLink && (
                        <span className='bg-amber-300 text-xs p-1 rounded flex gap-1 items-center cursor-pointer dark:text-black'>
                            <Link to={externalLink} target="_blank" >
                                <ExternalLink className='size-3.5' />
                            </Link>
                        </span>
                    )}
                    <span className='bg-amber-300 text-xs p-1 rounded flex gap-1 items-center dark:text-black'>
                        <Star className='size-3.5' /> {Math.trunc(rating * 10) / 10}
                    </span>
                </div>
            </div>
        </div>
    )
}


export const OverViewHeading: React.FC = () => {
    return (
        <h2 className="text-lg text-amber-500 font-bold flex items-center gap-1">
            Overview
        </h2>
    )
}

interface InfoProps {
    label?: string;
    value: string;
}

export const Info: React.FC<InfoProps> = ({ label, value }) => {
    return (
        <p>{label && <span className="text-amber-500 font-bold">{label}:</span>} {value}</p>
    )
}