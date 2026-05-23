import { useUpdateConsultantOnboardingInfo } from "@/lib/actions/consultantQueryAndMutations";
import Navigation from "./OnboardingNavigation";
import { useState } from "react";
import { z } from "zod";
import { fileListSchema, fileSchema } from "@/lib/utils/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConsultantOnboardingData, STEPS } from "./ConsultantOnboarding";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileDropZone from "@/components/shared/FileDropZone";
import { Label } from "@radix-ui/react-label";
import { getUploadSignature } from "@/lib/api/general_api";
import axios from "axios";
import { Credential } from "@/types";

interface Qualifications extends ConsultantOnboardingData {
  medicalDegree: string;
  university: string;
  graduationYear: number;
  certifications: string;
  credentials: Credential[];
  resume: Credential;
  type: string;
}
const qualificationsValidation = z.object({
  medicalDegree: z.string(),
  university: z.string(),
  graduationYear: z.coerce
    .number()
    .min(new Date().getUTCFullYear() - 60, "Year too far back")
    .max(new Date().getUTCFullYear() - 5, "Cannot have had enough experience"),
  certifications: z.string(),
  certificate: fileListSchema,
  resume: fileSchema,
});
const Qualifications = ({
  step,
  handleNext,
  updateOnBoardingInfo,
  accessToken,
}: {
  step: number;
  accessToken: string | null;
  handleNext: () => void;
  updateOnBoardingInfo: ReturnType<
    typeof useUpdateConsultantOnboardingInfo
  >["mutateAsync"];
}) => {
  const [isOnboarding, setIsOnboarding] = useState(false);

  const qualificationsForm = useForm<z.infer<typeof qualificationsValidation>>({
    resolver: zodResolver(qualificationsValidation),
    defaultValues: {
      certificate: undefined,
      certifications: "",
      graduationYear: 2015,
      medicalDegree: "",
      resume: undefined,
      university: "",
    },
    mode: "onTouched",
  });

  const handleQualificationFormSubmit = async (
    form: z.infer<typeof qualificationsValidation>,
  ) => {
    setIsOnboarding(true);
    const resumeUrl = await uploadResume(form.resume[0], accessToken);
    const certificates = form.certificate;
    const certificatesResponse = await uploadCredentials(
      certificates,
      accessToken,
    );
    const data: Qualifications = {
      certifications: form.certifications,
      university: form.university,
      credentials: certificatesResponse
        ? certificatesResponse.map((certificate) => ({
            name: certificate.name,
            fileUrl: certificate.fileUrl,
            type: certificate.type,
          }))
        : [],
      graduationYear: form.graduationYear,
      medicalDegree: form.medicalDegree,
      resume: {
        fileUrl: resumeUrl,
        name: form.resume[0].name,
        type: "resume",
      },
      type: "qualifications",
    };
    await updateOnBoardingInfo({
      data,
      stage: STEPS[step as keyof typeof STEPS],
    });
    setIsOnboarding(false);
    handleNext();
  };
  return (
    <Form {...qualificationsForm}>
      <form
        className="flex flex-col gap-5 px-6"
        onSubmit={qualificationsForm.handleSubmit(
          handleQualificationFormSubmit,
        )}
      >
        <div className="flex items-center gap-2 mb-4">
          <Award className="text-purple-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">
            Qualifications & Credentials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={qualificationsForm.control}
            name="medicalDegree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical Degree *</FormLabel>
                <FormControl>
                  <Input {...field} required placeholder="e.g., MBBS, MD" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={qualificationsForm.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required
                    placeholder="e.g., University of Lagos"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        <FormField
          control={qualificationsForm.control}
          name="graduationYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Graduation Year *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  required
                  placeholder="e.g., 2015"
                  type="number"
                  min={new Date().getUTCFullYear() - 60}
                  max={new Date().getUTCFullYear() - 5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          control={qualificationsForm.control}
          name="certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block">
                Additional Certifications & Training *
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  required
                  rows={3}
                  className="w-full"
                  placeholder="List any fellowships, board certifications, or specialized training (e.g., Fellowship in Cardiology, ACLS Certified)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <div className="flex flex-col gap-2 justify-start">
          <Label className="block">Upload Credentials & Certificates *</Label>
          <FileDropZone
            control={qualificationsForm.control}
            name="certificate"
          />
        </div>
        <div className="flex flex-col gap-2 justify-start">
          <Label className="block">Upload Resume *</Label>
          <FileDropZone control={qualificationsForm.control} name="resume" />
        </div>
        <Navigation step={step} isOnboarding={isOnboarding} />
      </form>
    </Form>
  );
};

export default Qualifications;

export async function uploadResume(
  resume: File,
  accessToken: string | null,
): Promise<string> {
  /* UPLOAD THE PROFILE PIC TO CLOUDINARY */

  const signaturesData = await getUploadSignature(1, accessToken);
  const signatureData = signaturesData[0];
  if (!signatureData) {
    throw new Error("Invalid signature data");
  }
  if (resume instanceof File) {
    const form = new FormData();
    form.append("file", resume);
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
        throw new Error(`Trouble uploading resume: ${error}`);
      });

    return cloudRes.secure_url;
  }
  throw new Error("Not a file");
}

export async function uploadCredentials(
  credentials: File[],
  accessToken: string | null,
): Promise<Credential[]> {
  if (!credentials || credentials.length < 1) {
    throw new Error("No credentials provided");
  }

  const signaturesData = await getUploadSignature(
    credentials.length,
    accessToken,
  );
  if (!signaturesData) {
    throw new Error("No upload signatures returned");
  }

  const urls: Credential[] = await Promise.all(
    credentials.map(async (credential, index) => {
      console.log(credential);
      const signature = signaturesData[index];
      if (!signature) {
        throw new Error("Invalid signature");
      }
      if (!(credential instanceof File)) {
        throw new Error("Invalid file type");
      }

      const form = new FormData();
      form.append("file", credential);
      form.append("api_key", signature.apiKey);
      form.append("public_id", signature.publicId);
      form.append("folder", signature.folder);
      form.append("timestamp", String(signature.timeStamp));
      form.append("signature", signature.signature);

      const response = await axios
        .post(
          `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
          form,
          {
            timeout: 1000 * 10,
            timeoutErrorMessage: "Took too long to respond",
          },
        )
        .then((response) => response.data)
        .catch((error) => {
          throw new Error(`Trouble uploading credential documents: ${error}`);
        });

      return {
        fileUrl: response.secure_url,
        name: credential.name,
        type: "certificate",
      } as Credential;
    }),
  );
  return urls;
}
