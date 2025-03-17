import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useSearchParams } from 'react-router-dom'
import { fetchSearchFromTMDB, tmdbBaseUrl, tmdbOptions } from '../utils';
import { Loading } from '../components/MediaDetails';
import MediaCard from '../components/MediaCard';
import { useInView } from "react-intersection-observer";
import Spinner from '../components/Spinner';
import { ArrowUp } from 'lucide-react';
import { useRootContext } from '../Context';

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [resultsList, setResultsList] = useState<any[]>([]);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [showSpinner, setShowSpinner] = useState<boolean>(true);
    const { ref, inView } = useInView();
    const category = searchParams.get('category');
    const url = `${tmdbBaseUrl}/search/${category}`;
    const query = searchParams.get('query');
    const { favorites, toggleFavorite } = useRootContext();

    useEffect(() => {
        const fetchResults = async () => {
            const data = await fetchSearchFromTMDB(url, tmdbOptions, query!, 1);
            setResultsList(data.results);
            setTotalPages(data.total_pages);
        }
        fetchResults();
    }, [query, category]);

    useEffect(() => {
        if (!url) return;
        if (page > totalPages) {
            setShowSpinner(false);
            return;
        };
        if (inView) {
            const fetchData = async () => {
                const resJson = await fetchSearchFromTMDB(url, tmdbOptions, query!, page + 1);
                setResultsList(prev => [...prev, ...resJson.results]);
                setPage(prev => prev + 1);
            };

            setTimeout(() => {
                fetchData();
            }, 1000);
        }
    }, [inView]);

    return (
        <>
            <Wrapper>
                <h1 className="text-xl sm:text-3xl text-amber-500 py-1 mb-2 text-center sm:text-left px-4 xl:px-0">Search results for {query} in {category === "movie" ? "Movies" : "TV Shows"}</h1>
                <div className="media-cards grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-2 px-4 xl:px-0">
                    {resultsList.length === 0 ? <Loading /> : resultsList.map((item: any, index: number) => (
                        <MediaCard item={item} category={category!} key={index} isFavorited={favorites.find(f => f.id === item.id)?.isFavorited ?? false} toggleFavorite={toggleFavorite} />
                    ))}
                </div>
                <div ref={ref} className={`${showSpinner ? "flex justify-center" : "hidden"}`}>
                    <Spinner />
                </div>
            </Wrapper>

            <div className="go-to-top">
                <button
                    className=" bg-amber-500 text-white p-1 rounded-full opacity-50 fixed z-10 bottom-4 right-4 cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <ArrowUp />
                </button>
            </div>
        </>
    )
}

export default SearchResults