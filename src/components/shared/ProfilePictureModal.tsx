import { getUploadSignature } from "@/lib/api/general_api";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Loader from "./Loader";
import { Input } from "../ui/input";
import { X } from "lucide-react";

const ProfilePictureModal = ({
  handleSetProfileImgPicture,
  setImageUpdateModalOpen,
}: {
  handleSetProfileImgPicture: (value: string) => void;
  setImageUpdateModalOpen: (value: React.SetStateAction<boolean>) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const signaturesData = await getUploadSignature();
      const signatureData = signaturesData[0];
      if (!signatureData) {
        throw new Error("Invalid signature data");
        
      }
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", signatureData.apiKey);
      formData.append("public_id", signatureData.publicId);
      formData.append("folder", signatureData.folder);
      formData.append("timestamp", signatureData.timeStamp + "");
      formData.append("signature", signatureData.signature);

      const cloudRes = await axios
        .post(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
          formData,
          {
            timeout: 1000 * 10,
            timeoutErrorMessage: "Took too long to response",
          }
        )
        .then((response) => response.data);
      handleSetProfileImgPicture(cloudRes.secure_url);
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError;
        toast.error(axiosError.message);
      } else {
        toast.error(String(error));
      }
    } finally {
      setUploading(false);
    }
    setImageUpdateModalOpen(false);
  };

  return (
    <main className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center h-full p-4 z-50">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center w-full max-w-sm ">
          <CardTitle>Upload Profile Picture</CardTitle>
          <X
            onClick={() => setImageUpdateModalOpen(false)}
            className="w-6 h-6 bg-gray-600 hover:bg-red-400 rounded-sm text-white"
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Input type="file" accept="image/*" onChange={handleFileChange} />

          {preview && (
            <img src={preview} alt="preview" className="w-40 h-40 rounded-lg" />
          )}
        </CardContent>
        <CardFooter>
          <button
            disabled={!selectedFile || uploading}
            onClick={handleUpload}
            className="w-full bg-main-light disabled:cursor-not-allowed disabled:bg-gray-600 disabled:hover:bg-gray-600 hover:bg-main py-2 px-4 text-white rounded-lg flex justify-center items-center"
          >
            {uploading ? <Loader /> : "Upload"}
          </button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default ProfilePictureModal;
