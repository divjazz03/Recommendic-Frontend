import ConsultantOnboarding from "@/components/consultant/onboarding/ConsultantOnboarding";
import PatientOnboarding from "@/components/patient/PatientOnboarding";
import { useUserContext } from "@/context/AuthContext";

const Onboarding = () => {
  const { userContext } = useUserContext();
  if (!userContext.userPrincipal?.role) {
    return null;
  }
  return (
    <main className="h-full w-full flex items-center justify-center bg-gray-50 py-6">
      {userContext.userPrincipal.role.name === "ROLE_PATIENT" ? (
        <PatientOnboarding />
      ) : (
        <ConsultantOnboarding />
      )}
    </main>
  );
};

export default Onboarding;
