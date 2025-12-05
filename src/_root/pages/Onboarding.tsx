import ConsultantOnboarding from "@/components/consultant/ConsultantOnboarding";
import PatientOnboarding from "@/components/patient/PatientOnboarding";
import { useUserContext } from "@/context/AuthContext";

const Onboarding = () => {
  const { userContext } = useUserContext();
  if (!userContext.role) {
    return null;
  }
  return (
    <main className="h-full w-full flex items-center justify-center bg-gray-50 py-6">
      {userContext.role === "ROLE_PATIENT" ? (
        <PatientOnboarding />
      ) : (
        <ConsultantOnboarding />
      )}
    </main>
  );
};

export default Onboarding;
