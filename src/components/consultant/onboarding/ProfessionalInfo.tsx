import { useUpdateConsultantOnboardingInfo } from "@/lib/actions/consultantQueryAndMutations";
import { useGetSupportedMedicalCategories } from "@/lib/actions/generalQueriesAndMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { ConsultantOnboardingData, STEPS } from "./ConsultantOnboarding";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Briefcase } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import Navigation from "./OnboardingNavigation";
import { useForm } from "react-hook-form";

const languageOptions = [
  "English",
  "Yoruba",
  "Igbo",
  "Hausa",
  "French",
  "Arabic",
  "Spanish",
];

interface ProfessionalInfo extends ConsultantOnboardingData {
  specialization: string;
  subSpecialties: string[];
  licenseNumber: string;
  yearsOfExperience: number;
  currentWorkplace: string;
  languages: string[];
  type: "professional";
}

const ProfessionalInfo = ({
  step,
  handleNext,
  updateOnBoardingInfo,
}: {
  step: number;
  handleNext: () => void;
  updateOnBoardingInfo: ReturnType<
    typeof useUpdateConsultantOnboardingInfo
  >["mutateAsync"];
}) => {
  const [isOnboarding, setIsOnboarding] = useState(false);

  const { data: medicalCategoriesResponse } =
    useGetSupportedMedicalCategories();
  const specialties = medicalCategoriesResponse?.data;
  const professionalInfoValidation = z.object({
    specialization: z.string().trim().min(1, "Specialization is required"),
    licenseNumber: z.string().trim().min(7, "Invalid license number"),
    yearsOfExperience: z
      .number()
      .min(5, "You must have at least 5 years experience"),
    currentWorkplace: z
      .string()
      .min(5, "Too short to represent proper information")
      .max(50, "Too long "),
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

  const handleProfessionalInfoFormSubmit = async (
    form: z.infer<typeof professionalInfoValidation>,
  ) => {
    setIsOnboarding(true);
    const data: ProfessionalInfo = {
      specialization: form.specialization,
      licenseNumber: form.licenseNumber,
      yearsOfExperience: form.yearsOfExperience,
      currentWorkplace: form.currentWorkplace,
      languages: form.languagesSpoken,
      subSpecialties: [],
      type: "professional",
    };
    await updateOnBoardingInfo({
      data,
      stage: STEPS[step as keyof typeof STEPS],
    });
    setIsOnboarding(false);
    handleNext();
  };

  return (
    <Form {...professionalInfoForm}>
      <form
        onSubmit={professionalInfoForm.handleSubmit(
          handleProfessionalInfoFormSubmit,
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
                    {specialties &&
                      specialties.map((spec) => (
                        <SelectItem key={spec.id} value={spec.id}>
                          {spec.name}
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

        <Navigation step={step} isOnboarding={isOnboarding} />
      </form>
    </Form>
  );
};

export default ProfessionalInfo;
