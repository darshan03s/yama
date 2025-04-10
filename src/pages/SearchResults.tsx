import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchSearchFromTMDB, tmdbBaseUrl } from '../utils';
import { useInView } from "react-intersection-observer";
import { MediaCard, Wrapper, Spinner } from "../components"
import { Loading } from '../components/MediaDetails';
import { ArrowUp } from 'lucide-react';
import { useRootContext } from '../context/Context';
import { MovieType, TYShowType } from '../types';
import GridWrapper from '../components/GridWrapper';

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [resultsList, setResultsList] = useState<MovieType[] | TYShowType[]>([]);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [showSpinner, setShowSpinner] = useState<boolean>(true);
    const { ref, inView } = useInView();
    const category = searchParams.get('category');
    const url = `${tmdbBaseUrl}/search/${category}`;
    const query = searchParams.get('query');
    const { favorites, toggleFavorite } = useRootContext();
    const [fetchingSearchResults, setFetchingSearchResults] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            setFetchingSearchResults(true);
            const data = await fetchSearchFromTMDB(url, query!, 1);
            setResultsList(data.results);
            setTotalPages(data.total_pages);
            setFetchingSearchResults(false);
        }
        fetchResults();
    }, [query, category]);

    useEffect(() => {
        if (!fetchingSearchResults && resultsList.length == 0) {
            setShowSpinner(false);
        } else {
            setShowSpinner(true);
        }
    }, [resultsList])

    useEffect(() => {
        if (!url) return;
        if (page > totalPages) {
            setShowSpinner(false);
            return;
        };
        if (inView) {
            const fetchData = async () => {
                const resJson = await fetchSearchFromTMDB(url, query!, page + 1);
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
                <GridWrapper>
                    {resultsList.length === 0 && fetchingSearchResults ? <Loading /> : resultsList.map((item: MovieType | TYShowType, index: number) => (
                        <MediaCard item={item} category={category!} key={index} isFavorited={favorites.listItems.find(f => f.id === item.id)?.isFavorited ?? false} toggleFavorite={toggleFavorite} />
                    ))}
                    {!fetchingSearchResults && resultsList.length == 0 ? <p>No results found</p> : null}
                </GridWrapper>
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