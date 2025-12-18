import { useUserContext } from "@/context/AuthContext";
import { updateMyNotificationSettings } from "@/lib/api/general_api";
import { useGetNotificationSettings } from "@/lib/actions/generalQueriesAndMutation";
import { UserType } from "@/types";
import { useEffect, useState } from "react";


export interface PatientModifyingNotificationSetting extends ModifyingNotificationSetting{
        
}
export interface PatientNotificationSetting extends NotificationSetting{
        
}
export interface NotificationSetting {
        emailNotificationsEnabled: boolean,
        smsNotificationsEnabled: boolean,
        appointmentRemindersEnabled: boolean,
        labResultUpdatesEnabled: boolean,
        systemUpdatesEnabled: boolean,
        marketingEmailsEnabled: boolean
}
export interface ModifyingNotificationSetting {
        emailNotificationsEnabled?: boolean,
        smsNotificationsEnabled?: boolean,
        appointmentRemindersEnabled?: boolean,
        labResultUpdatesEnabled?: boolean,
        systemUpdatesEnabled?: boolean,
        marketingEmailsEnabled?: boolean,
        type?: UserType
}

export interface ConsultantNotificationSetting extends NotificationSetting{
        
}
export interface ConsultantModifyingNotificationSetting extends ModifyingNotificationSetting{
        
}

export const useNotificationSettings = () => {
        const { data: notificationSettingsResponse } = useGetNotificationSettings();
        const { userContext } = useUserContext()
        const [notificationSettings, setNotificationSettings] = useState<NotificationSetting>();
        const [modifyingNotificationSettings, setModifyingNotificationSettings] = useState<PatientModifyingNotificationSetting | ConsultantModifyingNotificationSetting>();

        useEffect(() => {
                if (notificationSettingsResponse) {
                        const data = notificationSettingsResponse.data
                        setNotificationSettings({
                                emailNotificationsEnabled: data.emailNotificationsEnabled,
                                appointmentRemindersEnabled: data.appointmentRemindersEnabled,
                                labResultUpdatesEnabled: data.labResultUpdatesEnabled,
                                marketingEmailsEnabled: data.marketingEmailsEnabled,
                                smsNotificationsEnabled: data.smsNotificationsEnabled,
                                systemUpdatesEnabled: data.systemUpdatesEnabled
                        })
                }
        }, [notificationSettingsResponse])

        const notificationSettingsHasBeenModified = () => {
                if (modifyingNotificationSettings) {
                        return !!modifyingNotificationSettings.type
                }
                return false
        }
        const handleNotificationChange = (setting: keyof NotificationSetting) => {
                console.log(setting)
                switch (userContext.userType) {
                        case 'PATIENT' : {
                                setting = setting as keyof PatientNotificationSetting
                        }
                        break;
                        case 'CONSULTANT' : {
                                setting = setting as keyof ConsultantNotificationSetting
                        }
                        break;
                        default: console.log("Default notification type")
                }
                setNotificationSettings(notificationSettings => notificationSettings && ({
                        ...notificationSettings,
                        [setting]: !notificationSettings[setting]
                }));
                setModifyingNotificationSettings(modifyingNotificationSettings => {
                        if (!notificationSettings) { return }
                        if (!modifyingNotificationSettings) {
                                return {
                                        type: userContext.userType,
                                        [setting]: !notificationSettings[setting]
                                }
                        }
                        return {
                                ...modifyingNotificationSettings,
                                type: userContext.userType,
                                [setting]: !modifyingNotificationSettings[setting]
                        }
                })
        };

        const handleSaveNotificationSetting = async () => {
        if (modifyingNotificationSettings) {
            console.log("Saving Notification", modifyingNotificationSettings);

            updateMyNotificationSettings(modifyingNotificationSettings);
        }

    }
        return ({
                notificationSettingsHasBeenModified,
                handleNotificationChange,
                handleSaveNotificationSetting,
                notificationSettings
        })
}

