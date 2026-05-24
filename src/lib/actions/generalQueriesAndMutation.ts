import { NewUser, SigninUserData } from "@/types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  signinUser,
  getCurrentUser,
  resendConfirmationEmail,
  verifyEmail,
  getAllSupportedMedicalCategories,
  startNewConsultation,
  endConsultation,
  getConsultantTimeSlots,
  getAppointments,
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationAsRead,
  deleteNotification,
} from "../api/general_api";
import { TypeOfUser } from "@/_auth/forms/SignupForm";
import {
  createNewPatient,
  sendPatientOnboardingData,
} from "../api/patient_api";
import { createNewConsultant, createNewSchedule } from "../api/consultant_api";
import { NewSchedule } from "@/hooks/useConsultantSchedule";
import { PatientOnboardingData } from "@/components/patient/PatientOnboarding";
import { useTokenStore } from "@/store/TokenStore";

type UserCreateMutionProps = {
  typeOfUser: TypeOfUser;
  userData: NewUser;
};
type PatientOnboardingMutionProps = {
  data: PatientOnboardingData;
  userId: string;
};

export const useGetNotifications = (accessToken: string | null) => {
  return useInfiniteQuery({
    queryKey: ["Notifications"],
    queryFn: () => getAllNotifications({ pageParam: null }, accessToken),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export const useMarkNotificationsAsRead = (accessToken: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id, accessToken),
    //  onSuccess: () =>
    //    queryClient.invalidateQueries({ queryKey: "Notifications" }),
  });
};
export const useMarkAllNotificationsAsRead = (accessToken: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationAsRead(accessToken),
    //  onSuccess: () =>
    //    queryClient.invalidateQueries({ queryKey: "Notifications" }),
  });
};

export const useDeleteNotification = (accessToken: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id, accessToken),
    // onSuccess: () =>
    //    queryClient.invalidateQueries({queryKey: "Notifications"})
  });
};
export const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: (mutationFnProp: UserCreateMutionProps) => {
      switch (mutationFnProp.typeOfUser) {
        case "Patient":
          return createNewPatient(mutationFnProp.userData);
        case "Consultant":
          return createNewConsultant(mutationFnProp.userData);
      }
    },
  });
};

export const useGetCurrentUser = (
  enabled: boolean,
  accessToken?: string | null,
) => {
  if (!accessToken) {
    return {
      error: new Error("No access token"),
      isPending: false,
      data: null,
    };
  }
  return useQuery({
    queryKey: ["getCurrentUser"],
    queryFn: () => getCurrentUser(accessToken),
    enabled: enabled,
    retry: 1,
  });
};

export const useGetSupportedMedicalCategories = () => {
  return useQuery({
    queryKey: ["getSupportedMedicalCategories"],
    queryFn: getAllSupportedMedicalCategories,
    staleTime: Infinity,
  });
};

export const useSignInUserMutation = () => {
  return useMutation({
    mutationFn: (data: SigninUserData) => signinUser(data),
    throwOnError: false,
  });
};

export const useLogout = () => {
  const { setAccessToken, setRefreshToken } = useTokenStore();

  return {
    logout: () => {
      setAccessToken(null);
      setRefreshToken(null);
    },
  };
};

export const useResendEmailMutation = () => {
  return useMutation({
    mutationFn: (email: string) => resendConfirmationEmail(email),
  });
};
export const useUpdatePatientOnboardingInfo = (accessToken: string | null) => {
  return useMutation({
    mutationFn: (props: PatientOnboardingMutionProps) =>
      sendPatientOnboardingData(props.data, props.userId, accessToken),
  });
};

export const useVerifyTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });
};

export const useCreateSchedule = (accessToken: string | null) => {
  return useMutation({
    mutationFn: (schedule: NewSchedule[]) =>
      createNewSchedule(schedule, accessToken),
  });
};

export const useStartConsultation = (accessToken: string | null) => {
  return useMutation({
    mutationFn: (appointmentId: string) =>
      startNewConsultation(appointmentId, accessToken),
  });
};
export const useEndConsultation = (accessToken: string | null) => {
  return useMutation({
    mutationFn: (consultationId: string) =>
      endConsultation(consultationId, accessToken),
  });
};

export const useGetConsultantTimeSlots = (
  consultantId: string,
  date: string,
  enabled: boolean = true,
  accessToken: string | null,
) => {
  return useQuery({
    queryKey: ["Consultant timeSlots", consultantId, date],
    queryFn: () => getConsultantTimeSlots(consultantId, date, accessToken),
    staleTime: 1000 * 3600,
    enabled: enabled,
    retry: 1,
  });
};

export const useGetAppointments = (accessToken: string | null) => {
  return useQuery({
    queryKey: ["Appointments"],
    queryFn: () => getAppointments(accessToken),
    staleTime: 1000 * 3600,
  });
};
