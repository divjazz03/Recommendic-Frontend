import React, { KeyboardEventHandler, useState } from 'react'
import { Input } from './ui/input'

interface LocalSearchProps {
    placeholder: string,
}

const LocalSearch = ({ placeholder }: LocalSearchProps) => {

    const [searchValue, setSearchValue] = useState('');

    const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        
        if (event.key === 'Enter') {
            event.preventDefault()
            console.log(`submit search query ${searchValue}`)
        }

    }
    return (
        <>
            <div className='max-w-[320px] max-h-10 px-2 flex flex-row justify-center items-center gap-2'>
                <Input size={32}
                    placeholder={placeholder}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onKeyDown={handleEnterKeyPress} />
            </div>
        </>
    )
}

export default LocalSearch