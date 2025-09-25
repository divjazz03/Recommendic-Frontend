import React, { createContext, useContext, useState } from 'react'

interface GlobalSearchContextProps {
    query: string,
    setQuery: (query: string) => void;
}


const SearchContext = createContext<GlobalSearchContextProps| undefined>(undefined);

export const GlobalSearchProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [query, setQuery] = useState('');
    return (
        <SearchContext.Provider value={{query,setQuery}}>
            {children}
        </SearchContext.Provider>
    );
};

export const useGlobalSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be withing a searchProvider');
    }
    return context;
}