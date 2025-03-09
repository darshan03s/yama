import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MediaCard from "../components/MediaCard";
import { useRootContext } from "../Context";
import { Category } from "../types";
import Wrapper from "../components/Wrapper";

const Home: React.FC = () => {
    const location = useLocation();
    const { data, setData } = useRootContext();
    const [currentList, setCurrentList] = useState<any[]>([]);
    const [categoryString, setCategoryString] = useState<string>("");

    const searchParams = new URLSearchParams(location.search);
    const category = (searchParams.get("category") as Category) || "movie";

    useEffect(() => {
        let url = "https://api.themoviedb.org/3/";

        if (category === "movie") {
            url += "discover/movie?include_adult=false";
            setCategoryString("Movies");
        } else if (category === "tv") {
            url += "discover/tv?include_adult=false";
            setCategoryString("TV Shows");
        } else if (category === "now_playing") {
            url += "movie/now_playing?include_adult=false";
            setCategoryString("Now Playing");
        } else if (category === "top_rated") {
            url += "movie/top_rated?include_adult=false";
            setCategoryString("Top Rated");
        } else if (category === "upcoming") {
            url += "movie/upcoming?include_adult=false";
            setCategoryString("Upcoming");
        }

        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
            },
        };

        const fetchData = async () => {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error("Failed to fetch movies");
                }
                const resJson = await response.json();
                setData((prev) => ({ ...prev, [category]: resJson.results }));
                setCurrentList(resJson.results);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        if (!data[category] || data[category].length === 0) {
            fetchData();
        } else {
            setCurrentList(data[category]);
        }
    }, [category]);

    return (
        <Wrapper>
            <h1 className="text-xl sm:text-3xl text-amber-500 py-1 mb-2 text-center sm:text-left px-4 xl:px-0">{categoryString}</h1>
            <div className="media-cards grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-2 px-4 xl:px-0">
                {currentList.map((item: any, index: number) => (
                    <MediaCard item={item} category={category} key={index} />
                ))}
            </div>
        </Wrapper>
    );
};

export default Home;
