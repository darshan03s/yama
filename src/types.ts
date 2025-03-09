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
