import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "../ui/progress";
import {
  Award,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  HashIcon,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { getUploadSignature } from "@/lib/api/general_api";
import Loader from "../shared/Loader";
import { z } from "zod";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "../ui/multi-select";
import { Button } from "../ui/button";
import {
  fileListSchema,
  fileSchema,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/utils/validations";
import FileDropZone from "../shared/FileDropZone";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useUpdateConsultantOnboardingInfo } from "@/lib/actions/consultantQueryAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { ApiError } from "@/lib/axios";

export type DocumentType = "photo" | "certificate" | "resume";
export type Credential = {
  name: string;
  fileUrl: string | File;
  type: DocumentType;
};
export interface ConsultantOnboardingData {
  specialization?: string;
  subSpecialties?: string[];
  licenseNumber?: string;
  yearsOfExperience?: number;
  currentWorkplace?: string;

  // Qualifications
  medicalDegree?: string;
  university?: string;
  graduationYear?: number;
  certifications?: string;

  // Practice Details
  languages?: string[];
  consultationFee?: number;
  consultationDuration?: number;
  availableDays?: string[];
  preferredTimeSlots?: string[];

  // Additional
  bio?: string;
  profilePictureUrl?: string | File;
  credentials?: Credential[];
  resume?: Credential;
}

const specializations = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Urology",
  "Gynecology",
  "Ophthalmology",
  "ENT (Otolaryngology)",
  "Oncology",
  "General Practice",
];

const languageOptions = [
  "English",
  "Yoruba",
  "Igbo",
  "Hausa",
  "French",
  "Arabic",
  "Spanish",
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeSlots = [
  "Morning (8AM - 12PM)",
  "Afternoon (12PM - 4PM)",
  "Evening (4PM - 8PM)",
];
const STEPS = 4;

async function uploadProfilePic(
  formData: ConsultantOnboardingData
): Promise<string> {
  /* UPLOAD THE PROFILE PIC TO CLOUDINARY */

    const signaturesData = await getUploadSignature(1);
    const signatureData = signaturesData[0];
    if (!signatureData) {
      throw new Error("Invalid signature data");
    }

    if (formData.profilePictureUrl instanceof File) {
      const form = new FormData();
      form.append("file", formData.profilePictureUrl);
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
          }
        )
        .then((response) => response.data);

      return cloudRes.secure_url;
    }
    throw new Error("Not a file");
  
}

async function uploadResume(
  formData: ConsultantOnboardingData
): Promise<string> {
  /* UPLOAD THE PROFILE PIC TO CLOUDINARY */
  
    const signaturesData = await getUploadSignature(1);
    const signatureData = signaturesData[0];
    if (!signatureData) {
      throw new Error("Invalid signature data");
    }
    if (formData.resume?.fileUrl instanceof File) {
      const form = new FormData();
      form.append("file", formData.resume.fileUrl);
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
          }
        )
        .then((response) => response.data);

      return cloudRes.secure_url;
    }
    throw new Error("Not a file");
  
}

