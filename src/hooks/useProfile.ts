import {
  useGetMyConsultantProfiles,
  useUpdateConsultantProfile,
} from "@/lib/actions/consultantQueryAndMutations";
import { useGetSupportedMedicalCategories } from "@/lib/actions/generalQueriesAndMutation";
import {
  useGetMyProfiles,
  useUpdatePatientData,
} from "@/lib/actions/patientQueryAndMutations";
import {
  Address,
  ConsultantEducation,
  LifeStyleInformation,
  MedicalCategory,
  MedicalHistory,
} from "@/types";
import { useEffect, useState } from "react";

export interface PatientProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth: string;
  gender: string;
  address?: Partial<Address>;
  interests: string[];
  bloodType?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: Partial<MedicalHistory>;
  lifeStyleInfo?: Partial<LifeStyleInformation>;
  profileImgUrl?: string;
}

export type ModifyingProfileData = Partial<PatientProfileData>;

export const usePatientProfile = () => {
  const [profileData, setProfileData] = useState<PatientProfileData>();
  const { data: medicalCategoriesResponse } =
    useGetSupportedMedicalCategories();
  const { data: myProfileResponse } = useGetMyProfiles();
  const [isEditing, setIsEditing] = useState(false);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [modifyingProfileData, setModifyingProfileData] =
    useState<ModifyingProfileData>();

  const selectedCategoriesChangable = myProfileResponse?.data.interests ?? [];

  const [selectedCategories, setSelectedCategories] = useState<
    MedicalCategory[]
  >(
    medicalCategoriesResponse?.data.filter((category) =>
      selectedCategoriesChangable.includes(category.name)
    ) ?? []
  );

  const { mutateAsync: updatePatientProfileData } =
    useUpdatePatientData();

  useEffect(() => {
    if (myProfileResponse) {
      const data = myProfileResponse.data;
      setProfileData({
        firstName: data.userName.first_name ?? "undefined",
        lastName: data.userName.last_name ?? "undefined",
        email: data.email,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        bloodType: data.bloodType,
        address: {
          city: data?.address?.city,
          country: data?.address?.country,
          state: data?.address?.state,
          zipCode: "200033",
        },
        interests: data.interests,
        profileImgUrl: data.profileImgUrl,
      });
      if (medicalCategoriesResponse && medicalCategoriesResponse.data) {
        setSelectedCategories([
          ...medicalCategoriesResponse.data.filter((category) =>
            data.interests?.includes(category.name)
          ),
        ]);
      }
    }
  }, [myProfileResponse, medicalCategoriesResponse]);

  const handleInputChange = (
    field: keyof PatientProfileData,
    value: string
  ) => {
    setProfileData(prev => prev && ({ ...prev, [field]: value }) );
    if (modifyingProfileData) {
      setModifyingProfileData({ ...modifyingProfileData, [field]: value });
      return;
    }
    setModifyingProfileData({ [field]: value });
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setProfileData((prev) => prev && ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
    if (modifyingProfileData) {
      setModifyingProfileData((prev) => ({
        ...prev,
        address: { ...profileData?.address, [field]: value },
      }));
    } else {
      setModifyingProfileData((prev) => ({
        ...prev,
        address: { [field]: value },
      }));
    }
  };

  const handleLifeStyleChange = (
    field: keyof LifeStyleInformation,
    value: string
  ) => {
    setProfileData((prev) => (prev && {
      ...prev,
      lifeStyleInfo: { ...prev?.lifeStyleInfo, [field]: value },
    }));

    if (modifyingProfileData) {
      setModifyingProfileData((prev) => ({
        ...prev,
        lifeStyleInfo: {
          ...prev?.lifeStyleInfo,
          [field]: value,
        },
      }));
    } else {
      setModifyingProfileData((prev) => ({
        ...prev,
        lifeStyleInfo: { [field]: value },
      }));
    }
  };

  const handleMedicalHistoryChange = (
    field: keyof MedicalHistory,
    value: string
  ) => {
    setProfileData((prev) => 
      prev && ({
          ...prev,
          medicalHistory: { ...prev?.medicalHistory, [field]: value },
        })
    );

    if (modifyingProfileData) {
      setModifyingProfileData((prev) => ({
        ...prev,
        medicalHistory: {
          ...prev?.medicalHistory,
          [field]: value,
        },
      }));
    } else {
      setModifyingProfileData((prev) => ({
        ...prev,
        medicalHistory: { [field]: value },
      }));
    }
  };

  const handleInterestsChange = (interests: string[]) => {
    setProfileData((prev) => prev &&  ({ ...prev, interests: [...interests] }));
    setModifyingProfileData((prev) => ({ ...prev, interests: [...interests] }));
  };

  const handleSaveProfile = async () => {
    if (modifyingProfileData) {
      console.log("Saving profile:", modifyingProfileData);
      await updatePatientProfileData(modifyingProfileData);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  const handleStartEdit = () => {
    !isEditing && setIsEditing(true);
  };

  const medicalCategories = medicalCategoriesResponse?.data;

  return {
    handleInputChange,
    handleAddressChange,
    handleCancelEdit,
    handleInterestsChange,
    handleSaveProfile,
    handleStartEdit,
    showSuccessMessage,
    isEditing,
    selectedCategories,
    profileData,
    medicalCategories,
    handleMedicalHistoryChange,
    handleLifeStyleChange,
  };
};

export interface ConsultantProfileData {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: string;
  address?: Partial<Address>;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  specialty?: string;
  subSpecialty?: string;
  licenseNumber?: string;
  yearsOfExperience?: string;
  education?: Partial<ConsultantEducation>;
  boardCertification?: string;
  location?: string;
  department?: string;
  languages?: string[];
  bio?: string;
  profileImgUrl?: string;
}

export type ModifyingConsultantProfileData = Partial<ConsultantProfileData>;

export const useConsultantProfile = () => {
  const { data: myProfileResponse } = useGetMyConsultantProfiles();
  const { mutateAsync: updateConsultantProfileDetails } =
    useUpdateConsultantProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [modifyingProfileData, setModifyingProfileData] =
    useState<ModifyingConsultantProfileData>();
  const [profileData, setProfileData] = useState<ConsultantProfileData>();

  const handleInputChange = (
    field: keyof ModifyingConsultantProfileData,
    value: unknown
  ) => {
    setProfileData((prev) => {
      if (prev)
        return {
          ...prev,
          [field]: value,
        };
    });
    setModifyingProfileData({ ...modifyingProfileData, [field]: value });
  };

  const handleEducationChange = (
    field: keyof ConsultantEducation,
    value: unknown
  ) => {
    setProfileData((prev) => {
      if (prev)
        return {
          ...prev,
          education: { ...prev?.education, [field]: value },
        };
    });
    setModifyingProfileData((prev) => {
      return {
        ...prev,
        education: { ...prev?.education, [field]: value },
      };
    });
  };
  const handleLanguagesChange = (languages: string[]) => {
    setProfileData((prev) => {
      if (prev) return { ...prev, languages: [...languages] };
    });
    setModifyingProfileData((prev) => ({ ...prev, languages: [...languages] }));
  };

  const handleSaveProfile = async () => {
    console.log("Saving profile:", profileData);
    setIsEditing(false);
    await updateConsultantProfileDetails({
      education: {
        degree: modifyingProfileData?.education?.degree,
        institution: modifyingProfileData?.education?.institution,
        year: modifyingProfileData?.education?.year,
      },
      profile: {
        address: {
          city: modifyingProfileData?.city,
          country: modifyingProfileData?.country,
          state: modifyingProfileData?.state,
          zipCode: modifyingProfileData?.zipCode,
        },
        bio: modifyingProfileData?.bio,
        dateOfBirth: modifyingProfileData?.dateOfBirth,
        experience: modifyingProfileData?.yearsOfExperience,
        languages: modifyingProfileData?.languages,
        location: modifyingProfileData?.location,
        phoneNumber: modifyingProfileData?.phone,
        specialty: modifyingProfileData?.specialty,
        subSpecialty: modifyingProfileData?.subSpecialty,
        userName: {
          first_name: modifyingProfileData?.firstName,
          last_name: modifyingProfileData?.lastName,
        },
        profileImgUrl: modifyingProfileData?.profileImgUrl,
      },
    });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  const handleStartEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setProfileData((prev) => prev && ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
    if (modifyingProfileData) {
      setModifyingProfileData((prev) => ({
        ...prev,
        address: { ...profileData?.address, [field]: value },
      }));
    } else {
      setModifyingProfileData((prev) => ({
        ...prev,
        address: { [field]: value },
      }));
    }
  };

  useEffect(() => {
    if (myProfileResponse) {
      const data = myProfileResponse.data;
      setProfileData({
        firstName: data.profile.userName?.first_name,
        lastName: data.profile.userName?.last_name,
        email: data.profile.email,
        phone: data.profile.phoneNumber,
        dateOfBirth: data.profile.dateOfBirth,
        gender: data.profile.gender,
        address: data.profile.address,
        city: data.profile.address?.city,
        state: data.profile.address?.state,
        zipCode: "62701",
        country: data.profile.address?.country,
        specialty: data.profile?.specialty,
        subSpecialty: data.profile.subSpecialties[0],
        licenseNumber: data.profile.medicalLicenseNumber,
        yearsOfExperience: data.profile?.experience,
        education: {
          degree: data.education?.degree,
          institution: data.education?.institution,
          year: data.education?.year,
        },
        boardCertification: data.profile.boardCertification,
        location: data.profile.location,
        department: data.profile.specialty,
        bio: data.profile.bio,
        languages: data.profile.languages,
        profileImgUrl: data.profile.profileImgUrl,
      });
    }
  }, [myProfileResponse]);

  return {
    isEditing,
    showSuccessMessage,
    handleInputChange,
    handleSaveProfile,
    handleCancelEdit,
    handleStartEdit,
    profileData,
    handleEducationChange,
    handleLanguagesChange,
    handleAddressChange
  };
};
