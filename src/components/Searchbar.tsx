import React, { useEffect, useState } from 'react'
import Wrapper from './Wrapper'
import { Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Category } from '../types';
import { useNavigate } from 'react-router-dom';

const Searchbar: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = (searchParams.get("category") as Category) || "movie";
    const [media, setMedia] = useState<string>("movie");
    const navigate = useNavigate();

    useEffect(() => {
        if (category === "tv") {
            setMedia("tv");
        } else {
            setMedia("movie");
        }
    }, [category]);

    const handleSearch = async () => {
        if (!search) return;
        navigate(`/search?category=${media}&query=${search}`);
    }

    console.log(media);
    return (
        <Wrapper className="px-4 py-2 xl:px-0 flex items-center">
            <input
                type="search"
                placeholder="Search"
                className="w-full outline-none border border-amber-300 rounded-l-full py-2 px-4 rounded-r-none h-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
            <button className="bg-amber-300 text-white p-2 h-10 rounded-r-full cursor-pointer" onClick={handleSearch}><Search /></button>
        </Wrapper>
    )
}

export default Searchbar