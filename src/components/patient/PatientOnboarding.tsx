import React, { useState } from "react";
import { Progress } from "../ui/progress";
import {
  User,
  ChevronRight,
  Heart,
  AlertCircle,
  Activity,
  Pill,
} from "lucide-react";
import { MedicalCategory } from "@/types";
import {
  useGetSupportedMedicalCategories,
  useUpdatePatientOnboardingInfo,
} from "@/lib/actions/generalQueriesAndMutation";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "sonner";

export interface PatientOnboardingData {
  dateOfBirth?: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;

  // Medical History
  bloodType?: string;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  pastSurgeries?: string;
  familyHistory?: string;

  // Lifestyle
  smokingStatus?: string;
  alcoholConsumption?: string;
  exerciseFrequency?: string;
  dietaryRestrictions?: string;

  specializations: string[];
}

const STEPS = 4;

const PatientOnboarding = () => {
  const [step, setStep] = useState(1);
  const { data: medicalCategoriesResponse } =
    useGetSupportedMedicalCategories();
  const medicalSpecializations = medicalCategoriesResponse?.data || [];
  const [formData, setFormData] = useState<PatientOnboardingData>({
    specializations: [],
  });
  const navigate = useNavigate();
  const { userContext } = useUserContext();
  const { mutateAsync: onBoardUser } = useUpdatePatientOnboardingInfo();
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleNext = () => {
    if (step < STEPS) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    console.log("form submitted: ", formData);
    if (!userContext.user_id) return;
    try {
      await onBoardUser({ userId: userContext.user_id, data: formData });
      toast.success("Take you for helping us serve you better");
    } catch (error) {
      toast.error(error?.message);
    }
    alert(
      "Profile completed successfully! Your doctors will have access to these information"
    );
  };

  const toggleSpecification = (spec: MedicalCategory) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec.id)
        ? prev.specializations.filter((s) => s !== spec.id)
        : [...prev.specializations, spec.id],
    }));
  };

  return (
    <main className="flex flex-col justify-center h-full w-full max-w-3xl ">
      <section className="flex flex-col gap-6 px-6 bg-white py-16 rounded-2xl overflow-y-auto shadow-xl h-full">
        <header className=" flex flex-col gap-6 text-gray-900">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold"> Complete Your Profile</h1>
            <p className="">
              Help your doctors provide better care by sharing your medical
              information
            </p>
          </div>
          <Progress value={(step / STEPS) * 100} className="h-2 rounded-sm " />
        </header>
        <div className="flex-1">
          {step === 1 && (
            <PersonalDetails formData={formData} handleChange={handleChange} />
          )}
          {step === 2 && (
            <MedicalHistory formData={formData} handleChange={handleChange} />
          )}
          {step === 3 && (
            <Lifestyle formData={formData} handleChange={handleChange} />
          )}
          {step === 4 && (
            <MedicalSpecialization
              medicalSpecializations={medicalSpecializations}
              formData={formData}
              toggleSpecialization={toggleSpecification}
            />
          )}
        </div>
        <Navigation
          step={step}
          handleBack={handleBack}
          handleNext={handleNext}
          handleSubmit={handleSubmit}
        />
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </button>
        </div>
      </section>
    </main>
  );
};

