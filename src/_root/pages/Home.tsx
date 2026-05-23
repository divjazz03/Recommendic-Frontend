import ConsultantHome from "@/components/consultant/ConsultantHome";
import PatientHome from "@/components/patient/PatientHome";
import { useUserContext } from "@/context/AuthContext";

const Home = () => {
  const { userContext } = useUserContext();
  if (!userContext.userPrincipal?.role.name) {
    return null;
  }
  return (
    <>
      {userContext.userPrincipal.role.name === "ROLE_PATIENT" ? (
        <PatientHome />
      ) : (
        <ConsultantHome />
      )}
    </>
  );
};

export default Home;
