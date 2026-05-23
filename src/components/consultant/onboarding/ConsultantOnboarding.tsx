import React, { useEffect, useState } from "react";
import {
  useGetConsultantProfile,
  useUpdateConsultantOnboardingInfo,
} from "@/lib/actions/consultantQueryAndMutations";
import { useUserContext } from "@/context/AuthContext";

import { useTokenStore } from "@/store/TokenStore";
import ProfessionalInfo from "./ProfessionalInfo";
import { Progress } from "@/components/ui/progress";
import ProfileAndBio from "./ProfileAndBio";
import Qualifications from "./Qualifications";
import PracticeDetails from "./PracticeDetails";

export interface ConsultantOnboardingData {}

export const STEPS = {
  1: "professional_info",
  2: "qualifications",
  3: "practice_details",
  4: "profile_info",
};

const ConsultantOnboarding = () => {
  const { userContext } = useUserContext();
  const { accessToken } = useTokenStore();
  const { data: consultantProfile } = useGetConsultantProfile(accessToken);
  const currentStep = consultantProfile?.data.onboardingStage.toLowerCase();
  const stepNumber: number =
    Number(
      Object.entries(STEPS).find(([, value]) => value === currentStep)?.[0],
    ) || 1;
  const [step, setStep] = useState(0);
  const {
    mutateAsync: updateOnBoardingInfo,
    isError,
    error,
  } = useUpdateConsultantOnboardingInfo(accessToken);
  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  useEffect(() => {
    setStep(stepNumber);
  }, [stepNumber]);
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
            value={(step / Object.keys(STEPS).length) * 100}
            className="h-2 rounded-sm bg-white border [&>div]:bg-main-light border-white "
          />
        </header>
        <div className="flex-1">
          {step === 1 && (
            <ProfessionalInfo
              step={step}
              updateOnBoardingInfo={updateOnBoardingInfo}
              handleNext={handleNext}
            />
          )}
          {step === 2 && (
            <Qualifications
              handleNext={handleNext}
              accessToken={accessToken}
              step={step}
              updateOnBoardingInfo={updateOnBoardingInfo}
            />
          )}
          {step === 3 && (
            <PracticeDetails
              updateOnBoardingInfo={updateOnBoardingInfo}
              step={step}
              handleNext={handleNext}
            />
          )}
          {step === 4 && (
            <ProfileAndBio
              updateOnBoardingInfo={updateOnBoardingInfo}
              step={step}
              accessToken={accessToken}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default ConsultantOnboarding;
