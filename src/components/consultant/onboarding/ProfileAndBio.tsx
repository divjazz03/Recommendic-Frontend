import { useUpdateConsultantOnboardingInfo } from "@/lib/actions/consultantQueryAndMutations";
import { MAX_FILE_SIZE_BYTES } from "@/lib/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { ConsultantOnboardingData, STEPS } from "./ConsultantOnboarding";
import { FileText, Upload } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "./OnboardingNavigation";
import { getUploadSignature } from "@/lib/api/general_api";
import axios from "axios";

interface ProfileDetails extends ConsultantOnboardingData {
  bio: string;
  profilePictureUrl: string | File;
  type: string;
}

const ProfileAndBio = ({
  step,
  updateOnBoardingInfo,
  accessToken,
}: {
  step: number;
  accessToken: string | null;
  updateOnBoardingInfo: ReturnType<
    typeof useUpdateConsultantOnboardingInfo
  >["mutateAsync"];
}) => {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const navigate = useNavigate();
  const profilePicSchema = z
    .array(z.instanceof(File))
    .length(1, "Provide one profile photo")
    .refine(
      (files) => files.every((f) => f.size <= MAX_FILE_SIZE_BYTES),
      "Each file must be under 5MB",
    )
    .refine(
      (files) =>
        files.every((file) => ["image/png", "image/jpeg"].includes(file.type)),
      "Invalid file detected (only PNG, JPG, PDF allowed)",
    );
  const profileValidation = z.object({
    profilePictureUrl: profilePicSchema,
    bio: z
      .string()
      .max(500, "Must provide at most 500 characters")
      .min(50, "Must provide at least 50 characters"),
  });

  const profileForm = useForm<z.infer<typeof profileValidation>>({
    resolver: zodResolver(profileValidation),
    defaultValues: {
      bio: "",
      profilePictureUrl: undefined,
    },
    mode: "onTouched",
  });

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    updateFiles(files);
  }
  function updateFiles(newFiles: File[]) {
    const existing = Array.isArray(profileForm.getValues().profilePictureUrl)
      ? profileForm.getValues().profilePictureUrl
      : [];

    const unique = [
      ...existing,
      ...newFiles.filter(
        (newFile) =>
          !existing.some(
            (old) => old.name === newFile.name && old.size === newFile.size,
          ),
      ),
    ];

    profileForm.setValue("profilePictureUrl", unique);
  }

  const handleProfileFormSubmit = async (
    form: z.infer<typeof profileValidation>,
  ) => {
    setIsOnboarding(true);
    const profilePicUrl = await uploadProfilePic(
      form.profilePictureUrl[0],
      accessToken!,
    );

    const data: Partial<ProfileDetails> = {
      bio: form.bio,
      profilePictureUrl: profilePicUrl,
      type: "profile",
    };
    await updateOnBoardingInfo({
      data,
      stage: STEPS[step as keyof typeof STEPS],
    });

    setIsOnboarding(false);
    navigate("/", { replace: true });
  };

  return (
    <Form {...profileForm}>
      <form
        onSubmit={profileForm.handleSubmit(handleProfileFormSubmit)}
        className="flex flex-col gap-5 px-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText className="text-green-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">
            Profile Information
          </h2>
        </div>
        <FormField
          name="profilePictureUrl"
          control={profileForm.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Photo *</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {field.value ? (
                      <img
                        src={URL.createObjectURL(field.value[0])}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="text-gray-400" size={32} />
                    )}
                  </div>
                  <label
                    htmlFor="profilePictureUrlInput"
                    className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                  >
                    Choose Photo
                  </label>
                  <input
                    id="profilePictureUrlInput"
                    type="file"
                    multiple={false}
                    accept="image/*"
                    hidden
                    onChange={handleSelect}
                  />
                </div>
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          control={profileForm.control}
          name={"bio"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Bio *</FormLabel>
              <FormControl>
                <>
                  <Textarea
                    {...field}
                    disabled={field.value.trim().length > 500}
                  />
                  <p className="text-xs text-gray-500">
                    {field.value.length || 0}/500 characters
                  </p>
                </>
              </FormControl>
            </FormItem>
          )}
        ></FormField>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-900 mb-2">Review Process</h3>
          <p className="text-sm text-amber-800">
            After submitting your profile, our team will review your credentials
            and qualifications. This typically takes 24-48 hours. You'll receive
            an email notification once your profile is approved and you can
            start accepting patient consultations.
          </p>
        </div>

        <Navigation step={step} isOnboarding={isOnboarding} />
      </form>
    </Form>
  );
};

export default ProfileAndBio;

export async function uploadProfilePic(
  profilePicFile: File,
  accessToken: string,
): Promise<string> {
  /* UPLOAD THE PROFILE PIC TO CLOUDINARY */

  const signaturesData = await getUploadSignature(1, accessToken);
  const signatureData = signaturesData[0];
  if (!signatureData) {
    throw new Error("Invalid signature data");
  }

  if (profilePicFile instanceof File) {
    const form = new FormData();
    form.append("file", profilePicFile);
    form.append("api_key", signatureData.apiKey);
    form.append("public_id", signatureData.publicId);
    form.append("folder", signatureData.folder);
    form.append("timestamp", String(signatureData.timeStamp));
    form.append("signature", signatureData.signature);

    const cloudRes = await axios
      .post(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        form,
        {
          timeout: 1000 * 10,
          timeoutErrorMessage: "Took too long to respond",
        },
      )
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`Trouble uploading profile pic: ${error}`);
      });

    return cloudRes.secure_url;
  }
  throw new Error("Not a file");
}
