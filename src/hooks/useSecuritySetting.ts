import { useState } from "react";

export interface SecuritySetting {
  multiFactorAuthEnabled: boolean;
  sessionTimeoutMin: number;
  loginAlertsEnabled: boolean;
}

export const useSecuritySetting = (
  securityPreferences?: Partial<SecuritySetting>,
) => {
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting>({
    multiFactorAuthEnabled: securityPreferences?.multiFactorAuthEnabled ?? true,
    sessionTimeoutMin: securityPreferences?.sessionTimeoutMin ?? 30,
    loginAlertsEnabled: securityPreferences?.loginAlertsEnabled ?? true,
  });

  const handleSettingChange = (
    setting: keyof typeof securitySettings,
    value: unknown,
  ) => {
    setSecuritySettings({
      ...securitySettings,
      [setting]: value,
    });
  };

  return {
    securitySettings,
    handleSettingChange,
  };
};
