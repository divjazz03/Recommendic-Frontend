
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandGroup, CommandList } from '../ui/command';
import { useGlobalSearchContext } from '@/context/GlobalSearchContext';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import SearchResults from '../SearchResult';
import { Loader, Search } from 'lucide-react';
import { useSearchResults } from '@/hooks/useSearchResults';

const GlobalSearch = () => {
    const { setQuery } = useGlobalSearchContext();
    const [searchText, setSearchText] = useState('');
    const debouncedValue = useDebouncedValue(searchText)
    const [popoverOpen, setPopOverOpen] = useState(false);

    const { data, isLoading, isError } = useSearchResults();




    const triggerRef = useRef(null);

    useEffect(() => {
        if (debouncedValue.trim() === '') {
            return;
        } else {
            setQuery(debouncedValue.trim());
        }
    }, [debouncedValue, setQuery])

    return (
        <>
            <Popover open={popoverOpen} onOpenChange={setPopOverOpen}>
                <PopoverTrigger asChild>
                    <div className='flex flex-row items-center justify-between gap-2 pr-1'>
                        <p className='text-lg'>Global&nbsp;Search</p>
                        <div className='flex flex-col justify-center items-center min-w-8 max-w-10'>
                            <Search className='w-6 h-6' />
                        </div>
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className='w-96 py-1 px-1 flex flex-col' sideOffset={8}
                    onInteractOutside={(e) => {
                        if (triggerRef.current && triggerRef.current.contains(e.target as Node)) {
                            e.preventDefault();
                        } else {
                            setPopOverOpen(false)
                        }
                    }}
                >
                    <Input type='search'
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        className='border h-full w-full  focus-visible:ring-offset-0 focus-visible:ring-transparent '
                        placeholder='Global Search' />
                    <Command>
                        <CommandList>
                            <CommandGroup heading="Results">
                                {isLoading && (<Loader />)}
                                {isError && !isLoading && (<p>Error loading results.</p>)}
                                {(!data || data.length < 1 ) && !isLoading && !isError && (<p>Wow Such Empty</p>)}
                                {!isLoading && !isError && data && (<ul className='mt-2 space-x-1'>
                                    {data?.map((item) => (
                                        <li key={item.id} className='p-2 border rounded shadow'>
                                            {item.name}
                                        </li>
                                    ))}
                                </ul>)}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>

            </Popover>
        </>
    )
}

export default GlobalSearch