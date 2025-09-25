import { useGlobalSearchContext } from "@/context/GlobalSearchContext"
import { doGlobalSearch } from "@/lib/api/general_api";
import { useQuery } from "@tanstack/react-query";

export interface SearchResult {
    id: string,
    name: string
}

export const useSearchResults = () => {
    const {query} = useGlobalSearchContext();

    return useQuery<SearchResult[]>({
        queryKey: ['search', query],
        queryFn: () => {
            if (!query) return [];
            return doGlobalSearch(query);
        },
        enabled: !!query,
        staleTime: 1000 * 60
    });
};