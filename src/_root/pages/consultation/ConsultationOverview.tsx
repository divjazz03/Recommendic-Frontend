import ConsultantConsultationOverview from "@/components/consultant/consultation/ConsultantConsultationOverview";
import PatientConsultationOverview from "@/components/patient/consultation/PatientConsultationOverview";
import { useUserContext } from "@/context/AuthContext";

const ConsultationOverview = () => {
  const { userContext } = useUserContext();

  if (!userContext.userType) {
    return null;
  }
  return (
    <>
      {userContext.userType === "PATIENT" ? (
        <PatientConsultationOverview />
      ) : (
        <ConsultantConsultationOverview />
      )}
    </>
  );
};

export default ConsultationOverview;
