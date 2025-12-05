import { getUploadSignature } from "@/lib/api/general_api"
import { useQuery } from "@tanstack/react-query"


const useGetUploadSignature = (count?: number) => {
    const {data,  error} = useQuery({
        queryKey: ['uploadSignature'],
        queryFn: () => getUploadSignature(count || 1)
    });
    if (count === 1 && data) {
        const uploadSignatureData =  data[0]
        return {uploadSignatureData,error}
    }
    const uploadSignatures = data
    return {uploadSignatures, error}
    
}

export default useGetUploadSignature