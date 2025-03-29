import { FavoritesListType } from "./types";

export const devLog = (...args: any[]) => {
    if (import.meta.env.DEV) {
        console.log(...args);
    }
};

export const tmdbBaseUrl: string = "https://api.themoviedb.org/3";

export const tmdbImageUrl: string = "https://image.tmdb.org/t/p/original";

export const tmdbOptions: RequestInit = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
    },
};

export const fetchMovieFromTMDB = async (url: string, options: RequestInit): Promise<any> => {
    const response = await fetch(url, options);
    const resJson = await response.json();
    return resJson;
}

export const fetchTVShowFromTMDB = async (url: string, options: RequestInit): Promise<any> => {
    const response = await fetch(url, options);
    const resJson = await response.json();
    return resJson;
}

export const fetchListFromTMDB = async (url: string, options: RequestInit, page: number): Promise<any> => {
    const response = await fetch(`${url}&page=${page}`, options);
    const resJson = await response.json();
    return resJson;
}

export const fetchSearchFromTMDB = async (url: string, options: RequestInit, query: string, page: number): Promise<any> => {
    const response = await fetch(`${url}?query=${query}&page=${page}`, options);
    const resJson = await response.json();
    return resJson;
}

export const fetchFavorites = async (favorites: FavoritesListType): Promise<any> => {
    const fetchedData = await Promise.all(
        favorites.listItems.map(async (item) => {
            const url = `${tmdbBaseUrl}/${item.category}/${item.id}`;
            const res = await fetch(url, tmdbOptions);
            if (!res.ok) return null;

            const data = await res.json();
            return { category: item.category, data };
        })
    );

    const updatedFetchedFavorites = fetchedData.filter(item =>
        item !== null && favorites.listItems.some(f => f.id === item.data.id)
    );

    return updatedFetchedFavorites;
}

export function formatMoney(num: number): string {
    if (!num || isNaN(num)) return "N/A";
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    return num.toString();
}