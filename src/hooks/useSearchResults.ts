import { useGlobalSearch } from "@/context/GlobalSearchContext"
import { doGlobalSearch } from "@/lib/backend_api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface SearchResult {
    id: string,
    name: string
}

export const useSearchResults = () => {
    const {query} = useGlobalSearch();

    return useQuery<SearchResult[]>({
        queryKey: ['search', query],
        queryFn: async () => {
            if (!query) return [];
            const data = await doGlobalSearch(query);
        },
        enabled: !!query,
        staleTime: 1000* 60
    });
};