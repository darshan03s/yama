export type Category = "movie" | "tv" | "now_playing" | "top_rated" | "upcoming";

export type MovieType = {
    id: number;
    title: string;
    poster_path?: string;
    backdrop_path?: string;
    vote_average: number;
    homepage?: string;
    overview?: string;
    release_date?: string;
    runtime?: number;
    genres?: { id: number; name: string }[];
    original_language?: string;
    original_title?: string;
    budget?: number;
    revenue?: number;
};

export type TYShowType = {
    id: number;
    name: string;
    poster_path?: string;
    backdrop_path?: string;
    title: string;
    vote_average: number;
    homepage?: string;
    overview?: string;
    first_air_date?: string;
    last_air_date?: string;
    number_of_seasons?: string;
    number_of_episodes?: string;
    genres?: { id: number; name: string }[];
    original_language?: string;
    original_name?: string;
};

export type UserType = {
    id?: number;
    name: string;
    email: string;
    password?: string;
    avatar_url: string;
};

export type FavoriteType = {
    id: number;
    category: string;
    isFavorited: boolean;
    createdAt: string;
};