async function uploadCredentials(
  formData: ConsultantOnboardingData
): Promise<Credential[]> {
  if (!formData.credentials) {
    throw new Error("No credentials provided");
  }

    const signaturesData = await getUploadSignature(
      formData.credentials.length
    );
    if (!signaturesData) {
      throw new Error("No upload signatures returned");
    }

    const urls: Credential[] = await Promise.all(
      formData.credentials.map(async (credential, index) => {
        console.log(credential)
        const signature = signaturesData[index];
        if (!signature) {
          throw new Error("Invalid signature");
        }
        if (!(credential.fileUrl instanceof File)) {
          throw new Error("Invalid file type");
        }

        const form = new FormData();
        form.append("file", credential.fileUrl);
        form.append("api_key", signature.apiKey);
        form.append("public_id", signature.publicId);
        form.append("folder", signature.folder);
        form.append("timestamp", String(signature.timeStamp));
        form.append("signature", signature.signature);

        const { data } = await axios.post(
          `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
          form,
          {
            timeout: 1000 * 10,
            timeoutErrorMessage: "Took too long to respond",
          }
        );

        return {
          fileUrl: data.secure_url,
          name: credential.name,
          type: "certificate"
        } as Credential;
      })
    );
    return urls;
  
}

const ConsultantOnboarding = () => {
  const {userContext} = useUserContext()
  const [step, setStep] = useState(1);
  const { mutateAsync: updateOnBoardingInfo, isError, error } =
    useUpdateConsultantOnboardingInfo();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isFinishedInputtingValues, setIsFinishedInputtingValues] =
    useState(false);
  const [formData, setFormData] = useState<ConsultantOnboardingData>({
    credentials: [],
    availableDays: [],
    preferredTimeSlots: [],
    languages: [],
    consultationDuration: 15,
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  useEffect(() => {
    if (isFinishedInputtingValues) {
      handleSubmit();
    }
  }, [isFinishedInputtingValues]);

  const handleSubmit = async () => {
    setIsOnboarding(true);
    console.log("Logging the form data", formData)
    const onboardingData: ConsultantOnboardingData = {
      availableDays: formData.availableDays,
      bio: formData.bio,
      certifications: formData.certifications,
      consultationDuration: formData.consultationDuration,
      consultationFee: formData.consultationFee,
      currentWorkplace: formData.currentWorkplace,
      graduationYear: formData.graduationYear,
      languages: formData.languages,
      licenseNumber: formData.licenseNumber,
      medicalDegree: formData.medicalDegree,
      preferredTimeSlots: formData.preferredTimeSlots,
      specialization: formData.specialization?.toLowerCase(),
      subSpecialties: formData.subSpecialties,
      university: formData.university,
      yearsOfExperience: formData.yearsOfExperience,
      resume: formData.resume,
      credentials: [],
    };

    

    try {
      const profilePicUrl = await uploadProfilePic(formData);
      onboardingData.profilePictureUrl = profilePicUrl;

      const resumeUrl = await uploadResume(formData);
      onboardingData.resume = {
        fileUrl: resumeUrl,
        name: formData.resume?.name || "unknown name",
        type: "resume",
      };

      const returnValues = await uploadCredentials(formData);
      if (onboardingData.credentials) onboardingData.credentials.length = 0;

      returnValues.forEach((value) => {
        onboardingData.credentials?.push(value);
      });
    } catch (error) {
      if(error instanceof ApiError) {
        toast.error(error.message)
      }else {
        toast.error(String(error))
      }
      setIsOnboarding(false);
    }

    console.log(onboardingData)

    if (!onboardingData.credentials) {
      setIsOnboarding(false);
      return toast.error("No credentials found");
    }
    
    const response = userContext.user_id && updateOnBoardingInfo({data: onboardingData, userId: userContext.user_id})
    if (isError && error) {
      if (error instanceof ApiError) {
        Array(error.data?.errors).map((error) => toast.error(error.error))
      }
    }

    setIsOnboarding(false);
    navigate("/");
  };

  return (
    <main className="flex flex-col justify-center h-full px-2 w-full max-w-3xl ">
      <section className="flex flex-col gap-6 bg-white rounded-2xl overflow-y-auto shadow-xl h-full">
        <header className=" flex flex-col gap-6 p-6 text-light-4 bg-main-light">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">
              Complete Your Professional Profile
            </h1>
            <p className="">
              Help Patients find you by completing your consultant profile
            </p>
          </div>
          <Progress
            title="Step progress"
            value={(step / STEPS) * 100}
            className="h-2 rounded-sm bg-white border [&>div]:bg-main-light border-white "
          />
        </header>
        <div className="flex-1">
          {step === 1 && (
            <ProfessionalInfo
              setFormData={setFormData}
              step={step}
              handleBack={handleBack}
              handleNext={handleNext}
              handleSubmit={handleSubmit}
              isOnboarding={isOnboarding}
            />
          )}
          {step === 2 && (
            <Qualifications
              handleNext={handleNext}
              setFormData={setFormData}
              step={step}
              handleBack={handleBack}
              handleSubmit={handleSubmit}
              isOnboarding={isOnboarding}
            />
          )}
          {step === 3 && (
            <PracticeDetails
              setFormData={setFormData}
              step={step}
              handleBack={handleBack}
              handleNext={handleNext}
              handleSubmit={handleSubmit}
              isOnboarding={isOnboarding}
            />
          )}
          {step === 4 && (
            <ProfileAndBio
              setFormData={setFormData}
              step={step}
              handleBack={handleBack}
              isOnboarding={isOnboarding}
              handleSubmit={handleSubmit}
              setIsFinishedInputtingValues={setIsFinishedInputtingValues}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default ConsultantOnboarding;

const ProfessionalInfo = ({
  step,
  isOnboarding,
  setFormData,
  handleBack,
  handleSubmit,
  handleNext,
}: {
  isOnboarding: boolean;
  step: number;
  handleBack: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  setFormData: (value: React.SetStateAction<ConsultantOnboardingData>) => void;
}) => {
  const professionalInfoValidation = z.object({
    specialization: z.string().trim().min(1, "Required"),
    licenseNumber: z.string().trim().min(7, "Invalid license number"),
    yearsOfExperience: z
      .number()
      .min(5, "You must have at least 5 years experience"),
    currentWorkplace: z.string(),
    languagesSpoken: z
      .array(z.string())
      .min(1, "Must provide at least one language")
      .max(3, "Must provid at most 3 languages"),
  });

  const professionalInfoForm = useForm<
    z.infer<typeof professionalInfoValidation>
  >({
    resolver: zodResolver(professionalInfoValidation),
    defaultValues: {
      yearsOfExperience: undefined,
      currentWorkplace: "",
      languagesSpoken: [],
      licenseNumber: "",
      specialization: "",
    },
    mode: "onChange",
  });

  const handleProfessionalInfoFormSubmit = (
    form: z.infer<typeof professionalInfoValidation>
  ) => {
    setFormData((prev) => ({
      ...prev,
      yearsOfExperience: form.yearsOfExperience,
      currentWorkplace: form.currentWorkplace,
      languages: form.languagesSpoken,
      licenseNumber: form.licenseNumber,
      specialization: form.specialization,
    }));
    handleNext();
  };

  return (
    <Form {...professionalInfoForm}>
      <form
        onSubmit={professionalInfoForm.handleSubmit(
          handleProfessionalInfoFormSubmit
        )}
        className="px-6 flex flex-col gap-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="text-indigo-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">
            Professional Information
          </h2>
        </div>

        <FormField
          control={professionalInfoForm.control}
          name="specialization"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Primary Specialization</FormLabel>
              <FormControl>
                <Select required {...field} onValueChange={field.onChange}>
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    id={field.name}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select a specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          control={professionalInfoForm.control}
          name="licenseNumber"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>
                Medical License Number *
              </FormLabel>
              <FormControl>
                <Input
                  required
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={professionalInfoForm.control}
            name="yearsOfExperience"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>
                  Years Of Experience *
                </FormLabel>
                <FormControl>
                  <Input
                    aria-errormessage={fieldState.error?.message}
                    {...field}
                    id={field.name}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    required
                    placeholder="6"
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={professionalInfoForm.control}
            name="currentWorkplace"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Current WorkPlace *</FormLabel>
                <FormControl>
                  <Input
                    id={field.name}
                    aria-errormessage={fieldState.error?.message}
                    {...field}
                    required
                    placeholder="e.g., Lagos University Teaching Hospital"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>

        <FormField
          control={professionalInfoForm.control}
          name="languagesSpoken"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Languages Spoken *</FormLabel>
              <MultiSelect onValuesChange={field.onChange} values={field.value}>
                <FormControl>
                  <MultiSelectTrigger id={field.name} className="w-full h-10">
                    <MultiSelectValue placeholder="Select Languages you are proficient speaking" />
                  </MultiSelectTrigger>
                </FormControl>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {languageOptions.map((lang) => (
                      <MultiSelectItem key={lang} value={lang}>
                        {lang}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <Navigation
          step={step}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
          isOnboarding={isOnboarding}
        />
      </form>
    </Form>
  );
};

const Qualifications = ({
  isOnboarding,
  setFormData,
  step,
  handleSubmit,
  handleBack,
  handleNext,
}: {
  isOnboarding: boolean;
  step: number;
  handleBack: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  setFormData: (value: React.SetStateAction<ConsultantOnboardingData>) => void;
}) => {
  const qualificationsValidation = z.object({
    medicalDegree: z.string(),
    university: z.string(),
    graduationYear: z.coerce
      .number()
      .min(new Date().getUTCFullYear() - 60, "Invalid year")
      .max(new Date().getUTCFullYear() - 5, "Invalid year"),
    certifications: z.string(),
    certificate: fileListSchema,
    resume: fileSchema,
  });

  const qualificationsForm = useForm<z.infer<typeof qualificationsValidation>>({
    resolver: zodResolver(qualificationsValidation),
    defaultValues: {
      certificate: undefined,
      certifications: "",
      graduationYear: undefined,
      medicalDegree: "",
      resume: undefined,
      university: "",
    },
    mode: "onChange",
  });

  const handleQualificationFormSubmit = (
    form: z.infer<typeof qualificationsValidation>
  ) => {
    const resume = form.resume[0];
    setFormData((prev) => ({
      ...prev,
      certifications: form.certifications,
      university: form.university,
      credentials: form.certificate.map((file) => ({
        fileUrl: file,
        name: file.name,
        type: "certificate",
      })),
      graduationYear: form.graduationYear,
      medicalDegree: form.medicalDegree,
      resume: {
        fileUrl: resume,
        name: resume.name,
        type: "resume",
      },
    }));
    handleNext();
  };
  return (
    <Form {...qualificationsForm}>
      <form
        className="flex flex-col gap-5 px-6"
        onSubmit={qualificationsForm.handleSubmit(
          handleQualificationFormSubmit
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
        <Navigation
          step={step}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
          isOnboarding={isOnboarding}
        />
      </form>
    </Form>
  );
};

const PracticeDetails = ({
  isOnboarding,
  step,
  handleBack,
  handleNext,
  handleSubmit,
  setFormData,
}: {
  isOnboarding: boolean;
  step: number;
  handleBack: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  setFormData: (value: React.SetStateAction<ConsultantOnboardingData>) => void;
}) => {
  const practiceDetailsValidation = z.object({
    consultationFee: z.coerce.number().optional(),
    duration: z.coerce.number().optional(),
    availableDays: z.array(z.string()).optional(),
    preferredTimeSlots: z.array(z.string()).optional(),
  });

  const practiceDetailsForm = useForm<
    z.infer<typeof practiceDetailsValidation>
  >({
    resolver: zodResolver(practiceDetailsValidation),
    defaultValues: {
      consultationFee: 15000,
      duration: 60,
      availableDays: [],
      preferredTimeSlots: [],
    },
    mode: "onChange",
  });

  const handleQualificationFormSubmit = (
    form: z.infer<typeof practiceDetailsValidation>
  ) => {
    setFormData((prev) => ({
      ...prev,
      consultationFee: form.consultationFee,
      consultationDuration: form.duration,
      availableDays: form.availableDays,
      preferredTimeSlots: form.preferredTimeSlots,
    }));
    handleNext();
  };
  return (
    <Form {...practiceDetailsForm}>
      <form
        onSubmit={practiceDetailsForm.handleSubmit(
          handleQualificationFormSubmit
        )}
        className="flex flex-col gap-5 px-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">
            Practice Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={practiceDetailsForm.control}
            name={"consultationFee"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consultation Fee (#)</FormLabel>
                <FormControl>
                  <div className="relative border rounded-md focus-within:ring-2 focus-within:ring-main focus-within:ring-offset-2 overflow-hidden ">
                    <HashIcon
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 15000)
                      }
                      name="consultationFee"
                      placeholder="15000"
                      className="ml-12 border-none w-48 h-auto focus-visible:ring-transparent"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={practiceDetailsForm.control}
            name={"duration"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consultation Fee (#)</FormLabel>
                <FormControl>
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pick your preferred consultation duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"15"}>15 minutes</SelectItem>
                      <SelectItem value={"30"}>30 minutes</SelectItem>
                      <SelectItem value={"45"}>45 minutes</SelectItem>
                      <SelectItem value={"60"}>1 hour</SelectItem>
                      <SelectItem value={"120"}>2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          ></FormField>
        </div>

        <FormField
          control={practiceDetailsForm.control}
          name="availableDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Days</FormLabel>
              <MultiSelect onValuesChange={field.onChange} values={field.value}>
                <FormControl>
                  <MultiSelectTrigger className="w-full h-10">
                    <MultiSelectValue placeholder="Select Days that you will most likely be available" />
                  </MultiSelectTrigger>
                </FormControl>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {daysOfWeek.map((day) => (
                      <MultiSelectItem key={day} value={day}>
                        {day}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          control={practiceDetailsForm.control}
          name="preferredTimeSlots"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Time Slots</FormLabel>
              <MultiSelect onValuesChange={field.onChange} values={field.value}>
                <FormControl>
                  <MultiSelectTrigger className="w-full h-10">
                    <MultiSelectValue placeholder="Select your preferred time slots" />
                  </MultiSelectTrigger>
                </FormControl>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {timeSlots.map((time) => (
                      <MultiSelectItem key={time} value={time}>
                        {time}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <Navigation
          step={step}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
          isOnboarding={isOnboarding}
        />
      </form>
    </Form>
  );
};

const ProfileAndBio = ({
  setFormData,
  isOnboarding,
  step,
  handleBack,
  handleSubmit,
  setIsFinishedInputtingValues,
}: {
  isOnboarding: boolean;
  step: number;
  handleBack: () => void;
  handleSubmit: () => void;
  setIsFinishedInputtingValues: (value: React.SetStateAction<boolean>) => void;
  setFormData: (value: React.SetStateAction<ConsultantOnboardingData>) => void;
}) => {
  const profilePicSchema = z
    .array(z.instanceof(File))
    .length(1, "Provide one profile photo")
    .refine(
      (files) => files.every((f) => f.size <= MAX_FILE_SIZE_BYTES),
      "Each file must be under 5MB"
    )
    .refine(
      (files) =>
        files.every((file) => ["image/png", "image/jpeg"].includes(file.type)),
      "Invalid file detected (only PNG, JPG, PDF allowed)"
    );
  const profileValidation = z.object({
    profilePictureUrl: profilePicSchema,
    bio: z.string().max(500, "Must provid at most 3 languages"),
  });

  const profileForm = useForm<z.infer<typeof profileValidation>>({
    resolver: zodResolver(profileValidation),
    defaultValues: {
      bio: "",
      profilePictureUrl: undefined,
    },
    mode: "onChange",
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
            (old) => old.name === newFile.name && old.size === newFile.size
          )
      ),
    ];

    profileForm.setValue("profilePictureUrl", unique);
  }

  const handleProfileFormSubmit = (form: z.infer<typeof profileValidation>) => {
    setFormData((prev) => ({
      profilePictureUrl: form.profilePictureUrl[0],
      bio: form.bio,
      ...prev,
    }));
    setIsFinishedInputtingValues(true);
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

        <Navigation
          step={step}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
          isOnboarding={isOnboarding}
        />
      </form>
    </Form>
  );
};

const Navigation = ({
  handleBack,
  step,
  handleSubmit,
  isOnboarding,
}: {
  isOnboarding: boolean;
  step: number;
  handleBack: () => void;
  handleSubmit: () => void;
}) => (
  <main className="flex justify-between p-6 border-t border-gray-200">
    <Button
      onClick={handleBack}
      disabled={step === 1}
      className={`px-6 py-2 rounded-lg font-medium transition-all ${
        step === 1
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      <ChevronLeft size={20} />
      Back
    </Button>

    {step < 4 ? (
      <Button
        type="submit"
        className="px-6 py-2 bg-main-light text-white rounded-lg font-medium hover:bg-main transition-all flex items-center gap-2"
      >
        Next
        <ChevronRight size={20} />
      </Button>
    ) : (
      <Button
        disabled={isOnboarding}
        type="submit"
        className="px-6 py-2 bg-green-600 disabled:cursor-not-allowed text-white rounded-lg font-medium hover:bg-green-700 transition-all"
      >
        {isOnboarding ? "Please wait " : "Submit for Review"}{" "}
        {isOnboarding && <Loader />}
      </Button>
    )}
  </main>
);
