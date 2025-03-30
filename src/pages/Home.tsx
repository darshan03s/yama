import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRootContext } from "../context/Context";
import { Category, MovieType, TYShowType } from "../types";
import { Loading } from "../components/MediaDetails";
import { MediaCard, Wrapper, Spinner } from "../components"

import { useInView } from "react-intersection-observer";
import { devLog, fetchListFromTMDB, tmdbBaseUrl, tmdbOptions } from "../utils";
import { ArrowUp } from "lucide-react";
import GridWrapper from "../components/GridWrapper";

const Home: React.FC = () => {
    const location = useLocation();
    const { data, setData, pageInfo, setPageInfo } = useRootContext();
    const [currentList, setCurrentList] = useState<MovieType[] | TYShowType[]>([]);
    const [categoryString, setCategoryString] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [showSpinner, setShowSpinner] = useState<boolean>(true);
    const [totalPages, setTotalPages] = useState<number>(0);

    const searchParams = new URLSearchParams(location.search);
    const category = (searchParams.get("category") as Category) || "movie";
    const { ref, inView } = useInView();
    const { favorites, toggleFavorite } = useRootContext();

    useEffect(() => {
        let url = tmdbBaseUrl;
        if (pageInfo[category]) {
            setPage(pageInfo[category].page);
            setTotalPages(pageInfo[category].totalPages);
        }

        if (category === "movie") {
            url += "/discover/movie?include_adult=false";
            setCategoryString("Movies");
        } else if (category === "tv") {
            url += "/discover/tv?include_adult=false";
            setCategoryString("TV Shows");
        } else if (category === "now_playing") {
            url += "/movie/now_playing?include_adult=false";
            setCategoryString("Now Playing");
        } else if (category === "top_rated") {
            url += "/movie/top_rated?include_adult=false";
            setCategoryString("Top Rated");
        } else if (category === "upcoming") {
            url += "/movie/upcoming?include_adult=false";
            setCategoryString("Upcoming");
        }

        setUrl(url);

        const fetchData = async () => {
            const resJson = await fetchListFromTMDB(url, tmdbOptions, 1);
            setData((prev) => ({ ...prev, [category]: resJson.results }));
            setCurrentList(resJson.results);
            setTotalPages(resJson.total_pages);
            setShowSpinner(true);
            setPage(1);
        };

        if (!data[category] || data[category].length === 0) {
            fetchData();
        } else {
            setCurrentList(data[category]);
        }
    }, [category]);

    useEffect(() => {
        if (!url) return;
        devLog(`Current page: ${page}`);
        if (page > totalPages) {
            setShowSpinner(false);
            return;
        };
        if (inView) {
            devLog(`Fetching page ${page + 1}`);
            const fetchData = async () => {
                const resJson = await fetchListFromTMDB(url, tmdbOptions, page + 1);
                devLog("Fetched page", resJson);
                setData((prev) => ({ ...prev, [category]: [...prev[category], ...resJson.results] }));
                setCurrentList(prev => [...prev, ...resJson.results]);
                setPageInfo((prev) => ({ ...prev, [category]: { page: page + 1, totalPages: resJson.total_pages } }));
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
                <h1 className="text-xl sm:text-3xl text-amber-500 py-1 mb-2 text-center sm:text-left px-4 xl:px-0">{categoryString}</h1>
                <GridWrapper>
                    {currentList.length === 0 ? <Loading /> : currentList.map((item: MovieType | TYShowType, index: number) => (
                        <MediaCard item={item} category={category} key={index} isFavorited={favorites.listItems.find(f => f.id === item.id)?.isFavorited ?? false} toggleFavorite={toggleFavorite} />
                    ))}
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
    );
};

export default Home;
