import { useGetConsultantProfile } from "@/lib/actions/consultantQueryAndMutations";
import { useTokenStore } from "@/store/TokenStore";
import { UserType } from "@/types";

const useHomeProfile = (userType: UserType) => {
  const { accessToken } = useTokenStore();
  const { data: profileData } = useGetConsultantProfile(
    accessToken,
    userType === "CONSULTANT",
  );
  const profile = profileData?.data;
  return {
    profile,
  };
};

export default useHomeProfile;
