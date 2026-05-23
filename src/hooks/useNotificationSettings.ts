import { useUserContext } from "@/context/AuthContext";
import { useGetMyConsultantProfiles } from "@/lib/actions/consultantQueryAndMutations";
import { ProfileDetails } from "@/lib/api/consultant_api";
import { UserType } from "@/types";
import { useEffect, useState } from "react";

export interface PatientModifyingNotificationSetting extends ModifyingNotificationSetting {}
export interface PatientNotificationSetting extends NotificationSetting {}
export interface NotificationSetting {
  emailNotificationEnabled: boolean;
  smsNotificationsEnabled: boolean;
  appointmentRemindersEnabled: boolean;
  labResultUpdatesEnabled: boolean;
  systemUpdatesEnabled: boolean;
  marketingEmailsEnabled: boolean;
}
export interface ModifyingNotificationSetting {
  emailNotificationEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
  appointmentRemindersEnabled?: boolean;
  labResultUpdatesEnabled?: boolean;
  systemUpdatesEnabled?: boolean;
  marketingEmailsEnabled?: boolean;
  type?: UserType;
}

export interface ConsultantNotificationSetting extends NotificationSetting {}
export interface ConsultantModifyingNotificationSetting extends ModifyingNotificationSetting {}

export const useNotificationSettings = (
  userType: UserType,
  accessToken: string | null,
  notificationPreferences?: Partial<NotificationSetting>,
) => {
  // const {data: patientProfile} = useGetMyPatientProfiles(accessToken, userType === "PATIENT");
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSetting>({
      emailNotificationEnabled:
        notificationPreferences?.emailNotificationEnabled ?? false,
      smsNotificationsEnabled:
        notificationPreferences?.smsNotificationsEnabled ?? false,
      appointmentRemindersEnabled:
        notificationPreferences?.appointmentRemindersEnabled ?? false,
      labResultUpdatesEnabled:
        notificationPreferences?.labResultUpdatesEnabled ?? false,
      systemUpdatesEnabled:
        notificationPreferences?.systemUpdatesEnabled ?? false,
      marketingEmailsEnabled:
        notificationPreferences?.marketingEmailsEnabled ?? false,
    });
  const [modifyingNotificationSettings, setModifyingNotificationSettings] =
    useState<
      | PatientModifyingNotificationSetting
      | ConsultantModifyingNotificationSetting
    >();

  const notificationSettingsHasBeenModified = () => {
    if (modifyingNotificationSettings) {
      return !!modifyingNotificationSettings.type;
    }
    return false;
  };
  const handleNotificationChange = (setting: keyof NotificationSetting) => {
    console.log(setting);
    switch (userType) {
      case "PATIENT":
        {
          setting = setting as keyof PatientNotificationSetting;
        }
        break;
      case "CONSULTANT":
        {
          setting = setting as keyof ConsultantNotificationSetting;
        }
        break;
      default:
        console.log("Default notification type");
    }
    setNotificationSettings(
      (notificationSettings) =>
        notificationSettings && {
          ...notificationSettings,
          [setting]: !notificationSettings[setting],
        },
    );
    setModifyingNotificationSettings((modifyingNotificationSettings) => {
      if (!notificationSettings) {
        return;
      }
      if (!modifyingNotificationSettings) {
        return {
          type: userType,
          [setting]: !notificationSettings[setting],
        };
      }
      return {
        ...modifyingNotificationSettings,
        type: userType,
        [setting]: !modifyingNotificationSettings[setting],
      };
    });
  };

  return {
    notificationSettingsHasBeenModified,
    handleNotificationChange,
    notificationSettings,
  };
};
