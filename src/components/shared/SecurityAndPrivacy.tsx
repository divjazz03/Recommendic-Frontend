import { SecuritySetting } from "@/hooks/useSecuritySetting"
import { ArrowLeft, Save } from "lucide-react"

interface SecurityAndPrivacyProps {
    securitySettings : SecuritySetting
    handleSettingChange: (key: keyof SecuritySetting, value: unknown) => void
    setActiveTab: (value: React.SetStateAction<string>) => void
}

const SecurityAndPrivacy = (
    {
        securitySettings,
        handleSettingChange,
        setActiveTab
    }: SecurityAndPrivacyProps
) => (
    <div className='bg-white shadow-sm p-6 rounded-lg '>
        <header className='flex gap-2 justify-start items-center pb-4 mb-2 border-b'>
            <div className='p-2 rounded-sm hover:bg-main/15' onClick={() => setActiveTab("")}>
                <ArrowLeft />
            </div>
            <h2 className='font-semibold text-lg text-gray-900 '>Security & Privacy</h2>
        </header>
        <div>
            <h3 className='font-medium font-lg text-gray-900 mb-4'>Security Settings</h3>
            <div className='flex flex-col gap-3 mb-6'>
                <div>
                    <label className="block text-sm text-gray-900 mb-2">
                        Session Timeout
                    </label>
                    <select
                        value={securitySettings.sessionTimeoutMin}
                        onChange={(e) => handleSettingChange('sessionTimeoutMin', e.target.value)}
                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                    </select>
                </div>
                <div className="flex items-center justify-between py-3 ">
                    <div>
                        <p className="text-gray-900 text-sm">Multi-Factor Authentication</p>
                        <p className="text-xs font-thin text-gray-500">Enable multi factor authentication</p>
                    </div>
                    <button
                        onClick={() => handleSettingChange('multiFactorAuthEnabled', !securitySettings['multiFactorAuthEnabled'])}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${securitySettings['multiFactorAuthEnabled'] ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securitySettings['multiFactorAuthEnabled'] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
                {/* Active Sessions */}
                <div className="pb-6">
                    <h4 className=" text-gray-900 text-sm mb-4">Active Sessions</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-sm text-gray-900">Current Session</p>
                                <p className="text-xs text-gray-600">Chrome on Windows • Ibadan, Nigeria</p>
                                <p className="text-xs font-thin text-gray-500 mt-1">Active now</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Active
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-sm text-gray-900">Mobile Device</p>
                                <p className="text-xs text-gray-600">Safari on iPhone • Lagos, Nigeria</p>
                                <p className="text-xs font-thin text-gray-500 mt-1">2 hours ago</p>
                            </div>
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                Revoke
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>


        <h4 className="font-medium font-lg text-gray-900 pb-4 mb-2 border-b">Privacy Settings</h4>
        <div className="flex flex-col gap-4 mb-2">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-sm text-gray-900">Profile Visibility</p>
                    <p className="text-xs text-gray-500">Control who can see your profile information</p>
                </div>
                <select className="px-3 py-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                    <option>Everyone</option>
                    <option>Staff Only</option>
                    <option>Private</option>
                </select>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-sm text-gray-900">Activity Status</p>
                    <p className="text-xs text-gray-500">Show when you're online</p>
                </div>
                <button
                    onClick={() => handleSettingChange('loginAlertsEnabled', !securitySettings['loginAlertsEnabled'])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors ${securitySettings['loginAlertsEnabled'] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securitySettings['loginAlertsEnabled'] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
        </div>
        <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Security Settings
            </button>
        </div>
    </div>
)

export default SecurityAndPrivacy