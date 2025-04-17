
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandGroup, CommandList } from '../ui/command';

const GlobalSearch = () => {

    const [searchText, setSearchText] = useState('');
    const [popoverOpen, setPopOverOpen] = useState(false);

    return (
        <>
            <Popover open={popoverOpen} onOpenChange={setPopOverOpen} >
                <PopoverTrigger asChild>
                    <div 
                        tabIndex={0} 
                        className='flex flex-row justify-between gap-2 h-10 w-80 p-1 rounded-md border border-slate-200 bg-white text-base ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300'>
                        <Input type='search'
                            onChange={(event) => setSearchText(event.target.value)}
                            className='border-none ring-offset-0 h-full focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-white w-72' 
                            placeholder='Global Search' />
                        <img tabIndex={0} src='/assets/svg/search-alt-1-svgrepo-com.svg' className='min-w-7 max-w-7 px-1 hover:bg-light-4 rounded-sm' />
                    </div>
                </PopoverTrigger>
                <PopoverContent className='w-80'>
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>

            </Popover>
        </>
    )
}

export default GlobalSearch