const PersonalDetails = ({
  formData,
  handleChange,
}: {
  formData: PatientOnboardingData;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) => (
  <>
    <main className="h-full flex flex-col gap-2">
      <header className="flex items-center gap-2 mb-4">
        <User className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Personal Details
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+234 800 000 0000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Type
          </label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Name
          </label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Phone
          </label>
          <input
            type="tel"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            placeholder="+234 800 000 0000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
          />
        </div>
      </div>
    </main>
  </>
);

const MedicalHistory = ({
  formData,
  handleChange,
}: {
  formData: PatientOnboardingData;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) => (
  <main className="flex h-full flex-col">
    <header className="flex items-center gap-2 mb-4">
      <Heart className="text-red-500" size={24} />
      <h2 className="text-xl font-semibold text-gray-800">Medical History</h2>
    </header>
    <div className="flex-1 flex flex-col overflow-y-auto h-full">
      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Known Allergies
        </label>
        <textarea
          name="allergies"
          value={formData.allergies || ""}
          onChange={handleChange}
          placeholder="e.g., Penicillin, Peanuts, Latex (or 'None')"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
        />
      </section>

      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chronic Conditions
        </label>
        <textarea
          name="chronicConditions"
          value={formData.chronicConditions}
          onChange={handleChange}
          placeholder="e.g., Diabetes, Hypertension, Asthma (or 'None')"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
        />
      </section>

      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Medications
        </label>
        <textarea
          name="currentMedications"
          value={formData.currentMedications}
          onChange={handleChange}
          placeholder="List all medications you're currently taking (or 'None')"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
        />
      </section>

      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Past Surgeries
        </label>
        <textarea
          name="pastSurgeries"
          value={formData.pastSurgeries}
          onChange={handleChange}
          placeholder="List any previous surgeries and approximate dates (or 'None')"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
        />
      </section>

      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Family Medical History
        </label>
        <textarea
          name="familyHistory"
          value={formData.familyHistory}
          onChange={handleChange}
          placeholder="Notable conditions in immediate family (e.g., Heart disease, Cancer)"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
        />
      </section>
    </div>
  </main>
);

const Lifestyle = ({
  formData,
  handleChange,
}: {
  formData: PatientOnboardingData;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) => (
  <main className="space-y-5">
    <header className="flex items-center gap-2 mb-4">
      <Activity className="text-green-600" size={24} />
      <h2 className="text-xl font-semibold text-gray-800">
        Lifestyle Information
      </h2>
    </header>

    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Smoking Status
        </label>
        <select
          name="smokingStatus"
          value={formData.smokingStatus}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
        >
          <option value="">Select</option>
          <option value="never">Never smoked</option>
          <option value="former">Former smoker</option>
          <option value="current">Current smoker</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alcohol Consumption
        </label>
        <select
          name="alcoholConsumption"
          value={formData.alcoholConsumption}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
        >
          <option value="">Select</option>
          <option value="none">None</option>
          <option value="occasional">Occasional</option>
          <option value="moderate">Moderate</option>
          <option value="heavy">Heavy</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exercise Frequency
        </label>
        <select
          name="exerciseFrequency"
          value={formData.exerciseFrequency}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
        >
          <option value="">Select</option>
          <option value="none">Rarely/Never</option>
          <option value="1-2">1-2 times per week</option>
          <option value="3-4">3-4 times per week</option>
          <option value="5+">5+ times per week</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dietary Restrictions
        </label>
        <input
          type="text"
          name="dietaryRestrictions"
          value={formData.dietaryRestrictions}
          onChange={handleChange}
          placeholder="e.g., Vegetarian, Gluten-free"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
        />
      </div>
    </section>

    <section className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
      <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
      <div className="text-sm text-gray-700">
        <p className="font-medium text-gray-900 mb-1">Privacy & Security</p>
        <p>
          Your medical information is <strong>encrypted</strong> and only
          accessible by your healthcare providers. You can update this
          information anytime in your profile settings.
        </p>
      </div>
    </section>
  </main>
);

const MedicalSpecialization = ({
  formData,
  toggleSpecialization,
  medicalSpecializations,
}: {
  formData: PatientOnboardingData;
  medicalSpecializations: MedicalCategory[];
  toggleSpecialization: (spec: MedicalCategory) => void;
}) => (
  <div className="flex h-full flex-col gap-2">
    <div className="flex items-center gap-2">
      <Pill className="text-purple-600" size={24} />
      <h2 className="text-xl font-semibold text-gray-800">Areas of Interest</h2>
    </div>

    <p className="text-gray-600">
      Select the medical departments or specializations you're interested in.
      This helps us recommend the right doctors for your needs.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {medicalSpecializations.map((spec) => (
        <button
          key={spec.id}
          onClick={() => toggleSpecialization(spec)}
          className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
            formData.specializations.includes(spec.id)
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white hover:border-blue-300"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{spec.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{spec.name}</h3>
                {formData.specializations.includes(spec.id) && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{spec.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>

    {formData.specializations.length > 0 && (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium text-green-800">
            {formData.specializations.length} specialization
            {formData.specializations.length !== 1 ? "s" : ""} selected
          </span>{" "}
          - We'll prioritize recommending doctors in these areas.
        </p>
      </div>
    )}
  </div>
);

const Navigation = ({
  handleBack,
  step,
  handleNext,
  handleSubmit,
}: {
  handleBack: () => void;
  handleNext: () => void;
  step: number;
  handleSubmit: () => void;
}) => (
  <main className="flex justify-between border-t border-gray-200">
    <button
      onClick={handleBack}
      disabled={step === 1}
      className={`px-6 py-2 rounded-lg font-medium transition-all ${
        step === 1
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      Back
    </button>

    {step < STEPS ? (
      <button
        onClick={handleNext}
        className="px-6 py-2 bg-main-light/90 text-white rounded-lg font-medium hover:bg-main-light transition-all flex items-center gap-2"
      >
        Next
        <ChevronRight size={20} />
      </button>
    ) : (
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
      >
        Complete Profile
      </button>
    )}
  </main>
);

export default PatientOnboarding;
