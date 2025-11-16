import React from 'react'
import { Input } from '../ui/input'
import { Search } from 'lucide-react';

interface LocalSearchProps {
    placeholder: string,
    setSearchValue: (value: React.SetStateAction<string>)=>void
    handleEnterKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

const LocalSearch: React.FC<LocalSearchProps> = ({ placeholder, setSearchValue, handleEnterKeyPress}) => {
    return (
        <>
            <div  className= 'relative w-full max-h-10 px-2 flex flex-row justify-center items-center gap-2'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-1 w-5 h-5'/>
                <Input
                    placeholder={placeholder}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onKeyDown={handleEnterKeyPress} 
                    className='w-full pl-10 pr-4 border border-light-3 rounded-lg  focus:border-transparent'
                    />
            </div>
        </>
    )
}

export default LocalSearch