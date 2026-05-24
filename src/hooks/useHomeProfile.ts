import { useGetConsultantProfile } from "@/lib/actions/consultantQueryAndMutations";
import { useTokenStore } from "@/store/TokenStore";
import { UserType } from "@/types";
import { usePatientProfile } from "./useProfile";
import { useGetMyProfiles } from "@/lib/actions/patientQueryAndMutations";

const useHomeProfile = (userType: UserType) => {
  const { accessToken } = useTokenStore();
  const { data: profileData } = useGetConsultantProfile(
    accessToken,
    userType === "CONSULTANT",
  );
  const { data: patientProfileData } = useGetMyProfiles(
    accessToken,
    userType === "PATIENT",
  );
  const patientData = patientProfileData?.data;
  const profile = profileData?.data || {
    onboardingStage: "ACTIVE_USER",
    profilePicture: {
      name: "unknown",
      pictureUrl: patientData?.profileImgUrl ?? "",
    },
    specialty: undefined,
    userName: {
      full_name: patientData?.userName?.full_name ?? "Unknown User",
    },
  };
  return {
    profile,
  };
};

export default useHomeProfile;
