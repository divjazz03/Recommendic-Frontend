import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { confirmAppointment, ConsultantProfileUpdateRequest, createNewSchedule, deleteSchedule, getMyDashboard, getMyProfileDetails, getMySchedules, getScheduleById, sendConsultantOnboardingData, updateConsultantProfileDetails, updateSchedule } from "../api/consultant_api"
import { ModifyingSchedule } from "@/components/consultant/ConsultantModifySchedule"
import { NewSchedule } from "@/hooks/useConsultantSchedule"
import { ConsultantOnboardingData } from "@/components/consultant/ConsultantOnboarding"
import axios from "axios";
import { getUploadSignature } from "@/lib/api/general_api";
import { Credential } from "@/types"
export async function uploadProfilePic(
  formData: ConsultantOnboardingData
): Promise<string> {
  /* UPLOAD THE PROFILE PIC TO CLOUDINARY */

    const signaturesData = await getUploadSignature(1);
    const signatureData = signaturesData[0];
    if (!signatureData) {
      throw new Error("Invalid signature data");
    }

    if (formData.profilePictureUrl instanceof File) {
      const form = new FormData();
      form.append("file", formData.profilePictureUrl);
      form.append("api_key", signatureData.apiKey);
      form.append("public_id", signatureData.publicId);
      form.append("folder", signatureData.folder);
      form.append("timestamp", String(signatureData.timeStamp));
      form.append("signature", signatureData.signature);

      const cloudRes = await axios
        .post(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
          form,
          {
            timeout: 1000 * 10,
            timeoutErrorMessage: "Took too long to respond",
          }
        )
        .then((response) => response.data)
        .catch((error) => {throw new Error(`Trouble uploading profile pic: ${error}`)});

      return cloudRes.secure_url;
    }
    throw new Error("Not a file");
  
}

export async function uploadResume(
  formData: ConsultantOnboardingData
): Promise<string> {
  /* UPLOAD THE PROFILE PIC TO CLOUDINARY */
  
    const signaturesData = await getUploadSignature(1);
    const signatureData = signaturesData[0];
    if (!signatureData) {
      throw new Error("Invalid signature data");
    }
    if (formData.resume?.fileUrl instanceof File) {
      const form = new FormData();
      form.append("file", formData.resume.fileUrl);
      form.append("api_key", signatureData.apiKey);
      form.append("public_id", signatureData.publicId);
      form.append("folder", signatureData.folder);
      form.append("timestamp", String(signatureData.timeStamp));
      form.append("signature", signatureData.signature);

      const cloudRes = await axios
        .post(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
          form,
          {
            timeout: 1000 * 10,
            timeoutErrorMessage: "Took too long to respond",
          }
        )
        .then((response) => response.data)
        .catch((error) => {throw new Error(`Trouble uploading resume: ${error}`);
        });

      return cloudRes.secure_url;
    }
    throw new Error("Not a file");
  
}

export async function uploadCredentials(
  formData: ConsultantOnboardingData
): Promise<Credential[]> {
  if (!formData.credentials) {
    throw new Error("No credentials provided");
  }

    const signaturesData = await getUploadSignature(
      formData.credentials.length
    );
    if (!signaturesData) {
      throw new Error("No upload signatures returned");
    }

    const urls: Credential[] = await Promise.all(
      formData.credentials.map(async (credential, index) => {
        console.log(credential)
        const signature = signaturesData[index];
        if (!signature) {
          throw new Error("Invalid signature");
        }
        if (!(credential.fileUrl instanceof File)) {
          throw new Error("Invalid file type");
        }

        const form = new FormData();
        form.append("file", credential.fileUrl);
        form.append("api_key", signature.apiKey);
        form.append("public_id", signature.publicId);
        form.append("folder", signature.folder);
        form.append("timestamp", String(signature.timeStamp));
        form.append("signature", signature.signature);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
          form,
          {
            timeout: 1000 * 10,
            timeoutErrorMessage: "Took too long to respond",
          }
        ).then(response => response.data)
        .catch(error => {throw new Error(`Trouble uploading credential documents: ${error}`);
        });

        return {
          fileUrl: response.secure_url,
          name: credential.name,
          type: "certificate"
        } as Credential;
      })
    );
    return urls;
  
}

export const useGetDashboard = () => {
    return useQuery({
        queryKey: ['My Dashboard'],
        queryFn: getMyDashboard,
        staleTime: 3600 * 1000,
        retry: 1
    })
}

export const useGetCurrentUserSchedules = () => {
    return useQuery({
        queryKey: ["My Schedules"],
        queryFn: getMySchedules,
        staleTime: 3600 * 1000,
        retry: 1
    })
}

export const useGetScheduleWithUserId = (scheduleId: string) => {
    return useQuery({
        queryKey: ["Schedule", scheduleId],
        queryFn: () =>  getScheduleById(scheduleId),
        enabled: !!scheduleId
    })
}

type ScheduleModificationProps = {
    id: string,
    schedule: ModifyingSchedule
}

export const useCreateNewSchedules = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (schedules: NewSchedule[]) => createNewSchedule(schedules),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['My Schedules']
            })
        }
    })
}

export const useUpdateSchedule = () => {
    return useMutation({
        mutationFn: (mutationFnProp: ScheduleModificationProps) => updateSchedule(mutationFnProp.id, mutationFnProp.schedule)
    })
}
export const useDeleteSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['My Schedules']
            })
        }
    })
}
export const useGetMyConsultantProfiles = () => {
    return useQuery({
        queryKey: ['My profile'],
        queryFn: getMyProfileDetails,
        staleTime: 1000 * 3600
    })
}
export const useUpdateConsultantProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (consultantProfile: ConsultantProfileUpdateRequest) => updateConsultantProfileDetails(consultantProfile),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['My profile']})
    })
}

 type ConsultantOnboardingMutionProps = {
    data: ConsultantOnboardingData,
    userId: string
 }
export const useUpdateConsultantOnboardingInfo = () => {
   return useMutation({
      mutationFn: (props: ConsultantOnboardingMutionProps) => sendConsultantOnboardingData(props.data, props.userId),
   })
 }

interface ConfirmAppointmentProp {
    appointmentId: string,
    note?: string
}
export const useConfirmAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({appointmentId, note}:ConfirmAppointmentProp) => confirmAppointment(appointmentId,note ?? ''),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['Appointments']})
    })
}
