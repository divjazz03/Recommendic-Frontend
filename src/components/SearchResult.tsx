import { useGlobalSearch } from '@/context/GlobalSearchContext';
import { CommandGroup, CommandItem } from 'cmdk';
import React, { useEffect, useState } from 'react'
import { Command, CommandList } from './ui/command';
import { useSearchResults } from '@/hooks/useSearchResults';
import Loader from './shared/Loader';



const SearchResults = () => {

    const {data, isLoading, isError} = useSearchResults();

    if (isLoading) return <Loader />
    if (isError) return <p>Error loading results.</p>
    if (!data?.length) return <p>Wow Such Empty</p>

    return (
        <ul className='mt-2 space-x-1'>
            {data.map((item) => (
                <li key={item.id} className='p-2 border rounded shadow'>
                    {item.name}
                </li>
            ))}
        </ul>
    );
}

export default SearchResults