import { FavoritesListType } from "./types";

export const devLog = (...args: any[]) => {
    if (import.meta.env.DEV) {
        console.log(...args);
    }
};

export const tmdbBaseUrl: string = "https://api.themoviedb.org/3";

export const tmdbImageUrl: string = "https://image.tmdb.org/t/p/original";

export const posterPlaceholder = "https://placehold.co/620x1000?text=No+Poster";

export const stillPlaceholder = "https://placehold.co/180x100?text=No+Image";

const serverUrl = import.meta.env.DEV ? import.meta.env.VITE_LOCAL_SERVER_URL : import.meta.env.VITE_SERVER_URL;
// const serverUrl = import.meta.env.VITE_SERVER_URL;

export const fetchListFromTMDB = async (url: string, page: number): Promise<any> => {
    const newUrl = `${url}&page=${page}`;
    const response = await fetch(`${serverUrl}/fetch-from-tmdb`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: newUrl }),
    });
    const resJson = await response.json();
    return resJson;
}

export const fetchSearchFromTMDB = async (url: string, query: string, page: number): Promise<any> => {
    const newUrl = `${url}?query=${query}&page=${page}`;
    const response = await fetch(`${serverUrl}/fetch-from-tmdb`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: newUrl }),
    });
    const resJson = await response.json();
    return resJson;
}

export const fetchMovieFromTMDB = async (url: string): Promise<any> => {
    const response = await fetch(`${serverUrl}/fetch-from-tmdb`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
    });
    const resJson = await response.json();
    return resJson;
}

export const fetchMovieVideosFromTMDB = async (url: string): Promise<any> => {
    const response = await fetch(`${serverUrl}/fetch-from-tmdb`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
    });
    const resJson = await response.json();
    return resJson;
}

export const fetchMovieCreditsFromTMDB = async (url: string): Promise<any> => {
    const response = await fetch(`${serverUrl}/fetch-from-tmdb`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
    });
    const resJson = await response.json();
    return resJson;
}

export const fetchTVShowFromTMDB = async (url: string): Promise<any> => {
    const response = await fetch(`${serverUrl}/fetch-from-tmdb`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
    });
    const resJson = await response.json();
    return resJson;
}

export const fetchTvShowCredits = async (url: string): Promise<any> => {
    const response = await fetch(`${serverUrl}/fetch-from-tmdb`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
    });
    const resJson = await response.json();
    return resJson;
}


export const fetchTVShowSeasonFromTMDB = async (url: string): Promise<any> => {
    const response = await fetch(`${serverUrl}/fetch-from-tmdb`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
    });
    const resJson = await response.json();
    return resJson;
}

export const fetchTVShowVideosFromTMDB = async (url: string): Promise<any> => {
    const response = await fetch(`${serverUrl}/fetch-from-tmdb`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
    });
    const resJson = await response.json();
    return resJson;
}

export const fetchFavorites = async (favorites: FavoritesListType): Promise<any> => {
    const fetchedData = await Promise.all(
        favorites.listItems.map(async (item) => {
            const url = `${tmdbBaseUrl}/${item.category}/${item.id}`;
            const response = await fetch(`${serverUrl}/fetch-from-tmdb`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: url }),
            });
            if (!response.ok) return null;
            const resJson = await response.json();
            return { category: item.category, data: resJson };
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

export const formatTime = (timeInMinutes: number): string => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    if (hours === 0) {
        return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
}