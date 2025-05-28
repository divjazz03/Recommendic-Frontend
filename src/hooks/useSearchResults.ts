import { useGlobalSearchContext } from "@/context/GlobalSearchContext"
import { doGlobalSearch } from "@/lib/api/backend_api";
import { useQuery } from "@tanstack/react-query";

export interface SearchResult {
    id: string,
    name: string
}

export const useSearchResults = () => {
    const {query} = useGlobalSearchContext();

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