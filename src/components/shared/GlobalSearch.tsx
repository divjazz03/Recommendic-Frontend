
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandGroup, CommandList } from '../ui/command';
import { useGlobalSearchContext } from '@/context/GlobalSearchContext';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Loader, Search, SearchIcon } from 'lucide-react';
import { useSearchResults } from '@/hooks/useSearchResults';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group';

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
    }, [debouncedValue])

    return (
        <>
            <Popover open={popoverOpen && !!searchText} onOpenChange={setPopOverOpen} modal={false}>
                <PopoverTrigger className='w-full'>
                        <InputGroup tabIndex={0} className='w-full'>
                            <InputGroupInput onChange={(e) => {
                                e.preventDefault()
                                setSearchText(e.target.value)}} placeholder='Search...' />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                        </InputGroup>
                </PopoverTrigger>
                <PopoverContent
                    className='w-screen min-h-full py-1 px-1 flex flex-col' sideOffset={8}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => {
                        if (triggerRef.current && triggerRef.current.contains(e.target as Node)) {
                            e.preventDefault();
                        } else {
                            setPopOverOpen(false)
                        }
                    }}
                >
                    
                    <Command>
                        <CommandList>
                            <CommandGroup heading="Results">
                                {isLoading && (<Loader />)}
                                {isError && !isLoading && searchText && (<p>Error loading results.</p>)}
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