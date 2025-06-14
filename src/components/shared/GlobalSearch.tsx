
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandGroup,CommandList } from '../ui/command';
import { useGlobalSearchContext } from '@/context/GlobalSearchContext';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import SearchResults from '../SearchResult';
import { Search } from 'lucide-react';

const GlobalSearch = () => {
    const {setQuery} = useGlobalSearchContext();
    const [searchText, setSearchText] = useState('');
    const debouncedValue = useDebouncedValue(searchText)
    const [popoverOpen, setPopOverOpen] = useState(false);


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
                    <div className='flex flex-row items-center gap-2 pr-1'>
                        <p className='base-regular'>Global&nbsp;Search</p>
                        <div className='h-full min-w-8 max-w-10'>
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
                        className='border-none h-full w-full  focus-visible:ring-offset-0 focus-visible:ring-transparent '
                        placeholder='Global Search' />
                    <Command>
                        <CommandList>
                            <CommandGroup heading="Results">
                                <SearchResults />
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>

            </Popover>
        </>
    )
}

export default GlobalSearch