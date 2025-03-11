import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MediaCard from "../components/MediaCard";
import { useRootContext } from "../Context";
import { Category } from "../types";
import Wrapper from "../components/Wrapper";
import { Loading } from "../components/MediaDetails";
import Spinner from "../components/Spinner";
import { useInView } from "react-intersection-observer";
import { fetchListFromTMDB, tmdbBaseUrl, tmdbOptions } from "../utils";

const Home: React.FC = () => {
    const location = useLocation();
    const { data, setData } = useRootContext();
    const [currentList, setCurrentList] = useState<any[]>([]);
    const [categoryString, setCategoryString] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);

    const searchParams = new URLSearchParams(location.search);
    const category = (searchParams.get("category") as Category) || "movie";
    const { ref, inView } = useInView();

    useEffect(() => {
        let url = tmdbBaseUrl;

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
        setShowSpinner(false);

        const fetchData = async () => {
            const resJson = await fetchListFromTMDB(url, tmdbOptions, 1);
            setData((prev) => ({ ...prev, [category]: resJson.results }));
            setCurrentList(resJson.results);
            setTotalPages(resJson.total_pages);
            setShowSpinner(true);
        };

        if (!data[category] || data[category].length === 0) {
            fetchData();
        } else {
            setCurrentList(data[category]);
        }
    }, [category]);

    useEffect(() => {
        if (!url) return;
        if (page > totalPages) {
            setShowSpinner(false);
            return;
        };
        if (inView) {
            console.log(page);
            const fetchData = async () => {
                setShowSpinner(false);
                const resJson = await fetchListFromTMDB(url, tmdbOptions, page + 1);
                setData((prev) => ({ ...prev, [category]: [...prev[category], ...resJson.results] }));
                setCurrentList(prev => [...prev, ...resJson.results]);
                setShowSpinner(true);
                setPage(prev => prev + 1);
            };

            setTimeout(() => {
                fetchData();
            }, 1000);
        }
    }, [inView]);


    return (
        <Wrapper>
            <h1 className="text-xl sm:text-3xl text-amber-500 py-1 mb-2 text-center sm:text-left px-4 xl:px-0">{categoryString}</h1>
            <div className="media-cards grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-2 px-4 xl:px-0">
                {currentList.length === 0 ? <Loading /> : currentList.map((item: any, index: number) => (
                    <MediaCard item={item} category={category} key={index} />
                ))}
            </div>
            <div ref={ref} className={`${showSpinner ? "flex justify-center" : "hidden"}`}>
                <Spinner />
            </div>
        </Wrapper>
    );
};

export default Home;
