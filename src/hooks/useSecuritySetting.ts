import { useState } from "react";


export interface SecuritySetting {
    multiFactorAuthEnabled: boolean,
    sessionTimeoutMin: number,
    loginAlertsEnabled: boolean,
}

export const useSecuritySetting = () => {
    const [securitySettings, setSecuritySettings] = useState<SecuritySetting>({
        multiFactorAuthEnabled: true,
        sessionTimeoutMin: 30,
        loginAlertsEnabled: true
    });

    const handleSettingChange = (setting: keyof typeof securitySettings, value) => {
        setSecuritySettings({
            ...securitySettings,
            [setting]: value
        })
    }

    return {
        securitySettings,
        handleSettingChange
    }
}