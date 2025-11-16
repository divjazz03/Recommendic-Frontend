import { getUploadSignature } from '@/lib/api/general_api'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import Loader from './Loader'
import { Input } from '../ui/input'
import { X } from 'lucide-react'

const ProfilePictureModal = (
    {
        handleSetProfileImgPicture,
        setImageUpdateModalOpen
    }: { 
        handleSetProfileImgPicture: (value: string) => void
        setImageUpdateModalOpen: (value: React.SetStateAction<boolean>) => void }
) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0]
        setSelectedFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleUpload = async () => {
        if(!selectedFile) return;

        setUploading(true);

        const {apiKey,cloudName,publicId,signature,folder,timeStamp
        } = await getUploadSignature();
        console
        const formData = new FormData();
        formData.append("file", selectedFile)
        formData.append("api_key",apiKey)
        formData.append('public_id', publicId)
        formData.append('folder', folder)
        formData.append('timestamp', timeStamp +'')
        formData.append("signature", signature)
        try {
            const cloudRes = await axios
            .post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData, 
                {
                    timeout: 1000 * 10,
                    timeoutErrorMessage: 'Took too long to response'
                }
            )
            .then(response => response.data)
                    handleSetProfileImgPicture(cloudRes.secure_url)
        } catch (error){
            const axiosError = error as AxiosError
            toast.error(axiosError.message)
        }
        setUploading(false)
        setImageUpdateModalOpen(false)
    }
    return (<main className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center h-full p-4 z-50'>
        <Card>
            <CardHeader className='flex flex-row justify-between items-center w-full max-w-sm '>
                <CardTitle>Upload Profile Picture</CardTitle>
                <X
                onClick={() => setImageUpdateModalOpen(false)}
                className='w-6 h-6 bg-gray-600 hover:bg-red-400 rounded-sm text-white'/>
            </CardHeader>
                <CardContent className='flex flex-col gap-2'>
                    <Input type='file' accept='image/*' onChange={handleFileChange} />

                    {preview && (
                        <img src={preview} alt='preview' className='w-40 h-40 rounded-lg' />
                    )}

                    
                </CardContent>
                <CardFooter>
                    <button disabled={!selectedFile || uploading} onClick={handleUpload} 
                    className='w-full bg-main-light disabled:cursor-not-allowed disabled:bg-gray-600 disabled:hover:bg-gray-600 hover:bg-main py-2 px-4 text-white rounded-lg flex justify-center items-center' >
                        {uploading ? <Loader /> : 'Upload'}
                    </button>
                </CardFooter>
            
        </Card>
    </main>)
}

export default ProfilePictureModal