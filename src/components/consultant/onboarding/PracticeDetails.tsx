import { useUpdateConsultantOnboardingInfo } from "@/lib/actions/consultantQueryAndMutations";
import Navigation from "./OnboardingNavigation";
import { useState } from "react";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Calendar, HashIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";

interface PracticeDetails extends ConsultantOnboardingData {
  consultationFee: number;
  consultationDuration: number;
  availableDays: string[];
  preferredTimeSlots: string[];
  type: string;
}
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

const PracticeDetails = ({
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
    mode: "onTouched",
  });

  const handleQualificationFormSubmit = async (
    form: z.infer<typeof practiceDetailsValidation>,
  ) => {
    setIsOnboarding(true);
    const data: Partial<PracticeDetails> = {
      consultationFee: form.consultationFee,
      consultationDuration: form.duration,
      availableDays: form.availableDays,
      preferredTimeSlots: form.preferredTimeSlots,
      type: "practice",
    };
    await updateOnBoardingInfo({
      data,
      stage: STEPS[step as keyof typeof STEPS],
    });
    setIsOnboarding(false);
    handleNext();
  };
  return (
    <Form {...practiceDetailsForm}>
      <form
        onSubmit={practiceDetailsForm.handleSubmit(
          handleQualificationFormSubmit,
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
                <FormLabel>Consultation Duration</FormLabel>
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

        <Navigation step={step} isOnboarding={isOnboarding} />
      </form>
    </Form>
  );
};

export default PracticeDetails;
