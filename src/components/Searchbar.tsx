import React, { useState } from 'react'
import Wrapper from './Wrapper'
import { Search } from 'lucide-react';

const Searchbar: React.FC = () => {
    const [search, setSearch] = useState('');
    return (
        <Wrapper className="px-4 py-2 xl:px-0 flex items-center">
            <input type="search" placeholder="Search" className="w-full outline-none border border-amber-300 rounded-l-full py-2 px-4 rounded-r-none h-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="bg-amber-300 text-white p-2 h-10 rounded-r-full cursor-pointer"><Search /></button>
        </Wrapper>
    )
}

export default Searchbar