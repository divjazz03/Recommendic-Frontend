
import { useEffect, useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandGroup, CommandList } from '../ui/command';
import { useGlobalSearchContext } from '@/context/GlobalSearchContext';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Loader, SearchIcon } from 'lucide-react';
import { useSearchResults } from '@/hooks/useSearchResults';
import InputWithIcon from './InputWithIcon';

const GlobalSearch = () => {
    const { setQuery } = useGlobalSearchContext();
    const [searchText, setSearchText] = useState('');
    const debouncedValue = useDebouncedValue(searchText)
    const [popoverOpen, setPopOverOpen] = useState(false);
    const { data, isLoading, isError } = useSearchResults();

    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (debouncedValue.trim() === '') {
            return;
        } else {
            setQuery(debouncedValue.trim());
        }
    }, [debouncedValue])

    return (
        <>
            <Popover open={popoverOpen && !!searchText.trim()} onOpenChange={setPopOverOpen} modal={false}>
                <PopoverTrigger className='w-full focus-visible:outline-none ' >
                            <InputWithIcon
                            divStyle='focus-within:ring-2 focus-within:ring-white'
                            className='bg-main text-light-5 focus-visible:outline-none'
                            icon={<SearchIcon className='w-5 h-5 text-sm text-light-5 bg-main' />} 
                            onChange={(e) => setSearchText(e.target.value)} />
                </PopoverTrigger>
                <PopoverContent
                    className='w-screen min-h-full py-1 px-1 flex flex-col' sideOffset={8}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => {
                        if (triggerRef.current && triggerRef.current?.contains(e.target as Node)) {
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