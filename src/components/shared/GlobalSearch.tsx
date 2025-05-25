
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command';

const GlobalSearch = () => {

    const [searchText, setSearchText] = useState('');
    const [debouncedText, setDouncedText] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [popoverOpen, setPopOverOpen] = useState(false);

    const triggerRef = useRef(null);

    const mockItems = [
        'Apple',
        'Banana',
        'Orange',
        'Pineapple',
        'Grape',
        'Watermelon',
        'Mango',
        'Blueberry'
    ];

    useEffect(() => {
        const handler = setTimeout(() => {
            setDouncedText(searchText);
        }, 300); // 300ms delay
    }, [searchText])

    useEffect(() => {
        if (debouncedText.trim() === '') {
            setResults([]);
        } else {
            const filtered = mockItems.filter(Item => Item.toLowerCase().includes(debouncedText.toLowerCase()));
            setResults(filtered);
        }
    }, [debouncedText])

    return (
        <>
            <Popover open={popoverOpen} onOpenChange={setPopOverOpen}>
                <PopoverTrigger asChild>
                    <div className='flex flex-row items-center gap-2 pr-1'>
                        <p className='base-regular'>Global&nbsp;Search</p>
                        <div className='h-full min-w-8 max-w-10'>
                            <img
                                src='/assets/svg/search-alt-1-svgrepo-com.svg'
                                className='w-full h-full px-1 py-1 hover:bg-light-4 rounded-sm' />
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
                                {results.length > 0 ? (
                                    results.map((item, index) => (
                                        <CommandItem
                                            key={index}
                                            onSelect={() => {
                                                setSearchText(item);
                                                setPopOverOpen(false);
                                            }}
                                        >
                                            {item}
                                        </CommandItem>
                                    ))
                                ) : (
                                    <div className="p-4 text-sm">Wow such empty</div>
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>

            </Popover>
        </>
    )
}

export default GlobalSearch