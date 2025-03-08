import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MediaCard from "../components/MediaCard";
import { useRootContext } from "../Context";
import { Category } from "../types";

const Home: React.FC = () => {
    const location = useLocation();
    const { data, setData } = useRootContext();
    const [currentList, setCurrentList] = useState<any[]>([]);

    const searchParams = new URLSearchParams(location.search);
    const category = (searchParams.get("category") as Category) || "movie";

    useEffect(() => {
        let url = "https://api.themoviedb.org/3/";

        if (category === "movie") {
            url += "discover/movie?include_adult=false";
        } else if (category === "tv") {
            url += "discover/tv?include_adult=false";
        } else if (category === "now_playing") {
            url += "movie/now_playing?include_adult=false";
        } else if (category === "top_rated") {
            url += "movie/top_rated?include_adult=false";
        } else if (category === "upcoming") {
            url += "movie/upcoming?include_adult=false";
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
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl text-amber-500 py-1 mb-2">Discover</h1>
            <div className="media-cards sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-2">
                {currentList.map((item: any, index: number) => (
                    <MediaCard item={item} key={index} />
                ))}
            </div>
        </div>
    );
};

export default Home;
